-- 프로필 테이블
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 이야기 테이블
CREATE TABLE stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood TEXT NOT NULL DEFAULT 'happy',
  genre TEXT NOT NULL DEFAULT 'pop',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 노래 테이블
CREATE TABLE songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  artist_name TEXT NOT NULL DEFAULT 'Story to Song',
  audio_url TEXT NOT NULL,
  preview_duration INTEGER NOT NULL DEFAULT 60,
  full_duration INTEGER NOT NULL DEFAULT 0,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 구매 테이블
CREATE TABLE purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE NOT NULL,
  purchase_type TEXT NOT NULL CHECK (purchase_type IN ('one_time', 'subscription', 'copyright')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  price INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- 프로필 정책
CREATE POLICY "사용자는 자신의 프로필을 볼 수 있음" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "사용자는 자신의 프로필을 수정할 수 있음" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "관리자는 모든 프로필을 볼 수 있음" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 이야기 정책
CREATE POLICY "사용자는 자신의 이야기를 볼 수 있음" ON stories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "사용자는 이야기를 생성할 수 있음" ON stories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "관리자는 모든 이야기를 볼 수 있음" ON stories
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "관리자는 이야기 상태를 수정할 수 있음" ON stories
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 노래 정책
CREATE POLICY "사용자는 자신의 노래를 볼 수 있음" ON songs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM stories WHERE stories.id = songs.story_id AND stories.user_id = auth.uid())
  );

CREATE POLICY "관리자는 모든 노래를 관리할 수 있음" ON songs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 구매 정책
CREATE POLICY "사용자는 자신의 구매를 볼 수 있음" ON purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "사용자는 구매를 생성할 수 있음" ON purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "관리자는 모든 구매를 볼 수 있음" ON purchases
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 트리거: 프로필 자동 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 트리거: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Storage 버킷 생성
INSERT INTO storage.buckets (id, name, public) VALUES ('songs', 'songs', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true);

-- Storage 정책
CREATE POLICY "관리자는 노래를 업로드할 수 있음" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('songs', 'covers') AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "모든 사용자는 노래를 다운로드할 수 있음" ON storage.objects
  FOR SELECT USING (bucket_id IN ('songs', 'covers'));
