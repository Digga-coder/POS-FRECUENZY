import { Category, Product, SalesData, Waiter } from './types';

export const CATEGORIES: Category[] = [
  { id: 1, name: 'Licores', color_hex: 'bg-red-600' },
  { id: 2, name: 'Cervezas/Calimocho', color_hex: 'bg-amber-500' },
  { id: 3, name: 'Cócteles', color_hex: 'bg-purple-600' },
  { id: 4, name: 'Refrescos', color_hex: 'bg-blue-500' },
  { id: 5, name: 'Chupitos', color_hex: 'bg-green-600' },
];

export const PRODUCTS: Product[] = [
  // Licores (Require Mixer)
  { id: 101, category_id: 1, name: 'Beefeater', price: 8.00, cost: 1.5, stock_current: 50, is_mixer: false, requires_mixer: true },
  { id: 102, category_id: 1, name: 'Barceló', price: 8.00, cost: 1.4, stock_current: 40, is_mixer: false, requires_mixer: true },
  { id: 103, category_id: 1, name: 'Absolut', price: 8.00, cost: 1.3, stock_current: 35, is_mixer: false, requires_mixer: true },
  
  // Cervezas
  { id: 201, category_id: 2, name: 'Heineken', price: 4.00, cost: 0.8, stock_current: 100, is_mixer: false, requires_mixer: false },
  { id: 202, category_id: 2, name: 'Corona', price: 4.50, cost: 0.9, stock_current: 80, is_mixer: false, requires_mixer: false },
  
  // Cócteles
  { id: 301, category_id: 3, name: 'Mojito', price: 10.00, cost: 2.0, stock_current: 20, is_mixer: false, requires_mixer: false },
  
  // Refrescos (Mixers)
  { id: 401, category_id: 4, name: 'Coca-Cola', price: 3.00, cost: 0.3, stock_current: 200, is_mixer: true, requires_mixer: false },
  { id: 402, category_id: 4, name: 'Tónica', price: 3.00, cost: 0.3, stock_current: 150, is_mixer: true, requires_mixer: false },
  { id: 403, category_id: 4, name: 'Fanta Limón', price: 3.00, cost: 0.3, stock_current: 120, is_mixer: true, requires_mixer: false },
  { id: 404, category_id: 4, name: 'Sprite', price: 3.00, cost: 0.3, stock_current: 100, is_mixer: true, requires_mixer: false },
  
  // Fake "No Mixer" option usually treated as a mixer internally or handled via logic
  { id: 999, category_id: 4, name: 'Solo / Hielo', price: 0, cost: 0, stock_current: 9999, is_mixer: true, requires_mixer: false },
  
  // Chupitos
  { id: 501, category_id: 5, name: 'Jagger', price: 3.00, cost: 0.8, stock_current: 30, is_mixer: false, requires_mixer: false },
];

export const MOCK_SALES_DATA: SalesData[] = [
  { time: '22:00', sales: 120 },
  { time: '23:00', sales: 450 },
  { time: '00:00', sales: 980 },
  { time: '01:00', sales: 1250 },
  { time: '02:00', sales: 1100 },
  { time: '03:00', sales: 600 },
];

export const INITIAL_WAITERS: Waiter[] = [
  { id: '1', name: 'Juan Pérez', username: 'juan', password: '123', active: true },
  { id: '2', name: 'Maria Lopez', username: 'maria', password: '123', active: true },
];