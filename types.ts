export type Role = 'admin' | 'waiter';

// AQUI: Definimos las nuevas formas de "pago"
export type PaymentMethod = 'cash' | 'ticket_normal' | 'ticket_vip' | 'invitation';

export interface Category {
  id: number;
  name: string;
  color_hex: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  price: number;
  cost: number;
  stock_current: number;
  is_mixer: boolean;
  requires_mixer: boolean;
}

export interface CartItem {
  uniqueId: string;
  product: Product;
  mixer?: Product;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  waiter_id: string;
  waiter_name: string;
  created_at: string;
  total_amount: number;
  payment_method: PaymentMethod; // <--- Importante para guardar el tipo
  items: CartItem[];
}

export interface StockLog {
  id: string;
  date: string;
  product_name: string;
  quantity_change: number;
  reason: 'sale' | 'restock' | 'manual_adjustment';
  user: string;
}

export interface SalesData {
  time: string;
  sales: number;
}

export interface Waiter {
  id: string;
  name: string;
  username: string;
  password: string;
  active: boolean;
}