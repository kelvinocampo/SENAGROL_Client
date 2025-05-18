# SENAGROL

**SAMTS** es una plataforma web que permite leer y publicar artículos de manera sencilla. Ofrece un espacio gratuito para quienes desean escribir y compartir sus ideas sin complicaciones.

El sistema cuenta con planes de suscripción, siendo el más económico de **15.000 pesos colombianos** por un mes, con publicaciones ilimitadas. Los planes superiores ofrecen más duración, navegación sin anuncios y acceso a inteligencia artificial para ayudar a redactar y corregir artículos.

También se publicarán artículos del administrador sobre productos de Amazon e infoproductos de Hotmart. SAMTS incluirá una tienda en línea gestionada con **Shopify**.

Además, el sistema integrará funciones clave como:

- **Sistema de reputación** para destacar a los mejores autores.
- **Comentarios y reacciones** para fomentar la interacción.
- **Estadísticas de desempeño** para autores.
- **Editor enriquecido** con opciones visuales.
- **Monetización** mediante donaciones o suscripciones.
- **Colaboración en artículos** entre varios usuarios.
- **App móvil** con acceso sin conexión.
- **Interfaz multilingüe** con traducción automática.

Estas funciones hacen de SAMTS una plataforma moderna, completa y orientada a la comunidad.

## Integrantes del Proyecto
1. Samuel Torres Ospina (Scrum Master)

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

## Anexos

