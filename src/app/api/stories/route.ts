import { createClient, createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "서비스 준비 중입니다." }, { status: 503 });
  }

  const body = await request.json();
  const { name, email, title, content } = body;

  if (!name || !email || !title || !content) {
    return NextResponse.json(
      { error: "이름, 이메일, 제목, 내용은 필수입니다." },
      { status: 400 }
    );
  }

  if (content.length < 30) {
    return NextResponse.json(
      { error: "이야기 내용은 최소 30자 이상이어야 합니다." },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("stories")
    .insert({
      title,
      content,
      mood: "자유",
      genre: "자유",
      status: "pending",
      admin_note: JSON.stringify({ name, email }),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "이야기 저장에 실패했습니다." },
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
