TaskFlow API
============

TaskFlow API es un servicio backend que proporciona una solución escalable y segura para la gestión de tareas. Este proyecto demuestra habilidades en desarrollo backend utilizando Node.js, Express.js y SQLite, incluyendo autenticación con JWT y pruebas automatizadas.

Características
---------------

*   Gestión completa de usuarios (registro, inicio de sesión, actualización, eliminación).
*   CRUD para tareas, incluyendo paginación y búsqueda.
*   Autenticación segura con JSON Web Tokens (JWT).
*   Base de datos SQLite para almacenamiento de datos (no requiere instalación adicional).
*   Documentación interactiva de la API con Swagger.
*   Pruebas unitarias con Jest.
*   Despliegue en Render o Heroku.

Tecnologías Utilizadas
----------------------

*   **Backend:** Node.js, Express.js
*   **Base de Datos:** SQLite
*   **Autenticación:** JSON Web Tokens (JWT)
*   **Pruebas:** Jest
*   **Despliegue:** Render o Heroku

Requisitos Previos
------------------

Asegúrate de tener instalados los siguientes requisitos en tu entorno de desarrollo:

*   [Node.js](https://nodejs.org/) (v16 o superior)
*   [Git](https://git-scm.com/)

**Nota:** No se requiere instalar SQLite, ya que viene embebido en el proyecto.

Instalación
-----------

1.  **Clona el repositorio:**
    
        git clone https://github.com/Klain/taskflow-api.git
        cd taskflow-api
            
    
2.  **Instala las dependencias:**
    
        npm install
    
3.  **Configura las variables de entorno:**
    
    Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
    
        PORT=3000
        JWT_SECRET=tu_secreto
            
    
4.  **Inicia la aplicación:**
    
        npm run dev
    

Uso
---

### Endpoints Principales

#### Registro de Usuario

*   **URL:** `/api/auth/register`
*   **Método:** `POST`
*   **Body:**

    {
      "username": "testuser",
      "password": "password123"
    }
    

#### Inicio de Sesión

*   **URL:** `/api/auth/login`
*   **Método:** `POST`
*   **Body:**

    {
      "username": "testuser",
      "password": "password123"
    }
    

**Respuesta:**

    {
      "token": "Bearer <tu_token>"
    }
    

#### Obtener Tareas

*   **URL:** `/api/tasks`
*   **Método:** `GET`
*   **Headers:**

    {
      "Authorization": "Bearer <tu_token>"
    }
    

#### Crear Tarea

*   **URL:** `/api/tasks`
*   **Método:** `POST`
*   **Headers:**

    {
      "Authorization": "Bearer <tu_token>"
    }
    

**Body:**

    {
      "title": "Nueva Tarea",
      "description": "Descripción de la tarea"
    }
    

Recursos
--------

[Colección de Thunder Client](docs/thunder-collection.json): Importa esta colección en Thunder Client para probar las rutas de la API.

Pruebas
-------

Ejecuta las pruebas unitarias utilizando Jest:

    npm test

Despliegue
----------

### Render

1.  Sube el proyecto a un repositorio de GitHub.
2.  Crea un nuevo servicio web en [Render](https://render.com/).
3.  Configura los siguientes parámetros:
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm run start`
    *   **Environment Variables:** Configura las variables definidas en tu archivo `.env`.

### Heroku

1.  Crea una aplicación en Heroku:
    
        heroku create taskflow-api
    
2.  Sube el proyecto:
    
        git push heroku main
    
3.  La API estará disponible en la URL proporcionada por Heroku.