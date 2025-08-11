import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { RoomCard } from "@/components/dashboard/RoomCard";
import { CreateRoomModal } from "@/components/dashboard/CreateRoomModal";
import { JoinRoomModal } from "@/components/dashboard/JoinRoomModal";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { socket } from "@/socket";
import axios from "axios";

// This matches what RoomCard expects
interface RoomCardData {
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

export default function Dashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState<RoomCardData[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get<{
          _id: string;
          name: string;
          players: string[];
        }[]>(`${import.meta.env.VITE_BACKEND_URL}/api/room`);

        const transformedRooms: RoomCardData[] = res.data.map((room) => ({
          id: room._id,
          title: room.name,
          host: room.players?.[0] || "Unknown Host",
          hostAvatar: undefined, // Replace with actual URL if available
          participants: room.players?.length ?? 0,
          maxParticipants: 10, // Change if backend sends max
          status: "waiting", // Default until backend supports it
          difficulty: "Easy", // Or derive from backend data
          timeLeft: undefined,
          platforms: ["Web"], // Example static platform
        }));

        setRooms(transformedRooms);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };

    fetchRooms();

    socket.on("roomCreated", (newRoom: { _id: string; name: string; players: string[] }) => {
      const transformed: RoomCardData = {
        id: newRoom._id,
        title: newRoom.name,
        host: newRoom.players?.[0] || "Unknown Host",
        hostAvatar: undefined,
        participants: newRoom.players?.length ?? 0,
        maxParticipants: 10,
        status: "waiting",
        difficulty: "Easy",
        timeLeft: undefined,
        platforms: ["Web"],
      };
      setRooms((prev) => [transformed, ...prev]);
    });

    socket.on("roomUpdated", (updatedRoom: { _id: string; name: string; players: string[] }) => {
      const transformed: RoomCardData = {
        id: updatedRoom._id,
        title: updatedRoom.name,
        host: updatedRoom.players?.[0] || "Unknown Host",
        hostAvatar: undefined,
        participants: updatedRoom.players?.length ?? 0,
        maxParticipants: 10,
        status: "waiting",
        difficulty: "Easy",
        timeLeft: undefined,
        platforms: ["Web"],
      };
      setRooms((prev) =>
        prev.map((r) => (r.id === updatedRoom._id ? transformed : r))
      );
    });

    return () => {
      socket.off("roomCreated");
      socket.off("roomUpdated");
    };
  }, []);

  const handleJoinRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      toast({
        title: "Joining Room",
        description: `Joining "${room.title}"...`,
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
    room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.host.toLowerCase().includes(searchQuery.toLowerCase())
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
              <CreateRoomModal
                onCreateRoom={(newRoom) =>
                  setRooms([
                    {
                      id: newRoom._id,
                      title: newRoom.name,
                      host: newRoom.players?.[0] || "Unknown Host",
                      hostAvatar: undefined,
                      participants: newRoom.players?.length ?? 0,
                      maxParticipants: 10,
                      status: "waiting",
                      difficulty: "Easy",
                      timeLeft: undefined,
                      platforms: ["Web"],
                    },
                    ...rooms,
                  ])
                }
              />
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onJoin={handleJoinRoom}
              />
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-4">No rooms found</div>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Create a new room to get started"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
