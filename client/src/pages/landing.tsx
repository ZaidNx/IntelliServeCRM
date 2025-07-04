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
      // Force a page reload to trigger the routing logic
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
      // Force a page reload to trigger the routing logic
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Brain className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-intelliserve-secondary">
                IntelliServe CRM
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-600 hover:text-intelliserve-primary transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-600 hover:text-intelliserve-primary transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-600 hover:text-intelliserve-primary transition-colors"
              >
                Contact
              </button>
              <Button variant="ghost" onClick={() => setShowLogin(true)}>
                Sign In
              </Button>
              <Button
                onClick={() => setShowRegister(true)}
                className="bg-intelliserve-primary hover:bg-blue-600"
              >
                Get Started
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-left text-gray-600 hover:text-intelliserve-primary transition-colors py-2"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-left text-gray-600 hover:text-intelliserve-primary transition-colors py-2"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-left text-gray-600 hover:text-intelliserve-primary transition-colors py-2"
                >
                  Contact
                </button>
                <Button
                  variant="ghost"
                  onClick={() => setShowLogin(true)}
                  className="justify-start"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => setShowRegister(true)}
                  className="bg-intelliserve-primary hover:bg-blue-600"
                >
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              The Future of CRM
              <br />
              <span className="text-intelliserve-primary">Driven by AI</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Empowering service professionals with intelligent automation,
              smart scheduling, and AI-powered customer interactions — all in
              one beautifully crafted platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => setShowRegister(true)}
                className="bg-intelliserve-primary hover:bg-blue-600 text-white px-8 py-4 text-lg font-semibold shadow-lg"
              >
                Start Free Trial
              </Button>
              <Button
                onClick={() => scrollToSection("contact")}
                variant="outline"
                className="border-intelliserve-accent text-intelliserve-accent hover:bg-intelliserve-accent hover:text-intelliserve-secondary px-8 py-4 text-lg font-semibold"
              >
                Contact Me
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Note Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                ZN
              </div>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Hi, I'm{" "}
              <strong className="text-intelliserve-primary">Zaid Naeem</strong>{" "}
              — the designer, developer, and deployer of this application. You
              can reach out to me via the contact section below.
              <br />I designed, developed and deployed this CRM app —{" "}
              <strong className="text-intelliserve-accent">
                solo, like a one-man army
              </strong>
              .
            </p>
            <Button
              onClick={() => scrollToSection("contact")}
              className="mt-6 bg-intelliserve-primary hover:bg-blue-600 text-white px-6 py-3 font-semibold"
            >
              Contact Me
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-intelliserve-secondary mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage your service business efficiently
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="text-intelliserve-primary w-6 h-6" />
                </div>
                <CardTitle>AI-Powered Chatbot</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Intelligent customer service that handles bookings and
                  inquiries 24/7
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="text-intelliserve-accent w-6 h-6" />
                </div>
                <CardTitle>Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automated appointment booking with conflict detection and
                  availability management
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="text-green-600 w-6 h-6" />
                </div>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive insights into your business performance and
                  customer metrics
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 bg-intelliserve-secondary text-white"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-300">
              Ready to transform your service business? Let's talk!
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="text-intelliserve-accent mr-4 w-5 h-5" />
                  <span>+92 336 1435189</span>
                </div>
                <div className="flex items-center">
                  <Mail className="text-intelliserve-accent mr-4 w-5 h-5" />
                  <span>zaid.ch20@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <Linkedin className="text-intelliserve-accent mr-4 w-5 h-5" />
                  <a
                    href="https://www.linkedin.com/in/zaid-naeem-1b24611a8/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    linkedin.com/in/zaid-naeem-1b24611a8/
                  </a>
                </div>
              </div>
            </div>
            <div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <Input
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
                <textarea
                  rows={4}
                  placeholder="Your Message"
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-intelliserve-accent focus:border-transparent"
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-intelliserve-accent hover:bg-orange-600 text-white py-3 font-semibold"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Brain className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold">IntelliServe CRM</span>
            </div>
            <p className="text-gray-400 mb-4">
              The Future of CRM — Driven by AI, Designed for You
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 IntelliServe CRM. Built by Zaid Naeem.
            </p>
          </div>
        </div>
      </footer>

      {/* Login Dialog */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center">
                <Brain className="text-white w-8 h-8" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl font-bold">
              Welcome Back
            </DialogTitle>
            <p className="text-center text-gray-600">
              Sign in to your IntelliServe account
            </p>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-intelliserve-primary hover:bg-blue-600"
            >
              Sign In
            </Button>
          </form>
          <div className="text-center mt-4">
            <Button
              variant="link"
              onClick={() => {
                setShowLogin(false);
                setShowRegister(true);
              }}
            >
              Don't have an account? Sign up
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Register Dialog */}
      <Dialog open={showRegister} onOpenChange={setShowRegister}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center">
                <Brain className="text-white w-8 h-8" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl font-bold">
              Get Started
            </DialogTitle>
            <p className="text-center text-gray-600">
              Create your IntelliServe account
            </p>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="register-name">Full Name</Label>
              <Input
                id="register-name"
                type="text"
                placeholder="Enter your full name"
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="Enter your email"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="Create a password"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-intelliserve-primary hover:bg-blue-600"
            >
              Create Account
            </Button>
          </form>
          <div className="text-center mt-4">
            <Button
              variant="link"
              onClick={() => {
                setShowRegister(false);
                setShowLogin(true);
              }}
            >
              Already have an account? Sign in
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
