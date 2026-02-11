import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("stories")
    .select("*, song:songs(*), user:profiles(id, name, email)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "이야기를 찾을 수 없습니다" },
      { status: 404 }
    );
  }

  const admin = await isAdmin(supabase, user.id);

  if (data.user_id !== user.id && !admin) {
    return NextResponse.json(
      { error: "접근 권한이 없습니다" },
      { status: 403 }
    );
  }

  return NextResponse.json({ data });
}

const VALID_STATUSES = ["pending", "in_progress", "completed", "rejected"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
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
  const { status, admin_note } = body;

  // 상태값 화이트리스트 검증
  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: "유효하지 않은 상태값입니다" },
      { status: 400 }
    );
  }

  // admin_note 타입 및 길이 검증
  if (admin_note !== undefined) {
    if (typeof admin_note !== "string") {
      return NextResponse.json(
        { error: "메모는 문자열이어야 합니다" },
        { status: 400 }
      );
    }
    if (admin_note.length > 1000) {
      return NextResponse.json(
        { error: "메모는 1000자 이하여야 합니다" },
        { status: 400 }
      );
    }
  }

  const updateData: Record<string, string> = {};
  if (status) updateData.status = status;
  if (admin_note !== undefined) updateData.admin_note = admin_note;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: "수정할 항목이 없습니다" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("stories")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "이야기 수정에 실패했습니다" },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}
