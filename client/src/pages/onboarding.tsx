import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getAuthHeaders } from "@/lib/auth";
import {
  Brain,
  Scissors,
  Stethoscope,
  Wrench,
  Bath,
  Plus,
  Trash2,
} from "lucide-react";
import { useLocation } from "wouter";

interface Profession {
  _id: string;
  name: string;
  icon: string;
  description: string;
}

interface Service {
  name: string;
  durationMinutes: number;
  price: number;
  description?: string;
}

interface WorkingHours {
  [key: string]: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const WEEKDAY_LABELS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const PROFESSION_ICONS = {
  "fas fa-cut": Scissors,
  "fas fa-tooth": Stethoscope,
  "fas fa-spa": Bath,
  "fas fa-wrench": Wrench,
};

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [selectedProfession, setSelectedProfession] = useState<string>("");
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    phone: "",
    location: "",
  });
  const [workingHours, setWorkingHours] = useState<WorkingHours>({});
  const [services, setServices] = useState<Service[]>([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [currentService, setCurrentService] = useState<Service>({
    name: "",
    durationMinutes: 30,
    price: 0,
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const { user, updateUser } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetchProfessions();
    initializeWorkingHours();
  }, []);

  const fetchProfessions = async () => {
    try {
      const response = await fetch("/api/professions");
      const data = await response.json();
      setProfessions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load professions",
        variant: "destructive",
      });
    }
  };

  const initializeWorkingHours = () => {
    const defaultHours: WorkingHours = {};
    WEEKDAYS.forEach((day) => {
      defaultHours[day] = {
        enabled: day !== "sunday",
        start: "09:00",
        end: "17:00",
      };
    });
    setWorkingHours(defaultHours);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleWorkingHoursChange = (
    day: string,
    field: "enabled" | "start" | "end",
    value: boolean | string,
  ) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const addService = () => {
    if (
      currentService.name &&
      currentService.durationMinutes > 0 &&
      currentService.price >= 0
    ) {
      setServices([...services, currentService]);
      setCurrentService({
        name: "",
        durationMinutes: 30,
        price: 0,
        description: "",
      });
      setShowServiceModal(false);
    }
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const completeOnboarding = async () => {
    if (services.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one service",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Update user profile
      const userUpdateResponse = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          professionId: selectedProfession,
          businessName: businessInfo.businessName,
          phone: businessInfo.phone,
          location: businessInfo.location,
          workingHours,
        }),
      });

      if (!userUpdateResponse.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await userUpdateResponse.json();
      updateUser(updatedUser);

      // Create services
      for (const service of services) {
        const serviceResponse = await fetch("/api/services", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(service),
        });

        if (!serviceResponse.ok) {
          throw new Error("Failed to create service");
        }
      }

      toast({
        title: "Success!",
        description: "Your business setup is complete!",
      });
      // Force a page reload to trigger the routing logic
      window.location.href = "/dashboard";
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-intelliserve-secondary mb-2">
                Choose Your Profession
              </h2>
              <p className="text-gray-600">
                Select your primary service category
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {professions.map((profession) => {
                const IconComponent =
                  PROFESSION_ICONS[
                    profession.icon as keyof typeof PROFESSION_ICONS
                  ] || Brain;
                return (
                  <Card
                    key={profession._id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedProfession === profession._id
                        ? "border-intelliserve-primary bg-primary/5"
                        : "border-gray-200"
                    }`}
                    onClick={() => setSelectedProfession(profession._id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                          <IconComponent className="text-intelliserve-primary w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {profession.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {profession.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Button
              onClick={nextStep}
              disabled={!selectedProfession}
              className="w-full bg-intelliserve-primary hover:bg-blue-600 mt-8"
            >
              Continue
            </Button>
          </div>
        );

      case 2:
        return (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-intelliserve-secondary mb-2">
                Business Information
              </h2>
              <p className="text-gray-600">Tell us about your business</p>
            </div>
            <div className="space-y-6">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="Your business name"
                  value={businessInfo.businessName}
                  onChange={(e) =>
                    setBusinessInfo({
                      ...businessInfo,
                      businessName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Business phone number"
                  value={businessInfo.phone}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Business address"
                  value={businessInfo.location}
                  onChange={(e) =>
                    setBusinessInfo({
                      ...businessInfo,
                      location: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <Button onClick={prevStep} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!businessInfo.businessName}
                className="flex-1 bg-intelliserve-primary hover:bg-blue-600"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-intelliserve-secondary mb-2">
                Working Hours
              </h2>
              <p className="text-gray-600">Set your availability</p>
            </div>
            <div className="space-y-4">
              {WEEKDAYS.map((day, index) => (
                <Card key={day} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={workingHours[day]?.enabled || false}
                        onCheckedChange={(checked) =>
                          handleWorkingHoursChange(day, "enabled", !!checked)
                        }
                      />
                      <span className="font-medium">
                        {WEEKDAY_LABELS[index]}
                      </span>
                    </div>
                    {workingHours[day]?.enabled && (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          value={workingHours[day].start}
                          onChange={(e) =>
                            handleWorkingHoursChange(
                              day,
                              "start",
                              e.target.value,
                            )
                          }
                          className="w-32"
                        />
                        <span className="text-gray-500">to</span>
                        <Input
                          type="time"
                          value={workingHours[day].end}
                          onChange={(e) =>
                            handleWorkingHoursChange(day, "end", e.target.value)
                          }
                          className="w-32"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex gap-4 mt-8">
              <Button onClick={prevStep} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={nextStep}
                className="flex-1 bg-intelliserve-primary hover:bg-blue-600"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-intelliserve-secondary mb-2">
                Define Your Services
              </h2>
              <p className="text-gray-600">
                Add at least one service to get started
              </p>
            </div>
            <div className="space-y-4 mb-6">
              {services.map((service, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {service.durationMinutes} minutes • ${service.price}
                      </p>
                    </div>
                    <Button
                      onClick={() => removeService(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <Button
              onClick={() => setShowServiceModal(true)}
              variant="outline"
              className="w-full border-dashed border-2 border-gray-300 hover:border-intelliserve-primary text-gray-600 hover:text-intelliserve-primary py-4 mb-8"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
            <div className="flex gap-4">
              <Button onClick={prevStep} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={completeOnboarding}
                disabled={services.length === 0 || isLoading}
                className="flex-1 bg-intelliserve-accent hover:bg-orange-600"
              >
                {isLoading ? "Setting up..." : "Complete Setup"}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className="shadow-lg">
          <CardContent className="p-8">{renderStep()}</CardContent>
        </Card>
      </div>

      {/* Service Modal */}
      <Dialog open={showServiceModal} onOpenChange={setShowServiceModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="serviceName">Service Name</Label>
              <Input
                id="serviceName"
                placeholder="e.g., Haircut & Style"
                value={currentService.name}
                onChange={(e) =>
                  setCurrentService({ ...currentService, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={currentService.durationMinutes}
                onChange={(e) =>
                  setCurrentService({
                    ...currentService,
                    durationMinutes: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={currentService.price}
                onChange={(e) =>
                  setCurrentService({
                    ...currentService,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                placeholder="Brief description of the service"
                value={currentService.description}
                onChange={(e) =>
                  setCurrentService({
                    ...currentService,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex gap-4 mt-6">
              <Button
                onClick={() => setShowServiceModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={addService}
                className="flex-1 bg-intelliserve-primary hover:bg-blue-600"
              >
                Add Service
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
