import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sidebar } from '@/components/sidebar';
import { getAuthHeaders } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  DollarSign,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    durationMinutes: 30,
    price: 0,
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load services", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({ name: '', durationMinutes: 30, price: 0, description: '' });
    setShowModal(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      durationMinutes: service.durationMinutes,
      price: service.price,
      description: service.description || ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || formData.durationMinutes <= 0 || formData.price < 0) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const url = editingService ? `/api/services/${editingService._id}` : '/api/services';
      const method = editingService ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const savedService = await response.json();
        
        if (editingService) {
          setServices(prev => prev.map(s => s._id === editingService._id ? savedService : s));
          toast({ title: "Success", description: "Service updated successfully" });
        } else {
          setServices(prev => [...prev, savedService]);
          toast({ title: "Success", description: "Service created successfully" });
        }
        
        setShowModal(false);
      } else {
        throw new Error('Failed to save service');
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save service", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setServices(prev => prev.filter(s => s._id !== serviceId));
        toast({ title: "Success", description: "Service deleted successfully" });
      } else {
        throw new Error('Failed to delete service');
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete service", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-200 rounded"></div>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-intelliserve-secondary mb-2">Services</h1>
            <p className="text-gray-600">Manage your business services and pricing</p>
          </div>
          <Button 
            onClick={openCreateModal}
            className="bg-intelliserve-primary hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>

        {services.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No services yet</h3>
              <p className="text-gray-500 mb-6">Create your first service to start accepting bookings.</p>
              <Button 
                onClick={openCreateModal}
                className="bg-intelliserve-primary hover:bg-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Service
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-intelliserve-secondary">
                      {service.name}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditModal(service)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(service._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{service.durationMinutes} minutes</span>
                      </div>
                      <div className="flex items-center text-lg font-bold text-intelliserve-primary">
                        <DollarSign className="w-4 h-4" />
                        <span>{service.price}</span>
                      </div>
                    </div>
                    
                    {service.description && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {service.description}
                      </p>
                    )}
                    
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Created {new Date(service.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Service Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="serviceName">Service Name *</Label>
              <Input
                id="serviceName"
                placeholder="e.g., Haircut & Style"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the service..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="flex gap-4 mt-6">
              <Button 
                onClick={() => setShowModal(false)} 
                variant="outline" 
                className="flex-1"
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                className="flex-1 bg-intelliserve-primary hover:bg-blue-600"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : (editingService ? "Update" : "Create")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
