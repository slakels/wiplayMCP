# Arquitectura MCP del Proyecto

## Resumen

Este proyecto implementa una arquitectura inspirada en el Protocolo de Contexto de Modelo (MCP), proporcionando herramientas para gestionar reservas de pistas de pádel a través de una API REST.

## Estructura de Herramientas MCP

### 1. list_courts

**Descripción**: Lista todas las pistas de pádel disponibles

**Endpoint**: `POST /mcp/tools/list_courts`

**Input Schema**:
```json
{
  "type": "object",
  "properties": {}
}
```

**Ejemplo de respuesta**:
```json
{
  "success": true,
  "message": "Pistas obtenidas exitosamente",
  "data": [
    {
      "id": "court-1",
      "name": "Pista Central",
      "type": "interior",
      "status": "disponible",
      "pricePerHour": 25.0,
      "description": "Pista principal cubierta con iluminación LED y aire acondicionado"
    }
  ]
}
```

### 2. check_availability

**Descripción**: Verifica la disponibilidad de una pista en una fecha específica

**Endpoint**: `POST /mcp/tools/check_availability`

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "court_id": {
      "type": "string",
      "description": "ID de la pista"
    },
    "date": {
      "type": "string",
      "description": "Fecha (yyyy-MM-dd)"
    }
  },
  "required": ["court_id", "date"]
}
```

**Ejemplo de uso**:
```bash
curl -X POST http://localhost:8080/mcp/tools/check_availability \
  -H "Content-Type: application/json" \
  -d '{"court_id":"court-1","date":"2024-03-15"}'
```

**Ejemplo de respuesta**:
```json
{
  "success": true,
  "message": "Disponibilidad obtenida exitosamente",
  "data": {
    "court": {
      "id": "court-1",
      "name": "Pista Central",
      "type": "interior",
      "status": "disponible",
      "pricePerHour": 25.0,
      "description": "Pista principal cubierta con iluminación LED"
    },
    "date": "2024-03-15",
    "slots": [
      {
        "startTime": "08:00",
        "endTime": "09:00",
        "available": true
      },
      {
        "startTime": "09:00",
        "endTime": "10:00",
        "available": true
      }
    ]
  }
}
```

### 3. create_reservation

**Descripción**: Crea una nueva reserva de pista

**Endpoint**: `POST /mcp/tools/create_reservation`

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "court_id": {
      "type": "string"
    },
    "date": {
      "type": "string"
    },
    "start_time": {
      "type": "string"
    },
    "end_time": {
      "type": "string"
    },
    "user_name": {
      "type": "string"
    }
  },
  "required": ["court_id", "date", "start_time", "end_time", "user_name"]
}
```

**Ejemplo de uso**:
```bash
curl -X POST http://localhost:8080/mcp/tools/create_reservation \
  -H "Content-Type: application/json" \
  -d '{
    "court_id":"court-1",
    "date":"2024-03-15",
    "start_time":"10:00",
    "end_time":"11:00",
    "user_name":"Juan Pérez"
  }'
```

**Ejemplo de respuesta**:
```json
{
  "success": true,
  "message": "Reserva creada exitosamente",
  "data": {
    "id": "RES-0001",
    "courtId": "court-1",
    "courtName": "Pista Central",
    "date": "2024-03-15",
    "startTime": "10:00",
    "endTime": "11:00",
    "userName": "Juan Pérez",
    "status": "confirmada",
    "totalPrice": 25.0
  }
}
```

### 4. list_my_reservations

**Descripción**: Lista las reservas de un usuario

**Endpoint**: `POST /mcp/tools/list_my_reservations`

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "user_name": {
      "type": "string",
      "description": "Nombre del usuario"
    }
  },
  "required": ["user_name"]
}
```

**Ejemplo de uso**:
```bash
curl -X POST http://localhost:8080/mcp/tools/list_my_reservations \
  -H "Content-Type: application/json" \
  -d '{"user_name":"Juan Pérez"}'
```

**Ejemplo de respuesta**:
```json
{
  "success": true,
  "message": "Reservas obtenidas exitosamente",
  "data": [
    {
      "id": "RES-0001",
      "courtId": "court-1",
      "courtName": "Pista Central",
      "date": "2024-03-15",
      "startTime": "10:00",
      "endTime": "11:00",
      "userName": "Juan Pérez",
      "status": "confirmada",
      "totalPrice": 25.0
    }
  ]
}
```

## Formato de Respuesta Estándar

Todas las herramientas MCP siguen el mismo formato de respuesta:

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": { ... }
}
```

### Respuesta de Error
```json
{
  "success": false,
  "error": "Mensaje de error descriptivo"
}
```

## Descubrimiento de Herramientas

Para obtener la lista completa de herramientas y sus esquemas:

```bash
curl http://localhost:8080/mcp/tools
```

Respuesta:
```json
{
  "tools": [
    {
      "name": "list_courts",
      "description": "Lista todas las pistas de pádel disponibles",
      "inputSchema": { ... }
    },
    {
      "name": "check_availability",
      "description": "Verifica la disponibilidad de una pista en una fecha",
      "inputSchema": { ... }
    },
    ...
  ]
}
```

## Integración con Clientes

### Desde JavaScript

```javascript
// Listar pistas
async function listCourts() {
  const response = await fetch('http://localhost:8080/mcp/tools/list_courts', {
    method: 'POST'
  });
  const result = await response.json();
  return result.data;
}

// Crear reserva
async function createReservation(courtId, date, startTime, endTime, userName) {
  const response = await fetch('http://localhost:8080/mcp/tools/create_reservation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      court_id: courtId,
      date: date,
      start_time: startTime,
      end_time: endTime,
      user_name: userName
    })
  });
  const result = await response.json();
  
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error);
  }
}
```

### Desde Python

```python
import requests

# Listar pistas
def list_courts():
    response = requests.post('http://localhost:8080/mcp/tools/list_courts')
    result = response.json()
    return result['data']

# Crear reserva
def create_reservation(court_id, date, start_time, end_time, user_name):
    response = requests.post(
        'http://localhost:8080/mcp/tools/create_reservation',
        json={
            'court_id': court_id,
            'date': date,
            'start_time': start_time,
            'end_time': end_time,
            'user_name': user_name
        }
    )
    result = response.json()
    
    if result['success']:
        return result['data']
    else:
        raise Exception(result['error'])
```

## Diferencias con el SDK MCP Oficial

Esta implementación utiliza REST en lugar del protocolo MCP nativo por las siguientes razones:

1. **Compatibilidad**: REST es universal y fácil de integrar desde cualquier lenguaje
2. **Desarrollo activo**: El SDK oficial de MCP Java está en desarrollo
3. **Simplicidad**: Más fácil de entender y mantener para este proyecto de demostración
4. **Migración futura**: La arquitectura está diseñada para facilitar la migración al SDK oficial

### Plan de Migración

Cuando el SDK oficial de MCP Java esté estable:

1. Reemplazar `McpToolsController` con implementación del SDK
2. Mantener la API REST existente para compatibilidad
3. Agregar soporte para el protocolo MCP nativo (stdio/SSE)
4. Mantener los mismos esquemas de datos

## Extensión del Sistema

Para agregar nuevas herramientas:

1. Definir la herramienta en `McpToolsController`
2. Agregar el endpoint POST correspondiente
3. Implementar la lógica en `PadelService`
4. Actualizar la lista de herramientas en el método `listTools()`

Ejemplo:

```java
@PostMapping("/cancel_reservation")
public ResponseEntity<Map<String, Object>> cancelReservation(@RequestBody Map<String, String> request) {
    String reservationId = request.get("reservation_id");
    
    boolean cancelled = padelService.cancelReservation(reservationId);
    
    Map<String, Object> response = new HashMap<>();
    response.put("success", cancelled);
    response.put("message", cancelled ? 
        "Reserva cancelada exitosamente" : 
        "No se pudo cancelar la reserva");
    
    return ResponseEntity.ok(response);
}
```

## Logging y Observabilidad

Todas las herramientas MCP registran logs con SLF4J:

```
05:01:48.123 [http-nio-8080-exec-1] INFO  c.w.p.c.McpToolsController - Ejecutando herramienta MCP: list_courts
05:01:48.456 [http-nio-8080-exec-2] INFO  c.w.p.s.PadelService - Obteniendo todas las pistas
```

## Seguridad

**Nota**: Esta es una implementación de demostración. Para producción, considera:

- Autenticación de usuarios (JWT, OAuth2)
- Rate limiting en los endpoints
- Validación de entrada robusta
- HTTPS obligatorio
- CORS configurado adecuadamente
- Logs de auditoría
