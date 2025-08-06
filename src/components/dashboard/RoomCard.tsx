import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Users, Trophy, Play } from "lucide-react";

interface RoomCardProps {
  room: {
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
  };
  onJoin: (roomId: string) => void;
}

export function RoomCard({ room, onJoin }: RoomCardProps) {
  const statusConfig = {
    waiting: { color: "bg-warning", text: "Waiting", icon: Clock },
    live: { color: "bg-destructive animate-pulse", text: "Live", icon: Play },
    finished: { color: "bg-muted", text: "Finished", icon: Trophy }
  };

  const difficultyConfig = {
    Easy: "bg-success",
    Medium: "bg-warning", 
    Hard: "bg-destructive"
  };

  const StatusIcon = statusConfig[room.status].icon;

  return (
    <Card className="group hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg group-hover:text-accent transition-colors">
              {room.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={`${statusConfig[room.status].color} text-white font-medium`}
              >
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig[room.status].text}
              </Badge>
              <Badge 
                variant="outline" 
                className={`${difficultyConfig[room.difficulty]} text-white border-none`}
              >
                {room.difficulty}
              </Badge>
            </div>
          </div>
          <Avatar className="h-10 w-10">
            <AvatarImage src={room.hostAvatar} />
            <AvatarFallback className="bg-accent text-accent-foreground">
              {room.host[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Host</span>
            <span className="font-medium">{room.host}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Users className="w-4 h-4" />
              Participants
            </span>
            <span className="font-medium">
              {room.participants}/{room.maxParticipants}
            </span>
          </div>

          {room.timeLeft && room.status === "waiting" && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Starts in
              </span>
              <span className="font-medium text-accent">{room.timeLeft}</span>
            </div>
          )}

          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Platforms</span>
            <div className="flex flex-wrap gap-1">
              {room.platforms.map((platform) => (
                <Badge key={platform} variant="secondary" className="text-xs">
                  {platform}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={() => onJoin(room.id)}
          variant={room.status === "live" ? "glow" : "accent"}
          className="w-full"
          disabled={room.status === "finished" || room.participants >= room.maxParticipants}
        >
          {room.status === "finished" 
            ? "Finished" 
            : room.participants >= room.maxParticipants 
            ? "Room Full" 
            : "Join Room"
          }
        </Button>
      </CardContent>
    </Card>
  );
}