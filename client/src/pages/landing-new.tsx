import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Brain,
  Calendar,
  Users,
  BarChart3,
  Phone,
  Mail,
  Linkedin,
  Menu,
  X,
  Sparkles,
  Zap,
  Star,
  ArrowRight,
  CheckCircle,
  Rocket,
  Shield,
  TrendingUp,
  Globe,
} from "lucide-react";

export default function Landing() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { toast } = useToast();
  const { login, register } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginForm.email, loginForm.password);
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });
      setShowLogin(false);
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(
        registerForm.name,
        registerForm.email,
        registerForm.password,
      );
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
      setShowRegister(false);
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "Thank you for your message. I'll get back to you soon.",
        });
        setContactForm({ name: "", email: "", message: "" });
      } else {
        toast({
          title: "Failed to send",
          description: "Please try again or contact me directly via email",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to send",
        description: "Please try again or contact me directly via email",
        variant: "destructive",
      });
    }
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description:
        "Smart chatbot automation that handles customer inquiries and bookings 24/7",
      gradient: "from-purple-600 to-indigo-600",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description:
        "Automated appointment booking with conflict detection and optimal time suggestions",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: Users,
      title: "Customer Management",
      description:
        "Complete customer profiles with history, preferences, and automated follow-ups",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Real-time business insights with revenue tracking and performance metrics",
      gradient: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-96 -left-96 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -right-96 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-96 left-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-2xl flex items-center justify-center animate-float">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                  IntelliServe
                </h1>
                <p className="text-xs text-purple-200">AI-Enhanced CRM</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-purple-200 hover:text-white transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-purple-200 hover:text-white transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-purple-200 hover:text-white transition-colors"
              >
                Contact
              </button>
              <Button
                onClick={() => setShowLogin(true)}
                variant="ghost"
                className="text-purple-200 hover:text-white hover:bg-white/10"
              >
                Sign In
              </Button>
              <Button
                onClick={() => setShowRegister(true)}
                className="btn-gradient"
              >
                Get Started
              </Button>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-white"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>

          {showMobileMenu && (
            <div className="md:hidden pb-6 space-y-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-purple-200"
                onClick={() => scrollToSection("features")}
              >
                Features
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-purple-200"
                onClick={() => scrollToSection("contact")}
              >
                Contact
              </Button>
              <Button onClick={() => setShowLogin(true)} className="w-full">
                Sign In
              </Button>
              <Button
                onClick={() => setShowRegister(true)}
                className="w-full btn-gradient"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20">
              <Rocket className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-medium">
                Revolutionary CRM Technology
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent animate-glow">
                Service Business
              </span>
              with AI Power
            </h1>

            <p className="text-xl lg:text-2xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
              IntelliServe revolutionizes how service businesses operate with
              intelligent automation, seamless customer management, and
              data-driven insights that boost revenue by up to 40%.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
              <Button
                onClick={() => setShowRegister(true)}
                size="lg"
                className="btn-gradient text-lg px-12 py-4 rounded-2xl transform hover:scale-105 transition-all"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Button
                onClick={() => {
                  window.open(
                    "https://www.youtube.com/@zaid5222",
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-pink-500 text-white text-lg px-12 py-4 rounded-2xl transform hover:scale-105 transition-all shadow-lg border-none"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 pt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">99.9%</div>
                <div className="text-sm text-purple-200">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">10k+</div>
                <div className="text-sm text-purple-200">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400">40%</div>
                <div className="text-sm text-purple-200">Revenue Boost</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative z-10 py-20 bg-black/20 backdrop-blur-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Powerful Features for
              <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Modern Businesses
              </span>
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">
              Everything you need to streamline operations, delight customers,
              and scale your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="bg-gradient-to-br from-emerald-500 via-purple-900 to-pink-500 border-none shadow-2xl group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4"
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-200 text-center leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform
              <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Your Business?
              </span>
            </h2>
            <p className="text-xl text-purple-200">
              Get in touch and let's discuss your success story.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold mb-6 text-white">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <Phone className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Phone</p>
                    <p className="text-purple-200">+92 336 1435189</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Mail className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <p className="text-purple-200">zaid.ch20@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Linkedin className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-white">LinkedIn</p>
                    <a
                      href="https://www.linkedin.com/in/zaid-naeem-1b24611a8/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-200 hover:text-cyan-400 transition-colors"
                    >
                      Connect with Zaid
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <p className="text-white font-medium mb-2">
                  About the Developer
                </p>
                <p className="text-purple-200 text-sm leading-relaxed">
                  "I designed, developed and deployed this CRM app — solo, like
                  a one-man army."
                </p>
                <p className="text-cyan-400 text-sm mt-2 font-medium">
                  - Zaid Naeem
                </p>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-emerald-500 via-purple-900 to-pink-500 border-none shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-cyan-400" />
                  Send Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-white">
                      Your Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      className="bg-white/10 border-white/30 text-white focus:border-cyan-400"
                      style={{ color: "white" }}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">
                      Your Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          email: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/30 text-white focus:border-cyan-400"
                      style={{ color: "white" }}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-white">
                      Your Message
                    </Label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Tell me about your business needs..."
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          message: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
                      style={{ color: "white" }}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-gradient text-lg py-3 rounded-xl"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="bg-slate-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Welcome Back
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                className="bg-white/10 border-white/30 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                className="bg-white/10 border-white/30 text-white"
                required
              />
            </div>
            <Button type="submit" className="w-full btn-gradient">
              Sign In
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Register Modal */}
      <Dialog open={showRegister} onOpenChange={setShowRegister}>
        <DialogContent className="bg-slate-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Get Started Today
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="register-name">Full Name</Label>
              <Input
                id="register-name"
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, name: e.target.value })
                }
                className="bg-white/10 border-white/30 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
                className="bg-white/10 border-white/30 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                type="password"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
                className="bg-white/10 border-white/30 text-white"
                required
              />
            </div>
            <Button type="submit" className="w-full btn-gradient">
              Create Account
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
