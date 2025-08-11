import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { RoomCard } from "@/components/dashboard/RoomCard";
import { CreateRoomModal } from "@/components/dashboard/CreateRoomModal";
import { JoinRoomModal } from "@/components/dashboard/JoinRoomModal";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Trophy, Clock, Users as UsersIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { socket } from "@/socket";
import axios from "axios";

// This matches what your backend returns
interface ApiRoom {
  _id: string;
  name: string;
  host?: string;
  status?: "waiting" | "live" | "finished";
  players?: string[];
  maxPlayers?: number;
  difficulty?: "Easy" | "Medium" | "Hard";
  platforms?: string[];
  hostAvatar?: string;
  timeLeft?: string;
}

export default function Dashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState<ApiRoom[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get<ApiRoom[]>(
          `${import.meta.env.VITE_BACKEND_URL}/api/room`
        );
        setRooms(res.data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };

    fetchRooms();

    socket.on("roomCreated", (newRoom: ApiRoom) => {
      setRooms((prev) => [newRoom, ...prev]);
    });

    socket.on("roomUpdated", (updatedRoom: ApiRoom) => {
      setRooms((prev) =>
        prev.map((r) => (r._id === updatedRoom._id ? updatedRoom : r))
      );
    });

    return () => {
      socket.off("roomCreated");
      socket.off("roomUpdated");
    };
  }, []);

  const handleJoinRoom = (roomId: string) => {
    const room = rooms.find(r => r._id === roomId);
    if (room) {
      toast({
        title: "Joining Room",
        description: `Joining "${room.name}"...`,
      });
      navigate(`/room/${roomId}`);
    }
  };

  const handleJoinRoomByCode = (roomCode: string) => {
    navigate(`/room/${roomCode}`);
    toast({
      title: "Room Joined!",
      description: `Successfully joined room ${roomCode}`,
    });
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (room.host && room.host.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-bold">Code Battle Arena</h1>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rooms or hosts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border focus:border-accent"
              />
            </div>
            <div className="flex gap-3">
              <JoinRoomModal onJoinRoom={handleJoinRoomByCode} />
              <CreateRoomModal onCreateRoom={(newRoom) => setRooms([newRoom, ...rooms])} />
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room._id}
                room={{
                  id: room._id,
                  title: room.name,
                  host: room.host ?? "Unknown",
                  hostAvatar: room.hostAvatar ?? "",
                  participants: room.players?.length ?? 0,
                  maxParticipants: room.maxPlayers ?? 10,
                  status: room.status ?? "waiting",
                  difficulty: room.difficulty ?? "Easy",
                  timeLeft: room.timeLeft,
                  platforms: room.platforms ?? [],
                }}
                onJoin={handleJoinRoom}
              />
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-4">No rooms found</div>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try adjusting your search" : "Create a new room to get started"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
