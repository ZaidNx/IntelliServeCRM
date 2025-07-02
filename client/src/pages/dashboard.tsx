import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sidebar } from '@/components/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { getAuthHeaders } from '@/lib/auth';
import { 
  Calendar, 
  Clock, 
  UserPlus, 
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Activity,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  Timer
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-intelliserve-secondary mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, <span className="font-semibold">{user?.name}</span></p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Appointments</p>
                  <p className="text-3xl font-bold text-intelliserve-secondary">
                    {stats?.totalAppointments || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="text-intelliserve-primary w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Today's Schedule</p>
                  <p className="text-3xl font-bold text-intelliserve-secondary">
                    {stats?.todayAppointments || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Clock className="text-intelliserve-accent w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">New Customers</p>
                  <p className="text-3xl font-bold text-intelliserve-secondary">
                    {stats?.newCustomers || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="text-green-600 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Revenue</p>
                  <p className="text-3xl font-bold text-intelliserve-secondary">
                    ${stats?.revenue?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-purple-600 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.todaySchedule && stats.todaySchedule.length > 0 ? (
              <div className="space-y-4">
                {stats.todaySchedule.map((appointment) => (
                  <div key={appointment._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-intelliserve-primary text-white rounded-full flex items-center justify-center font-semibold">
                        {appointment.customerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-intelliserve-secondary">{appointment.customerName}</p>
                        <p className="text-gray-600 text-sm">{appointment.serviceName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold">{appointment.time}</p>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(appointment.status)}
                          {appointment.status}
                        </div>
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No appointments scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
