# SENAGROL ![Estado](https://img.shields.io/badge/estado-finalizado-brightgreen?style=for-the-badge)

## 🎯 Propósito Principal
**SENAGROL** es una plataforma web que busca establecer una **conexión directa, rápida y fácil** entre **agricultores y consumidores** para **mejorar la rentabilidad** de los cultivos y reducir las pérdidas económicas. Su enfoque principal es en los **productos agrícolas**, aunque facilita la venta de otros productos en general.

## 💻 Tecnología y Arquitectura
El *front-end* (`SENAGROL_Client`) está construido con **React** y **TypeScript** sobre una **arquitectura modular**. Esto garantiza una experiencia de usuario escalable y mantenible.

## 🔑 Funcionalidades Clave
Las capacidades esenciales de la plataforma incluyen:

* **Seguridad y Gestión:** **Control de Acceso Basado en Roles (RBAC)** y herramientas integrales de administración (gestión de usuarios, productos y ventas).
* **Interacción:** Comunicación en **Tiempo Real** (chat y notificaciones) usando WebSockets.
* **Innovación:** Integración de **Inteligencia Artificial (IA)** para soporte y *insights*.
* **Visualización:** Componentes enriquecidos como gráficos, mapas y códigos QR.

[![Último Commit](https://img.shields.io/github/last-commit/kelvinocampo/SENAGROL_Client?style=flat&logo=git&logoColor=white&color=0080ff)](https://github.com/kelvinocampo/SENAGROL_Client/commits/main)
[![Lenguaje Principal](https://img.shields.io/github/languages/top/kelvinocampo/SENAGROL_Client?style=flat&color=0080ff)](https://github.com/kelvinocampo/SENAGROL_Client)
[![Conteo de Lenguajes](https://img.shields.io/github/languages/count/kelvinocampo/SENAGROL_Client?style=flat&color=0080ff)](https://github.com/kelvinocampo/SENAGROL_Client)

## Integrantes del Proyecto
1. Kevin Esneider Ocampo Osorio (Scrum Master)
2. Samuel Torres Ospina (Product Owner)
3. Luisa Fernanda Vargas Barrera
4. Valerie Calle Loaiza
5. Mariana Cardenas Rendon
6. Lenis Rocio Alfonso Castillo (Diseñadora)

# Estructura del Proyecto Frontend (Vite + React + TypeScript)
- **`node_modules/`**  
  Dependencias del proyecto instaladas por npm/yarn (generada automáticamente).
- **`public/`**  
  Archivos estáticos sin procesar (ej. `favicon.ico`, `robots.txt`).
- **`src/`** *(Código fuente principal)*  
  - **`assets/`**  
    Recursos estáticos procesados (imágenes, fuentes, CSS).  
  - **`components/`**  
    Componentes UI reutilizables (presentacionales).  
  - **`contexts/`**  
    Contextos de React para manejo de estado global.  
  - **`hooks/`**  
    Hooks personalizados (lógica reusable).  
  - **`pages/`**  
    Componentes de páginas/rutas principales.  
  - **`services/`**  
    Conexión con APIs/backend (axios, fetch).  
  - **`types/`**  
    Tipos/interfaces TypeScript.  
  - **`utils/`**  
    Funciones helpers (formateadores, validaciones).  
- **`App.tsx`**  
  Componente raíz con rutas y providers.  
- **`main.tsx`**  
  Punto de entrada (renderiza React en el DOM).  
- **Archivos de configuración**  
  - **`.gitignore`**  
    Excluye archivos del control de versiones.  
  - **`package.json`** / **`package-lock.json`**  
    Dependencias y scripts npm. 
  - **`tsconfig*.json`**  
    Configuración de TypeScript.  
  - **`vite.config.ts`**  
    Bundler (alias, plugins, optimizaciones).  
  - **`eslint.config.js`**  
    Reglas de linting.  
- **`README.md`**  
    Documentación del proyecto.  
- **`vercel.json`**  
    Configuración para despliegue en Vercel.

## ⚙️ Comenzar
### Prerrequisitos
Este proyecto requiere las siguientes dependencias:
* **Lenguaje de Programación:** TypeScript
* **Gestor de Paquetes:** Npm (Node Package Manager)

### Instalación

Construye SENAGROL\_Client desde el código fuente e instala las dependencias:
1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/kelvinocampo/SENAGROL_Client
    ```
2.  **Navegar al Directorio del Proyecto:**
    ```bash
    cd SENAGROL_Client
    ```
3.  **Instalar las Dependencias:**
    Usando `npm`:
    ```bash
    npm install
    ```
### Uso
Ejecuta el proyecto con:
Usando `npm`:
```bash
npm start
```
## Anexos
- [Demo](https://senagrol.vercel.app/)
- [Repositorio BackEnd](https://github.com/kelvinocampo/SENAGROL_Server)
