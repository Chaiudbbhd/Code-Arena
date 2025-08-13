// src/types/room.ts
export interface RoomCardData {
  id: string;
  title: string;
  host: string;
  hostAvatar?: string;
  participants: number;
  maxParticipants: number;
  status: "waiting" | "live" | "finished";
  difficulty: "Easy" | "Medium" | "Hard";
  timeLeft?: string;
  platforms: string[];
}
