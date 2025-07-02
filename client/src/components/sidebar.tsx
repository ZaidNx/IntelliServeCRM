export function Sidebar() {
  const { logout, user } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Calendar, label: "Appointments", path: "/appointments" },
    { icon: Users, label: "Customers", path: "/customers" },
    { icon: Briefcase, label: "Services", path: "/services" },
    { icon: Settings, label: "Settings", path: "/settings" },
    {
      icon: Settings,
      label: "Public Page",
      path: `/book/${user?.publicUrlSlug}`,
    },
  ];
  console.log("chachu tum beech main na ao");
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <Brain className="text-white w-4 h-4" />
          </div>
          <span className="text-lg font-bold text-intelliserve-secondary">
            IntelliServe
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <li key={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActive
                        ? "bg-intelliserve-primary text-white"
                        : "text-gray-600 hover:text-intelliserve-primary hover:bg-gray-100"
                    }`}
                    onClick={() => setLocation(item.path)}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 shrink-0">
        <Button
          variant="outline"
          className="w-full justify-start text-sm mb-4"
          onClick={() => window.open(`/book/${user.publicUrlSlug}`, "_blank")}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Public Page
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
