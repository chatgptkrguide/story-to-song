import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
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

  if (!admin) {
    return NextResponse.json(
      { error: "관리자만 접근할 수 있습니다" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { story_id, title, audio_url, cover_image_url, full_duration } = body;

  if (!story_id || !title || !audio_url) {
    return NextResponse.json(
      { error: "이야기 ID, 제목, 오디오 URL은 필수 입력입니다" },
      { status: 400 }
    );
  }

  const { data: story } = await supabase
    .from("stories")
    .select("id")
    .eq("id", story_id)
    .single();

  if (!story) {
    return NextResponse.json(
      { error: "해당 이야기를 찾을 수 없습니다" },
      { status: 404 }
    );
  }

  const { data, error } = await supabase
    .from("songs")
    .insert({
      story_id,
      title,
      audio_url,
      cover_image_url: cover_image_url ?? null,
      full_duration: full_duration ?? 0,
      status: "draft",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "노래 등록에 실패했습니다" },
      { status: 500 }
    );
  }

  await supabase
    .from("stories")
    .update({ status: "completed" })
    .eq("id", story_id);

  return NextResponse.json({ data }, { status: 201 });
}
