import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { RoomCard } from "@/components/dashboard/RoomCard";
import { CreateRoomModal } from "@/components/dashboard/CreateRoomModal";
import { JoinRoomModal } from "@/components/dashboard/JoinRoomModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Sparkles, Trophy, Clock, Users as UsersIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState([
    {
      id: "1",
      title: "JavaScript Fundamentals Battle",
      host: "Alice",
      participants: 3,
      maxParticipants: 6,
      status: "waiting" as const,
      difficulty: "Easy" as const,
      timeLeft: "5m",
      platforms: ["LeetCode", "GeeksforGeeks"]
    },
    {
      id: "2", 
      title: "Algorithm Speedrun Challenge",
      host: "Bob",
      participants: 4,
      maxParticipants: 4,
      status: "live" as const,
      difficulty: "Hard" as const,
      platforms: ["CodeChef", "Codeforces"]
    },
    {
      id: "3",
      title: "Data Structures Mastery",
      host: "Charlie",
      participants: 2,
      maxParticipants: 8,
      status: "waiting" as const,
      difficulty: "Medium" as const,
      timeLeft: "12m",
      platforms: ["LeetCode"]
    },
    {
      id: "4",
      title: "Dynamic Programming Arena",
      host: "Diana",
      participants: 6,
      maxParticipants: 6,
      status: "finished" as const,
      difficulty: "Hard" as const,
      platforms: ["CodeChef", "GeeksforGeeks"]
    }
  ]);

  const handleCreateRoom = (roomData: any) => {
    setRooms([roomData, ...rooms]);
  };

  const handleJoinRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      toast({
        title: "Joining Room",
        description: `Joining "${room.title}"...`,
      });
      
      // Navigate to room waiting page
      navigate(`/room/${roomId}`);
    }
  };

  const handleJoinRoomByCode = (roomCode: string) => {
    // Navigate to room waiting page with the room code
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
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-accent" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Code Battle Arena
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Join competitive coding battles or create your own challenges
            </p>
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

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-accent/10">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{rooms.length}</div>
                  <div className="text-sm text-muted-foreground">Total Rooms</div>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-destructive/10">
                  <Clock className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-destructive">
                    {rooms.filter(r => r.status === "live").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Live Battles</div>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-success/10">
                  <UsersIcon className="h-4 w-4 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">
                    {rooms.reduce((acc, room) => acc + room.participants, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Players</div>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-warning/10">
                  <Trophy className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-warning">
                    {rooms.filter(r => r.status === "finished").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>
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
                {searchQuery ? "Try adjusting your search" : "Create a new room to get started"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}