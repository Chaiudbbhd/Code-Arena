import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Copy, Users, Clock, Target, Play, Settings, LogOut, Check } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function RoomWaiting() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // seconds until start
  const [isHost] = useState(Math.random() > 0.5); // Random for demo

  const room = {
    id: roomId || "ARENA123",
    title: "JavaScript Fundamentals Battle",
    host: "Alice",
    difficulty: "Medium",
    maxParticipants: 6,
    platforms: ["LeetCode", "CodeChef"],
    timer: 30,
    participants: [
      { id: 1, name: "You", avatar: "", isHost: isHost, ready: true },
      { id: 2, name: "Alice", avatar: "", isHost: !isHost, ready: true },
      { id: 3, name: "Bob", avatar: "", isHost: false, ready: true },
      { id: 4, name: "Charlie", avatar: "", isHost: false, ready: false },
    ]
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto-start battle
      handleStartBattle();
    }
  }, [timeLeft]);

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(room.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Room code copied to clipboard",
    });
  };

  const handleStartBattle = () => {
    toast({
      title: "Battle Starting!",
      description: "Get ready to code...",
    });
    navigate(`/arena/${roomId}`);
  };

  const handleLeaveRoom = () => {
    navigate('/dashboard');
  };

  const readyCount = room.participants.filter(p => p.ready).length;
  const progress = (readyCount / room.participants.length) * 100;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
            {room.title}
          </h1>
          <p className="text-muted-foreground">Waiting for all participants to be ready</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Room Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Room Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Room Code</span>
                <div className="flex items-center gap-2">
                  <code className="bg-secondary px-2 py-1 rounded font-mono text-accent">
                    {room.id}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyRoomCode}
                    className="h-8 w-8"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Host</span>
                <span className="font-medium">{room.host}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Difficulty</span>
                <Badge variant="secondary" className="bg-warning text-white">
                  {room.difficulty}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{room.timer} minutes</span>
              </div>

              <div className="space-y-2">
                <span className="text-muted-foreground">Platforms</span>
                <div className="flex flex-wrap gap-1">
                  {room.platforms.map((platform) => (
                    <Badge key={platform} variant="outline">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                Participants ({room.participants.length}/{room.maxParticipants})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ready: {readyCount}/{room.participants.length}</span>
                  <span className="text-accent">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-3">
                {room.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback className="bg-accent text-accent-foreground text-sm">
                        {participant.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{participant.name}</span>
                        {participant.isHost && (
                          <Badge variant="secondary" className="text-xs">Host</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {participant.ready ? (
                        <Badge variant="secondary" className="bg-success text-white text-xs">
                          Ready
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Waiting
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Countdown Timer */}
        {timeLeft > 0 && readyCount === room.participants.length && (
          <Card className="mt-6 border-accent/50 bg-accent/5">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-accent font-mono glow-accent">
                  {timeLeft}
                </div>
                <p className="text-lg text-accent">
                  Battle starting in {timeLeft} second{timeLeft !== 1 ? 's' : ''}...
                </p>
                <div className="flex justify-center">
                  <div className="animate-pulse">
                    <Play className="h-8 w-8 text-accent" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8">
          {isHost && readyCount === room.participants.length && timeLeft > 0 && (
            <Button
              variant="accent"
              size="lg"
              onClick={handleStartBattle}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Start Battle Now
            </Button>
          )}
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleLeaveRoom}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Leave Room
          </Button>
        </div>

        {/* Waiting Message */}
        {readyCount < room.participants.length && (
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Waiting for {room.participants.length - readyCount} more participant{room.participants.length - readyCount !== 1 ? 's' : ''} to be ready...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}