export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin";
  created_at: string;
}

export interface Story {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string;
  genre: string;
  status: "pending" | "in_progress" | "completed" | "rejected";
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface Song {
  id: string;
  story_id: string;
  title: string;
  artist_name: string;
  audio_url: string;
  full_duration: number;
  cover_image_url: string | null;
  status: "draft" | "published";
  created_at: string;
}

export interface SongWithStory extends Song {
  story: Pick<Story, "id" | "title" | "content">;
}
