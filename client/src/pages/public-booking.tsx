import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SimpleChatbot } from "@/components/simple-chatbot";
import { useToast } from "@/hooks/use-toast";
import {
  Building,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle,
  X,
} from "lucide-react";

interface BusinessData {
  business: {
    _id: string;
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

interface BookingForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  date: string;
  time: string;
  notes: string;
}

export default function PublicBooking() {
  const { slug } = useParams();
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    serviceId: "",
    date: "",
    time: "",
    notes: "",
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showAvailableSlots, setShowAvailableSlots] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchBusinessData();
    }
  }, [slug]);

  const fetchBusinessData = async () => {
    try {
      const response = await fetch(`/api/public/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setBusinessData(data);
      } else if (response.status === 404) {
        toast({
          title: "Business not found",
          description: "The requested business page could not be found.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load business information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openBookingModal = (serviceId: string) => {
    setSelectedService(serviceId);
    setBookingForm({ ...bookingForm, serviceId });
    setShowBookingModal(true);
  };

  const generateAvailableSlots = async () => {
    if (!businessData || !bookingForm.serviceId || !bookingForm.date) {
      toast({
        title: "Missing information",
        description: "Please select a service and date first",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `/api/public/${slug}/available-slots?serviceId=${bookingForm.serviceId}&date=${bookingForm.date}`,
      );
      if (response.ok) {
        const slots = await response.json();
        setAvailableSlots(slots);
        setShowAvailableSlots(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch available slots",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch available slots",
        variant: "destructive",
      });
    }
  };

  const handleBooking = async () => {
    if (
      !bookingForm.customerName ||
      !bookingForm.customerPhone ||
      !bookingForm.serviceId ||
      !bookingForm.date ||
      !bookingForm.time ||
      !bookingForm.customerEmail
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const email = bookingForm.customerEmail.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address .",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    try {
      const response = await fetch(`/api/public/${slug}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm),
      });

      if (response.ok) {
        setBookingSuccess(true);
        toast({
          title: "Booking confirmed!",
          description: "Your appointment has been successfully booked.",
        });
      } else {
        const error = await response.json();
        // Show available slots if booking failed due to time conflict
        if (
          error.message &&
          (error.message.includes("slot") ||
            error.message.includes("time") ||
            error.message.includes("conflict"))
        ) {
          await generateAvailableSlots();
          toast({
            title: "Time slot unavailable",
            description: `${error.message}. Check available slots below.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Booking failed",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create booking",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
        slots.push(time);
      }
    }
    return slots;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-intelliserve-primary"></div>
      </div>
    );
  }

  if (!businessData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Business Not Found
            </h1>
            <p className="text-gray-600">
              The requested business page could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedServiceData = businessData.services.find(
    (s) => s._id === selectedService,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Business Header */}
        <Card className="shadow-lg mb-8">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building className="text-white w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold text-intelliserve-secondary mb-2">
                {businessData.business.businessName ||
                  businessData.business.name}
              </h1>
              <div className="flex items-center justify-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{businessData.business.location}</span>
              </div>
              <div className="flex items-center justify-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <span>{businessData.business.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-intelliserve-secondary">
              Our Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            {businessData.services.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No services available at the moment.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {businessData.services.map((service) => (
                  <Card
                    key={service._id}
                    className="border border-gray-200 hover:border-intelliserve-primary transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-intelliserve-secondary">
                            {service.name}
                          </h3>
                          <div className="flex items-center text-gray-600 text-sm mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{service.durationMinutes} minutes</span>
                          </div>
                          {service.description && (
                            <p className="text-gray-600 text-sm mt-2">
                              {service.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-xl font-bold text-intelliserve-primary">
                            <DollarSign className="w-5 h-5" />
                            <span>{service.price}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => openBookingModal(service._id)}
                        className="w-full bg-intelliserve-primary hover:bg-blue-600"
                      >
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {bookingSuccess ? "Booking Confirmed!" : "Book Appointment"}
            </DialogTitle>
          </DialogHeader>

          {bookingSuccess ? (
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-700 mb-2">
                Your appointment has been booked!
              </h3>
              <p className="text-gray-600 mb-4">
                You'll receive a confirmation shortly. The business will contact
                you to confirm the details.
              </p>
              <Button
                onClick={() => {
                  setShowBookingModal(false);
                  setBookingSuccess(false);
                  setBookingForm({
                    customerName: "",
                    customerEmail: "",
                    customerPhone: "",
                    serviceId: "",
                    date: "",
                    time: "",
                    notes: "",
                  });
                }}
                className="bg-intelliserve-primary hover:bg-blue-600"
              >
                Book Another Appointment
              </Button>
            </div>
          ) : (
            <>
              {selectedServiceData && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-intelliserve-secondary">
                    {selectedServiceData.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedServiceData.durationMinutes} minutes • $
                    {selectedServiceData.price}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    value={bookingForm.customerName}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        customerName: e.target.value,
                      })
                    }
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="customerPhone">Phone Number *</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={bookingForm.customerPhone}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        customerPhone: e.target.value,
                      })
                    }
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={bookingForm.customerEmail}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        customerEmail: e.target.value,
                      })
                    }
                    placeholder="Your email address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      min={getMinDate()}
                      value={bookingForm.date}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time *</Label>
                    <select
                      id="time"
                      value={bookingForm.time}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, time: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-intelliserve-primary focus:border-transparent"
                    >
                      <option value="">Select time</option>
                      {generateTimeSlots().map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={bookingForm.notes}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, notes: e.target.value })
                    }
                    placeholder="Any special requests or notes..."
                    rows={3}
                  />
                </div>

                {/* View Available Slots Button */}
                {bookingForm.serviceId && bookingForm.date && (
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateAvailableSlots}
                      className="w-full border-intelliserve-primary text-intelliserve-primary hover:bg-intelliserve-primary hover:text-white"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      View Available Time Slots
                    </Button>
                  </div>
                )}

                {/* Available Slots Display */}
                {showAvailableSlots && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        Available Time Slots
                      </h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAvailableSlots(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map((slot) => (
                          <Button
                            key={slot}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setBookingForm({ ...bookingForm, time: slot });
                              setShowAvailableSlots(false);
                            }}
                            className="text-sm hover:bg-intelliserve-primary hover:text-white transition-colors"
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm">
                        No available slots for the selected date and service.
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={() => setShowBookingModal(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={isBooking}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBooking}
                    className="flex-1 bg-intelliserve-primary hover:bg-blue-600"
                    disabled={isBooking}
                  >
                    {isBooking ? "Booking..." : "Book Appointment"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Simple Chatbot */}
      {businessData && (
        <SimpleChatbot businessSlug={slug || ""} businessData={businessData} />
      )}
    </div>
  );
}
