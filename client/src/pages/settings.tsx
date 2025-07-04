import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sidebar } from "@/components/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { User, Building, Clock, ExternalLink, Save } from "lucide-react";

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

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    businessName: "",
    phone: "",
    location: "",
  });
  const [workingHours, setWorkingHours] = useState<WorkingHours>({});

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        businessName: user.businessName || "",
        phone: user.phone || "",
        location: user.location || "",
      });

      if (user.workingHours) {
        setWorkingHours(user.workingHours);
      } else {
        initializeWorkingHours();
      }
    }
  }, [user]);

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

  const handleProfileSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          ...profileData,
          workingHours,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-intelliserve-secondary mb-2">
              Settings
            </h1>
            <p className="text-gray-600">
              Manage your profile and business settings
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={profileData.businessName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        businessName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Business Address</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {user?.publicUrlSlug && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-intelliserve-secondary">
                          Public Booking Page
                        </p>
                        <p className="text-sm text-gray-600">
                          Your customers can book appointments at: /book/
                          {user.publicUrlSlug}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(`/book/${user.publicUrlSlug}`, "_blank")
                        }
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Working Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {WEEKDAYS.map((day, index) => (
                    <div
                      key={day}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={workingHours[day]?.enabled || false}
                          onCheckedChange={(checked) =>
                            handleWorkingHoursChange(day, "enabled", !!checked)
                          }
                        />
                        <span className="font-medium w-20">
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
                              handleWorkingHoursChange(
                                day,
                                "end",
                                e.target.value,
                              )
                            }
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleProfileSave}
                disabled={isLoading}
                className="bg-intelliserve-primary hover:bg-blue-600"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
