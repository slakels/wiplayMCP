# 🎾 Wiplay Padel MCP Server

Sistema de reservas de pistas de pádel basado en el Protocolo de Contexto de Modelo (MCP) con interfaz web.

## 📋 Descripción

Este proyecto implementa un servidor para gestionar reservas de pistas de pádel con herramientas inspiradas en el Protocolo de Contexto de Modelo (MCP), usando Spring Boot. Incluye:

- **API REST con herramientas estilo MCP** para gestión de reservas
- **4 herramientas**: list_courts, check_availability, create_reservation, list_my_reservations
- **API REST tradicional** para la interfaz web
- **Interfaz web** HTML/JavaScript moderna y responsive
- **Interfaz de chat** para interactuar mediante lenguaje natural
- **Datos mock** para demostración (preparado para integración futura con APIs reales)

> **Nota**: Este proyecto utiliza una implementación personalizada de herramientas tipo MCP a través de REST, ya que el SDK oficial de MCP Java está en desarrollo activo. La arquitectura está diseñada para facilitar la migración futura al SDK oficial cuando esté completamente estable.

## 🚀 Características

### Herramientas MCP Disponibles

1. **list_courts** - Lista todas las pistas de pádel disponibles
2. **check_availability** - Verifica disponibilidad de una pista en una fecha específica
3. **create_reservation** - Crea una nueva reserva
4. **list_my_reservations** - Lista las reservas de un usuario

### Funcionalidades de las Interfaces

#### Interfaz Web (index.html)
- ✅ Visualización de pistas disponibles con detalles
- ✅ Verificación de disponibilidad por fecha
- ✅ Reserva de pistas en horarios disponibles
- ✅ Gestión de reservas personales
- ✅ Diseño responsive y moderno

#### Interfaz de Chat (chat.html)
- ✅ Interacción mediante lenguaje natural
- ✅ Procesamiento inteligente de comandos
- ✅ Respuestas conversacionales
- ✅ Acciones rápidas con botones
- ✅ Mantiene contexto de la conversación

## 🛠️ Requisitos Previos

- **Java 17** o superior
- **Maven 3.6+**
- Un navegador web moderno

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd wiplayMCP
```

2. **Compilar el proyecto**
```bash
mvn clean install
```

## ▶️ Ejecución

### Iniciar la aplicación

```bash
mvn spring-boot:run
```

La aplicación se iniciará en: **http://localhost:8080**

### Endpoints disponibles

- **Interfaz Web**: `http://localhost:8080/`
- **Interfaz de Chat**: `http://localhost:8080/chat.html`
- **API REST**: `http://localhost:8080/api/`
- **Herramientas MCP**: `http://localhost:8080/mcp/tools/`
- **Lista de herramientas**: `http://localhost:8080/mcp/tools`

## 📖 Uso

### Interfaz Web

1. Abre tu navegador en `http://localhost:8080`
2. Ingresa tu nombre en el campo superior
3. Explora las pistas disponibles en la pestaña "Ver Pistas"
4. Haz clic en una pista para reservarla
5. Selecciona fecha y horario disponible
6. Confirma tu reserva
7. Revisa tus reservas en la pestaña "Mis Reservas"

### Interfaz de Chat

1. Abre tu navegador en `http://localhost:8080/chat.html`
2. Ingresa tu nombre en el campo superior
3. Escribe comandos en lenguaje natural, por ejemplo:
   - "Muéstrame las pistas disponibles"
   - "¿Está disponible la pista 1 para mañana?"
   - "Reserva la pista central para hoy a las 10"
   - "Ver mis reservas"
4. Usa los botones rápidos para acciones comunes
5. El chat mantiene contexto de la conversación para facilitar seguimientos

### API REST

#### Obtener todas las pistas
```bash
curl http://localhost:8080/api/courts
```

#### Verificar disponibilidad
```bash
curl "http://localhost:8080/api/courts/court-1/availability?date=2024-02-15"
```

#### Crear una reserva
```bash
curl -X POST http://localhost:8080/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "courtId": "court-1",
    "date": "2024-02-15",
    "startTime": "10:00",
    "endTime": "11:00",
    "userName": "Juan Pérez"
  }'
```

#### Obtener reservas de un usuario
```bash
curl "http://localhost:8080/api/reservations?userName=Juan%20Pérez"
```

### Herramientas MCP

#### Listar herramientas disponibles
```bash
curl http://localhost:8080/mcp/tools
```

#### Ejecutar herramienta: list_courts
```bash
curl -X POST http://localhost:8080/mcp/tools/list_courts
```

#### Ejecutar herramienta: check_availability
```bash
curl -X POST http://localhost:8080/mcp/tools/check_availability \
  -H "Content-Type: application/json" \
  -d '{"court_id":"court-1","date":"2024-02-15"}'
```

#### Ejecutar herramienta: create_reservation
```bash
curl -X POST http://localhost:8080/mcp/tools/create_reservation \
  -H "Content-Type: application/json" \
  -d '{
    "court_id":"court-1",
    "date":"2024-02-15",
    "start_time":"10:00",
    "end_time":"11:00",
    "user_name":"Juan Pérez"
  }'
```

#### Ejecutar herramienta: list_my_reservations
```bash
curl -X POST http://localhost:8080/mcp/tools/list_my_reservations \
  -H "Content-Type: application/json" \
  -d '{"user_name":"Juan Pérez"}'
```

## 🏗️ Estructura del Proyecto

```
wiplayMCP/
├── src/
│   ├── main/
│   │   ├── java/com/wiplay/padel/
│   │   │   ├── model/              # Modelos de datos
│   │   │   │   ├── PadelCourt.java
│   │   │   │   ├── Reservation.java
│   │   │   │   └── TimeSlot.java
│   │   │   ├── service/            # Lógica de negocio
│   │   │   │   └── PadelService.java
│   │   │   ├── config/             # Configuración MCP
│   │   │   │   └── McpServerConfiguration.java
│   │   │   ├── controller/         # Controladores REST
│   │   │   │   ├── ApiController.java
│   │   │   │   └── McpController.java
│   │   │   └── PadelMcpApplication.java  # Clase principal
│   │   └── resources/
│   │       ├── static/             # Interfaz web
│   │       │   ├── index.html
│   │       │   ├── css/style.css
│   │       │   └── js/app.js
│   │       └── application.properties
│   └── test/                       # Tests
├── pom.xml                         # Configuración Maven
└── README.md                       # Este archivo
```

## 🎨 Tecnologías Utilizadas

- **Backend**:
  - Java 17
  - Spring Boot 3.2.1
  - Jackson (JSON)
  - Lombok
  - Arquitectura REST inspirada en MCP
  
- **Frontend**:
  - HTML5
  - CSS3 (con diseño moderno y gradientes)
  - JavaScript ES6+ (Fetch API, async/await)

## 📝 Datos Mock

El sistema incluye 4 pistas de pádel de demostración:

1. **Pista Central** - Interior - 25€/hora
2. **Pista Norte** - Interior - 20€/hora
3. **Pista Sur** - Exterior - 18€/hora
4. **Pista Este** - Exterior - 18€/hora

Los horarios disponibles van de 8:00 a 22:00 (cada hora).

## 🔮 Próximos Pasos

Este proyecto está diseñado como base para expansión futura:

- [ ] Migración al SDK oficial de MCP Java cuando esté estable
- [ ] Integración con APIs reales de "easypadel"
- [ ] Autenticación y autorización de usuarios
- [ ] Persistencia en base de datos (PostgreSQL/MySQL)
- [ ] Notificaciones por email/SMS
- [ ] Pagos online
- [ ] Sistema de valoraciones
- [ ] Panel de administración
- [ ] Aplicación móvil

## 🐛 Solución de Problemas

### El servidor no inicia
- Verifica que el puerto 8080 no esté en uso
- Asegúrate de tener Java 17 o superior instalado

### Error al compilar
- Ejecuta `mvn clean install -U` para forzar actualización de dependencias

### La interfaz web no carga
- Verifica que el servidor esté ejecutándose
- Abre las herramientas de desarrollador del navegador (F12) para ver errores

## 📄 Licencia

Este proyecto es un prototipo de demostración.

## 👥 Autor

Proyecto creado para Wiplay - Sistema de reservas de pistas de pádel

## 📚 Documentación Adicional

- **[CHAT_GUIDE.md](CHAT_GUIDE.md)** - Guía completa de la interfaz de chat
- **[EXAMPLES.md](EXAMPLES.md)** - Ejemplos de uso de las APIs
- **[MCP_ARCHITECTURE.md](MCP_ARCHITECTURE.md)** - Arquitectura técnica del servidor
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Resumen del proyecto

---

**¿Preguntas o problemas?** Abre un issue en el repositorio.
