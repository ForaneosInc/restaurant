// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import * as echarts from 'echarts';
import { useEffect } from 'react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [cart, setCart] = useState<{id: number, name: string, price: number, quantity: number}[]>([]);
  const [amountReceived, setAmountReceived] = useState("");
  const [activeAdminTab, setActiveAdminTab] = useState("dashboard");

  const handleLogin = () => {
    // Simulación de login
    if (username === "admin" && password === "admin") {
      setUserRole("admin");
      setActiveTab("admin");
    } else if (username === "cajero" && password === "cajero") {
      setUserRole("cajero");
      setActiveTab("cajero");
    } else if (username === "mesero" && password === "mesero") {
      setUserRole("mesero");
      setActiveTab("mesero");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setActiveTab("login");
    setUsername("");
    setPassword("");
    setSelectedTable(null);
    setCart([]);
  };

  const addToCart = (product: {id: number, name: string, price: number}) => {
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? {...item, quantity: item.quantity + 1} 
          : item
      ));
    } else {
      setCart([...cart, {...product, quantity: 1}]);
    }
  };

  const removeFromCart = (productId: number) => {
    const existingProduct = cart.find(item => item.id === productId);
    
    if (existingProduct && existingProduct.quantity > 1) {
      setCart(cart.map(item => 
        item.id === productId 
          ? {...item, quantity: item.quantity - 1} 
          : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== productId));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateChange = () => {
    const total = calculateTotal();
    const received = parseFloat(amountReceived);
    
    if (!isNaN(received) && received >= total) {
      return received - total;
    }
    return 0;
  };

  useEffect(() => {
    if (activeTab === "admin" && activeAdminTab === "dashboard") {
      const salesChart = echarts.init(document.getElementById('sales-chart'));
      const salesOption = {
        animation: false,
        title: {
          text: 'Ventas Mensuales 2025',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [12000, 13500, 14800, 15200, 16500, 18000, 19500, 20100, 21000, 22500, 23800, 25000],
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#4f46e5'
            },
            itemStyle: {
              color: '#4f46e5'
            }
          }
        ],
        color: ['#4f46e5']
      };
      salesChart.setOption(salesOption);

      const productsChart = echarts.init(document.getElementById('products-chart'));
      const productsOption = {
        animation: false,
        title: {
          text: 'Productos Más Vendidos',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Ventas',
            type: 'pie',
            radius: '60%',
            data: [
              { value: 1048, name: 'Paella' },
              { value: 735, name: 'Tortilla' },
              { value: 580, name: 'Gazpacho' },
              { value: 484, name: 'Patatas Bravas' },
              { value: 300, name: 'Sangría' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      productsChart.setOption(productsOption);

      return () => {
        salesChart.dispose();
        productsChart.dispose();
      };
    }
  }, [activeTab, activeAdminTab]);

  // Datos de ejemplo
  const categories = [
    { id: 1, name: "Entrantes" },
    { id: 2, name: "Platos Principales" },
    { id: 3, name: "Postres" },
    { id: 4, name: "Bebidas" }
  ];

  const products = [
    { id: 1, name: "Patatas Bravas", price: 5.50, category: 1, image: "https://readdy.ai/api/search-image?query=Spanish%20patatas%20bravas%20dish%20on%20a%20white%20plate%2C%20crispy%20potatoes%20with%20spicy%20tomato%20sauce%2C%20restaurant%20quality%20presentation%2C%20minimalist%20white%20background%2C%20professional%20food%20photography%2C%20appetizer%2C%20tapas&width=300&height=200&seq=1&orientation=landscape" },
    { id: 2, name: "Croquetas", price: 6.00, category: 1, image: "https://readdy.ai/api/search-image?query=Spanish%20ham%20croquettes%20on%20a%20white%20ceramic%20plate%2C%20golden%20brown%20exterior%2C%20creamy%20interior%2C%20minimalist%20white%20background%2C%20professional%20food%20photography%2C%20appetizer%2C%20tapas%2C%20restaurant%20quality&width=300&height=200&seq=2&orientation=landscape" },
    { id: 3, name: "Paella", price: 18.50, category: 2, image: "https://readdy.ai/api/search-image?query=Traditional%20Spanish%20seafood%20paella%20in%20a%20traditional%20pan%2C%20saffron%20rice%20with%20prawns%2C%20mussels%20and%20vegetables%2C%20steam%20rising%2C%20minimalist%20white%20background%2C%20professional%20food%20photography%2C%20main%20dish&width=300&height=200&seq=3&orientation=landscape" },
    { id: 4, name: "Tortilla Española", price: 7.50, category: 2, image: "https://readdy.ai/api/search-image?query=Spanish%20potato%20omelette%20slice%20on%20a%20white%20plate%2C%20showing%20the%20creamy%20interior%20with%20potatoes%2C%20minimalist%20white%20background%2C%20professional%20food%20photography%2C%20traditional%20dish&width=300&height=200&seq=4&orientation=landscape" },
    { id: 5, name: "Flan", price: 4.50, category: 3, image: "https://readdy.ai/api/search-image?query=Spanish%20caramel%20flan%20dessert%20on%20a%20white%20plate%2C%20smooth%20custard%20with%20golden%20caramel%20sauce%2C%20minimalist%20white%20background%2C%20professional%20food%20photography%2C%20traditional%20dessert&width=300&height=200&seq=5&orientation=landscape" },
    { id: 6, name: "Sangría", price: 5.00, category: 4, image: "https://readdy.ai/api/search-image?query=Spanish%20sangria%20in%20a%20clear%20glass%20with%20fruit%20pieces%2C%20red%20wine%20cocktail%20with%20orange%20slices%20and%20apple%2C%20minimalist%20white%20background%2C%20professional%20beverage%20photography%2C%20refreshing%20drink&width=300&height=200&seq=6&orientation=landscape" }
  ];

  const users = [
    { id: 1, name: "Carlos Rodríguez", role: "Admin", avatar: "CR" },
    { id: 2, name: "María López", role: "Cajero", avatar: "ML" },
    { id: 3, name: "Juan García", role: "Mesero", avatar: "JG" }
  ];

  const tables = [
    { id: 1, name: "Mesa 1", status: "libre", location: "Terraza" },
    { id: 2, name: "Mesa 2", status: "ocupada", location: "Terraza" },
    { id: 3, name: "Mesa 3", status: "libre", location: "Interior" },
    { id: 4, name: "Mesa 4", status: "reservada", location: "Interior" },
    { id: 5, name: "Mesa 5", status: "libre", location: "Interior" },
    { id: 6, name: "Mesa 6", status: "ocupada", location: "Interior" }
  ];

  const filteredProducts = selectedCategory === "todos" 
    ? products 
    : products.filter(product => product.category === parseInt(selectedCategory));

  return (
    <div className="min-h-screen bg-gray-50">
      {activeTab === "login" && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <img 
                src="https://readdy.ai/api/search-image?query=Modern%20restaurant%20logo%20with%20a%20stylized%20fork%20and%20knife%2C%20elegant%20typography%2C%20minimalist%20design%2C%20blue%20and%20gold%20color%20scheme%2C%20professional%20branding%2C%20isolated%20on%20white%20background%2C%20vector%20style&width=200&height=200&seq=7&orientation=squarish" 
                alt="Logo Restaurante" 
                className="mx-auto h-24 w-auto mb-4"
              />
              <h1 className="text-3xl font-bold text-gray-900">Restaurante ---- </h1>
              <p className="text-gray-600 mt-2">Sistema de Gestión de Restaurante</p>
            </div>
            
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-center text-xl">Iniciar Sesión</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Usuario
                    </label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Ingrese su usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Contraseña
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Ingrese su contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <Button 
                    onClick={handleLogin} 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white !rounded-button whitespace-nowrap cursor-pointer"
                  >
                    Ingresar
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>Usuarios de prueba:</p>
                  <p>admin / admin</p>
                  <p>cajero / cajero</p>
                  <p>mesero / mesero</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "admin" && (
        <div className="min-h-screen flex">
          {/* Sidebar */}
          <div className="w-64 bg-indigo-800 text-white">
            <div className="p-4">
              <h2 className="text-xl font-bold">El Sabor</h2>
              <p className="text-indigo-200 text-sm">Panel de Administración</p>
            </div>
            
            <nav className="mt-6">
              <div 
                className={`flex items-center px-4 py-3 cursor-pointer ${activeAdminTab === "dashboard" ? "bg-indigo-900" : "hover:bg-indigo-700"}`}
                onClick={() => setActiveAdminTab("dashboard")}
              >
                <i className="fas fa-chart-line mr-3"></i>
                <span>Dashboard</span>
              </div>
              <div 
                className={`flex items-center px-4 py-3 cursor-pointer ${activeAdminTab === "users" ? "bg-indigo-900" : "hover:bg-indigo-700"}`}
                onClick={() => setActiveAdminTab("users")}
              >
                <i className="fas fa-users mr-3"></i>
                <span>Usuarios</span>
              </div>
              <div 
                className={`flex items-center px-4 py-3 cursor-pointer ${activeAdminTab === "inventory" ? "bg-indigo-900" : "hover:bg-indigo-700"}`}
                onClick={() => setActiveAdminTab("inventory")}
              >
                <i className="fas fa-utensils mr-3"></i>
                <span>Inventario</span>
              </div>
              <div 
                className={`flex items-center px-4 py-3 cursor-pointer ${activeAdminTab === "tables" ? "bg-indigo-900" : "hover:bg-indigo-700"}`}
                onClick={() => setActiveAdminTab("tables")}
              >
                <i className="fas fa-chair mr-3"></i>
                <span>Mesas</span>
              </div>
              <div 
                className={`flex items-center px-4 py-3 cursor-pointer ${activeAdminTab === "sales" ? "bg-indigo-900" : "hover:bg-indigo-700"}`}
                onClick={() => setActiveAdminTab("sales")}
              >
                <i className="fas fa-cash-register mr-3"></i>
                <span>Ventas</span>
              </div>
              <div 
                className={`flex items-center px-4 py-3 cursor-pointer ${activeAdminTab === "printing" ? "bg-indigo-900" : "hover:bg-indigo-700"}`}
                onClick={() => setActiveAdminTab("printing")}
              >
                <i className="fas fa-print mr-3"></i>
                <span>Impresión</span>
              </div>
            </nav>
            
            <div className="absolute bottom-0 w-64 p-4">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Administrador</p>
                  <p className="text-xs text-indigo-300">admin@elsabor.com</p>
                </div>
              </div>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="mt-4 w-full text-white border-indigo-600 hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer"
              >
                <i className="fas fa-sign-out-alt mr-2"></i> Cerrar Sesión
              </Button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-800">
                {activeAdminTab === "dashboard" && "Dashboard"}
                {activeAdminTab === "users" && "Gestión de Usuarios"}
                {activeAdminTab === "inventory" && "Gestión de Inventario"}
                {activeAdminTab === "tables" && "Gestión de Mesas"}
                {activeAdminTab === "sales" && "Historial de Ventas"}
                {activeAdminTab === "printing" && "Configuración de Impresión"}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{new Date().toLocaleDateString('es-ES')}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="!rounded-button whitespace-nowrap cursor-pointer">
                      <i className="fas fa-bell text-gray-600"></i>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <span>Notificación 1</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Notificación 2</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            
            <main className="p-6">
              {activeAdminTab === "dashboard" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-white shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Ventas Hoy</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">€1,250.00</h3>
                          </div>
                          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-chart-line text-green-600 text-xl"></i>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-green-600">
                          <i className="fas fa-arrow-up mr-1"></i>
                          <span>8.2% más que ayer</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Pedidos Hoy</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">42</h3>
                          </div>
                          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-receipt text-blue-600 text-xl"></i>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-blue-600">
                          <i className="fas fa-arrow-up mr-1"></i>
                          <span>12% más que ayer</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Clientes</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">156</h3>
                          </div>
                          <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-users text-purple-600 text-xl"></i>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-purple-600">
                          <i className="fas fa-arrow-up mr-1"></i>
                          <span>5.3% más que ayer</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Ticket Promedio</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">€29.76</h3>
                          </div>
                          <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-euro-sign text-yellow-600 text-xl"></i>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-yellow-600">
                          <i className="fas fa-arrow-up mr-1"></i>
                          <span>2.4% más que ayer</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle>Ventas Mensuales</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div id="sales-chart" style={{ height: '300px' }}></div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle>Productos Más Vendidos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div id="products-chart" style={{ height: '300px' }}></div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Últimas Ventas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3">ID</th>
                              <th scope="col" className="px-6 py-3">Mesa</th>
                              <th scope="col" className="px-6 py-3">Cajero</th>
                              <th scope="col" className="px-6 py-3">Fecha</th>
                              <th scope="col" className="px-6 py-3">Total</th>
                              <th scope="col" className="px-6 py-3">Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-white border-b">
                              <td className="px-6 py-4">#1001</td>
                              <td className="px-6 py-4">Mesa 3</td>
                              <td className="px-6 py-4">María López</td>
                              <td className="px-6 py-4">29/04/2025 12:30</td>
                              <td className="px-6 py-4">€45.50</td>
                              <td className="px-6 py-4">
                                <Badge className="bg-green-100 text-green-800">Completado</Badge>
                              </td>
                            </tr>
                            <tr className="bg-white border-b">
                              <td className="px-6 py-4">#1000</td>
                              <td className="px-6 py-4">Mesa 1</td>
                              <td className="px-6 py-4">Juan García</td>
                              <td className="px-6 py-4">29/04/2025 12:15</td>
                              <td className="px-6 py-4">€32.00</td>
                              <td className="px-6 py-4">
                                <Badge className="bg-green-100 text-green-800">Completado</Badge>
                              </td>
                            </tr>
                            <tr className="bg-white border-b">
                              <td className="px-6 py-4">#999</td>
                              <td className="px-6 py-4">Mesa 5</td>
                              <td className="px-6 py-4">María López</td>
                              <td className="px-6 py-4">29/04/2025 11:45</td>
                              <td className="px-6 py-4">€28.75</td>
                              <td className="px-6 py-4">
                                <Badge className="bg-green-100 text-green-800">Completado</Badge>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeAdminTab === "users" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Lista de Usuarios</h2>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer">
                      <i className="fas fa-plus mr-2"></i> Nuevo Usuario
                    </Button>
                  </div>
                  
                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3">ID</th>
                              <th scope="col" className="px-6 py-3">Usuario</th>
                              <th scope="col" className="px-6 py-3">Rol</th>
                              <th scope="col" className="px-6 py-3">Email</th>
                              <th scope="col" className="px-6 py-3">Estado</th>
                              <th scope="col" className="px-6 py-3">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.map(user => (
                              <tr key={user.id} className="bg-white border-b">
                                <td className="px-6 py-4">#{user.id}</td>
                                <td className="px-6 py-4 flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarFallback>{user.avatar}</AvatarFallback>
                                  </Avatar>
                                  {user.name}
                                </td>
                                <td className="px-6 py-4">
                                  <Badge className={
                                    user.role === "Admin" 
                                      ? "bg-purple-100 text-purple-800" 
                                      : user.role === "Cajero" 
                                        ? "bg-blue-100 text-blue-800" 
                                        : "bg-green-100 text-green-800"
                                  }>
                                    {user.role}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4">{user.name.toLowerCase().replace(' ', '.')}@elsabor.com</td>
                                <td className="px-6 py-4">
                                  <Badge className="bg-green-100 text-green-800">Activo</Badge>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                      <i className="fas fa-edit text-blue-600"></i>
                                    </Button>
                                    <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                      <i className="fas fa-trash text-red-600"></i>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeAdminTab === "inventory" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">Inventario de Productos</h2>
                      <p className="text-sm text-gray-500">Gestiona tus productos y categorías</p>
                    </div>
                    <div className="flex space-x-3">
                      <Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
                        <i className="fas fa-tags mr-2"></i> Gestionar Categorías
                      </Button>
                      <Button className="bg-indigo-600 hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer">
                        <i className="fas fa-plus mr-2"></i> Nuevo Producto
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 overflow-x-auto py-2">
                    <Button 
                      variant={selectedCategory === "todos" ? "default" : "outline"} 
                      onClick={() => setSelectedCategory("todos")}
                      className="!rounded-button whitespace-nowrap cursor-pointer"
                    >
                      Todos
                    </Button>
                    {categories.map(category => (
                      <Button 
                        key={category.id}
                        variant={selectedCategory === category.id.toString() ? "default" : "outline"} 
                        onClick={() => setSelectedCategory(category.id.toString())}
                        className="!rounded-button whitespace-nowrap cursor-pointer"
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                      <Card key={product.id} className="overflow-hidden bg-white shadow-sm">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{product.name}</h3>
                              <p className="text-gray-500 text-sm">
                                {categories.find(c => c.id === product.category)?.name}
                              </p>
                            </div>
                            <p className="text-lg font-bold">€{product.price.toFixed(2)}</p>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <Badge className="bg-green-100 text-green-800">Disponible</Badge>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                <i className="fas fa-edit text-blue-600"></i>
                              </Button>
                              <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                <i className="fas fa-trash text-red-600"></i>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {activeAdminTab === "tables" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">Gestión de Mesas</h2>
                      <p className="text-sm text-gray-500">Administra la distribución de mesas del restaurante</p>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer">
                      <i className="fas fa-plus mr-2"></i> Nueva Mesa
                    </Button>
                  </div>
                  
                  <Tabs defaultValue="all">
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">Todas</TabsTrigger>
                      <TabsTrigger value="terraza">Terraza</TabsTrigger>
                      <TabsTrigger value="interior">Interior</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {tables.map(table => (
                          <Card 
                            key={table.id} 
                            className={`
                              overflow-hidden bg-white shadow-sm border-l-4
                              ${table.status === 'libre' ? 'border-green-500' : 
                                table.status === 'ocupada' ? 'border-red-500' : 'border-yellow-500'}
                            `}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-lg">{table.name}</h3>
                                  <p className="text-gray-500 text-sm">{table.location}</p>
                                </div>
                                <Badge className={`
                                  ${table.status === 'libre' ? 'bg-green-100 text-green-800' : 
                                    table.status === 'ocupada' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                                `}>
                                  {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center mt-4">
                                <div className="text-sm text-gray-500">
                                  {table.status === 'ocupada' && (
                                    <span>Desde: 12:30</span>
                                  )}
                                </div>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                    <i className="fas fa-edit text-blue-600"></i>
                                  </Button>
                                  <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                    <i className="fas fa-trash text-red-600"></i>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="terraza">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {tables.filter(table => table.location === "Terraza").map(table => (
                          <Card 
                            key={table.id} 
                            className={`
                              overflow-hidden bg-white shadow-sm border-l-4
                              ${table.status === 'libre' ? 'border-green-500' : 
                                table.status === 'ocupada' ? 'border-red-500' : 'border-yellow-500'}
                            `}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-lg">{table.name}</h3>
                                  <p className="text-gray-500 text-sm">{table.location}</p>
                                </div>
                                <Badge className={`
                                  ${table.status === 'libre' ? 'bg-green-100 text-green-800' : 
                                    table.status === 'ocupada' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                                `}>
                                  {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center mt-4">
                                <div className="text-sm text-gray-500">
                                  {table.status === 'ocupada' && (
                                    <span>Desde: 12:30</span>
                                  )}
                                </div>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                    <i className="fas fa-edit text-blue-600"></i>
                                  </Button>
                                  <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                    <i className="fas fa-trash text-red-600"></i>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="interior">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {tables.filter(table => table.location === "Interior").map(table => (
                          <Card 
                            key={table.id} 
                            className={`
                              overflow-hidden bg-white shadow-sm border-l-4
                              ${table.status === 'libre' ? 'border-green-500' : 
                                table.status === 'ocupada' ? 'border-red-500' : 'border-yellow-500'}
                            `}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-lg">{table.name}</h3>
                                  <p className="text-gray-500 text-sm">{table.location}</p>
                                </div>
                                <Badge className={`
                                  ${table.status === 'libre' ? 'bg-green-100 text-green-800' : 
                                    table.status === 'ocupada' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                                `}>
                                  {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center mt-4">
                                <div className="text-sm text-gray-500">
                                  {table.status === 'ocupada' && (
                                    <span>Desde: 12:30</span>
                                  )}
                                </div>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                    <i className="fas fa-edit text-blue-600"></i>
                                  </Button>
                                  <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                    <i className="fas fa-trash text-red-600"></i>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <Card className="bg-white shadow-sm mt-6">
                    <CardHeader>
                      <CardTitle>Mapa del Restaurante</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-100 p-6 rounded-lg">
                        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                          <div className="flex flex-wrap gap-4">
                            {tables.map(table => (
                              <div 
                                key={table.id}
                                className={`
                                  w-24 h-24 rounded-lg flex items-center justify-center cursor-pointer
                                  ${table.status === 'libre' ? 'bg-green-100 border border-green-500' : 
                                    table.status === 'ocupada' ? 'bg-red-100 border border-red-500' : 'bg-yellow-100 border border-yellow-500'}
                                `}
                              >
                                <div className="text-center">
                                  <i className="fas fa-utensils mb-1"></i>
                                  <p className="font-semibold">{table.name}</p>
                                  <p className="text-xs">{table.location}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeAdminTab === "sales" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">Historial de Ventas</h2>
                      <p className="text-sm text-gray-500">Consulta todas las ventas realizadas</p>
                    </div>
                    <div className="flex space-x-3">
                      <Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
                        <i className="fas fa-filter mr-2"></i> Filtrar
                      </Button>
                      <Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
                        <i className="fas fa-download mr-2"></i> Exportar
                      </Button>
                    </div>
                  </div>
                  
                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3">ID</th>
                              <th scope="col" className="px-6 py-3">Mesa</th>
                              <th scope="col" className="px-6 py-3">Cajero</th>
                              <th scope="col" className="px-6 py-3">Fecha</th>
                              <th scope="col" className="px-6 py-3">Productos</th>
                              <th scope="col" className="px-6 py-3">Total</th>
                              <th scope="col" className="px-6 py-3">Estado</th>
                              <th scope="col" className="px-6 py-3">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-white border-b">
                              <td className="px-6 py-4">#1001</td>
                              <td className="px-6 py-4">Mesa 3</td>
                              <td className="px-6 py-4">María López</td>
                              <td className="px-6 py-4">29/04/2025 12:30</td>
                              <td className="px-6 py-4">4 items</td>
                              <td className="px-6 py-4">€45.50</td>
                              <td className="px-6 py-4">
                                <Badge className="bg-green-100 text-green-800">Completado</Badge>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                    <i className="fas fa-eye text-blue-600"></i>
                                  </Button>
                                  <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                    <i className="fas fa-print text-gray-600"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                            <tr className="bg-white border-b">
                              <td className="px-6 py-4">#1000</td>
                              <td className="px-6 py-4">Mesa 1</td>
                              <td className="px-6 py-4">Juan García</td>
                              <td className="px-6 py-4">29/04/2025 12:15</td>
                              <td className="px-6 py-4">3 items</td>
                              <td className="px-6 py-4">€32.00</td>
                              <td className="px-6 py-4">
                                <Badge className="bg-green-100 text-green-800">Completado</Badge>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                    <i className="fas fa-eye text-blue-600"></i>
                                  </Button>
                                  <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                    <i className="fas fa-print text-gray-600"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                            <tr className="bg-white border-b">
                              <td className="px-6 py-4">#999</td>
                              <td className="px-6 py-4">Mesa 5</td>
                              <td className="px-6 py-4">María López</td>
                              <td className="px-6 py-4">29/04/2025 11:45</td>
                              <td className="px-6 py-4">2 items</td>
                              <td className="px-6 py-4">€28.75</td>
                              <td className="px-6 py-4">
                                <Badge className="bg-green-100 text-green-800">Completado</Badge>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                    <i className="fas fa-eye text-blue-600"></i>
                                  </Button>
                                  <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                    <i className="fas fa-print text-gray-600"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeAdminTab === "printing" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">Configuración de Impresión</h2>
                      <p className="text-sm text-gray-500">Configura las opciones de impresión para tickets, facturas y cocina</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle>Tickets</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Impresora</label>
                            <div className="flex items-center mt-1 border rounded-md p-2">
                              <i className="fas fa-print mr-2 text-gray-500"></i>
                              <span>Impresora Térmica Principal</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Tamaño de Papel</label>
                            <div className="flex items-center mt-1 border rounded-md p-2">
                              <i className="fas fa-file mr-2 text-gray-500"></i>
                              <span>80mm x 297mm</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Copias</label>
                            <div className="flex items-center mt-1 border rounded-md p-2">
                              <i className="fas fa-copy mr-2 text-gray-500"></i>
                              <span>1</span>
                            </div>
                          </div>
                          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer">
                            Configurar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle>Facturas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Impresora</label>
                            <div className="flex items-center mt-1 border rounded-md p-2">
                              <i className="fas fa-print mr-2 text-gray-500"></i>
                              <span>Impresora Láser Oficina</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Tamaño de Papel</label>
                            <div className="flex items-center mt-1 border rounded-md p-2">
                              <i className="fas fa-file mr-2 text-gray-500"></i>
                              <span>A4 (210mm x 297mm)</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Copias</label>
                            <div className="flex items-center mt-1 border rounded-md p-2">
                              <i className="fas fa-copy mr-2 text-gray-500"></i>
                              <span>2</span>
                            </div>
                          </div>
                          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer">
                            Configurar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle>Cocina</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Impresora</label>
                            <div className="flex items-center mt-1 border rounded-md p-2">
                              <i className="fas fa-print mr-2 text-gray-500"></i>
                              <span>Impresora Térmica Cocina</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Tamaño de Papel</label>
                            <div className="flex items-center mt-1 border rounded-md p-2">
                              <i className="fas fa-file mr-2 text-gray-500"></i>
                              <span>80mm x 297mm</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Copias</label>
                            <div className="flex items-center mt-1 border rounded-md p-2">
                              <i className="fas fa-copy mr-2 text-gray-500"></i>
                              <span>1</span>
                            </div>
                          </div>
                          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer">
                            Configurar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Personalización de Documentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-2">Encabezado</h3>
                          <div className="border rounded-md p-4 bg-gray-50">
                            <div className="text-center">
                              <p className="font-bold">Restaurante El Sabor</p>
                              <p>Calle Principal 123, Madrid</p>
                              <p>Tel: +34 91 123 45 67</p>
                              <p>CIF: B12345678</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Pie de Página</h3>
                          <div className="border rounded-md p-4 bg-gray-50">
                            <div className="text-center">
                              <p>¡Gracias por su visita!</p>
                              <p>www.elsabor.com</p>
                              <p>IVA Incluido</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer">
                          Guardar Cambios
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {activeTab === "cajero" && (
        <div className="min-h-screen flex flex-col">
          <header className="bg-indigo-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">El Sabor</h1>
                <span className="ml-4 text-indigo-200">|</span>
                <span className="ml-4">Panel de Cajero</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>{new Date().toLocaleDateString('es-ES')}</span>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>ML</AvatarFallback>
                  </Avatar>
                  <span>María López</span>
                </div>
                <Button 
                  onClick={handleLogout} 
                  variant="ghost" 
                  className="text-white hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i> Salir
                </Button>
              </div>
            </div>
          </header>
          
          <div className="flex-1 flex">
            <div className="w-1/3 border-r">
              <div className="p-4 bg-gray-100 border-b">
                <h2 className="text-lg font-semibold">Ventas</h2>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seleccionar Mesa
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {tables.map(table => (
                      <Button 
                        key={table.id}
                        variant={selectedTable === table.id ? "default" : "outline"}
                        className={`
                          w-full !rounded-button whitespace-nowrap cursor-pointer
                          ${table.status === 'ocupada' ? 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200' : ''}
                        `}
                        onClick={() => setSelectedTable(table.id)}
                        disabled={table.status === 'ocupada'}
                      >
                        {table.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Categorías</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant={selectedCategory === "todos" ? "default" : "outline"}
                      onClick={() => setSelectedCategory("todos")}
                      className="w-full !rounded-button whitespace-nowrap cursor-pointer"
                    >
                      Todos
                    </Button>
                    {categories.map(category => (
                      <Button 
                        key={category.id}
                        variant={selectedCategory === category.id.toString() ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category.id.toString())}
                        className="w-full !rounded-button whitespace-nowrap cursor-pointer"
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {filteredProducts.map(product => (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="flex">
                          <div className="w-1/3">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="h-full w-full object-cover object-top"
                            />
                          </div>
                          <div className="w-2/3 p-3 flex flex-col justify-between">
                            <div>
                              <h3 className="font-semibold">{product.name}</h3>
                              <p className="text-sm text-gray-500">
                                {categories.find(c => c.id === product.category)?.name}
                              </p>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <p className="font-bold">€{product.price.toFixed(2)}</p>
                              <Button 
                                onClick={() => addToCart(product)}
                                size="sm"
                                className="bg-indigo-600 hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer"
                              >
                                <i className="fas fa-plus mr-1"></i> Añadir
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
            
            <div className="w-2/3 flex flex-col">
              <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedTable ? `Mesa ${selectedTable}` : "Seleccione una mesa"}
                  </h2>
                  <p className="text-sm text-gray-500">Ticket #1001</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
                    <i className="fas fa-save mr-2"></i> Guardar
                  </Button>
                  <Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
                    <i className="fas fa-print mr-2"></i> Imprimir
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 p-4">
                <Card className="h-full flex flex-col">
                  <CardContent className="p-4 flex-1">
                    <ScrollArea className="h-[300px]">
                      <table className="w-full">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left">Producto</th>
                            <th scope="col" className="px-4 py-3 text-center">Cant.</th>
                            <th scope="col" className="px-4 py-3 text-right">Precio</th>
                            <th scope="col" className="px-4 py-3 text-right">Total</th>
                            <th scope="col" className="px-4 py-3 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                No hay productos en el carrito
                              </td>
                            </tr>
                          ) : (
                            cart.map(item => (
                              <tr key={item.id} className="border-b">
                                <td className="px-4 py-3">{item.name}</td>
                                <td className="px-4 py-3 text-center">{item.quantity}</td>
                                <td className="px-4 py-3 text-right">€{item.price.toFixed(2)}</td>
                                <td className="px-4 py-3 text-right">€{(item.price * item.quantity).toFixed(2)}</td>
                                <td className="px-4 py-3 text-center">
                                  <div className="flex justify-center space-x-1">
                                    <Button 
                                      onClick={() => addToCart({id: item.id, name: item.name, price: item.price})}
                                      size="sm" 
                                      variant="outline"
                                      className="h-8 w-8 p-0 !rounded-button whitespace-nowrap cursor-pointer"
                                    >
                                      <i className="fas fa-plus"></i>
                                    </Button>
                                    <Button 
                                      onClick={() => removeFromCart(item.id)}
                                      size="sm" 
                                      variant="outline"
                                      className="h-8 w-8 p-0 !rounded-button whitespace-nowrap cursor-pointer"
                                    >
                                      <i className="fas fa-minus"></i>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </ScrollArea>
                  </CardContent>
                  
                  <div className="border-t p-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span>€{calculateTotal().toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">IVA (21%):</span>
                            <span>€{(calculateTotal() * 0.21).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>€{(calculateTotal() * 1.21).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Monto Recibido
                          </label>
                          <Input
                            type="number"
                            value={amountReceived}
                            onChange={(e) => setAmountReceived(e.target.value)}
                            className="w-full"
                            placeholder="0.00"
                          />
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Cambio:</span>
                          <span>€{calculateChange().toFixed(2)}</span>
                        </div>
                        <Button 
                          disabled={cart.length === 0 || !selectedTable || calculateChange() <= 0}
                          className="w-full bg-green-600 hover:bg-green-700 !rounded-button whitespace-nowrap cursor-pointer"
                        >
                          <i className="fas fa-check-circle mr-2"></i> Completar Venta
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "mesero" && (
        <div className="min-h-screen flex flex-col">
          <header className="bg-indigo-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">El Sabor</h1>
                <span className="ml-4 text-indigo-200">|</span>
                <span className="ml-4">Panel de Mesero</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>{new Date().toLocaleDateString('es-ES')}</span>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>JG</AvatarFallback>
                  </Avatar>
                  <span>Juan García</span>
                </div>
                <Button 
                  onClick={handleLogout} 
                  variant="ghost" 
                  className="text-white hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i> Salir
                </Button>
              </div>
            </div>
          </header>
          
          {!selectedTable ? (
            <div className="flex-1 p-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Seleccionar Mesa</h2>
                
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="terraza">Terraza</TabsTrigger>
                    <TabsTrigger value="interior">Interior</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {tables.map(table => (
                        <Card 
                          key={table.id} 
                          className={`
                            overflow-hidden bg-white shadow-sm border-l-4 cursor-pointer
                            ${table.status === 'libre' ? 'border-green-500' : 
                              table.status === 'ocupada' ? 'border-red-500' : 'border-yellow-500'}
                          `}
                          onClick={() => table.status !== 'ocupada' && setSelectedTable(table.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg">{table.name}</h3>
                                <p className="text-gray-500 text-sm">{table.location}</p>
                              </div>
                              <Badge className={`
                                ${table.status === 'libre' ? 'bg-green-100 text-green-800' : 
                                  table.status === 'ocupada' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                              `}>
                                {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="mt-4 text-center">
                              {table.status === 'libre' && (
                                <Button 
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer"
                                  onClick={() => setSelectedTable(table.id)}
                                >
                                  Seleccionar
                                </Button>
                              )}
                              {table.status === 'reservada' && (
                                <Button 
                                  className="w-full bg-yellow-600 hover:bg-yellow-700 !rounded-button whitespace-nowrap cursor-pointer"
                                  onClick={() => setSelectedTable(table.id)}
                                >
                                  Atender Reserva
                                </Button>
                              )}
                              {table.status === 'ocupada' && (
                                <p className="text-sm text-gray-500">No disponible</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="terraza">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {tables.filter(table => table.location === "Terraza").map(table => (
                        <Card 
                          key={table.id} 
                          className={`
                            overflow-hidden bg-white shadow-sm border-l-4 cursor-pointer
                            ${table.status === 'libre' ? 'border-green-500' : 
                              table.status === 'ocupada' ? 'border-red-500' : 'border-yellow-500'}
                          `}
                          onClick={() => table.status !== 'ocupada' && setSelectedTable(table.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg">{table.name}</h3>
                                <p className="text-gray-500 text-sm">{table.location}</p>
                              </div>
                              <Badge className={`
                                ${table.status === 'libre' ? 'bg-green-100 text-green-800' : 
                                  table.status === 'ocupada' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                              `}>
                                {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="mt-4 text-center">
                              {table.status === 'libre' && (
                                <Button 
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer"
                                  onClick={() => setSelectedTable(table.id)}
                                >
                                  Seleccionar
                                </Button>
                              )}
                              {table.status === 'reservada' && (
                                <Button 
                                  className="w-full bg-yellow-600 hover:bg-yellow-700 !rounded-button whitespace-nowrap cursor-pointer"
                                  onClick={() => setSelectedTable(table.id)}
                                >
                                  Atender Reserva
                                </Button>
                              )}
                              {table.status === 'ocupada' && (
                                <p className="text-sm text-gray-500">No disponible</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="interior">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {tables.filter(table => table.location === "Interior").map(table => (
                        <Card 
                          key={table.id} 
                          className={`
                            overflow-hidden bg-white shadow-sm border-l-4 cursor-pointer
                            ${table.status === 'libre' ? 'border-green-500' : 
                              table.status === 'ocupada' ? 'border-red-500' : 'border-yellow-500'}
                          `}
                          onClick={() => table.status !== 'ocupada' && setSelectedTable(table.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg">{table.name}</h3>
                                <p className="text-gray-500 text-sm">{table.location}</p>
                              </div>
                              <Badge className={`
                                ${table.status === 'libre' ? 'bg-green-100 text-green-800' : 
                                  table.status === 'ocupada' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                              `}>
                                {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="mt-4 text-center">
                              {table.status === 'libre' && (
                                <Button 
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer"
                                  onClick={() => setSelectedTable(table.id)}
                                >
                                  Seleccionar
                                </Button>
                              )}
                              {table.status === 'reservada' && (
                                <Button 
                                  className="w-full bg-yellow-600 hover:bg-yellow-700 !rounded-button whitespace-nowrap cursor-pointer"
                                  onClick={() => setSelectedTable(table.id)}
                                >
                                  Atender Reserva
                                </Button>
                              )}
                              {table.status === 'ocupada' && (
                                <p className="text-sm text-gray-500">No disponible</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex">
              <div className="w-1/3 border-r">
                <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Categorías</h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedTable(null)}
                    className="!rounded-button whitespace-nowrap cursor-pointer"
                  >
                    <i className="fas fa-arrow-left mr-2"></i> Volver
                  </Button>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      variant={selectedCategory === "todos" ? "default" : "outline"}
                      onClick={() => setSelectedCategory("todos")}
                      className="w-full text-left justify-start !rounded-button whitespace-nowrap cursor-pointer"
                    >
                      <i className="fas fa-th-large mr-2"></i> Todos los Productos
                    </Button>
                    {categories.map(category => (
                      <Button 
                        key={category.id}
                        variant={selectedCategory === category.id.toString() ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category.id.toString())}
                        className="w-full text-left justify-start !rounded-button whitespace-nowrap cursor-pointer"
                      >
                        <i className={`fas ${
                          category.id === 1 ? 'fa-cheese' : 
                          category.id === 2 ? 'fa-utensils' : 
                          category.id === 3 ? 'fa-ice-cream' : 'fa-glass-martini'
                        } mr-2`}></i>
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="w-2/3 flex flex-col">
                <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">Mesa {selectedTable}</h2>
                    <p className="text-sm text-gray-500">Pedido #1001</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
                      <i className="fas fa-save mr-2"></i> Guardar
                    </Button>
                    <Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
                      <i className="fas fa-print mr-2"></i> Imprimir
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 p-4 flex">
                  <div className="w-3/5 pr-4">
                    <h3 className="font-semibold mb-4">Productos</h3>
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="grid grid-cols-2 gap-4">
                        {filteredProducts.map(product => (
                          <Card 
                            key={product.id} 
                            className="overflow-hidden cursor-pointer"
                            onClick={() => addToCart(product)}
                          >
                            <div className="h-32 overflow-hidden">
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover object-top"
                              />
                            </div>
                            <CardContent className="p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">{product.name}</h3>
                                  <p className="text-xs text-gray-500">
                                    {categories.find(c => c.id === product.category)?.name}
                                  </p>
                                </div>
                                <p className="font-bold">€{product.price.toFixed(2)}</p>
                              </div>
                              <Button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(product);
                                }}
                                size="sm"
                                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer"
                              >
                                <i className="fas fa-plus mr-1"></i> Añadir
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  
                  <div className="w-2/5">
                    <Card className="h-full flex flex-col">
                      <CardHeader className="pb-2">
                        <CardTitle>Pedido Actual</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 flex-1">
                        <ScrollArea className="h-[300px]">
                          {cart.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              <i className="fas fa-shopping-cart text-4xl mb-2"></i>
                              <p>No hay productos en el pedido</p>
                              <p className="text-sm">Seleccione productos para añadir</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                                  <div className="flex-1">
                                    <h4 className="font-medium">{item.name}</h4>
                                    <p className="text-sm text-gray-500">€{item.price.toFixed(2)}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button 
                                      onClick={() => removeFromCart(item.id)}
                                      size="sm" 
                                      variant="outline"
                                      className="h-7 w-7 p-0 !rounded-button whitespace-nowrap cursor-pointer"
                                    >
                                      <i className="fas fa-minus"></i>
                                    </Button>
                                    <span className="w-6 text-center">{item.quantity}</span>
                                    <Button 
                                      onClick={() => addToCart({id: item.id, name: item.name, price: item.price})}
                                      size="sm" 
                                      variant="outline"
                                      className="h-7 w-7 p-0 !rounded-button whitespace-nowrap cursor-pointer"
                                    >
                                      <i className="fas fa-plus"></i>
                                    </Button>
                                  </div>
                                  <div className="w-20 text-right font-medium">
                                    €{(item.price * item.quantity).toFixed(2)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </ScrollArea>
                      </CardContent>
                      
                      <div className="border-t p-4">
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span>€{calculateTotal().toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">IVA (21%):</span>
                            <span>€{(calculateTotal() * 0.21).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>€{(calculateTotal() * 1.21).toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Monto Recibido
                            </label>
                            <Input
                              type="number"
                              value={amountReceived}
                              onChange={(e) => setAmountReceived(e.target.value)}
                              className="w-full"
                              placeholder="0.00"
                            />
                          </div>
                          <div className="flex justify-between font-bold">
                            <span>Cambio:</span>
                            <span>€{calculateChange().toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <Button 
                            variant="outline"
                            className="!rounded-button whitespace-nowrap cursor-pointer"
                          >
                            <i className="fas fa-print mr-2"></i> Imprimir Cocina
                          </Button>
                          <Button 
                            disabled={cart.length === 0 || calculateChange() <= 0}
                            className="bg-green-600 hover:bg-green-700 !rounded-button whitespace-nowrap cursor-pointer"
                          >
                            <i className="fas fa-check-circle mr-2"></i> Confirmar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;

