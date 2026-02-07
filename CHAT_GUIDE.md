# 💬 Guía de la Interfaz de Chat

## Descripción

La interfaz de chat permite interactuar con el servidor MCP de Wiplay Padel mediante lenguaje natural en español. No necesitas recordar comandos específicos, simplemente escribe como hablarías normalmente.

## Acceso

- **URL directa**: `http://localhost:8080/chat.html`
- **Desde interfaz web**: Haz clic en el botón "💬 Ir al Chat" en el header

## Características

### 🗣️ Lenguaje Natural
Escribe comandos en español natural, el chat interpreta tu intención:
- "Muéstrame las pistas"
- "¿Qué pistas hay disponibles?"
- "Cuáles son las canchas?"
- Todas estas frases hacen lo mismo: listar las pistas

### 🧠 Procesamiento Inteligente
El chat identifica automáticamente:
- **Pistas**: "pista 1", "pista central", "pista norte", etc.
- **Fechas**: "hoy", "mañana", "2024-02-15"
- **Horarios**: "a las 10", "10:00", "15"
- **Acciones**: listar, reservar, consultar, ver

### 💭 Contexto Conversacional
Mantiene contexto de la conversación:
```
Usuario: "¿Está disponible la pista central para mañana?"
Bot: [Muestra disponibilidad]
Usuario: "Resérvala a las 10"
Bot: [Crea reserva usando la pista y fecha del contexto]
```

### ⚡ Acciones Rápidas
Tres botones para las acciones más comunes:
- 📋 Ver pistas
- 🎫 Mis reservas
- ❓ Ayuda

## Comandos Soportados

### 1. Listar Pistas
**Variaciones aceptadas:**
- "Muéstrame las pistas"
- "Ver pistas disponibles"
- "Cuáles son las pistas?"
- "Listar canchas"

**Respuesta:**
Muestra todas las pistas con:
- Nombre y tipo (interior/exterior)
- Precio por hora
- Estado
- Descripción

### 2. Consultar Disponibilidad
**Variaciones aceptadas:**
- "¿Está disponible la pista 1?"
- "Disponibilidad de la pista central para mañana"
- "¿Está libre la pista norte el 2024-02-15?"
- "Consultar horarios de la pista 3"

**Respuesta:**
Muestra horarios disponibles y ocupados con indicadores visuales:
- ✓ = Disponible (verde)
- ✗ = Ocupado (rojo)

### 3. Hacer Reserva
**Variaciones aceptadas:**
- "Reserva la pista 1 para mañana a las 10"
- "Quiero reservar la pista central hoy a las 15"
- "Apartar pista norte para el 2024-02-15 a las 10:00"

**Requisitos:**
- Pista (número o nombre)
- Hora (formato: HH:00 o HH)
- Fecha (opcional, por defecto es hoy)

**Respuesta:**
Confirmación con detalles:
- ID de reserva
- Pista reservada
- Fecha y horario
- Precio total

### 4. Ver Mis Reservas
**Variaciones aceptadas:**
- "Ver mis reservas"
- "Mis reservas"
- "Mostrar mis reservaciones"
- "¿Cuáles son mis reservas?"

**Respuesta:**
Lista de todas tus reservas con:
- Pista
- Fecha
- Horario
- Precio
- ID de reserva

### 5. Ayuda
**Variaciones aceptadas:**
- "Ayuda"
- "Help"
- "Qué puedes hacer?"
- "Comandos"

**Respuesta:**
Lista completa de comandos disponibles con ejemplos.

## Ejemplos de Conversación

### Ejemplo 1: Consulta y Reserva Simple
```
Usuario: "Muéstrame las pistas"
Bot: [Lista 4 pistas con detalles]

Usuario: "Reserva la pista central para hoy a las 10"
Bot: "✅ ¡Reserva confirmada!
      ID: RES-0001
      Pista: Pista Central
      Fecha: 2026-02-07
      Horario: 10:00 - 11:00
      Precio: €25"
```

### Ejemplo 2: Consulta de Disponibilidad con Contexto
```
Usuario: "¿Está disponible la pista 1 para mañana?"
Bot: "Disponibilidad de Pista Central para el 2026-02-08:
      08:00 ✓  09:00 ✓  10:00 ✗  11:00 ✓  ..."

Usuario: "Resérvala a las 11"
Bot: [Crea reserva para pista 1, mañana, 11:00 usando el contexto]
```

### Ejemplo 3: Gestión de Reservas
```
Usuario: "Ver mis reservas"
Bot: "Tus reservas, Juan Pérez:
      - Pista Central | 2026-02-07 | 10:00-11:00 | €25
      - Pista Norte | 2026-02-08 | 11:00-12:00 | €20"
```

## Reconocimiento de Patrones

### Nombres de Pistas
El chat reconoce múltiples formas de referirse a cada pista:

| Pista | Variaciones Aceptadas |
|-------|----------------------|
| court-1 | pista 1, pista central, central |
| court-2 | pista 2, pista norte, norte |
| court-3 | pista 3, pista sur, sur |
| court-4 | pista 4, pista este, este |

### Fechas
- **Relativas**: hoy, mañana
- **Absolutas**: 2024-02-15, 15/02/2024, 15-02-2024

### Horarios
- **Con minutos**: 10:00, 15:30
- **Solo horas**: 10, 15
- **En texto**: "a las 10", "las 15 horas"

## Interfaz

### Diseño
- Gradiente violeta/púrpura moderno
- Mensajes estilo chat (usuario a la derecha, bot a la izquierda)
- Indicador de escritura animado
- Scroll automático a nuevos mensajes

### Responsive
Funciona perfectamente en:
- Desktop (800px óptimo)
- Tablet
- Móvil

### Accesibilidad
- Alto contraste
- Tamaños de fuente legibles
- Navegación por teclado
- Enter para enviar mensajes

## Tecnología

### Frontend
- HTML5 + CSS3
- JavaScript ES6+ (Vanilla)
- Fetch API para comunicación
- Procesamiento de lenguaje natural básico con regex

### Backend
Usa las mismas herramientas MCP del servidor:
- `/mcp/tools/list_courts`
- `/mcp/tools/check_availability`
- `/mcp/tools/create_reservation`
- `/mcp/tools/list_my_reservations`

## Limitaciones Actuales

1. **Idioma**: Solo español
2. **Horarios**: Solo bloques de 1 hora
3. **Modificación**: No se pueden cancelar o modificar reservas (próxima funcionalidad)
4. **NLP**: Procesamiento básico con regex (podría mejorarse con IA)

## Próximas Mejoras

- [ ] Cancelación de reservas por chat
- [ ] Modificación de reservas existentes
- [ ] Sugerencias automáticas basadas en disponibilidad
- [ ] Procesamiento de lenguaje natural más avanzado
- [ ] Soporte multiidioma (inglés, catalán)
- [ ] Historial de conversación persistente
- [ ] Notificaciones push

## Troubleshooting

**El chat no responde:**
- Verifica que el servidor esté corriendo
- Abre las DevTools (F12) y revisa la consola
- Asegúrate de que tu nombre esté ingresado

**No entiende mi comando:**
- Prueba usar palabras clave: "mostrar", "ver", "reservar", "disponible"
- Especifica claramente: pista + fecha + hora
- Usa el comando "Ayuda" para ver ejemplos

**Error al crear reserva:**
- Verifica que el horario esté disponible
- Asegúrate de especificar pista, fecha y hora
- El horario debe ser entre 08:00 y 22:00

## Soporte

Para más información, consulta:
- `README.md` - Guía general del proyecto
- `EXAMPLES.md` - Ejemplos de API
- `MCP_ARCHITECTURE.md` - Arquitectura técnica

---

¡Disfruta usando la interfaz de chat de Wiplay Padel! 🎾
