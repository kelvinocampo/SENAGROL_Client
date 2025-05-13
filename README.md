# SENAGROL

SENAGROL es una plataforma web diseñada para que los agricultores tengan una conexión más directa, rápida y fácil con los consumidores. A pesar de los avances tecnológicos y la disponibilidad de herramientas en línea, los agricultores siguen enfrentando numerosos desafíos al intentar llegar a los consumidores finales y garantizar la rentabilidad de sus cultivos, lo que a menudo resulta en pérdidas económicas tanto para los agricultores como para los consumidores. 

Aunque este software está dirigido especialmente a agricultores, tendrá una inclusión a todo tipo de productos con el fin de facilitar la venta de todo tipo de productos, enfocado principalmente en los productos agrícolas.

## Integrantes del Proyecto
1. Kevin Esneider Ocampo Osorio (Scrum Master)
2. Samuel Torres Ospina (Product Owner)
3. Luisa Fernanda Vargas Barrera
4. Valerie Calle Loaiza
5. Mariana Cardenas Rendon

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
- [Repositorio BackEnd](https://github.com/kelvinocampo/SENAGROL_Server)