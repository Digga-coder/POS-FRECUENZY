import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_SALES_DATA, CATEGORIES } from '../../constants';
import { SalesData, Waiter, Product, Order, StockLog } from '../../types';
import { LayoutDashboard, Package, LogOut, Users, DollarSign, UserPlus, Shield, Menu, X, Eye, EyeOff, Trash2, Save, Plus, Calendar, ArrowDown, ArrowUp, Lock } from 'lucide-react';
import { Button } from '../ui/Button';

interface AdminDashboardProps {
    onLogout: () => void;
    // Waiter Actions
    waiters: Waiter[];
    onCreateWaiter: (w: Waiter) => void;
    onUpdateWaiter: (w: Waiter) => void;
    onDeleteWaiter: (id: string) => void;
    
    // Data Props
    products: Product[];
    orders: Order[];
    stockLogs: StockLog[];
    onUpdateProduct: (p: Product) => void;
    onCreateProduct: (p: Product) => void;
    onDeleteProduct: (id: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    onLogout, 
    waiters, onCreateWaiter, onUpdateWaiter, onDeleteWaiter,
    products, orders, stockLogs, onUpdateProduct, onCreateProduct, onDeleteProduct
}) => {
  const [data, setData] = useState<SalesData[]>(MOCK_SALES_DATA);
  const [activeTab, setActiveTab] = useState<'monitor' | 'inventory' | 'staff' | 'calendar'>('monitor');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- WAITER STATE ---
  const [newWaiterName, setNewWaiterName] = useState('');
  const [newWaiterUser, setNewWaiterUser] = useState('');
  const [newWaiterPass, setNewWaiterPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAddWaiter, setShowAddWaiter] = useState(false);
  
  // NUEVO ESTADO: Mostrar/Ocultar contraseñas globales
  const [showAllPasswords, setShowAllPasswords] = useState(false);

  // --- PRODUCT STATE ---
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // --- CALENDAR STATE ---
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Product Form State
  const [prodForm, setProdForm] = useState({
      name: '',
      price: '',
      stock: '',
      category_id: 1,
      is_mixer: false,
      requires_mixer: false
  });

  useEffect(() => {
    // Simulación visual simple para el gráfico en tiempo real
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData];
        const lastIndex = newData.length - 1;
        newData[lastIndex] = {
            ...newData[lastIndex],
            sales: newData[lastIndex].sales + Math.floor(Math.random() * 50)
        };
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // --- CALENDAR FILTER LOGIC ---
  const filteredOrders = orders.filter(o => o.created_at.startsWith(selectedDate));
  const filteredLogs = stockLogs.filter(l => l.date.startsWith(selectedDate));
  
  const dailyRevenue = filteredOrders.reduce((sum, o) => sum + o.total_amount, 0);

  // --- WAITER HANDLERS ---
  const handleAddWaiter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWaiterName || !newWaiterUser || !newWaiterPass) return;

    const newWaiter: Waiter = {
        id: crypto.randomUUID(),
        name: newWaiterName,
        username: newWaiterUser.toLowerCase().trim(),
        password: newWaiterPass,
        active: true
    };

    onCreateWaiter(newWaiter);

    setNewWaiterName('');
    setNewWaiterUser('');
    setNewWaiterPass('');
    setShowPassword(false);
    setShowAddWaiter(false);
  };

  const toggleWaiterStatus = (waiter: Waiter) => {
    onUpdateWaiter({ ...waiter, active: !waiter.active });
  };

  const handleDeleteWaiterLocal = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este perfil permanentemente?')) {
        onDeleteWaiter(id);
    }
  };

  // --- PRODUCT HANDLERS ---
  const openProductModal = (product?: Product) => {
      if (product) {
          setEditingProduct(product);
          setProdForm({
              name: product.name,
              price: product.price.toString(),
              stock: product.stock_current.toString(),
              category_id: product.category_id,
              is_mixer: product.is_mixer,
              requires_mixer: product.requires_mixer
          });
      } else {
          setEditingProduct(null);
          setProdForm({
              name: '',
              price: '',
              stock: '',
              category_id: 1,
              is_mixer: false,
              requires_mixer: false
          });
      }
      setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
      e.preventDefault();
      
      const price = parseFloat(prodForm.price) || 0;
      const stock = parseInt(prodForm.stock) || 0;

      if (editingProduct) {
          onUpdateProduct({
              ...editingProduct,
              name: prodForm.name,
              price: price,
              stock_current: stock,
              category_id: prodForm.category_id,
              is_mixer: prodForm.is_mixer,
              requires_mixer: prodForm.requires_mixer
          });
      } else {
          const newProduct: Product = {
              id: Date.now(), 
              name: prodForm.name,
              price: price,
              cost: 0, 
              stock_current: stock,
              category_id: prodForm.category_id,
              is_mixer: prodForm.is_mixer,
              requires_mixer: prodForm.requires_mixer
          };
          onCreateProduct(newProduct);
      }
      setShowProductModal(false);
  };

  const handleDeleteProductLocal = (id: number) => {
      if(window.confirm('¿Eliminar producto del inventario?')) {
          onDeleteProduct(id);
      }
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans text-gray-800 relative overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-wider">NIGHTCLUB<span className="text-emerald-500">ADMIN</span></h1>
            <button onClick={closeSidebar} className="md:hidden text-slate-400 hover:text-white">
                <X size={24} />
            </button>
        </div>
        <nav className="flex-1 px-4 space-y-2">
            <button 
                onClick={() => { setActiveTab('monitor'); closeSidebar(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'monitor' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
                <LayoutDashboard size={20} /> Live Monitor
            </button>
            <button 
                onClick={() => { setActiveTab('inventory'); closeSidebar(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'inventory' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
                <Package size={20} /> Inventario
            </button>
            <button 
                onClick={() => { setActiveTab('staff'); closeSidebar(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'staff' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
                <Users size={20} /> Equipo (Staff)
            </button>
            <button 
                onClick={() => { setActiveTab('calendar'); closeSidebar(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'calendar' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
                <Calendar size={20} /> Historial
            </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
            <button onClick={onLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <LogOut size={18} /> Cerrar Sesión
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between md:hidden flex-none z-10">
            <div className="flex items-center gap-3">
                <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 p-1 active:bg-slate-100 rounded">
                    <Menu size={24} />
                </button>
                <span className="font-bold text-slate-800 text-lg capitalize">
                    {activeTab}
                </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">A</div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            {activeTab === 'monitor' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 hidden md:block">Panel en tiempo real</h2>
                    
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs md:text-sm text-slate-500 font-medium uppercase">Caja Total Hoy</p>
                                    <h3 className="text-2xl md:text-3xl font-bold text-emerald-600">{dailyRevenue.toFixed(2)}€</h3>
                                </div>
                                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><DollarSign size={20} /></div>
                            </div>
                            <span className="text-xs text-emerald-600 font-medium">Filtro: {selectedDate}</span>
                        </div>
                         <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs md:text-sm text-slate-500 font-medium uppercase">Camareros Activos</p>
                                    <h3 className="text-2xl md:text-3xl font-bold text-purple-600">{waiters.filter(w => w.active).length}</h3>
                                </div>
                                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Shield size={20} /></div>
                            </div>
                            <span className="text-xs text-slate-400">Personal en sala</span>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 h-80 md:h-96">
                        <h3 className="text-lg font-bold text-slate-700 mb-4">Ventas por Hora</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="time" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} width={40} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {activeTab === 'inventory' && (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-2xl font-bold text-slate-800 hidden md:block">Gestor de Productos</h2>
                        <button 
                            onClick={() => openProductModal()}
                            className="bg-emerald-600 text-white px-4 py-3 w-full sm:w-auto rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                           <Plus size={18} /> Nuevo Producto
                        </button>
                    </div>

                    {/* Product Manager Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Nombre</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Precio</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Stock</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {products.map(product => (
                                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-800">
                                                {product.name}
                                                <div className="text-xs text-slate-400 font-normal">
                                                    {CATEGORIES.find(c => c.id === product.category_id)?.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-emerald-600 font-bold">{product.price.toFixed(2)}€</td>
                                            <td className="px-6 py-4">
                                                <span className={`${product.stock_current < 10 ? 'text-red-500 font-bold' : ''}`}>
                                                    {product.stock_current} uds
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <button 
                                                    onClick={() => openProductModal(product)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteProductLocal(product.id)}
                                                    className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'staff' && (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-2xl font-bold text-slate-800 hidden md:block">Equipo de Camareros</h2>
                        <div className="flex gap-2 w-full sm:w-auto">
                            {/* BOTÓN NUEVO: VER CLAVES */}
                            <button 
                                onClick={() => setShowAllPasswords(!showAllPasswords)}
                                className={`flex-1 sm:flex-none px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm
                                    ${showAllPasswords ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                            >
                                {showAllPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                                {showAllPasswords ? 'Ocultar' : 'Ver'} Claves
                            </button>

                            <button 
                                onClick={() => setShowAddWaiter(!showAddWaiter)}
                                className="bg-emerald-600 text-white px-4 py-3 flex-1 sm:flex-none rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <UserPlus size={18} /> Nuevo
                            </button>
                        </div>
                    </div>

                    {showAddWaiter && (
                        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-emerald-100 animate-in fade-in slide-in-from-top-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">Crear Nuevo Perfil</h3>
                                <button onClick={() => setShowAddWaiter(false)} className="text-slate-400"><X size={20}/></button>
                            </div>
                            <form onSubmit={handleAddWaiter} className="flex flex-col md:flex-row gap-4 items-end flex-wrap">
                                <div className="w-full md:flex-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">NOMBRE COMPLETO</label>
                                    <input className="w-full p-3 border rounded-lg bg-slate-50" value={newWaiterName} onChange={e => setNewWaiterName(e.target.value)} placeholder="Ej. Carlos Ruiz" required />
                                </div>
                                <div className="w-full md:flex-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">USUARIO (LOGIN)</label>
                                    <input className="w-full p-3 border rounded-lg bg-slate-50" value={newWaiterUser} onChange={e => setNewWaiterUser(e.target.value)} placeholder="Ej. carlos" required />
                                </div>
                                <div className="w-full md:flex-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">CONTRASEÑA</label>
                                    <div className="relative">
                                        <input 
                                            className="w-full p-3 border rounded-lg bg-slate-50 pr-10"
                                            value={newWaiterPass} 
                                            onChange={e => setNewWaiterPass(e.target.value)} 
                                            placeholder="****" 
                                            type={showPassword ? "text" : "password"} 
                                            required 
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <Button variant="primary" type="submit" className="!bg-emerald-600 hover:!bg-emerald-700 !text-white h-12 md:h-12 w-full md:w-auto px-6 mt-2 md:mt-0 shadow-none">
                                    GUARDAR
                                </Button>
                            </form>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Nombre</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Usuario</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-sm hidden sm:table-cell">Contraseña</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Estado</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {waiters.map(waiter => (
                                        <tr key={waiter.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                                                    {waiter.name.substring(0,2).toUpperCase()}
                                                </div>
                                                {waiter.name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-mono">{waiter.username}</td>
                                            
                                            {/* COLUMNA DE CONTRASEÑA ACTUALIZADA */}
                                            <td className="px-6 py-4 font-mono hidden sm:table-cell">
                                                {showAllPasswords ? (
                                                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded font-bold text-sm">
                                                        {waiter.password}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 flex items-center gap-1">
                                                        <Lock size={12}/> ••••
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${waiter.active ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                                    {waiter.active ? 'ACTIVO' : 'INACTIVO'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <button 
                                                    onClick={() => toggleWaiterStatus(waiter)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                >
                                                    {waiter.active ? 'Desactivar' : 'Activar'}
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteWaiterLocal(waiter.id)}
                                                    className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded"
                                                    title="Eliminar Perfil"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            
            {/* NEW CALENDAR / HISTORY TAB */}
            {activeTab === 'calendar' && (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-2xl font-bold text-slate-800 hidden md:block">Historial y Calendario</h2>
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-white border border-slate-300 rounded-lg px-4 py-2 font-bold text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-auto"
                        />
                    </div>

                    {/* Daily Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
                             <p className="text-xs text-slate-500 uppercase font-bold">Ventas Totales</p>
                             <p className="text-2xl font-bold text-emerald-600">{dailyRevenue.toFixed(2)}€</p>
                        </div>
                         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                             <p className="text-xs text-slate-500 uppercase font-bold">Movimientos Stock</p>
                             <p className="text-2xl font-bold text-blue-600">{filteredLogs.length}</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Sales List */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col max-h-[500px]">
                            <div className="p-4 border-b border-slate-100 bg-slate-50">
                                <h3 className="font-bold text-slate-700 flex items-center gap-2"><DollarSign size={16} /> Ventas ({filteredOrders.length})</h3>
                            </div>
                            <div className="overflow-y-auto p-4 space-y-3 flex-1">
                                {filteredOrders.length === 0 ? (
                                    <p className="text-center text-slate-400 py-10">Sin ventas registradas en esta fecha</p>
                                ) : (
                                    filteredOrders.map(order => (
                                        <div key={order.id} className="border border-slate-100 rounded-lg p-3 hover:bg-slate-50 transition-colors">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                                                        {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                    <span className="text-sm font-medium text-slate-700">{order.waiter_name}</span>
                                                </div>
                                                <span className="text-emerald-600 font-bold">{order.total_amount.toFixed(2)}€</span>
                                            </div>
                                            <div className="text-xs text-slate-500 pl-2 border-l-2 border-slate-200">
                                                {order.items.map(i => (
                                                    <div key={i.uniqueId}>
                                                        {i.quantity}x {i.product.name} {i.mixer ? `+ ${i.mixer.name}` : ''}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Stock Logs List */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col max-h-[500px]">
                            <div className="p-4 border-b border-slate-100 bg-slate-50">
                                <h3 className="font-bold text-slate-700 flex items-center gap-2"><Package size={16} /> Registro de Stock</h3>
                            </div>
                             <div className="overflow-y-auto p-4 space-y-3 flex-1">
                                {filteredLogs.length === 0 ? (
                                    <p className="text-center text-slate-400 py-10">Sin movimientos registrados</p>
                                ) : (
                                    filteredLogs.map(log => (
                                        <div key={log.id} className="flex justify-between items-center border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                     <span className="text-xs text-slate-400">
                                                        {new Date(log.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                    <span className="font-medium text-slate-800">{log.product_name}</span>
                                                </div>
                                                <span className="text-xs text-slate-500 capitalize">{log.reason.replace('_', ' ')} por {log.user}</span>
                                            </div>
                                            <div className={`font-bold ${log.quantity_change > 0 ? 'text-blue-600' : 'text-red-500'} flex items-center`}>
                                                {log.quantity_change > 0 ? <ArrowUp size={14}/> : <ArrowDown size={14} />}
                                                {Math.abs(log.quantity_change)}
                                            </div>
                                        </div>
                                    ))
                                )}
                             </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Product Modal Overlay */}
        {showProductModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
                    <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-800">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                        <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
                    </div>
                    <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">NOMBRE DEL PRODUCTO</label>
                            <input 
                                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none" 
                                value={prodForm.name} 
                                onChange={e => setProdForm({...prodForm, name: e.target.value})} 
                                placeholder="Ej. Botella Absolut" 
                                required 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">PRECIO (€)</label>
                                <input 
                                    type="number" step="0.01"
                                    className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none" 
                                    value={prodForm.price} 
                                    onChange={e => setProdForm({...prodForm, price: e.target.value})} 
                                    placeholder="0.00" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">STOCK ACTUAL</label>
                                <input 
                                    type="number"
                                    className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none" 
                                    value={prodForm.stock} 
                                    onChange={e => setProdForm({...prodForm, stock: e.target.value})} 
                                    placeholder="0" 
                                    required 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">CATEGORÍA</label>
                            <select 
                                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={prodForm.category_id}
                                onChange={e => setProdForm({...prodForm, category_id: Number(e.target.value)})}
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-2">
                             <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                                <input 
                                    type="checkbox" 
                                    checked={prodForm.requires_mixer}
                                    onChange={e => setProdForm({...prodForm, requires_mixer: e.target.checked})}
                                    className="w-5 h-5 accent-emerald-600"
                                />
                                <span className="text-sm font-medium text-slate-700">Requiere Refresco</span>
                             </label>
                             <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                                <input 
                                    type="checkbox" 
                                    checked={prodForm.is_mixer}
                                    onChange={e => setProdForm({...prodForm, is_mixer: e.target.checked})}
                                    className="w-5 h-5 accent-emerald-600"
                                />
                                <span className="text-sm font-medium text-slate-700">Es Refresco/Mixer</span>
                             </label>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <Button type="button" variant="secondary" onClick={() => setShowProductModal(false)} className="px-6 bg-slate-200 text-slate-700 border-none hover:bg-slate-300">
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary" className="!bg-emerald-600 !text-white px-8 shadow-none hover:!bg-emerald-700">
                                <Save size={18} className="mr-2"/> Guardar Producto
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};
