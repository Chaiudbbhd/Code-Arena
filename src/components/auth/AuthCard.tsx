import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Mail, Lock, Github, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import authBg from "@/assets/auth-bg.jpg";

export function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: isLogin ? "Welcome back!" : "Account created!",
        description: isLogin
          ? "You've successfully logged in."
          : "Your account has been created successfully.",
      });
      navigate("/dashboard");
    }, 1500);
  };

  const handleOAuth = (provider: "google" | "github") => {
    window.location.href = `http://localhost:4000/auth/${provider}`;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative bg-background"
      style={{
        backgroundImage: `url(${authBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <Card className="w-full max-w-md border-border/50 shadow-2xl relative z-10 bg-card/95 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-accent/10 glow-accent">
              <Code2 className="h-8 w-8 text-accent" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              {isLogin ? "Welcome back" : "Create account"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isLogin
                ? "Sign in to your CodeArena account"
                : "Join the competitive coding arena"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="bg-secondary border-border focus:border-accent"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                💰 Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="bg-secondary border-border focus:border-accent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Only on Sign Up) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="flex items-center gap-2"
                >
                  💰 Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    className="bg-secondary border-border focus:border-accent pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading
                ? "Loading..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => handleOAuth("github")}
          >
            <Github className="h-4 w-4 mr-2" />
            Continue with GitHub
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => handleOAuth("google")}
          >
            <Mail className="h-4 w-4 mr-2" />
            Continue with Google
          </Button>

          {/* Toggle Between Login & Signup */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-accent hover:text-accent/80 transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Forgot Password */}
          {isLogin && (
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot your password?
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
