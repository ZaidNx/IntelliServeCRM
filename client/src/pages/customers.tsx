import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/sidebar";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Calendar } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

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
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
          <h1 className="text-3xl font-bold text-intelliserve-secondary mb-2">
            Customers
          </h1>
          <p className="text-gray-600">
            Manage your customer base and contact information
          </p>
        </div>

        {customers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No customers yet
              </h3>
              <p className="text-gray-500">
                When customers book appointments, they'll appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.map((customer) => (
              <Card
                key={customer._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-intelliserve-primary text-white rounded-full flex items-center justify-center font-semibold">
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-intelliserve-secondary">
                        {customer.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        Customer since {formatDate(customer.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{customer.phone}</span>
                    </div>

                    {customer.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                    )}

                    {customer.appointmentCount !== undefined && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{customer.appointmentCount} appointments</span>
                      </div>
                    )}

                    {customer.lastAppointment && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Last visit: {formatDate(customer.lastAppointment)}
                        </p>
                      </div>
                    )}
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
