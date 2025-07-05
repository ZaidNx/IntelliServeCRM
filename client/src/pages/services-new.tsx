import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Sidebar } from '@/components/sidebar-new';
import { useAuth } from '@/hooks/useAuth';
import { getAuthHeaders } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import {
  Wrench,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Clock,
  Star,
  TrendingUp,
  Zap,
  Award,
  Target,
  BarChart3,
} from 'lucide-react';

interface Service {
  _id: string;
  name: string;
  durationMinutes: number;
  price: number;
  description?: string;
  createdAt: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    durationMinutes: 60,
    price: 0,
    description: '',
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services', {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingService
        ? `/api/services/${editingService._id}`
        : '/api/services';
      const method = editingService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceForm),
      });

      if (response.ok) {
        toast({
          title: editingService ? 'Service updated' : 'Service created',
          description: `${serviceForm.name} has been ${
            editingService ? 'updated' : 'added'
          } successfully.`,
        });
        fetchServices();
        setShowModal(false);
        resetForm();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to save service. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save service. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        toast({
          title: 'Service deleted',
          description: 'The service has been removed successfully.',
        });
        fetchServices();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete service. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete service. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      durationMinutes: service.durationMinutes,
      price: service.price,
      description: service.description || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      durationMinutes: 60,
      price: 0,
      description: '',
    });
  };

  const totalServices = services.length;
  const averagePrice =
    services.length > 0
      ? Math.round(
          services.reduce((sum, service) => sum + service.price, 0) /
            services.length
        )
      : 0;
  const totalRevenue = services.reduce(
    (sum, service) => sum + service.price,
    0
  );
  const averageDuration =
    services.length > 0
      ? Math.round(
          services.reduce((sum, service) => sum + service.durationMinutes, 0) /
            services.length
        )
      : 0;

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Wrench className="w-8 h-8 text-white" />
            </div>
            <p className="text-white text-lg">Loading services...</p>
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
                Services
              </h1>
              <p className="text-purple-200 mt-2">
                Manage your service offerings
              </p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="btn-gradient"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Service
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-8 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="modern-card bg-transparent bg-gradient-to-br from-yellow-300 to-red-400 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-medium">
                      Total Services
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {totalServices}
                    </p>
                    <p className="text-xs text-purple-300 mt-1">
                      Active offerings
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card bg-transparent bg-gradient-to-br from-yellow-300 to-red-400 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-medium">
                      Average Price
                    </p>
                    <p className="text-3xl font-bold text-white">
                      ${averagePrice}
                    </p>
                    <p className="text-xs text-purple-300 mt-1">Per service</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card bg-transparent bg-gradient-to-br from-yellow-300 to-red-400 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-medium">
                      Avg Duration
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {averageDuration}m
                    </p>
                    <p className="text-xs text-purple-300 mt-1">Per service</p>
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
                      Total Value
                    </p>
                    <p className="text-3xl font-bold text-white">
                      ${totalRevenue}
                    </p>
                    <p className="text-xs text-purple-300 mt-1">
                      Service portfolio
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Services List */}
        <div className="flex-1 p-8 pt-0 overflow-y-auto">
          {services.length === 0 ? (
            <Card className="modern-card bg-transparent bg-gradient-to-br from-yellow-300 to-red-400 backdrop-blur-lg border-white/20">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No services yet
                </h3>
                <p className="text-purple-200 mb-6">
                  Create your first service to start accepting bookings
                </p>
                <Button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="btn-gradient"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Service
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card
                  key={service._id}
                  className="modern-card bg-transparent bg-gradient-to-br from-yellow-300 to-red-400 backdrop-blur-lg border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-white">
                            {service.name}
                          </CardTitle>
                          <p className="text-purple-200 text-sm">
                            Created{' '}
                            {new Date(service.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(service)}
                          className="text-cyan-400 hover:text-white hover:bg-cyan-500/20 rounded-xl"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(service._id)}
                          className="text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {service.description && (
                      <div className="bg-white/5 rounded-xl p-3 mb-4">
                        <p className="text-purple-200 text-sm">
                          {service.description}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-xl p-4 text-center border border-white/10">
                        <div className="flex items-center justify-center space-x-1 mb-2">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs text-emerald-200 font-medium">
                            Price
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          ${service.price}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-xl p-4 text-center border border-white/10">
                        <div className="flex items-center justify-center space-x-1 mb-2">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span className="text-xs text-amber-200 font-medium">
                            Duration
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          {service.durationMinutes}m
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-purple-200 bg-white/5 rounded-xl p-3">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-purple-400" />
                        <span>Hourly Rate</span>
                      </div>
                      <span className="font-medium text-white">
                        $
                        {Math.round(
                          (service.price / service.durationMinutes) * 60
                        )}
                        /hr
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Service Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-slate-900 border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-white">
                Service Name
              </Label>
              <Input
                id="name"
                value={serviceForm.name}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, name: e.target.value })
                }
                className="bg-white/10 border-white/30 text-white placeholder-purple-300 focus:border-cyan-400"
                placeholder="e.g. Haircut & Style"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-white">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={serviceForm.price}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      price: Number(e.target.value),
                    })
                  }
                  className="bg-white/10 border-white/30 text-white placeholder-purple-300 focus:border-cyan-400"
                  placeholder="50"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <Label htmlFor="duration" className="text-white">
                  Duration (minutes)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={serviceForm.durationMinutes}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      durationMinutes: Number(e.target.value),
                    })
                  }
                  className="bg-white/10 border-white/30 text-white placeholder-purple-300 focus:border-cyan-400"
                  placeholder="60"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-white">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={serviceForm.description}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    description: e.target.value,
                  })
                }
                className="bg-white/10 border-white/30 text-white placeholder-purple-300 focus:border-cyan-400 resize-none"
                placeholder="Brief description of the service..."
                rows={3}
              />
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                onClick={() => setShowModal(false)}
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 btn-gradient">
                {editingService ? 'Update Service' : 'Create Service'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
