import React, { useState, useMemo } from 'react';
import { Category, Product, CartItem, Waiter, Order, PaymentMethod } from '../../types';
import { CATEGORIES } from '../../constants';
import { Button } from '../ui/Button';
import { MixerModal } from './MixerModal';
import { ShoppingCart, Trash2, ChevronUp, LogOut, User, Ticket, Star, ShieldCheck, Banknote } from 'lucide-react';

interface PosInterfaceProps {
    onLogout: () => void;
    currentWaiter: Waiter;
    products: Product[];
    onCheckout: (order: Order) => void;
}

export const PosInterface: React.FC<PosInterfaceProps> = ({ onLogout, currentWaiter, products, onCheckout }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<number>(CATEGORIES[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedParentProduct, setSelectedParentProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => 
    products.filter(p => p.category_id === activeCategoryId && !p.is_mixer), 
  [activeCategoryId, products]);

  const handleProductClick = (product: Product) => {
    if (product.stock_current <= 0) {
        alert("¡Sin Stock!");
        return;
    }
    if (product.requires_mixer) {
      setSelectedParentProduct(product);
    } else {
      addToCart(product);
    }
  };

  const handleMixerSelection = (mixer: Product) => {
    if (mixer.stock_current <= 0) {
        alert(`Sin stock de ${mixer.name}`);
        return;
    }
    if (selectedParentProduct) {
      addToCart(selectedParentProduct, mixer);
      setSelectedParentProduct(null);
    }
  };

  const addToCart = (product: Product, mixer?: Product) => {
    const newItem: CartItem = {
      uniqueId: crypto.randomUUID(),
      product,
      mixer,
      quantity: 1,
      totalPrice: product.price + (mixer?.price || 0)
    };
    setCart([...cart, newItem]);
  };

  const removeFromCart = (uniqueId: string) => {
    setCart(cart.filter(item => item.uniqueId !== uniqueId));
  };

  const clearCart = () => setCart([]);

  const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  // --- LÓGICA DE COBRO ACTUALIZADA ---
  const handleCheckout = (method: PaymentMethod) => {
    if (cart.length === 0) return;
    
    let confirmMessage = "";
    let finalAmount = totalAmount;

    // Ajustamos mensaje y precio según el botón pulsado
    switch(method) {
        case 'cash':
            confirmMessage = `¿Cobrar ${totalAmount.toFixed(2)}€ en Efectivo/Tarjeta?`;
            break;
        case 'ticket_normal':
            confirmMessage = "¿Canjear 1 CONSUMICIÓN (Entrada)?";
            finalAmount = 0; // Se registra a 0€
            break;
        case 'ticket_vip':
            confirmMessage = "¿Canjear CONSUMICIÓN VIP (2 Copas)?";
            finalAmount = 0; // Se registra a 0€
            break;
        case 'invitation':
            confirmMessage = "¿Registrar INVITACIÓN STAFF (Gratis)?";
            finalAmount = 0; // Se registra a 0€
            break;
    }
    
    if(confirm(confirmMessage)) {
        const newOrder: Order = {
            id: crypto.randomUUID(),
            waiter_id: currentWaiter.id,
            waiter_name: currentWaiter.name,
            created_at: new Date().toISOString(),
            total_amount: finalAmount, 
            items: cart,
            payment_method: method // Guardamos si fue ticket, vip o invitación
        };

        onCheckout(newOrder);
        clearCart();
        setIsCartOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <div className="flex-none p-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex justify-between items-center mb-2 px-1">
            <div className="flex items-center gap-2 text-zinc-400">
                <div className="w-6 h-6 rounded-full bg-emerald-900 flex items-center justify-center border border-emerald-700">
                    <User size={12} className="text-emerald-400" />
                </div>
                <span className="font-bold text-sm text-emerald-500 uppercase tracking-wide">{currentWaiter.name}</span>
            </div>
            <button onClick={onLogout} className="text-red-500 flex items-center gap-1 text-sm font-bold active:opacity-50">
                <LogOut size={14}/> SALIR
            </button>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <Button
              key={cat.id}
              variant={activeCategoryId === cat.id ? 'category' : 'secondary'}
              colorClass={cat.color_hex}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`flex-none w-32 ${activeCategoryId === cat.id ? 'ring-2 ring-white scale-105' : 'opacity-60'}`}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid Productos */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 content-start pb-40">
        {filteredProducts.map(product => (
          <button
            key={product.id}
            onClick={() => handleProductClick(product)}
            className={`aspect-square rounded-2xl border-2 transition-all flex flex-col items-center justify-center p-2 shadow-lg relative overflow-hidden
                ${product.stock_current < 5 ? 'border-red-500/50 bg-red-900/10' : 'bg-zinc-800 border-zinc-700 active:border-emerald-500'}
                active:scale-95
            `}
          >
            <span className="text-xl font-bold text-center leading-tight z-10">{product.name}</span>
            <span className="text-emerald-400 font-mono mt-2 text-lg z-10">{product.price.toFixed(2)}€</span>
            
            {product.stock_current < 5 && (
                 <span className="absolute top-2 right-2 text-xs font-bold text-red-500 bg-red-900/30 px-2 rounded-full">
                    {product.stock_current}
                 </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent pointer-events-none" />
          </button>
        ))}
      </div>

      {/* --- ZONA DE COBRO: BOTONES ESPECIALES --- */}
      <div className="flex-none bg-zinc-900 border-t border-zinc-800 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
        
        {/* BOTONES DE TICKETS Y INVITACIÓN (Fila superior) */}
        <div className="grid grid-cols-3 gap-2 px-3 pt-3">
            <button 
                disabled={cart.length === 0}
                onClick={() => handleCheckout('ticket_normal')}
                className="bg-blue-900/30 border border-blue-500/30 text-blue-400 py-2 rounded-lg text-xs font-bold uppercase flex flex-col items-center justify-center active:bg-blue-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <Ticket size={16} className="mb-1" />
                1 Consumición
            </button>

            <button 
                disabled={cart.length === 0}
                onClick={() => handleCheckout('ticket_vip')}
                className="bg-purple-900/30 border border-purple-500/30 text-purple-400 py-2 rounded-lg text-xs font-bold uppercase flex flex-col items-center justify-center active:bg-purple-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <Star size={16} className="mb-1" />
                VIP (2 Copas)
            </button>

            <button 
                disabled={cart.length === 0}
                onClick={() => handleCheckout('invitation')}
                className="bg-zinc-800 border border-zinc-600 text-zinc-400 py-2 rounded-lg text-xs font-bold uppercase flex flex-col items-center justify-center active:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <ShieldCheck size={16} className="mb-1" />
                Invitación Staff
            </button>
        </div>

        {/* CONTROLES PRINCIPALES (Fila inferior) */}
        <div className="flex gap-3 p-4">
            <button 
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="flex-1 bg-zinc-800 rounded-xl flex items-center justify-between px-4 border border-zinc-700 active:bg-zinc-700 h-14"
            >
                <div className="flex items-center gap-2">
                    <div className="bg-emerald-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm text-white">
                        {cart.length}
                    </div>
                    <span className="text-zinc-300 font-medium text-sm">Ver Ticket</span>
                </div>
                <ChevronUp className={`text-zinc-400 transition-transform ${isCartOpen ? 'rotate-180' : ''}`} />
            </button>

            <Button 
                variant="primary" 
                className="flex-[1.5] h-14 text-xl bg-emerald-600 hover:bg-emerald-500 border-none text-white shadow-[0_0_15px_rgba(5,150,105,0.4)]"
                onClick={() => handleCheckout('cash')}
                disabled={cart.length === 0}
            >
                COBRAR {totalAmount.toFixed(2)}€
            </Button>
        </div>
      </div>

      {/* DRAWER DE COBRO (Para ver detalles) */}
      {isCartOpen && (
        <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex flex-col justify-end animate-in slide-in-from-bottom-10">
            <div className="bg-zinc-900 rounded-t-3xl h-[85vh] flex flex-col shadow-2xl border-t border-zinc-700">
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 rounded-t-3xl">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShoppingCart /> Ticket Actual
                    </h2>
                    <button onClick={() => setIsCartOpen(false)} className="p-2 text-zinc-400 hover:text-white bg-zinc-800 rounded-full">
                        <ChevronUp className="rotate-180" size={24} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-900">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                            <ShoppingCart size={48} className="mb-4 opacity-50" />
                            <p>El carrito está vacío</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.uniqueId} className="bg-black rounded-xl p-3 border border-zinc-800 flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-lg text-white">
                                        {item.product.name}
                                        {item.mixer && <span className="text-emerald-400"> + {item.mixer.name}</span>}
                                    </div>
                                    <div className="text-zinc-500 text-sm font-mono">
                                        {item.product.price.toFixed(2)}€
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-xl">{item.totalPrice.toFixed(2)}€</span>
                                    <button onClick={() => removeFromCart(item.uniqueId)} className="p-3 bg-red-900/30 text-red-500 rounded-lg">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 bg-zinc-950 border-t border-zinc-800 pb-8">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-zinc-400">Total a pagar</span>
                        <span className="text-3xl font-bold text-white">{totalAmount.toFixed(2)}€</span>
                    </div>
                     <button 
                            onClick={() => handleCheckout('cash')}
                            className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xl flex items-center justify-center gap-3 shadow-[0_4px_0_rgb(4,120,87)] active:translate-y-1 active:shadow-none transition-all"
                        >
                            <Banknote size={24} /> COBRAR (Efectivo/Tarjeta)
                        </button>
                    <button onClick={() => { clearCart(); setIsCartOpen(false); }} className="w-full mt-4 py-3 text-red-500 font-medium text-sm">
                        CANCELAR TICKET
                    </button>
                </div>
            </div>
        </div>
      )}

      {selectedParentProduct && (
        <MixerModal 
          parentProduct={selectedParentProduct}
          onSelectMixer={handleMixerSelection}
          onClose={() => setSelectedParentProduct(null)}
        />
      )}
    </div>
  );
};