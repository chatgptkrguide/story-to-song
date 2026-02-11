import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "서비스 준비 중입니다. 잠시 후 다시 시도해주세요." }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  const body = await request.json();
  const { title, content, mood, genre } = body;

  if (!title || !content || !mood || !genre) {
    return NextResponse.json(
      { error: "제목, 내용, 분위기, 장르는 필수 입력입니다" },
      { status: 400 }
    );
  }

  if (content.length < 50) {
    return NextResponse.json(
      { error: "이야기 내용은 최소 50자 이상이어야 합니다" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("stories")
    .insert({
      user_id: user.id,
      title,
      content,
      mood,
      genre,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "이야기 생성에 실패했습니다" },
      { status: 500 }
    );
  }

  return NextResponse.json({ data }, { status: 201 });
}

export async function GET(): Promise<NextResponse> {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "서비스 준비 중입니다." }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  const admin = await isAdmin(supabase, user.id);

  let query = supabase
    .from("stories")
    .select("*, song:songs(*), user:profiles(id, name, email)")
    .order("created_at", { ascending: false });

  if (!admin) {
    query = query.eq("user_id", user.id);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: "이야기 목록 조회에 실패했습니다" },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}
