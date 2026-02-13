package com.wiplay.padel.service;

import com.wiplay.padel.model.PadelCourt;
import com.wiplay.padel.model.Reservation;
import com.wiplay.padel.model.TimeSlot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Servicio que gestiona las pistas de pádel y reservas
 * Utiliza datos en memoria (mock) para demostración
 */
@Service
public class PadelService {
    
    private static final Logger log = LoggerFactory.getLogger(PadelService.class);
    
    // Almacenamiento en memoria de pistas y reservas
    private final Map<String, PadelCourt> courts = new ConcurrentHashMap<>();
    private final Map<String, Reservation> reservations = new ConcurrentHashMap<>();
    private int reservationCounter = 1;
    
    /**
     * Constructor que inicializa datos mock
     */
    public PadelService() {
        initializeMockData();
    }
    
    /**
     * Inicializa las pistas mock
     */
    private void initializeMockData() {
        courts.put("court-1", new PadelCourt(
            "court-1",
            "Pista Central",
            "interior",
            "disponible",
            25.0,
            "Pista principal cubierta con iluminación LED y aire acondicionado"
        ));
        
        courts.put("court-2", new PadelCourt(
            "court-2",
            "Pista Norte",
            "interior",
            "disponible",
            20.0,
            "Pista cubierta con excelente ventilación"
        ));
        
        courts.put("court-3", new PadelCourt(
            "court-3",
            "Pista Sur",
            "exterior",
            "disponible",
            18.0,
            "Pista al aire libre con vista panorámica"
        ));
        
        courts.put("court-4", new PadelCourt(
            "court-4",
            "Pista Este",
            "exterior",
            "disponible",
            18.0,
            "Pista exterior con césped artificial de última generación"
        ));
        
        log.info("Inicializadas {} pistas de pádel", courts.size());
    }
    
    /**
     * Obtiene todas las pistas disponibles
     * 
     * @return Lista de pistas
     */
    public List<PadelCourt> getAllCourts() {
        log.info("Obteniendo todas las pistas");
        return new ArrayList<>(courts.values());
    }
    
    /**
     * Obtiene los horarios disponibles para una pista en una fecha específica
     * 
     * @param courtId ID de la pista
     * @param date Fecha en formato yyyy-MM-dd
     * @return Lista de slots de tiempo
     */
    public List<TimeSlot> getAvailableTimeSlots(String courtId, String date) {
        log.info("Obteniendo horarios disponibles para pista {} en fecha {}", courtId, date);
        
        // Verificar que la pista existe
        if (!courts.containsKey(courtId)) {
            log.warn("Pista no encontrada: {}", courtId);
            return Collections.emptyList();
        }
        
        // Generar slots de 8:00 a 22:00 (cada hora)
        List<TimeSlot> slots = new ArrayList<>();
        for (int hour = 8; hour < 22; hour++) {
            String startTime = String.format("%02d:00", hour);
            String endTime = String.format("%02d:00", hour + 1);
            
            // Verificar si el slot está reservado
            boolean available = isSlotAvailable(courtId, date, startTime);
            slots.add(new TimeSlot(startTime, endTime, available));
        }
        
        return slots;
    }
    
    /**
     * Verifica si un slot de tiempo está disponible
     */
    private boolean isSlotAvailable(String courtId, String date, String startTime) {
        return reservations.values().stream()
            .noneMatch(r -> r.getCourtId().equals(courtId) 
                && r.getDate().equals(date)
                && r.getStartTime().equals(startTime)
                && r.getStatus().equals("confirmada"));
    }
    
    /**
     * Crea una nueva reserva
     * 
     * @param courtId ID de la pista
     * @param date Fecha de la reserva
     * @param startTime Hora de inicio
     * @param endTime Hora de fin
     * @param userName Nombre del usuario
     * @return Reserva creada o null si no se pudo crear
     */
    public Reservation createReservation(String courtId, String date, String startTime, 
                                        String endTime, String userName) {
        log.info("Creando reserva para pista {} el {} de {} a {}", 
                 courtId, date, startTime, endTime);
        
        // Verificar que la pista existe
        PadelCourt court = courts.get(courtId);
        if (court == null) {
            log.error("Pista no encontrada: {}", courtId);
            return null;
        }
        
        // Verificar que el slot está disponible
        if (!isSlotAvailable(courtId, date, startTime)) {
            log.warn("El slot no está disponible");
            return null;
        }
        
        // Calcular duración y precio
        double hours = calculateHours(startTime, endTime);
        double totalPrice = hours * court.getPricePerHour();
        
        // Crear la reserva
        String reservationId = "RES-" + String.format("%04d", reservationCounter++);
        Reservation reservation = new Reservation(
            reservationId,
            courtId,
            court.getName(),
            date,
            startTime,
            endTime,
            userName,
            "confirmada",
            totalPrice
        );
        
        reservations.put(reservationId, reservation);
        log.info("Reserva creada exitosamente: {}", reservationId);
        
        return reservation;
    }
    
    /**
     * Calcula las horas entre dos tiempos
     */
    private double calculateHours(String startTime, String endTime) {
        LocalTime start = LocalTime.parse(startTime);
        LocalTime end = LocalTime.parse(endTime);
        return (end.toSecondOfDay() - start.toSecondOfDay()) / 3600.0;
    }
    
    /**
     * Obtiene todas las reservas de un usuario
     * 
     * @param userName Nombre del usuario
     * @return Lista de reservas
     */
    public List<Reservation> getUserReservations(String userName) {
        log.info("Obteniendo reservas del usuario: {}", userName);
        
        return reservations.values().stream()
            .filter(r -> r.getUserName().equalsIgnoreCase(userName))
            .filter(r -> r.getStatus().equals("confirmada"))
            .sorted(Comparator.comparing(Reservation::getDate)
                   .thenComparing(Reservation::getStartTime))
            .collect(Collectors.toList());
    }
    
    /**
     * Cancela una reserva
     * 
     * @param reservationId ID de la reserva
     * @return true si se canceló exitosamente
     */
    public boolean cancelReservation(String reservationId) {
        log.info("Cancelando reserva: {}", reservationId);
        
        Reservation reservation = reservations.get(reservationId);
        if (reservation == null) {
            log.warn("Reserva no encontrada: {}", reservationId);
            return false;
        }
        
        reservation.setStatus("cancelada");
        log.info("Reserva cancelada exitosamente");
        return true;
    }
    
    /**
     * Obtiene una pista por su ID
     */
    public PadelCourt getCourtById(String courtId) {
        return courts.get(courtId);
    }
}
