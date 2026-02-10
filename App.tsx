import React, { useState, useEffect } from 'react';
// IMPORTACIONES PARA ESTRUCTURA EN RAÍZ (SIN CARPETA SRC):
import { LoginScreen } from './components/waiter/PinPad';
import { PosInterface } from './components/waiter/PosInterface';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Role, Waiter, Product, Order, StockLog } from './types';
import { PRODUCTS as MOCK_PRODUCTS } from './constants';
import { supabase } from './supabase';

import { InstallButton } from './components/ui/InstallButton';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>('waiter');
  const [loading, setLoading] = useState(true);

  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);

  const [currentWaiter, setCurrentWaiter] = useState<Waiter | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // Carga de datos inicial
    const { data: waitersData } = await supabase.from('waiters').select('*');
    if (waitersData) setWaiters(waitersData);

    const { data: productsData } = await supabase.from('products').select('*').order('id', { ascending: true });
    if (productsData && productsData.length > 0) {
      setProducts(productsData);
    } else {
      await supabase.from('products').insert(MOCK_PRODUCTS);
      setProducts(MOCK_PRODUCTS);
    }

    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(2000);
    if (ordersData) setOrders(ordersData);

    const { data: logsData } = await supabase
      .from('stock_logs')
      .select('*')
      .order('date', { ascending: false })
      .limit(200);
    if (logsData) setStockLogs(logsData);

    setLoading(false);
  };

  const handleCreateOrder = async (newOrder: Order) => {
    // 1. Guardar en Supabase (Incluyendo el método de pago)
    const { error } = await supabase.from('orders').insert({
      id: newOrder.id,
      waiter_id: newOrder.waiter_id,
      waiter_name: newOrder.waiter_name,
      total_amount: newOrder.total_amount,
      items: newOrder.items,
      created_at: newOrder.created_at,
      payment_method: newOrder.payment_method
    });

    if (error) {
      console.error("Error guardando pedido:", error);
      alert("Error de conexión al guardar pedido. Inténtalo de nuevo.");
      return;
    }

    // 2. Actualizar Stocks y Logs localmente
    const updatedProducts = [...products];

    for (const item of newOrder.items) {
      // Producto principal
      const prodIndex = updatedProducts.findIndex(p => p.id === item.product.id);
      if (prodIndex !== -1) {
        const newStock = updatedProducts[prodIndex].stock_current - 1;
        updatedProducts[prodIndex].stock_current = newStock;

        await supabase.from('products').update({ stock_current: newStock }).eq('id', item.product.id);
        await supabase.from('stock_logs').insert({
          product_name: item.product.name,
          quantity_change: -1,
          reason: 'sale',
          user: newOrder.waiter_name,
          date: new Date().toISOString()
        });
      }
      // Mixer
      if (item.mixer) {
        const mixIndex = updatedProducts.findIndex(p => p.id === item.mixer.id);
        if (mixIndex !== -1) {
          const newStockMixer = updatedProducts[mixIndex].stock_current - 1;
          updatedProducts[mixIndex].stock_current = newStockMixer;

          await supabase.from('products').update({ stock_current: newStockMixer }).eq('id', item.mixer.id);
          await supabase.from('stock_logs').insert({
            product_name: item.mixer.name,
            quantity_change: -1,
            reason: 'sale',
            user: newOrder.waiter_name,
            date: new Date().toISOString()
          });
        }
      }
    }

    setProducts(updatedProducts);
    setOrders(prev => [newOrder, ...prev]);

    // Recargar logs
    const { data: logs } = await supabase.from('stock_logs').select('*').order('date', { ascending: false }).limit(50);
    if (logs) setStockLogs(logs);
  };

  const handleCreateWaiter = async (waiter: Waiter) => {
    const { error } = await supabase.from('waiters').insert({
      id: waiter.id,
      name: waiter.name,
      username: waiter.username,
      password: waiter.password,
      active: waiter.active
    });

    if (error) {
      alert("Error creando camarero: " + error.message);
      return;
    }
    setWaiters(prev => [...prev, waiter]);
  };

  const handleUpdateWaiter = async (waiter: Waiter) => {
    await supabase.from('waiters').update({ active: waiter.active }).eq('id', waiter.id);
    setWaiters(prev => prev.map(w => w.id === waiter.id ? waiter : w));
  };

  const handleDeleteWaiter = async (id: string) => {
    await supabase.from('waiters').delete().eq('id', id);
    setWaiters(prev => prev.filter(w => w.id !== id));
  };

  const handleUpdateProduct = async (updatedProduct: Product, user: string) => {
    const oldProduct = products.find(p => p.id === updatedProduct.id);
    const diff = updatedProduct.stock_current - (oldProduct?.stock_current || 0);

    await supabase.from('products').update({
      name: updatedProduct.name,
      price: updatedProduct.price,
      stock_current: updatedProduct.stock_current,
      category_id: updatedProduct.category_id,
      is_mixer: updatedProduct.is_mixer,
      requires_mixer: updatedProduct.requires_mixer
    }).eq('id', updatedProduct.id);

    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));

    if (diff !== 0) {
      const log = {
        product_name: updatedProduct.name,
        quantity_change: diff,
        reason: 'manual_adjustment',
        user: user,
        date: new Date().toISOString()
      };
      // @ts-ignore
      await supabase.from('stock_logs').insert(log);
      // @ts-ignore
      setStockLogs(prev => [log, ...prev]);
    }
  };

  const handleCreateProduct = async (newProduct: Product, user: string) => {
    await supabase.from('products').insert(newProduct);

    const log = {
      product_name: newProduct.name,
      quantity_change: newProduct.stock_current,
      reason: 'restock',
      user: user,
      date: new Date().toISOString()
    };
    // @ts-ignore
    await supabase.from('stock_logs').insert(log);

    setProducts(prev => [...prev, newProduct]);
    // @ts-ignore
    setStockLogs(prev => [log, ...prev]);
  };

  const handleDeleteProduct = async (id: number) => {
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleWaiterLogin = (user: string, pass: string) => {
    const waiter = waiters.find(w => w.username.toLowerCase() === user.toLowerCase() && w.password === pass);

    if (waiter) {
      if (!waiter.active) {
        alert("Este usuario ha sido desactivado.");
        return;
      }
      setCurrentWaiter(waiter);
      setRole('waiter');
      setIsAuthenticated(true);
    } else {
      alert("Usuario o contraseña incorrectos.");
    }
  };

  const handleAdminLogin = (password: string) => {
    if (password === '1234') {
      setRole('admin');
      setIsAuthenticated(true);
      setCurrentWaiter(null);
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole('waiter');
    setCurrentWaiter(null);
    fetchData();
  };

  if (loading) {
    return <div className="h-screen bg-black text-white flex items-center justify-center font-bold text-xl">Cargando Sistema POS...</div>;
  }

  return (
    <>
      <InstallButton />
      {!isAuthenticated ? (
        <LoginScreen onWaiterLogin={handleWaiterLogin} onAdminLogin={handleAdminLogin} />
      ) : role === 'admin' ? (
        <AdminDashboard
          onLogout={handleLogout}
          waiters={waiters}
          // @ts-ignore
          setWaiters={setWaiters}
          onCreateWaiter={handleCreateWaiter}
          onUpdateWaiter={handleUpdateWaiter}
          onDeleteWaiter={handleDeleteWaiter}

          products={products}
          // @ts-ignore
          setProducts={setProducts}
          orders={orders}
          salesData={[]}
          stockLogs={stockLogs}
          onUpdateProduct={(p) => handleUpdateProduct(p, 'Admin')}
          onCreateProduct={(p) => handleCreateProduct(p, 'Admin')}
          onDeleteProduct={handleDeleteProduct}
        />
      ) : (
        <PosInterface
          onLogout={handleLogout}
          currentWaiter={currentWaiter!}
          products={products}
          onCheckout={handleCreateOrder}
        />
      )}
    </>
  );
};

export default App;
