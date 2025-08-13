// src/pages/Dashboard.tsx
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
import { transformRoom } from "@/utils/transformRoom";
import { RoomCardData } from "@/types/room";

export default function Dashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState<RoomCardData[]>([]);

  console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);


  useEffect(() => {
    // 1. Initial fetch from backend (REST API)
    axios
      .get<{ _id: string; name: string; players: string[] }[]>(
        `${import.meta.env.VITE_BACKEND_URL}/api/room`
      )
      .then((res) => {
        setRooms(res.data.map(transformRoom));
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
      });

    // 2. Listen for real-time socket events
    const handleRoomCreated = (room: any) => {
      setRooms((prev) => {
        const exists = prev.some((r) => r.id === room._id);
        if (exists) return prev; // avoid duplicates
        return [transformRoom(room), ...prev];
      });
    };

    const handleRoomUpdated = (room: any) => {
      setRooms((prev) =>
        prev.map((r) => (r.id === room._id ? transformRoom(room) : r))
      );
    };

    socket.on("roomCreated", handleRoomCreated);
    socket.on("roomUpdated", handleRoomUpdated);

    // 3. Cleanup on unmount
    return () => {
      socket.off("roomCreated", handleRoomCreated);
      socket.off("roomUpdated", handleRoomUpdated);
    };
  }, []);

  const handleJoinRoom = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
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

  // Optional: Optimistic UI update when creating room from this dashboard
  const handleCreateRoom = (newRoom: any) => {
    setRooms((prev) => [transformRoom(newRoom), ...prev]);
  };

  const filteredRooms = rooms.filter(
    (room) =>
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
              <CreateRoomModal onCreateRoom={handleCreateRoom} />
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} onJoin={handleJoinRoom} />
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-4">
                No rooms found
              </div>
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
