import { createClient, createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 3;
const ipRequestMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequestMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipRequestMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

const MAX_TITLE_LENGTH = 100;
const MAX_CONTENT_LENGTH = 5000;
const MAX_NAME_LENGTH = 50;

const ANON_EMAIL = "anonymous@storytosong.internal";
let cachedAnonUserId: string | null = null;

async function getAnonymousUserId(supabase: ReturnType<typeof createServiceClient>): Promise<string | null> {
  if (cachedAnonUserId) return cachedAnonUserId;

  const { data: createData } = await supabase.auth.admin.createUser({
    email: ANON_EMAIL,
    password: crypto.randomUUID(),
    email_confirm: true,
  });

  if (createData?.user) {
    cachedAnonUserId = createData.user.id;
    return cachedAnonUserId;
  }

  const { data: listData } = await supabase.auth.admin.listUsers();
  const found = listData?.users?.find((u) => u.email === ANON_EMAIL);
  if (found) {
    cachedAnonUserId = found.id;
    return cachedAnonUserId;
  }

  return null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "서비스 준비 중입니다." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { name, email, title, content } = body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof title !== "string" ||
    typeof content !== "string"
  ) {
    return NextResponse.json(
      { error: "잘못된 요청 형식입니다." },
      { status: 400 }
    );
  }

  if (!name.trim() || !email.trim() || !title.trim() || !content.trim()) {
    return NextResponse.json(
      { error: "이름, 이메일, 제목, 내용은 필수입니다." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "올바른 이메일 형식이 아닙니다." },
      { status: 400 }
    );
  }

  if (name.length > MAX_NAME_LENGTH) {
    return NextResponse.json(
      { error: `이름은 ${MAX_NAME_LENGTH}자 이하여야 합니다.` },
      { status: 400 }
    );
  }

  if (title.length > MAX_TITLE_LENGTH) {
    return NextResponse.json(
      { error: `제목은 ${MAX_TITLE_LENGTH}자 이하여야 합니다.` },
      { status: 400 }
    );
  }

  if (content.length < 30) {
    return NextResponse.json(
      { error: "이야기 내용은 최소 30자 이상이어야 합니다." },
      { status: 400 }
    );
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return NextResponse.json(
      { error: `이야기 내용은 ${MAX_CONTENT_LENGTH}자 이하여야 합니다.` },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  const anonUserId = await getAnonymousUserId(supabase);
  if (!anonUserId) {
    return NextResponse.json(
      { error: "서비스 초기화에 실패했습니다." },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("stories")
    .insert({
      user_id: anonUserId,
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
    console.error("Story insert error:", error.message);
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
