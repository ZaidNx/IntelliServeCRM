import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/sidebar-new";
import { useAuth } from "@/hooks/useAuth";
import { getAuthHeaders } from "@/lib/auth";
import {
  Calendar,
  Clock,
  UserPlus,
  DollarSign,
  TrendingUp,
  Activity,
  Users,
  ArrowUpRight,
  Sparkles,
  Star,
  ChevronRight,
  BarChart3,
  Zap,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  newCustomers: number;
  revenue: number;
  todaySchedule: Array<{
    _id: string;
    customerName: string;
    serviceName: string;
    time: string;
    status: string;
  }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats", {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "Completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {/* Modern Header with Greeting */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-20 animate-pulse"></div>
                <div className="relative bg-white rounded-lg p-6 shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold animate-float">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                        Welcome back, {user?.name || "User"}!
                      </h1>
                      <p className="text-lg text-gray-600 flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                        Your business is thriving today
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 lg:mt-0 flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="btn-modern border-purple-200 text-purple-700 hover:bg-purple-50"
                  onClick={openModal}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <Button className="btn-modern btn-gradient" onClick={openModal}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  New Appointment
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="modern-card animate-pulse">
                  <CardHeader className="space-y-0 pb-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* Revolutionary Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <Card className="modern-card relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 opacity-90"></div>
                  <div className="relative text-white p-6">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-purple-100">
                        Total Appointments
                      </CardTitle>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="text-4xl font-bold mb-2">
                        {stats?.totalAppointments || 0}
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <p className="text-xs text-purple-100">
                          +12% from last month
                        </p>
                      </div>
                    </CardContent>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/30 to-transparent"></div>
                </Card>

                <Card className="modern-card relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-90"></div>
                  <div className="relative text-white p-6">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-emerald-100">
                        Today's Schedule
                      </CardTitle>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="text-4xl font-bold mb-2">
                        {stats?.todayAppointments || 0}
                      </div>
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 mr-1" />
                        <p className="text-xs text-emerald-100">
                          Next at 2:30 PM
                        </p>
                      </div>
                    </CardContent>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/30 to-transparent"></div>
                </Card>

                <Card className="modern-card relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 opacity-90"></div>
                  <div className="relative text-white p-6">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-cyan-100">
                        New Customers
                      </CardTitle>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="text-4xl font-bold mb-2">
                        {stats?.newCustomers || 0}
                      </div>
                      <div className="flex items-center">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        <p className="text-xs text-cyan-100">+8% growth rate</p>
                      </div>
                    </CardContent>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/30 to-transparent"></div>
                </Card>

                <Card className="modern-card relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 opacity-90"></div>
                  <div className="relative text-white p-6">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-amber-100">
                        Monthly Revenue
                      </CardTitle>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="text-4xl font-bold mb-2">
                        ${stats?.revenue || 0}
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <p className="text-xs text-amber-100">
                          +15% vs last month
                        </p>
                      </div>
                    </CardContent>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/30 to-transparent"></div>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Today's Schedule - Enhanced */}
                <Card className="xl:col-span-2 modern-card shadow-2xl border-0">
                  <CardHeader className="bg-gradient-to-r from-slate-900 to-purple-900 text-white rounded-t-2xl">
                    <CardTitle className="text-2xl font-bold flex items-center">
                      <Clock className="mr-3 h-7 w-7" />
                      Today's Schedule
                      <Badge className="ml-auto bg-white/20 text-white border-0">
                        {stats?.todaySchedule?.length || 0} appointments
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 max-h-96 overflow-y-auto">
                    {stats?.todaySchedule && stats.todaySchedule.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {stats.todaySchedule.map((appointment, index) => (
                          <div
                            key={appointment._id}
                            className="p-6 hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50 transition-all duration-300 group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="relative">
                                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                                    {appointment.customerName.charAt(0)}
                                  </div>
                                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                      {index + 1}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <p className="font-bold text-lg text-gray-900 group-hover:text-purple-700 transition-colors">
                                    {appointment.customerName}
                                  </p>
                                  <p className="text-gray-600 font-medium">
                                    {appointment.serviceName}
                                  </p>
                                  <div className="flex items-center mt-1">
                                    <Star className="w-4 h-4 text-amber-400 mr-1" />
                                    <span className="text-sm text-gray-500">
                                      Premium Client
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <Badge
                                  className={`${getStatusColor(
                                    appointment.status,
                                  )} border font-semibold px-3 py-1`}
                                >
                                  {appointment.status}
                                </Badge>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-gray-900">
                                    {appointment.time}
                                  </p>
                                  <p className="text-sm text-gray-500 flex items-center">
                                    <Zap className="w-3 h-3 mr-1" />
                                    60 min
                                  </p>
                                </div>
                                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition-colors" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-16 text-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                          <Clock className="h-16 w-16 text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          All Clear Today!
                        </h3>
                        <p className="text-gray-600 mb-8 text-lg">
                          No appointments scheduled. Perfect time to plan ahead.
                        </p>
                        <Button className="btn-modern btn-gradient text-lg px-8 py-3">
                          <UserPlus className="w-5 h-5 mr-2" />
                          Schedule First Appointment
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Side Panel - Analytics & Quick Actions */}
                <div className="space-y-6">
                  {/* Business Insights */}
                  <Card className="modern-card shadow-xl border-0">
                    <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-2xl">
                      <CardTitle className="text-lg font-bold flex items-center">
                        <BarChart3 className="mr-2 h-5 w-5" />
                        Business Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 font-medium">
                            Monthly Target
                          </span>
                          <span className="font-bold text-emerald-600">
                            78%
                          </span>
                        </div>
                        <Progress value={78} className="h-3 bg-gray-100" />
                        <p className="text-xs text-gray-500 mt-1">
                          $2,340 to goal
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 font-medium">
                            Customer Satisfaction
                          </span>
                          <span className="font-bold text-purple-600">94%</span>
                        </div>
                        <Progress value={94} className="h-3 bg-gray-100" />
                        <p className="text-xs text-gray-500 mt-1">
                          Excellent rating this month
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 font-medium">
                            Booking Efficiency
                          </span>
                          <span className="font-bold text-cyan-600">86%</span>
                        </div>
                        <Progress value={86} className="h-3 bg-gray-100" />
                        <p className="text-xs text-gray-500 mt-1">
                          Great utilization rate
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="modern-card shadow-xl border-0">
                    <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-2xl">
                      <CardTitle className="text-lg font-bold flex items-center">
                        <Zap className="mr-2 h-5 w-5" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start btn-modern border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                        onClick={openModal}
                      >
                        <UserPlus className="w-4 h-4 mr-3" />
                        Add New Customer
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start btn-modern border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
                        onClick={openModal}
                      >
                        <Calendar className="w-4 h-4 mr-3" />
                        Book Appointment
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start btn-modern border-cyan-200 hover:bg-cyan-50 hover:border-cyan-300"
                        onClick={openModal}
                      >
                        <BarChart3 className="w-4 h-4 mr-3" />
                        View Reports
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start btn-modern border-amber-200 hover:bg-amber-50 hover:border-amber-300"
                        onClick={openModal}
                      >
                        <Star className="w-4 h-4 mr-3" />
                        Customer Reviews
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-purple-700">
                  Coming Soon
                </DialogTitle>
              </DialogHeader>

              <p className="text-sm text-gray-600 mb-4">
                This feature is under development. If you'd like to build a
                customized app like this or have a business idea, feel free to
                reach out!
              </p>

              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-semibold text-purple-600">
                    👨‍💻 Zaid Naeem
                  </span>{" "}
                  — Full-stack Mobile and Web Application developer. Tech stack:
                  React, React Native, MERN & Ruby on Rails developer
                </p>
                <p>
                  <span className="font-medium text-purple-500">📧 Email:</span>{" "}
                  <a href="mailto:zaid.ch20@gmail.com" className="underline">
                    zaid.ch20@gmail.com
                  </a>
                </p>
                <p>
                  <span className="font-medium text-purple-500">📞 Phone:</span>{" "}
                  <a href="tel:+923361435189" className="underline">
                    +92 336 1435189
                  </a>
                </p>
                <p>
                  <span className="font-medium text-purple-500">
                    🔗 LinkedIn:
                  </span>{" "}
                  <a
                    href="https://www.linkedin.com/in/zaid-naeem-1b24611a8/"
                    target="_blank"
                    className="underline"
                  >
                    https://www.linkedin.com/in/zaid-naeem-1b24611a8/
                  </a>
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={closeModal}>
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
