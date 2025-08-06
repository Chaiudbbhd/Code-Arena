import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Users, Clock, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateRoomModalProps {
  onCreateRoom: (roomData: any) => void;
}

export function CreateRoomModal({ onCreateRoom }: CreateRoomModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    difficulty: "",
    maxParticipants: "",
    timer: "",
    platforms: [] as string[]
  });
  const { toast } = useToast();

  const platforms = [
    { id: "leetcode", name: "LeetCode" },
    { id: "gfg", name: "GeeksforGeeks" },
    { id: "codechef", name: "CodeChef" },
    { id: "codeforces", name: "Codeforces" }
  ];

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        platforms: [...formData.platforms, platformId]
      });
    } else {
      setFormData({
        ...formData,
        platforms: formData.platforms.filter(p => p !== platformId)
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.platforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform.",
        variant: "destructive"
      });
      return;
    }

    const roomData = {
      id: Date.now().toString(),
      title: formData.title,
      host: "You",
      participants: 1,
      maxParticipants: parseInt(formData.maxParticipants),
      status: "waiting" as const,
      difficulty: formData.difficulty as "Easy" | "Medium" | "Hard",
      platforms: formData.platforms,
      timeLeft: `${formData.timer}m`
    };

    onCreateRoom(roomData);
    setOpen(false);
    setFormData({
      title: "",
      difficulty: "",
      maxParticipants: "",
      timer: "",
      platforms: []
    });

    toast({
      title: "Room Created!",
      description: "Your coding battle room has been created successfully.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="accent" size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            Create Battle Room
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Room Title</Label>
            <Input
              id="title"
              placeholder="Enter room title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="bg-secondary border-border focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Difficulty
              </Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                required
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Max Players
              </Label>
              <Select
                value={formData.maxParticipants}
                onValueChange={(value) => setFormData({ ...formData, maxParticipants: value })}
                required
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select max" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Players</SelectItem>
                  <SelectItem value="4">4 Players</SelectItem>
                  <SelectItem value="6">6 Players</SelectItem>
                  <SelectItem value="8">8 Players</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timer (minutes)
            </Label>
            <Select
              value={formData.timer}
              onValueChange={(value) => setFormData({ ...formData, timer: value })}
              required
            >
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Platforms</Label>
            <div className="grid grid-cols-2 gap-3">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform.id}
                    checked={formData.platforms.includes(platform.id)}
                    onCheckedChange={(checked) => handlePlatformChange(platform.id, checked as boolean)}
                  />
                  <Label
                    htmlFor={platform.id}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {platform.name}
                  </Label>
                </div>
              ))}
            </div>
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
            <Button type="submit" variant="accent" className="flex-1">
              Create Room
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}