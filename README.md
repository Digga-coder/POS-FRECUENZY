# POS FRECUENZY - Nightclub Point of Sale

Sistema de Punto de Venta (POS) optimizado para discotecas, diseñado para funcionar como una Aplicación Web Progresiva (PWA) en tablets y dispositivos móviles.

## 🚀 Características Principales

*   **Diseño 100% Responsive**: Interfaz adaptada para tablets y móviles con botones grandes y navegación táctil.
*   **Modo App Nativa (PWA)**: Se puede instalar en el dispositivo para funcionar sin barra de navegador y en pantalla completa.
*   **Gestión de Roles**:
    *   **Camareros**: Toma de pedidos rápida, selección de mixers (refrescos), y cobro.
    *   **Administradores**: Gestión de stock, usuarios, productos y visualización de logs.
*   **Sistema de Tickets**: Soporte para cobro en efectivo, tarjeta, tickets de entrada y consumiciones VIP.

## 📱 Cómo Instalar en Tablet (PWA)

1.  **Android (Chrome)**:
    *   Abre la web en Chrome.
    *   Pulsa en el botón flotante **"INSTALAR APP"** que aparecerá en la esquina inferior derecha.
    *   Si no aparece, ve al menú de Chrome (3 puntos) -> "Instalar aplicación".

2.  **iOS (iPad/iPhone - Safari)**:
    *   Abre la web en Safari.
    *   Pulsa el botón "Compartir" (cuadrado con flecha hacia arriba).
    *   Busca y selecciona **"Añadir a pantalla de inicio"**.

## 📖 Instrucciones de Uso

### 1. Inicio de Sesión
*   **Camareros**: Introducen su usuario y contraseña.
    *   *Nota*: El sistema avisa si el usuario está desactivado o la contraseña es incorrecta.
*   **Administradores**: Pulsan en "Acceso Admin" e introducen la *Clave Maestra* (Por defecto: `1234`).

### 2. Interfaz de Camarero (POS)
*   **Categorías**: Navega por las categorías en la barra superior (Copas, Cervezas, Chupitos, etc.).
*   **Añadir Productos**:
    *   Pulsa un producto para añadirlo al carrito.
    *   Si es una **Copa**, se abrirá automáticamente una ventana para elegir el **Mixer** (Refresco).
*   **Carrito**:
    *   Pulsa la barra inferior para ver el detalle del pedido.
    *   Puedes eliminar items individuales.
*   **Cobrar**:
    *   **Efectivo/Tarjeta**: Registra la venta y descuenta stock.
    *   **Ticket / VIP / Invitación**: Registra la salida de stock a coste 0€ para contabilidad.

### 3. Panel de Administración
*   **Productos**: Crea, edita o elimina productos. Ajusta precios y stock.
*   **Stocl**: Ajuste manual de stock (entradas de mercancía o mermas).
*   **Camareros**: Da de alta nuevos camareros o desactívalos.
*   **Logs**: Revisa el historial de movimientos de stock y ventas.

## 🛠️ Configuración Técnica

### Requisitos
*   Node.js instalado.
*   Conexión a Internet (para Supabase).

### Instalación Local
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

### Tecnologías
*   **Frontend**: React, TypeScript, Vite, TailwindCSS.
*   **Backend**: Supabase (Base de datos en tiempo real).
*   **Iconos**: Lucide React.
