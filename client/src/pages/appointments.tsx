import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/sidebar';
import { getAuthHeaders } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load appointments", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setAppointments(prev => 
          prev.map(apt => 
            apt._id === appointmentId ? { ...apt, status: status as any } : apt
          )
        );
        toast({ title: "Success", description: `Appointment ${status.toLowerCase()}` });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update appointment", variant: "destructive" });
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setAppointments(prev => prev.filter(apt => apt._id !== appointmentId));
        toast({ title: "Success", description: "Appointment deleted" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete appointment", variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'Pending': return <AlertCircle className="w-4 h-4" />;
      case 'Rejected': return <XCircle className="w-4 h-4" />;
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-intelliserve-secondary mb-2">Appointments</h1>
          <p className="text-gray-600">Manage your upcoming and past appointments</p>
        </div>

        {appointments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No appointments yet</h3>
              <p className="text-gray-500">When customers book appointments, they'll appear here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-intelliserve-primary text-white rounded-full flex items-center justify-center font-semibold">
                        {appointment.customer.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg text-intelliserve-secondary">
                              {appointment.customer.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {appointment.customer.phone}
                              </span>
                              {appointment.customer.email && (
                                <span>{appointment.customer.email}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-intelliserve-secondary">
                                {appointment.service.name}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {formatDate(appointment.date)}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {appointment.time} ({appointment.service.durationMinutes} min)
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-intelliserve-secondary">
                                ${appointment.service.price}
                              </p>
                            </div>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="mt-3 p-2 bg-blue-50 rounded border-l-4 border-blue-200">
                            <p className="text-sm text-gray-700">{appointment.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(appointment.status)}
                          {appointment.status}
                        </div>
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {appointment.status === 'Pending' && (
                            <>
                              <DropdownMenuItem
                                onClick={() => updateAppointmentStatus(appointment._id, 'Confirmed')}
                                className="text-green-600"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Confirm
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateAppointmentStatus(appointment._id, 'Rejected')}
                                className="text-red-600"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          {appointment.status === 'Confirmed' && (
                            <DropdownMenuItem
                              onClick={() => updateAppointmentStatus(appointment._id, 'Completed')}
                              className="text-blue-600"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Complete
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => deleteAppointment(appointment._id)}
                            className="text-red-600"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
