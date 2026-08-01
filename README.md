# 🛒 MarketPro - Sistema de Gestión de Inventario y Ventas

MarketPro es una aplicación web Full-Stack desarrollada como proyecto integrador para el **SENA**, diseñada para optimizar y automatizar el control de inventarios, entradas, salidas, devoluciones y la administración de usuarios en pequeños y medianos comercios.

---

## 🚀 Características Principales

- **Gestión de Inventario:** Control en tiempo real de productos, categorías y stock actual.
- **Movimientos de Stock:** Registro detallado de Entradas, Salidas y Devoluciones de mercancía.
- **Control de Acceso y Autenticación:** Sistema de inicio de sesión seguro conectado a un backend robusto.
- **Alertas de Stock:** Notificaciones visuales automáticas cuando los productos alcanzan niveles mínimos.
- **Reportes y Estadísticas:** Visualización del estado del inventario para la toma de decisiones.

---

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **React** (con TypeScript)
- **Vite** (como empaquetador y entorno de desarrollo rápido)
- **Tailwind CSS / Estilos modernos** para una interfaz responsiva y atractiva.

### **Backend**
- **Java 17+**
- **Spring Boot** (Spring Web, Spring Data JPA)
- **MySQL** (Base de datos relacional)
- **Maven** (Gestor de dependencias)

---

## ⚙️ Requisitos Previos

Antes de ejecutar el proyecto en tu entorno local, asegúrate de tener instalado:
1. **Node.js** (versión 16 o superior) y npm.
2. **Java JDK** (versión 17 o superior).
3. **Maven**.
4. **MySQL Server** (puedes usar XAMPP, Laragon o MySQL Workbench).

---

## 📥 Guía de Instalación y Ejecución

### 1. Configuración de la Base de Datos
1. Abre tu gestor de base de datos MySQL y crea una nueva base de datos vacía:
   ```sql
   CREATE DATABASE marketpro;
   ```
2. El backend está configurado para conectarse a `jdbc:mysql://localhost:3306/marketpro`. Si usas credenciales distintas (usuario por defecto suele ser `root` y contraseña vacía), actualiza el archivo `src/main/resources/application.properties` en el proyecto backend.

---

### 2. Ejecutar el Backend (Spring Boot)
1. Abre una terminal y navega hasta la carpeta del backend:
   ```bash
   cd MarketPro-Backend
   ```
2. Compila y ejecuta la aplicación con Maven:
   ```bash
   mvn spring-boot:run
   ```
   *(El servidor se iniciará por defecto en el puerto `http://localhost:8080`)*.

-----

### 3. Ejecutar el Frontend (React + Vite)
1. Abre **Otra pestaña o ventana de la terminal** y navega hasta la carpeta del frontend:
   ```bash
   cd MarketPro-Frontend
   ```
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre tu navegador web e ingresa a la URL proporcionada (generalmente `http://localhost:5173`).

---

## 👥 Autores y Créditos
- **Proyecto:** MarketPro
- **Institución:** SENA (Servicio Nacional de Aprendizaje)
- **Propósito:** Evidencia de desarrollo de software Full-Stack.
