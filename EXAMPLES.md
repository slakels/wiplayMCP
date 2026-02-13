# Ejemplos de Uso - Wiplay Padel MCP Server

Este archivo contiene ejemplos prácticos para probar el servidor.

## Iniciar el servidor

```bash
mvn spring-boot:run
```

El servidor estará disponible en: http://localhost:8080

## Probar desde la línea de comandos

### 1. Verificar que el servidor está funcionando

```bash
curl http://localhost:8080/mcp/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "server": "wiplay-padel-mcp-server",
  "version": "1.0.0",
  "tools_count": 4
}
```

### 2. Listar todas las herramientas MCP disponibles

```bash
curl http://localhost:8080/mcp/tools | jq
```

### 3. Listar todas las pistas

```bash
curl -X POST http://localhost:8080/mcp/tools/list_courts | jq
```

### 4. Verificar disponibilidad de una pista

```bash
# Para hoy
TODAY=$(date +%Y-%m-%d)
curl -X POST http://localhost:8080/mcp/tools/check_availability \
  -H "Content-Type: application/json" \
  -d "{\"court_id\":\"court-1\",\"date\":\"$TODAY\"}" | jq
```

### 5. Crear una reserva

```bash
TODAY=$(date +%Y-%m-%d)
curl -X POST http://localhost:8080/mcp/tools/create_reservation \
  -H "Content-Type: application/json" \
  -d "{
    \"court_id\":\"court-1\",
    \"date\":\"$TODAY\",
    \"start_time\":\"10:00\",
    \"end_time\":\"11:00\",
    \"user_name\":\"Juan Pérez\"
  }" | jq
```

### 6. Listar mis reservas

```bash
curl -X POST http://localhost:8080/mcp/tools/list_my_reservations \
  -H "Content-Type: application/json" \
  -d '{"user_name":"Juan Pérez"}' | jq
```

## Flujo completo de ejemplo

```bash
#!/bin/bash

# Configuración
TODAY=$(date +%Y-%m-%d)
USER_NAME="María García"
COURT_ID="court-2"

echo "=== 1. Listar pistas disponibles ==="
curl -X POST http://localhost:8080/mcp/tools/list_courts | jq

echo -e "\n=== 2. Verificar disponibilidad de Pista Norte ===" 
curl -X POST http://localhost:8080/mcp/tools/check_availability \
  -H "Content-Type: application/json" \
  -d "{\"court_id\":\"$COURT_ID\",\"date\":\"$TODAY\"}" | jq

echo -e "\n=== 3. Crear reserva para las 14:00 ==="
RESERVATION=$(curl -s -X POST http://localhost:8080/mcp/tools/create_reservation \
  -H "Content-Type: application/json" \
  -d "{
    \"court_id\":\"$COURT_ID\",
    \"date\":\"$TODAY\",
    \"start_time\":\"14:00\",
    \"end_time\":\"15:00\",
    \"user_name\":\"$USER_NAME\"
  }")

echo $RESERVATION | jq

# Extraer el ID de la reserva
RESERVATION_ID=$(echo $RESERVATION | jq -r '.data.id')
echo "ID de reserva: $RESERVATION_ID"

echo -e "\n=== 4. Listar mis reservas ==="
curl -X POST http://localhost:8080/mcp/tools/list_my_reservations \
  -H "Content-Type: application/json" \
  -d "{\"user_name\":\"$USER_NAME\"}" | jq

echo -e "\n=== 5. Verificar que el horario ya no está disponible ==="
curl -X POST http://localhost:8080/mcp/tools/check_availability \
  -H "Content-Type: application/json" \
  -d "{\"court_id\":\"$COURT_ID\",\"date\":\"$TODAY\"}" | jq '.data.slots[] | select(.startTime=="14:00")'
```

Guarda este script como `test_flow.sh`, dale permisos de ejecución con `chmod +x test_flow.sh` y ejecútalo.

## Probar con la interfaz web

1. Abre tu navegador en: http://localhost:8080
2. Ingresa tu nombre en el campo superior
3. Haz clic en cualquier pista para ver el modal de reserva
4. Selecciona una fecha (por defecto es hoy)
5. Selecciona un horario disponible (en verde)
6. Haz clic en "Confirmar Reserva"
7. Ve a la pestaña "Mis Reservas" para ver tu reserva

## API REST tradicional (alternativa)

El servidor también expone una API REST tradicional para la interfaz web:

```bash
# Listar pistas
curl http://localhost:8080/api/courts | jq

# Verificar disponibilidad
curl "http://localhost:8080/api/courts/court-1/availability?date=$(date +%Y-%m-%d)" | jq

# Crear reserva
curl -X POST http://localhost:8080/api/reservations \
  -H "Content-Type: application/json" \
  -d "{
    \"courtId\":\"court-1\",
    \"date\":\"$(date +%Y-%m-%d)\",
    \"startTime\":\"16:00\",
    \"endTime\":\"17:00\",
    \"userName\":\"Ana López\"
  }" | jq

# Listar reservas
curl "http://localhost:8080/api/reservations?userName=Ana%20López" | jq
```

## Probar múltiples usuarios

```bash
# Usuario 1
curl -X POST http://localhost:8080/mcp/tools/create_reservation \
  -H "Content-Type: application/json" \
  -d "{
    \"court_id\":\"court-1\",
    \"date\":\"$(date +%Y-%m-%d)\",
    \"start_time\":\"09:00\",
    \"end_time\":\"10:00\",
    \"user_name\":\"Carlos Ruiz\"
  }" | jq

# Usuario 2
curl -X POST http://localhost:8080/mcp/tools/create_reservation \
  -H "Content-Type: application/json" \
  -d "{
    \"court_id\":\"court-2\",
    \"date\":\"$(date +%Y-%m-%d)\",
    \"start_time\":\"09:00\",
    \"end_time\":\"10:00\",
    \"user_name\":\"Laura Martín\"
  }" | jq

# Usuario 3 en misma pista que Usuario 1 pero hora diferente
curl -X POST http://localhost:8080/mcp/tools/create_reservation \
  -H "Content-Type: application/json" \
  -d "{
    \"court_id\":\"court-1\",
    \"date\":\"$(date +%Y-%m-%d)\",
    \"start_time\":\"10:00\",
    \"end_time\":\"11:00\",
    \"user_name\":\"Pedro Sánchez\"
  }" | jq

# Listar reservas de cada usuario
echo "=== Reservas de Carlos ==="
curl -s -X POST http://localhost:8080/mcp/tools/list_my_reservations \
  -H "Content-Type: application/json" \
  -d '{"user_name":"Carlos Ruiz"}' | jq

echo "=== Reservas de Laura ==="
curl -s -X POST http://localhost:8080/mcp/tools/list_my_reservations \
  -H "Content-Type: application/json" \
  -d '{"user_name":"Laura Martín"}' | jq

echo "=== Reservas de Pedro ==="
curl -s -X POST http://localhost:8080/mcp/tools/list_my_reservations \
  -H "Content-Type: application/json" \
  -d '{"user_name":"Pedro Sánchez"}' | jq
```

## Probar conflictos de reserva

Intenta crear dos reservas para la misma pista y hora:

```bash
TODAY=$(date +%Y-%m-%d)

# Primera reserva (debe funcionar)
curl -X POST http://localhost:8080/mcp/tools/create_reservation \
  -H "Content-Type: application/json" \
  -d "{
    \"court_id\":\"court-3\",
    \"date\":\"$TODAY\",
    \"start_time\":\"18:00\",
    \"end_time\":\"19:00\",
    \"user_name\":\"Usuario 1\"
  }" | jq

# Segunda reserva para misma hora (debe fallar)
curl -X POST http://localhost:8080/mcp/tools/create_reservation \
  -H "Content-Type: application/json" \
  -d "{
    \"court_id\":\"court-3\",
    \"date\":\"$TODAY\",
    \"start_time\":\"18:00\",
    \"end_time\":\"19:00\",
    \"user_name\":\"Usuario 2\"
  }" | jq
```

Respuesta esperada de la segunda llamada:
```json
{
  "success": false,
  "error": "No se pudo crear la reserva"
}
```

## Probar todas las pistas

```bash
#!/bin/bash

TODAY=$(date +%Y-%m-%d)
COURTS=("court-1" "court-2" "court-3" "court-4")
NAMES=("Pista Central" "Pista Norte" "Pista Sur" "Pista Este")
USER="Probador de Sistema"

for i in "${!COURTS[@]}"; do
    echo "=== Reservando ${NAMES[$i]} ==="
    curl -s -X POST http://localhost:8080/mcp/tools/create_reservation \
      -H "Content-Type: application/json" \
      -d "{
        \"court_id\":\"${COURTS[$i]}\",
        \"date\":\"$TODAY\",
        \"start_time\":\"20:00\",
        \"end_time\":\"21:00\",
        \"user_name\":\"$USER\"
      }" | jq '.data | {id, courtName, totalPrice}'
    echo ""
done

echo "=== Todas mis reservas ==="
curl -s -X POST http://localhost:8080/mcp/tools/list_my_reservations \
  -H "Content-Type: application/json" \
  -d "{\"user_name\":\"$USER\"}" | jq '.data | length'
echo "reservas totales"
```

## Probar con diferentes fechas

```bash
# Hoy
TODAY=$(date +%Y-%m-%d)

# Mañana
TOMORROW=$(date -d "+1 day" +%Y-%m-%d 2>/dev/null || date -v+1d +%Y-%m-%d)

# Próxima semana
NEXT_WEEK=$(date -d "+7 days" +%Y-%m-%d 2>/dev/null || date -v+7d +%Y-%m-%d)

echo "=== Reserva para hoy ==="
curl -s -X POST http://localhost:8080/mcp/tools/create_reservation \
  -H "Content-Type: application/json" \
  -d "{
    \"court_id\":\"court-1\",
    \"date\":\"$TODAY\",
    \"start_time\":\"08:00\",
    \"end_time\":\"09:00\",
    \"user_name\":\"Madrugador\"
  }" | jq

echo "=== Reserva para mañana ==="
curl -s -X POST http://localhost:8080/mcp/tools/create_reservation \
  -H "Content-Type: application/json" \
  -d "{
    \"court_id\":\"court-1\",
    \"date\":\"$TOMORROW\",
    \"start_time\":\"08:00\",
    \"end_time\":\"09:00\",
    \"user_name\":\"Planificador\"
  }" | jq

echo "=== Reserva para próxima semana ==="
curl -s -X POST http://localhost:8080/mcp/tools/create_reservation \
  -H "Content-Type: application/json" \
  -d "{
    \"court_id\":\"court-1\",
    \"date\":\"$NEXT_WEEK\",
    \"start_time\":\"08:00\",
    \"end_time\":\"09:00\",
    \"user_name\":\"Previsor\"
  }" | jq
```

## Tips de testing

1. **Reiniciar datos**: El servidor usa datos en memoria. Para reiniciar todo, simplemente reinicia el servidor (Ctrl+C y vuelve a ejecutar `mvn spring-boot:run`)

2. **Logs**: Los logs del servidor muestran todas las operaciones. Observa la consola donde ejecutaste `mvn spring-boot:run`

3. **Pretty print JSON**: Usa `| jq` al final de los comandos curl para formatear el JSON

4. **Guardar respuestas**: Puedes guardar respuestas en archivos:
   ```bash
   curl -X POST http://localhost:8080/mcp/tools/list_courts > pistas.json
   ```

5. **Watch mode**: Para ver cambios en tiempo real:
   ```bash
   watch -n 2 'curl -s http://localhost:8080/mcp/health | jq'
   ```
