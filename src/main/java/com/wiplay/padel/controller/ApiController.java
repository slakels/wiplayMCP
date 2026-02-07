package com.wiplay.padel.controller;

import com.wiplay.padel.model.PadelCourt;
import com.wiplay.padel.model.Reservation;
import com.wiplay.padel.model.TimeSlot;
import com.wiplay.padel.service.PadelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para la API de pistas y reservas
 * Usado por la interfaz web
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {
    
    @Autowired
    private PadelService padelService;
    
    /**
     * GET /api/courts - Obtener todas las pistas
     */
    @GetMapping("/courts")
    public List<PadelCourt> getCourts() {
        return padelService.getAllCourts();
    }
    
    /**
     * GET /api/courts/{courtId}/availability?date=yyyy-MM-dd
     * Obtener disponibilidad de una pista
     */
    @GetMapping("/courts/{courtId}/availability")
    public ResponseEntity<?> getAvailability(
            @PathVariable String courtId,
            @RequestParam String date) {
        
        PadelCourt court = padelService.getCourtById(courtId);
        if (court == null) {
            return ResponseEntity.notFound().build();
        }
        
        List<TimeSlot> slots = padelService.getAvailableTimeSlots(courtId, date);
        
        Map<String, Object> response = new HashMap<>();
        response.put("court", court);
        response.put("date", date);
        response.put("slots", slots);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * POST /api/reservations - Crear una reserva
     */
    @PostMapping("/reservations")
    public ResponseEntity<?> createReservation(@RequestBody Map<String, String> request) {
        String courtId = request.get("courtId");
        String date = request.get("date");
        String startTime = request.get("startTime");
        String endTime = request.get("endTime");
        String userName = request.get("userName");
        
        Reservation reservation = padelService.createReservation(
            courtId, date, startTime, endTime, userName);
        
        if (reservation == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "No se pudo crear la reserva"));
        }
        
        return ResponseEntity.ok(reservation);
    }
    
    /**
     * GET /api/reservations?userName=xxx - Obtener reservas de un usuario
     */
    @GetMapping("/reservations")
    public List<Reservation> getReservations(@RequestParam String userName) {
        return padelService.getUserReservations(userName);
    }
}
