ChronoGamer - README

ChronoGamer
===========

**ChronoGamer** es una plataforma que permite explorar videojuegos históricos lanzados en fechas específicas a lo largo del tiempo. Los usuarios pueden filtrar, buscar y descubrir detalles de sus títulos favoritos, redescubriendo joyas del pasado y conectándose con el retrogaming.

Arquitectura del Proyecto
-------------------------

*   **API Backend:** Una API construida en _Node.js_ y desplegada en _Render_, que actúa como intermediaria entre la base de datos de videojuegos ([IGDB](https://www.igdb.com)) y las aplicaciones cliente.
*   **Frontend Web:** Una aplicación web desarrollada en _React_, con un diseño moderno y responsivo para explorar los videojuegos.
*   **Aplicación Móvil:** Una app móvil basada en _React Native_, disponible para Android, que proporciona una experiencia optimizada para dispositivos móviles.

Características Principales
---------------------------

*   Consulta de videojuegos lanzados en una fecha específica.
*   Búsqueda y filtrado por género, consola, desarrollador, entre otros.
*   Fichas detalladas de los videojuegos con información relevante.
*   Interfaz moderna y adaptada tanto para web como para móvil.

Tecnologías Utilizadas
----------------------

*   **Backend:** Node.js, Express.js
*   **API:** IGDB (vía Twitch)
*   **Frontend Web:** React
*   **Frontend Móvil:** React Native
*   **Despliegue:** Render (API), Netlify/Vercel (Web), Expo (Móvil)

Requisitos Previos
------------------

*   Node.js v16 o superior
*   NPM o Yarn
*   Cuenta de Twitch Developer para obtener credenciales de IGDB
*   React CLI y/o Expo CLI

Instalación
-----------

### 1\. Backend

1.  Clonar el repositorio del backend:

    git clone https://github.com/tuusuario/chronogamer-backend.git

3.  Instalar dependencias:

    npm install

5.  Configurar variables de entorno en un archivo `.env`:

    
    TWITCH_CLIENT_ID=your-client-id
    TWITCH_CLIENT_SECRET=your-client-secret
            

7.  Iniciar el servidor:

    npm start

### 2\. Frontend Web

1.  Clonar el repositorio del frontend web:

    git clone https://github.com/tuusuario/chronogamer-web.git

3.  Instalar dependencias:

    npm install

5.  Configurar el archivo `.env` con la URL de tu API:

    
    REACT_APP_API_URL=https://your-api-url.com
            

7.  Iniciar el servidor de desarrollo:

    npm start

### 3\. Aplicación Móvil

1.  Clonar el repositorio del móvil:

    git clone https://github.com/tuusuario/chronogamer-mobile.git

3.  Instalar dependencias:

    npm install

5.  Configurar el archivo `.env` con la URL de tu API:

    
    REACT_NATIVE_API_URL=https://your-api-url.com
            

7.  Iniciar la aplicación en Expo:

    npm start

Contribuciones
--------------

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request con mejoras o correcciones.

Licencia
--------

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.