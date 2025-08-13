// src/utils/transformRoom.ts
import { RoomCardData } from "@/types/room";

export function transformRoom(raw: { _id: string; name: string; players: string[] }): RoomCardData {
  return {
    id: raw._id,
    title: raw.name,
    host: raw.players?.[0] || "Unknown Host",
    hostAvatar: undefined,
    participants: raw.players?.length ?? 0,
    maxParticipants: 10,
    status: "waiting",
    difficulty: "Easy",
    timeLeft: undefined,
    platforms: ["Web"],
  };
}
