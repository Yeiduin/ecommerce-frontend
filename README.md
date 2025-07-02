# BestDeal - Cliente Frontend

Este es el cliente frontend para la tienda online **BestDeal**. Es una Single-Page Application (SPA) construida con React y estilizada con Tailwind CSS. Se conecta al servidor backend para ofrecer una experiencia de usuario completa, dinámica y reactiva.

## Características Principales

- **Arquitectura Moderna con React:** Construido con Vite para un desarrollo ultrarrápido y usando Hooks de React para la lógica de los componentes.
- **Enrutamiento del Lado del Cliente:** Navegación fluida sin recargas de página gracias a `React Router`, incluyendo:
  - Rutas dinámicas para detalles de productos.
  - Rutas protegidas para usuarios logueados (checkout, perfil).
  - Rutas de administrador anidadas y protegidas.
- **Gestión de Estado Global:** Uso de `Zustand` para un manejo de estado simple y potente para el carrito de compras y la sesión del usuario.
- **Tienda Completa:**
  - Página de inicio con banner y productos recientes.
  - Página de tienda con búsqueda, filtros dinámicos (por categoría, marca) y múltiples opciones de ordenamiento.
  - Carrito de compras funcional con notificaciones "toast".
- **Flujo de Autenticación y Checkout:**
  - Páginas de Registro e Inicio de Sesión.
  - Flujo de compra de prueba completo: Carrito -> Dirección de Envío -> Método de Pago -> Resumen del Pedido.
  - Persistencia de sesión y del carrito usando `localStorage`.
- **Panel de Administración Profesional:**
  - Dashboard con estadísticas del negocio (ventas, usuarios, etc.).
  - CRUD completo para la gestión de productos, incluyendo subida de imágenes a Cloudinary.
  - Gestión y visualización de todos los pedidos de la tienda.
  - Gestión de usuarios.
- **Diseño Responsivo:** Interfaz completamente adaptada a dispositivos móviles y de escritorio gracias a **Tailwind CSS**.

## Tecnologías Utilizadas

- **React**
- **Vite**
- **Tailwind CSS**
- **React Router**
- **Zustand** (Manejo de Estado)
- **Axios** (Peticiones HTTP)
- **react-hot-toast** (Notificaciones)

## Instalación y Ejecución Local

Sigue estos pasos para correr el cliente en tu máquina local.

1.  **Clonar el repositorio:**

    ```bash
    git clone [URL_DE_TU_REPOSITORIO]
    ```

2.  **Navegar a la carpeta del proyecto:**

    ```bash
    cd ecommerce-frontend
    ```

3.  **Instalar dependencias:**

    ```bash
    npm install


    ```

4.  **Crear el archivo de variables de entorno:**

    - Crea un archivo llamado `.env` en la raíz del proyecto.
    - Añade las siguientes variables con tus claves públicas de Cloudinary:

    ```
    VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
    VITE_CLOUDINARY_API_KEY=tu_api_key
    ```

    _Importante: El prefijo `VITE_` es obligatorio.\_

5.  **Iniciar el servidor de desarrollo:**

    ```bash
    npm run dev

    ```

    La aplicación estará disponible en `http://localhost:5173`.

## Usuarios de Prueba

Para probar la aplicación, puedes registrarte o usar las siguientes credenciales:

### Usuario Administrador

- **Email:** `yeiduin@correo.com`
- **Contraseña:** `12345`

### Usuario Normal

- **Email:** `yoelyei@correo.com`
- **Contraseña:** `yei123`

_(Nota: Para que el usuario admin funcione, debes asegurarte de haber cambiado su rol a 'admin' directamente en la base de datos de MongoDB)._
