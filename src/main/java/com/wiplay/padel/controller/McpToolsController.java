package com.wiplay.padel.controller;

import com.wiplay.padel.model.PadelCourt;
import com.wiplay.padel.model.Reservation;
import com.wiplay.padel.model.TimeSlot;
import com.wiplay.padel.service.PadelService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador que simula herramientas MCP para gestión de pistas de pádel
 * Expone las herramientas como endpoints REST
 */
@RestController
@RequestMapping("/mcp/tools")
@CrossOrigin(origins = "*")
public class McpToolsController {
    
    private static final Logger log = LoggerFactory.getLogger(McpToolsController.class);
    
    @Autowired
    private PadelService padelService;
    
    /**
     * GET /mcp/tools - Lista todas las herramientas MCP disponibles
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> listTools() {
        log.info("Solicitando lista de herramientas MCP");
        
        Map<String, Object> response = new HashMap<>();
        response.put("tools", List.of(
            Map.of(
                "name", "list_courts",
                "description", "Lista todas las pistas de pádel disponibles",
                "inputSchema", Map.of("type", "object", "properties", Map.of())
            ),
            Map.of(
                "name", "check_availability",
                "description", "Verifica la disponibilidad de una pista en una fecha",
                "inputSchema", Map.of(
                    "type", "object",
                    "properties", Map.of(
                        "court_id", Map.of("type", "string", "description", "ID de la pista"),
                        "date", Map.of("type", "string", "description", "Fecha (yyyy-MM-dd)")
                    ),
                    "required", List.of("court_id", "date")
                )
            ),
            Map.of(
                "name", "create_reservation",
                "description", "Crea una nueva reserva de pista",
                "inputSchema", Map.of(
                    "type", "object",
                    "properties", Map.of(
                        "court_id", Map.of("type", "string"),
                        "date", Map.of("type", "string"),
                        "start_time", Map.of("type", "string"),
                        "end_time", Map.of("type", "string"),
                        "user_name", Map.of("type", "string")
                    ),
                    "required", List.of("court_id", "date", "start_time", "end_time", "user_name")
                )
            ),
            Map.of(
                "name", "list_my_reservations",
                "description", "Lista las reservas de un usuario",
                "inputSchema", Map.of(
                    "type", "object",
                    "properties", Map.of(
                        "user_name", Map.of("type", "string", "description", "Nombre del usuario")
                    ),
                    "required", List.of("user_name")
                )
            )
        ));
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * POST /mcp/tools/list_courts - Ejecuta la herramienta list_courts
     */
    @PostMapping("/list_courts")
    public ResponseEntity<Map<String, Object>> listCourts() {
        log.info("Ejecutando herramienta MCP: list_courts");
        
        List<PadelCourt> courts = padelService.getAllCourts();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", courts);
        response.put("message", "Pistas obtenidas exitosamente");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * POST /mcp/tools/check_availability - Ejecuta la herramienta check_availability
     */
    @PostMapping("/check_availability")
    public ResponseEntity<Map<String, Object>> checkAvailability(@RequestBody Map<String, String> request) {
        String courtId = request.get("court_id");
        String date = request.get("date");
        
        log.info("Ejecutando herramienta MCP: check_availability - pista: {}, fecha: {}", courtId, date);
        
        PadelCourt court = padelService.getCourtById(courtId);
        if (court == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Pista no encontrada: " + courtId);
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        List<TimeSlot> slots = padelService.getAvailableTimeSlots(courtId, date);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", Map.of(
            "court", court,
            "date", date,
            "slots", slots
        ));
        response.put("message", "Disponibilidad obtenida exitosamente");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * POST /mcp/tools/create_reservation - Ejecuta la herramienta create_reservation
     */
    @PostMapping("/create_reservation")
    public ResponseEntity<Map<String, Object>> createReservation(@RequestBody Map<String, String> request) {
        String courtId = request.get("court_id");
        String date = request.get("date");
        String startTime = request.get("start_time");
        String endTime = request.get("end_time");
        String userName = request.get("user_name");
        
        log.info("Ejecutando herramienta MCP: create_reservation - usuario: {}, pista: {}", userName, courtId);
        
        Reservation reservation = padelService.createReservation(courtId, date, startTime, endTime, userName);
        
        if (reservation == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "No se pudo crear la reserva");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", reservation);
        response.put("message", "Reserva creada exitosamente");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * POST /mcp/tools/list_my_reservations - Ejecuta la herramienta list_my_reservations
     */
    @PostMapping("/list_my_reservations")
    public ResponseEntity<Map<String, Object>> listMyReservations(@RequestBody Map<String, String> request) {
        String userName = request.get("user_name");
        
        log.info("Ejecutando herramienta MCP: list_my_reservations - usuario: {}", userName);
        
        List<Reservation> reservations = padelService.getUserReservations(userName);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", reservations);
        response.put("message", reservations.isEmpty() ? 
            "No se encontraron reservas" : 
            "Reservas obtenidas exitosamente");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /mcp/health - Health check
     */
    @GetMapping("/../health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        response.put("server", "wiplay-padel-mcp-server");
        response.put("version", "1.0.0");
        response.put("tools_count", 4);
        
        return ResponseEntity.ok(response);
    }
}
