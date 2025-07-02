import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Clock, MapPin, DollarSign, Calendar } from 'lucide-react';

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
    workingHours?: Record<string, { enabled: boolean; start: string; end: string }>;
  };
  services: Array<{
    _id: string;
    name: string;
    durationMinutes: number;
    price: number;
    description?: string;
  }>;
}

interface BookingState {
  step: 'initial' | 'collecting_info' | 'selecting_service' | 'selecting_time' | 'confirming';
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  selectedService?: string;
  selectedDate?: string;
  selectedTime?: string;
  notes?: string;
}

interface CustomChatbotProps {
  businessSlug: string;
  businessData: BusinessData;
}

export function CustomChatbot({ businessSlug, businessData }: CustomChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm the assistant for ${businessData.business.businessName}. How can I help you today?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [bookingState, setBookingState] = useState<BookingState>({ step: 'initial' });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isBusinessOpen = () => {
    if (!businessData.business.workingHours) return true;
    
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase(); // e.g., 'mon', 'tue'
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    
    const todayHours = businessData.business.workingHours[currentDay];
    if (!todayHours || !todayHours.enabled) return false;
    
    return currentTime >= todayHours.start && currentTime <= todayHours.end;
  };

  const processMessage = async (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Business name questions
    if (lowerMessage.includes('business name') || lowerMessage.includes('name of this business')) {
      return `This business is called ${businessData.business.businessName}.`;
    }
    
    // Owner questions
    if (lowerMessage.includes('owner') || lowerMessage.includes('who runs')) {
      return `The owner of this business is ${businessData.business.name}.`;
    }
    
    // Services questions
    if (lowerMessage.includes('services') || lowerMessage.includes('what do you offer')) {
      const servicesList = businessData.services.map(service => 
        `• ${service.name} - $${service.price} (${service.durationMinutes} minutes)`
      ).join('\n');
      return `We offer the following services:\n${servicesList}`;
    }
    
    // Location questions
    if (lowerMessage.includes('location') || lowerMessage.includes('where are you') || lowerMessage.includes('address')) {
      return `Our address is: ${businessData.business.location}`;
    }
    
    // Working hours questions
    if (lowerMessage.includes('hours') || lowerMessage.includes('when are you open') || lowerMessage.includes('schedule')) {
      if (!businessData.business.workingHours) {
        return "Please contact us directly for our working hours.";
      }
      
      const workingHoursList = Object.entries(businessData.business.workingHours)
        .filter(([_, hours]) => hours.enabled)
        .map(([day, hours]) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours.start} - ${hours.end}`)
        .join('\n');
      
      return `Our working hours are:\n${workingHoursList}`;
    }
    
    // Open now questions
    if (lowerMessage.includes('open now') || lowerMessage.includes('open right now')) {
      return isBusinessOpen() 
        ? "Yes, we're currently open!"
        : "Sorry, we're currently closed. Please check our working hours.";
    }
    
    // Service-specific price questions
    const serviceMatch = businessData.services.find(service => 
      lowerMessage.includes(service.name.toLowerCase())
    );
    
    if (serviceMatch && (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('how much'))) {
      return `${serviceMatch.name} costs $${serviceMatch.price}.`;
    }
    
    if (serviceMatch && (lowerMessage.includes('long') || lowerMessage.includes('duration') || lowerMessage.includes('time'))) {
      return `${serviceMatch.name} takes ${serviceMatch.durationMinutes} minutes.`;
    }
    
    // Booking questions
    if (lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
      setBookingState({ step: 'collecting_info' });
      return "Sure! I'd be happy to help you book an appointment. Can you please provide your name, phone number, email, and let me know which service you're interested in?";
    }
    
    // Cancel/reschedule questions
    if (lowerMessage.includes('cancel') || lowerMessage.includes('reschedule')) {
      return "To cancel or reschedule your appointment, please call us directly or provide your booking details so I can help you further.";
    }
    
    // Default response
    return "I'm here to help! You can ask me about our services, prices, working hours, location, or if you'd like to book an appointment. What would you like to know?";
  };

  const handleBookingFlow = async (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    switch (bookingState.step) {
      case 'collecting_info':
        // Try to extract customer information
        const nameMatch = message.match(/name[:\s]*([a-zA-Z\s]+)/i);
        const phoneMatch = message.match(/phone[:\s]*([+\d\s-()]+)/i) || message.match(/(\+?\d{10,})/);
        const emailMatch = message.match(/email[:\s]*([^\s@]+@[^\s@]+\.[^\s@]+)/i);
        
        const updatedState = { ...bookingState };
        if (nameMatch) updatedState.customerName = nameMatch[1].trim();
        if (phoneMatch) updatedState.customerPhone = phoneMatch[1].trim();
        if (emailMatch) updatedState.customerEmail = emailMatch[1].trim();
        
        setBookingState(updatedState);
        
        if (updatedState.customerName && updatedState.customerPhone) {
          setBookingState({ ...updatedState, step: 'selecting_service' });
          const servicesList = businessData.services.map((service, index) => 
            `${index + 1}. ${service.name} - $${service.price} (${service.durationMinutes} minutes)`
          ).join('\n');
          return `Great! Now please select a service:\n${servicesList}\n\nJust type the number or name of the service you'd like.`;
        }
        
        return "I still need some information. Please provide your name and phone number (email is optional).";
        
      case 'selecting_service':
        const serviceNumber = parseInt(message);
        let selectedService;
        
        if (serviceNumber && serviceNumber <= businessData.services.length) {
          selectedService = businessData.services[serviceNumber - 1];
        } else {
          selectedService = businessData.services.find(service => 
            lowerMessage.includes(service.name.toLowerCase())
          );
        }
        
        if (selectedService) {
          setBookingState({ 
            ...bookingState, 
            step: 'selecting_time', 
            selectedService: selectedService._id 
          });
          return `Perfect! You've selected ${selectedService.name}. Please let me know your preferred date and time for the appointment.`;
        }
        
        return "Please select a valid service by typing its number or name.";
        
      case 'selecting_time':
        // Simple date/time extraction (could be enhanced)
        setBookingState({ 
          ...bookingState, 
          step: 'confirming',
          selectedDate: message.includes('/') || message.includes('-') ? message : new Date().toISOString().split('T')[0],
          selectedTime: message.includes(':') ? message.match(/\d{1,2}:\d{2}/)?.[0] || '10:00' : '10:00'
        });
        
        return `Great! Let me confirm your appointment details. Would you like to add any special notes or shall I proceed with the booking?`;
        
      case 'confirming':
        // Book the appointment
        try {
          const selectedServiceData = businessData.services.find(s => s._id === bookingState.selectedService);
          const bookingData = {
            customerName: bookingState.customerName!,
            customerPhone: bookingState.customerPhone!,
            customerEmail: bookingState.customerEmail || '',
            serviceId: bookingState.selectedService!,
            date: bookingState.selectedDate!,
            time: bookingState.selectedTime!,
            notes: message
          };
          
          const response = await fetch(`/api/public/${businessSlug}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
          });
          
          if (response.ok) {
            setBookingState({ step: 'initial' });
            return `Perfect! Your appointment for ${selectedServiceData?.name} has been booked successfully. We'll contact you shortly to confirm the details. Thank you for choosing ${businessData.business.businessName}!`;
          } else {
            return "Sorry, there was an error booking your appointment. Please try again or contact us directly.";
          }
        } catch (error) {
          return "Sorry, there was an error booking your appointment. Please try again or contact us directly.";
        }
        
      default:
        return await processMessage(message);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      let responseText;
      
      if (bookingState.step !== 'initial') {
        responseText = await handleBookingFlow(inputMessage);
      } else {
        responseText = await processMessage(inputMessage);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-intelliserve-primary text-white rounded-t-lg">
            <CardTitle className="text-sm font-medium">
              {businessData.business.businessName} Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 text-white hover:bg-blue-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-2 rounded-lg text-sm ${
                        message.isUser
                          ? 'bg-intelliserve-primary text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.text}</div>
                      <div className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 p-2 rounded-lg text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            <div className="p-3 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-intelliserve-primary hover:bg-blue-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}