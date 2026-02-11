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
  created_at: string;
  updated_at: string;
}

export interface Song {
  id: string;
  story_id: string;
  title: string;
  artist_name: string;
  audio_url: string;
  preview_duration: number; // seconds (default 60)
  full_duration: number; // seconds
  cover_image_url: string | null;
  status: "draft" | "published";
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  song_id: string;
  purchase_type: "one_time" | "subscription" | "copyright";
  status: "pending" | "completed" | "cancelled";
  price: number;
  created_at: string;
}

export interface StoryWithSong extends Story {
  song: Song | null;
  user: Pick<User, "id" | "name" | "email">;
}

export interface SongWithStory extends Song {
  story: Pick<Story, "id" | "title" | "content">;
}
