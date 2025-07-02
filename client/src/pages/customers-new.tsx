import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/sidebar-new";
import { useAuth } from "@/hooks/useAuth";
import { getAuthHeaders } from "@/lib/auth";
import {
  Users,
  Search,
  Phone,
  Mail,
  Calendar,
  Star,
  TrendingUp,
  UserPlus,
  Heart,
  Award,
  Clock,
  DollarSign,
  Activity,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  createdAt: string;
  appointmentCount?: number;
  lastAppointment?: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers", {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm),
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const totalCustomers = customers.length;
  const newCustomersThisMonth = customers.filter((customer) => {
    const customerDate = new Date(customer.createdAt);
    const now = new Date();
    return (
      customerDate.getMonth() === now.getMonth() &&
      customerDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const loyalCustomers = customers.filter(
    (customer) => (customer.appointmentCount || 0) >= 3,
  ).length;
  const totalRevenue = customers.reduce(
    (sum, customer) => sum + (customer.appointmentCount || 0) * 75,
    0,
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Users className="w-8 h-8 	text-purple-900" />
            </div>
            <p className="	text-purple-900 text-lg">Loading customers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 	text-purple-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-9000"></div>
      </div>

      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div className="p-8 border-b border-white/10 bg-black/20 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Customers
              </h1>
              <p className="	text-purple-900 mt-2">
                Manage your customer relationships
              </p>
            </div>
            <Button className="btn-gradient" onClick={openModal}>
              <UserPlus className="w-5 h-5 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-8 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="modern-card bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="	text-purple-900 text-sm font-medium">
                      Total Customers
                    </p>
                    <p className="text-3xl font-bold 	text-purple-900">
                      {totalCustomers}
                    </p>
                    <p className="text-xs 	text-purple-900 mt-1">
                      Active database
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 	text-purple-900" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-900 text-sm font-medium">
                      New This Month
                    </p>
                    <p className="text-3xl font-bold 	text-purple-900">
                      {newCustomersThisMonth}
                    </p>
                    <p className="text-xs text-purple-800 mt-1">
                      Growing strong
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 	text-purple-900" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card bg-gradient-to-br from-amber-600/20 to-orange-600/20 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-900 text-sm font-medium">
                      Loyal Customers
                    </p>
                    <p className="text-3xl font-bold 	text-purple-900">
                      {loyalCustomers}
                    </p>
                    <p className="text-xs text-purple-800 mt-1">
                      3+ appointments
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 	text-purple-900" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-900 text-sm font-medium">
                      Customer LTV
                    </p>
                    <p className="text-3xl font-bold 	text-purple-900">
                      $
                      {totalCustomers > 0
                        ? Math.round(totalRevenue / totalCustomers)
                        : 0}
                    </p>
                    <p className="text-xs text-purple-800 mt-1">
                      Average value
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 	text-purple-900" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search */}
        <div className="px-8 pb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 	text-purple-900 w-5 h-5" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/30 	text-purple-900 placeholder-purple-300 focus:border-cyan-400 rounded-xl"
            />
          </div>
        </div>

        {/* Customers List */}
        <div className="flex-1 p-8 pt-0 overflow-y-auto">
          {filteredCustomers.length === 0 ? (
            <Card className="modern-card bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 	text-purple-900" />
                </div>
                <h3 className="text-xl font-semibold 	text-purple-900 mb-2">
                  {searchTerm ? "No customers found" : "No customers yet"}
                </h3>
                <p className="	text-purple-900 mb-6">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Start adding customers to build your database"}
                </p>
                {!searchTerm && (
                  <Button className="btn-gradient">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add First Customer
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCustomers.map((customer) => (
                <Card
                  key={customer._id}
                  className="modern-card bg-white/10 backdrop-blur-lg border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center 	text-purple-900 font-bold text-xl group-hover:scale-110 transition-transform">
                        {getInitials(customer.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg 	text-purple-900 truncate">
                          {customer.name}
                        </h3>
                        <p className="	text-purple-900 text-sm">
                          Customer since {formatDate(customer.createdAt)}
                        </p>
                        {(customer.appointmentCount || 0) >= 3 && (
                          <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full px-2 py-1 mt-2">
                            <Award className="w-3 h-3 	text-purple-900" />
                            <span className="text-xs 	text-purple-900 font-medium">
                              Loyal
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {customer.email && (
                        <div className="flex items-center space-x-3 text-sm 	text-purple-900 bg-white/5 rounded-xl p-3">
                          <Mail className="w-4 h-4 text-cyan-400" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-3 text-sm 	text-purple-900 bg-white/5 rounded-xl p-3">
                        <Phone className="w-4 h-4 text-emerald-400" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Calendar className="w-4 h-4 	text-purple-900" />
                          <span className="text-xs 	text-purple-900">
                            Appointments
                          </span>
                        </div>
                        <p className="text-lg font-bold 	text-purple-900">
                          {customer.appointmentCount || 0}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span className="text-xs 	text-purple-900">
                            Last Visit
                          </span>
                        </div>
                        <p className="text-xs font-medium 	text-purple-900">
                          {customer.lastAppointment
                            ? formatDate(customer.lastAppointment)
                            : "Never"}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 	text-purple-900 border-0 rounded-xl"
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        Book
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-white/30 text-black hover:bg-white/10 hover:text-black rounded-xl"
                      >
                        <Activity className="w-4 h-4 mr-1" />
                        History
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
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
    </div>
  );
}
