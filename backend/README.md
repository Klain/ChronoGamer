ChronoGamer API - README

ChronoGamer API
===============

La **ChronoGamer API** es un servicio backend diseñado para la gestión de usuarios y la consulta de información histórica de videojuegos. Conectada a la API de IGDB, esta solución permite obtener detalles de videojuegos lanzados en fechas específicas, además de proporcionar funcionalidades básicas de autenticación.

Características
---------------

*   Gestión de usuarios (registro e inicio de sesión con JWT).
*   Consulta de videojuegos lanzados en fechas específicas.
*   Obtención de detalles completos de un videojuego por su ID.
*   Conexión segura con la API de IGDB a través de OAuth.
*   Pruebas automatizadas con Jest y Supertest.

Requisitos Previos
------------------

*   **Node.js** v16 o superior.
*   **NPM** o **Yarn**.
*   Credenciales de Twitch Developer para acceder a la API de IGDB.

Instalación
-----------

1.  Clona el repositorio:
    
        git clone https://github.com/Klain/ChronoGamer.git
    
2.  Accede al directorio del backend:
    
        cd ChronoGamer/backend
    
3.  Instala las dependencias:
    
        npm install
    
4.  Configura las variables de entorno en un archivo `.env`:
    
        
        PORT=3000
        JWT_SECRET=[tu_jwt_secret]
        TWITCH_CLIENT_ID=[tu_client_id]
        TWITCH_CLIENT_SECRET=[tu_client_secret]
                    
    
5.  Inicia el servidor:
    
        npm start
    

Endpoints Principales
---------------------

### 1\. Registro de Usuario

**POST** /api/auth/register

    {
      "username": "testuser",
      "password": "password123"
    }

### 2\. Inicio de Sesión

**POST** /api/auth/login

    {
      "username": "testuser",
      "password": "password123"
    }

### 3\. Listar Juegos por Fecha

**GET** /api/games?date=YYYY-MM-DD

_Query Params:_ `date` - Fecha en formato YYYY-MM-DD (opcional, por defecto se toma la fecha actual).

### 4\. Detalle de Juego

**GET** /api/games/:id

_Path Params:_ `id` - ID del videojuego en IGDB.

Pruebas
-------

Ejecuta las pruebas utilizando Jest:

    npm test

Contribuciones
--------------

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request con mejoras o correcciones.

Licencia
--------

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.