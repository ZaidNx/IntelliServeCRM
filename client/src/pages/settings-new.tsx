import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sidebar } from "@/components/sidebar-new";
import { useAuth } from "@/hooks/useAuth";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  User,
  Building,
  Clock,
  Globe,
  Shield,
  Bell,
  Palette,
  Save,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Link as LinkIcon,
  Calendar,
} from "lucide-react";

interface WorkingHours {
  [key: string]: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    businessName: "",
    phone: "",
    location: "",
    publicUrlSlug: "",
  });

  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    monday: { enabled: true, start: "09:00", end: "17:00" },
    tuesday: { enabled: true, start: "09:00", end: "17:00" },
    wednesday: { enabled: true, start: "09:00", end: "17:00" },
    thursday: { enabled: true, start: "09:00", end: "17:00" },
    friday: { enabled: true, start: "09:00", end: "17:00" },
    saturday: { enabled: false, start: "09:00", end: "17:00" },
    sunday: { enabled: false, start: "09:00", end: "17:00" },
  });

  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailReminders: true,
    smsNotifications: false,
    marketingEmails: false,
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        businessName: user.businessName || "",
        phone: user.phone || "",
        location: user.location || "",
        publicUrlSlug: user.publicUrlSlug || "",
      });

      if (user.workingHours) {
        setWorkingHours(user.workingHours);
      }
      setLoading(false);
    }
  }, [user]);

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...profileForm,
          workingHours,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        toast({
          title: "Profile updated",
          description: "Your profile has been saved successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const dayNames = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const dayLabels = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      id: "business",
      label: "Business",
      icon: Building,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      id: "hours",
      label: "Hours",
      icon: Clock,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      gradient: "from-cyan-500 to-blue-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <p className="text-white text-lg">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div className="p-8 border-b border-white/10 bg-black/20 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-purple-200 mt-2">
                Customize your account and business preferences
              </p>
            </div>
            <Button
              onClick={handleProfileSave}
              disabled={saving}
              className="btn-gradient"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="p-8 pb-0">
          <div className="flex space-x-4 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={isActive ? "default" : "outline"}
                  className={`${
                    isActive
                      ? `bg-gradient-to-r ${tab.gradient} text-white border-0`
                      : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                  } rounded-xl px-6 py-3`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-8 pt-0 overflow-y-auto">
          {activeTab === "profile" && (
            <div className="max-w-2xl">
              <Card className="modern-card bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center">
                    <User className="w-6 h-6 mr-2 text-purple-400" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-white">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            name: e.target.value,
                          })
                        }
                        className="bg-white/10 border-white/30 text-white placeholder-purple-300 focus:border-cyan-400"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            email: e.target.value,
                          })
                        }
                        className="bg-white/10 border-white/30 text-white placeholder-purple-300 focus:border-cyan-400"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          phone: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/30 text-white placeholder-purple-300 focus:border-cyan-400"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "business" && (
            <div className="max-w-2xl">
              <Card className="modern-card bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center">
                    <Building className="w-6 h-6 mr-2 text-emerald-400" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="businessName" className="text-white">
                      Business Name
                    </Label>
                    <Input
                      id="businessName"
                      value={profileForm.businessName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          businessName: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/30 text-white placeholder-purple-300 focus:border-cyan-400"
                      placeholder="Your Business Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-white">
                      Business Location
                    </Label>
                    <Input
                      id="location"
                      value={profileForm.location}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          location: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/30 text-white placeholder-purple-300 focus:border-cyan-400"
                      placeholder="123 Main St, City, State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="publicUrlSlug" className="text-white">
                      Public Booking URL
                    </Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-200 text-sm">
                        {window.location.origin}/book/
                      </span>
                      <Input
                        id="publicUrlSlug"
                        value={profileForm.publicUrlSlug}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            publicUrlSlug: e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]/g, "-"),
                          })
                        }
                        className="bg-white/10 border-white/30 text-white placeholder-purple-300 focus:border-cyan-400"
                        placeholder="your-business-name"
                      />
                    </div>
                    <p className="text-xs text-purple-300 mt-1">
                      Customers will use this URL to book appointments online
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "hours" && (
            <div className="max-w-2xl">
              <Card className="modern-card bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center">
                    <Clock className="w-6 h-6 mr-2 text-amber-400" />
                    Working Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dayNames.map((day, index) => (
                    <div
                      key={day}
                      className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="w-24">
                        <span className="text-white font-medium">
                          {dayLabels[index]}
                        </span>
                      </div>
                      <Switch
                        checked={workingHours[day]?.enabled || false}
                        onCheckedChange={(checked) =>
                          setWorkingHours({
                            ...workingHours,
                            [day]: { ...workingHours[day], enabled: checked },
                          })
                        }
                      />
                      {workingHours[day]?.enabled && (
                        <div className="flex items-center space-x-2 flex-1">
                          <Input
                            type="time"
                            value={workingHours[day]?.start || "09:00"}
                            onChange={(e) =>
                              setWorkingHours({
                                ...workingHours,
                                [day]: {
                                  ...workingHours[day],
                                  start: e.target.value,
                                },
                              })
                            }
                            className="bg-white/10 border-white/30 text-white focus:border-cyan-400 w-32"
                          />
                          <span className="text-purple-200">to</span>
                          <Input
                            type="time"
                            value={workingHours[day]?.end || "17:00"}
                            onChange={(e) =>
                              setWorkingHours({
                                ...workingHours,
                                [day]: {
                                  ...workingHours[day],
                                  end: e.target.value,
                                },
                              })
                            }
                            className="bg-white/10 border-white/30 text-white focus:border-cyan-400 w-32"
                          />
                        </div>
                      )}
                      {!workingHours[day]?.enabled && (
                        <span className="text-purple-400 italic flex-1">
                          Closed
                        </span>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="max-w-2xl">
              <Card className="modern-card bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center">
                    <Bell className="w-6 h-6 mr-2 text-cyan-400" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div>
                        <h4 className="text-white font-medium">
                          Email Booking Notifications
                        </h4>
                        <p className="text-purple-200 text-sm">
                          Get notified when new bookings are made
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailBookings}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            emailBookings: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div>
                        <h4 className="text-white font-medium">
                          Email Reminders
                        </h4>
                        <p className="text-purple-200 text-sm">
                          Receive appointment reminders via email
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailReminders}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            emailReminders: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div>
                        <h4 className="text-white font-medium">
                          SMS Notifications
                        </h4>
                        <p className="text-purple-200 text-sm">
                          Get text messages for urgent updates
                        </p>
                      </div>
                      <Switch
                        checked={notifications.smsNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            smsNotifications: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div>
                        <h4 className="text-white font-medium">
                          Marketing Emails
                        </h4>
                        <p className="text-purple-200 text-sm">
                          Receive tips and product updates
                        </p>
                      </div>
                      <Switch
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            marketingEmails: checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
