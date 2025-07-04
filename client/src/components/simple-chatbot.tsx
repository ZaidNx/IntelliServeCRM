import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface BusinessData {
  business: {
    name: string;
    businessName: string;
    phone: string;
    location: string;
    workingHours?: Record<
      string,
      { enabled: boolean; start: string; end: string }
    >;
  };
  services: Array<{
    _id: string;
    name: string;
    durationMinutes: number;
    price: number;
    description?: string;
  }>;
}

interface SimpleChatbotProps {
  businessSlug: string;
  businessData: BusinessData;
}

export function SimpleChatbot({
  businessSlug,
  businessData,
}: SimpleChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hello! I'm the assistant for ${businessData.business.businessName}. How can I help you today?`,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isBusinessOpen = () => {
    if (!businessData.business.workingHours) return true;

    const now = new Date();
    const currentDay = now
      .toLocaleDateString("en-US", { weekday: "short" })
      .toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5);

    const todayHours = businessData.business.workingHours[currentDay];
    if (!todayHours || !todayHours.enabled) return false;

    return currentTime >= todayHours.start && currentTime <= todayHours.end;
  };

  const processMessage = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    // Enhanced natural language understanding with multiple variations

    // Business name questions (multiple phrasings)
    if (
      lowerMessage.includes("business name") ||
      lowerMessage.includes("name of this business") ||
      lowerMessage.includes("what is the name") ||
      lowerMessage.includes("business called") ||
      lowerMessage.includes("company name")
    ) {
      return `This business is called ${businessData.business.businessName}.`;
    }

    // Owner questions (multiple phrasings)
    if (
      lowerMessage.includes("owner") ||
      lowerMessage.includes("who runs") ||
      lowerMessage.includes("who owns") ||
      lowerMessage.includes("proprietor") ||
      lowerMessage.includes("who is the boss") ||
      lowerMessage.includes("manager")
    ) {
      return `The owner of this business is ${businessData.business.name}.`;
    }

    // Services questions (multiple phrasings)
    if (
      lowerMessage.includes("services") ||
      lowerMessage.includes("what do you offer") ||
      lowerMessage.includes("what can you do") ||
      lowerMessage.includes("treatments") ||
      lowerMessage.includes("what services") ||
      lowerMessage.includes("service list") ||
      lowerMessage.includes("menu")
    ) {
      const servicesList = businessData.services
        .map(
          (service) =>
            `• ${service.name} - $${service.price} (${service.durationMinutes} minutes)`,
        )
        .join("\n");
      return `We offer the following services:\n${servicesList}`;
    }

    // Location questions (multiple phrasings)
    if (
      lowerMessage.includes("location") ||
      lowerMessage.includes("where are you") ||
      lowerMessage.includes("address") ||
      lowerMessage.includes("where located") ||
      lowerMessage.includes("find you") ||
      lowerMessage.includes("directions")
    ) {
      return `Our address is: ${businessData.business.location}`;
    }

    // Working hours questions (multiple phrasings)
    if (
      lowerMessage.includes("hours") ||
      lowerMessage.includes("when are you open") ||
      lowerMessage.includes("schedule") ||
      lowerMessage.includes("timing") ||
      lowerMessage.includes("open hours") ||
      lowerMessage.includes("business hours") ||
      lowerMessage.includes("what time") ||
      lowerMessage.includes("when open")
    ) {
      if (!businessData.business.workingHours) {
        return "Please contact us directly for our working hours.";
      }

      const workingHoursList = Object.entries(
        businessData.business.workingHours,
      )
        .filter(([_, hours]) => hours.enabled)
        .map(
          ([day, hours]) =>
            `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours.start} - ${hours.end}`,
        )
        .join("\n");

      return `Our working hours are:\n${workingHoursList}`;
    }

    // Open now questions (multiple phrasings)
    if (
      lowerMessage.includes("open now") ||
      lowerMessage.includes("open right now") ||
      lowerMessage.includes("currently open") ||
      lowerMessage.includes("are you open") ||
      lowerMessage.includes("open today")
    ) {
      return isBusinessOpen()
        ? "Yes, we're currently open!"
        : "Sorry, we're currently closed. Please check our working hours.";
    }

    // Available slots questions
    if (
      lowerMessage.includes("available") ||
      lowerMessage.includes("slots") ||
      lowerMessage.includes("free time") ||
      lowerMessage.includes("availability") ||
      lowerMessage.includes("when can") ||
      lowerMessage.includes("available times")
    ) {
      return "You can check available time slots using the 'View Available Slots' button on this page, or use the booking form to see real-time availability for your preferred service and date.";
    }

    // Service-specific price questions (enhanced)
    const serviceMatch = businessData.services.find((service) =>
      lowerMessage.includes(service.name.toLowerCase()),
    );

    if (
      serviceMatch &&
      (lowerMessage.includes("cost") ||
        lowerMessage.includes("price") ||
        lowerMessage.includes("how much") ||
        lowerMessage.includes("fee") ||
        lowerMessage.includes("charge"))
    ) {
      return `${serviceMatch.name} costs $${serviceMatch.price}.`;
    }

    if (
      serviceMatch &&
      (lowerMessage.includes("long") ||
        lowerMessage.includes("duration") ||
        lowerMessage.includes("time") ||
        lowerMessage.includes("take") ||
        lowerMessage.includes("minutes"))
    ) {
      return `${serviceMatch.name} takes ${serviceMatch.durationMinutes} minutes.`;
    }

    // Booking questions (multiple phrasings)
    if (
      lowerMessage.includes("book") ||
      lowerMessage.includes("appointment") ||
      lowerMessage.includes("schedule") ||
      lowerMessage.includes("reserve") ||
      lowerMessage.includes("make appointment") ||
      lowerMessage.includes("get appointment")
    ) {
      return "I'd be happy to help you book an appointment! Please use the booking form on this page to schedule your appointment. You can select your preferred service, date, and time.";
    }

    // Cancel/reschedule questions (multiple phrasings)
    if (
      lowerMessage.includes("cancel") ||
      lowerMessage.includes("reschedule") ||
      lowerMessage.includes("change appointment") ||
      lowerMessage.includes("modify booking")
    ) {
      return "To cancel or reschedule your appointment, please call us directly or contact us through the information provided on this page.";
    }

    // Default response with helpful suggestions
    return "I'm here to help! You can ask me about:\n• Our services and prices\n• Working hours and availability\n• Location and contact info\n• Booking appointments\n\nWhat would you like to know?";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const responseText = processMessage(currentInput);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-intelliserve-primary hover:bg-blue-600 shadow-lg z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-[500px] shadow-xl z-50 flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-3 px-4 bg-intelliserve-primary text-white rounded-t-lg flex-shrink-0">
            <CardTitle className="text-sm font-medium truncate">
              {businessData.business.businessName} Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-white hover:bg-blue-600 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <div className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 px-3 py-2">
              <div className="space-y-3 min-h-0">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-lg text-sm break-words ${
                        message.isUser
                          ? "bg-intelliserve-primary text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-900 rounded-bl-sm"
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        {message.text}
                      </div>
                      <div
                        className={`text-xs mt-1 ${message.isUser ? "text-blue-100" : "text-gray-500"}`}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 p-3 rounded-lg text-sm rounded-bl-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="p-3 border-t bg-white flex-shrink-0">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 text-sm border-gray-300 focus:border-intelliserve-primary"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-intelliserve-primary hover:bg-blue-600 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
