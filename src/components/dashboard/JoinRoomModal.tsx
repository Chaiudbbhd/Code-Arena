import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Copy, Check, Users, Clock, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JoinRoomModalProps {
  onJoinRoom: (roomCode: string) => void;
}

export function JoinRoomModal({ onJoinRoom }: JoinRoomModalProps) {
  const [open, setOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a room code.",
        variant: "destructive"
      });
      return;
    }

    setIsJoining(true);
    
    // Simulate joining room
    setTimeout(() => {
      setIsJoining(false);
      onJoinRoom(roomCode.trim());
      setOpen(false);
      setRoomCode("");
      
      toast({
        title: "Joining Room",
        description: `Successfully joined room: ${roomCode}`,
      });
    }, 1500);
  };

  const handleGenerateTestCode = () => {
    const testCode = `ARENA${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setRoomCode(testCode);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Room code copied to clipboard",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="accent-outline" size="lg" className="gap-2">
          <LogIn className="h-4 w-4" />
          Join Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5 text-accent" />
            Join Battle Room
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomCode">Room Code</Label>
              <div className="flex gap-2">
                <Input
                  id="roomCode"
                  placeholder="Enter room code (e.g., ARENA123)"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="bg-secondary border-border focus:border-accent font-mono text-center tracking-wider"
                  maxLength={12}
                />
                {roomCode && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleCopyCode}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Get the room code from your friend or battle organizer
              </p>
            </div>

            {/* Demo Room Info Card */}
            <Card className="border-accent/20 bg-accent/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-accent">Demo Room Available</CardTitle>
                <CardDescription className="text-xs">
                  Try joining a test room for demonstration
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateTestCode}
                  className="w-full text-accent hover:bg-accent/10"
                >
                  Generate Test Room Code
                </Button>
              </CardContent>
            </Card>

            {/* Room Status Preview */}
            {roomCode && (
              <Card className="border-border/50">
                <CardContent className="pt-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Room Status
                      </span>
                      <span className="text-warning font-medium">Waiting to join...</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        Expected Difficulty
                      </span>
                      <span className="font-medium">Unknown</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Status
                      </span>
                      <span className="font-medium">Validating room...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="accent" 
              className="flex-1"
              disabled={isJoining || !roomCode.trim()}
            >
              {isJoining ? "Joining..." : "Join Room"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}