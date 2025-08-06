import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const CodeArena = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  // ✅ Assume userId is stored in localStorage (or update this logic)
  const userId = localStorage.getItem("userId") || "anonymous";

  const [socket, setSocket] = useState<Socket | null>(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [antiCheatReason, setAntiCheatReason] = useState("");
  const [showAntiCheatModal, setShowAntiCheatModal] = useState(false);
  const [participants, setParticipants] = useState<{ submitted: boolean }[]>([
    { submitted: false },
  ]);

  // ✅ Establish socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:4000"); // change to your backend URL
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // ✅ Anti-cheat monitoring
  useEffect(() => {
    if (!socket) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setAntiCheatReason("Tab switching detected");
        setShowAntiCheatModal(true);
        socket.emit("cheat-detected", { userId, reason: "Tab switching detected" });
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setAntiCheatReason("Exited fullscreen mode");
        setShowAntiCheatModal(true);
        socket.emit("cheat-detected", { userId, reason: "Exited fullscreen mode" });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "c" || e.key === "v")) {
        e.preventDefault();
        setAntiCheatReason("Copy/paste attempt detected");
        setShowAntiCheatModal(true);
        socket.emit("cheat-detected", { userId, reason: "Copy/paste attempt detected" });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [socket, userId]);

  // ✅ Enter fullscreen on mount
  useEffect(() => {
    document.documentElement.requestFullscreen().catch(console.error);
  }, []);

  // ✅ Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSubmit();
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleRun = () => {
    setIsRunning(true);
    setOutput("");

    setTimeout(() => {
      setIsRunning(false);
      setOutput(`Running test cases...

Test Case 1: ✓ PASSED
Input: nums = [2,7,11,15], target = 9
Expected: [0,1]
Your output: [0,1]

Test Case 2: ✓ PASSED  
Input: nums = [3,2,4], target = 6
Expected: [1,2]
Your output: [1,2]

All test cases passed!`);
    }, 2000);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Solution Submitted!",
        description: "Your solution has been submitted successfully.",
      });
      navigate(`/results/${roomId}`);
    }, 2000);
  };

  const handleDisqualify = () => {
    toast({
      title: "Disqualified",
      description: antiCheatReason,
      variant: "destructive",
    });
    navigate("/dashboard");
  };

  const submittedCount = participants.filter((p) => p.submitted).length;
  const timeProgress = ((1800 - timeLeft) / 1800) * 100;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Code Arena</h1>

      <div className="flex justify-between items-center">
        <p>Time Left: {formatTime(timeLeft)}</p>
        <p>Submitted: {submittedCount}</p>
      </div>

      <div className="space-y-2">
        <Button onClick={handleRun} disabled={isRunning}>
          {isRunning ? "Running..." : "Run Code"}
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>

      {output && (
        <div className="bg-gray-100 p-4 rounded shadow mt-4 whitespace-pre-wrap">
          <code>{output}</code>
        </div>
      )}

      {showAntiCheatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-xl max-w-md w-full text-center space-y-4">
            <h2 className="text-lg font-bold text-red-600">Cheating Detected</h2>
            <p>{antiCheatReason}</p>
            <Button variant="destructive" onClick={handleDisqualify}>
              Disqualify Me
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeArena;
