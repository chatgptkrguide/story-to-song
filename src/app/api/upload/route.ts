import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_EXTENSIONS = [".mp3", ".wav"];
const ALLOWED_MIME_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav"];

// Magic Bytes for MP3
const MP3_MAGIC_BYTES: number[][] = [
  [0x49, 0x44, 0x33], // ID3v2
  [0xff, 0xfb], // MPEG-1 Layer 3
  [0xff, 0xf3], // MPEG-2 Layer 3
  [0xff, 0xf2], // MPEG-2.5 Layer 3
];

// Magic Bytes for WAV (RIFF)
const WAV_MAGIC_BYTES: number[][] = [[0x52, 0x49, 0x46, 0x46]];

function validateMagicBytes(bytes: Uint8Array): boolean {
  const isMp3 = MP3_MAGIC_BYTES.some((magic) =>
    magic.every((byte, i) => bytes[i] === byte)
  );

  const isWav = WAV_MAGIC_BYTES.some((magic) =>
    magic.every((byte, i) => bytes[i] === byte)
  );

  return isMp3 || isWav;
}

function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) return "";
  return filename.substring(lastDot).toLowerCase();
}

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

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "파일이 필요합니다" },
      { status: 400 }
    );
  }

  // 1. 파일 크기 체크
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "파일 크기는 50MB 이하여야 합니다" },
      { status: 400 }
    );
  }

  // 2. 파일 확장자 체크
  const ext = getFileExtension(file.name);
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      { error: "허용되지 않는 파일 확장자입니다 (MP3, WAV만 가능)" },
      { status: 400 }
    );
  }

  // 3. MIME 타입 체크
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "허용되지 않는 파일 형식입니다 (MP3, WAV만 가능)" },
      { status: 400 }
    );
  }

  // 4. Magic Bytes 검증 (실제 파일 내용 확인)
  const arrayBuffer = await file.arrayBuffer();
  const headerBytes = new Uint8Array(arrayBuffer.slice(0, 12));

  if (!validateMagicBytes(headerBytes)) {
    return NextResponse.json(
      { error: "유효하지 않은 오디오 파일입니다. 실제 MP3 또는 WAV 파일만 업로드 가능합니다" },
      { status: 400 }
    );
  }

  // 5. 안전한 파일명 생성 (UUID + 검증된 확장자)
  const safeFileName = `${crypto.randomUUID()}${ext}`;
  const filePath = `songs/${user.id}/${safeFileName}`;

  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("songs")
    .upload(filePath, buffer, {
      contentType: file.type,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: "파일 업로드에 실패했습니다" },
      { status: 500 }
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("songs").getPublicUrl(filePath);

  return NextResponse.json({ url: publicUrl }, { status: 201 });
}
