import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/sidebar-new';
import { useAuth } from '@/hooks/useAuth';
import { getAuthHeaders } from '@/lib/auth';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  DollarSign,
  MapPin,
  Star,
  TrendingUp,
  Zap,
  Filter,
  Search,
  Plus,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Appointment {
  _id: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Rejected' | 'Completed';
  notes?: string;
  customer: {
    name: string;
    email?: string;
    phone: string;
  };
  service: {
    name: string;
    price: number;
    durationMinutes: number;
  };
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [allDataLoading, setAllDataLoading] = useState(true); // NEW
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filter, setFilter] = useState<
    'all' | 'pending' | 'confirmed' | 'completed'
  >('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setAllDataLoading(true); // NEW
      const [appointmentsRes, customersRes, servicesRes] = await Promise.all([
        fetch('/api/appointments', { headers: getAuthHeaders() }),
        fetch('/api/customers', { headers: getAuthHeaders() }),
        fetch('/api/services', { headers: getAuthHeaders() }),
      ]);

      const [appointments, customers, services] = await Promise.all([
        appointmentsRes.json(),
        customersRes.json(),
        servicesRes.json(),
      ]);

      const customerMap = Object.fromEntries(customers.map((c) => [c._id, c]));
      const serviceMap = Object.fromEntries(services.map((s) => [s._id, s]));

      const enrichedAppointments = appointments.map((app) => ({
        ...app,
        customer: customerMap[app.customerId],
        service: serviceMap[app.serviceId],
      }));

      setAppointments(enrichedAppointments);
      setAllDataLoading(false); // NEW
    };

    fetchAll();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments', {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (
    appointmentId: string,
    status: string
  ) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'Confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Completed':
        return <Star className="w-4 h-4" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'from-amber-500 to-orange-500';
      case 'Confirmed':
        return 'from-emerald-500 to-teal-500';
      case 'Completed':
        return 'from-purple-500 to-indigo-500';
      case 'Rejected':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === 'all') return true;
    return appointment.status.toLowerCase() === filter;
  });

  const getInitials = (name: string) => {
    if (!name) return 'N/A';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const todayAppointments = appointments.filter((app) => {
    const today = new Date().toISOString().split('T')[0];
    return app.date === today;
  });

  const upcomingAppointments = appointments.filter((app) => {
    const today = new Date().toISOString().split('T')[0];
    return app.date > today;
  });

  console.log('filteredAppointments', filteredAppointments);

  if (loading || allDataLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <p className="text-white text-lg">Loading appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10">
        <div className="p-8 border-b border-white/10 bg-black/20 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Appointments
              </h1>
              <p className="text-purple-200 mt-2">
                Manage your bookings and schedule
              </p>
            </div>
            <Button className="btn-gradient" onClick={openModal}>
              <Plus className="w-5 h-5 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>
        {/* <div>
          <pre>{JSON.stringify(filteredAppointments, null, 2)}</pre>
        </div> */}
        {/* Stats Cards */}
        <div className="p-8 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="modern-card bg-transparent bg-gradient-to-br from-yellow-300 to-red-400 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-medium">Total</p>
                    <p className="text-3xl font-bold text-white">
                      {appointments.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card bg-transparent bg-gradient-to-br from-yellow-300 to-red-400 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-medium">Today</p>
                    <p className="text-3xl font-bold text-white">
                      {todayAppointments.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card bg-transparent bg-gradient-to-br from-yellow-300 to-red-400 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-medium">
                      Upcoming
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {upcomingAppointments.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card bg-transparent bg-gradient-to-br from-yellow-300 to-red-400 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-medium">
                      Revenue
                    </p>
                    <p className="text-3xl font-bold text-white">
                      $
                      {appointments.reduce(
                        (sum, app) => sum + (app?.service?.price ?? 1),
                        0
                      )}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="px-8 pb-4">
          <div className="flex space-x-4">
            {[
              { key: 'all', label: 'All Appointments', icon: Calendar },
              { key: 'pending', label: 'Pending', icon: AlertCircle },
              { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
              { key: 'completed', label: 'Completed', icon: Star },
            ].map((filterOption) => {
              const Icon = filterOption.icon;
              const isActive = filter === filterOption.key;
              return (
                <Button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key as any)}
                  variant={isActive ? 'default' : 'outline'}
                  className={`${
                    isActive
                      ? 'btn-gradient'
                      : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                  } rounded-xl`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {filterOption.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Appointments List */}
        <div className="flex-1 p-8 pt-0 overflow-y-auto">
          {filteredAppointments.length === 0 ? (
            <Card className="modern-card !bg-transparent bg-gradient-to-br from-purple-700/30 to-cyan-700/20 backdrop-blur-lg border-white/20">
              {' '}
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No appointments found
                </h3>
                <p className="text-purple-200 mb-6">
                  Start scheduling appointments to see them here.
                </p>
                <Button className="btn-gradient" onClick={openModal}>
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule First Appointment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <Card
                  key={appointment._id}
                  className="modern-card bg-gradient-to-br from-yellow-300 to-green-400 backdrop-blur-lg border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                          {getInitials(appointment.customer?.name || 'Unknown')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-xl text-white mb-1">
                                {appointment.customer?.name}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-purple-200">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(
                                    appointment.date
                                  ).toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {appointment.time}
                                </div>
                              </div>
                            </div>
                            <Badge
                              className={`bg-gradient-to-r ${getStatusColor(
                                appointment.status
                              )} text-white border-0 px-3 py-1 rounded-full`}
                            >
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(appointment.status)}
                                <span>{appointment.status}</span>
                              </div>
                            </Badge>
                          </div>

                          <div className="bg-gradient-to-br from-purple-700/40 to-cyan-700/20 rounded-xl p-4 mb-4 border border-white/10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex items-center space-x-2">
                                <Zap className="w-4 h-4 text-cyan-400" />
                                <span className="text-white font-medium">
                                  {appointment.service?.name ?? 'Miscellaneous'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <DollarSign className="w-4 h-4 text-emerald-400" />
                                <span className="text-white">
                                  ${appointment.service?.price ?? 200}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-amber-400" />
                                <span className="text-white">
                                  {appointment.service?.durationMinutes ?? 99}{' '}
                                  min
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-purple-200 mb-4">
                            {appointment.customer?.phone && (
                              <div className="flex items-center space-x-1">
                                <Phone className="w-4 h-4" />
                                <span>{appointment.customer.phone}</span>
                              </div>
                            )}
                            {appointment.customer?.email && (
                              <div className="flex items-center space-x-1">
                                <Mail className="w-4 h-4" />
                                <span>{appointment.customer.email}</span>
                              </div>
                            )}
                          </div>

                          {appointment.notes && (
                            <div className="bg-white/5 rounded-xl p-3 mb-4">
                              <p className="text-purple-200 text-sm italic">
                                "{appointment.notes}"
                              </p>
                            </div>
                          )}

                          {appointment.status === 'Pending' && (
                            <div className="flex space-x-2">
                              <Button
                                onClick={() =>
                                  updateAppointmentStatus(
                                    appointment._id,
                                    'Confirmed'
                                  )
                                }
                                size="sm"
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Confirm
                              </Button>
                              <Button
                                onClick={() =>
                                  updateAppointmentStatus(
                                    appointment._id,
                                    'Rejected'
                                  )
                                }
                                size="sm"
                                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-0"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}

                          {appointment.status === 'Confirmed' && (
                            <Button
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment._id,
                                  'Completed'
                                )
                              }
                              size="sm"
                              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-0"
                            >
                              <Star className="w-4 h-4 mr-1" />
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
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
                </span>{' '}
                — Full-stack Mobile and Web Application developer. Tech stack:
                React, React Native, MERN & Ruby on Rails developer
              </p>
              <p>
                <span className="font-medium text-purple-500">📧 Email:</span>{' '}
                <a href="mailto:zaid.ch20@gmail.com" className="underline">
                  zaid.ch20@gmail.com
                </a>
              </p>
              <p>
                <span className="font-medium text-purple-500">📞 Phone:</span>{' '}
                <a href="tel:+923361435189" className="underline">
                  +92 336 1435189
                </a>
              </p>
              <p>
                <span className="font-medium text-purple-500">
                  🔗 LinkedIn:
                </span>{' '}
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
