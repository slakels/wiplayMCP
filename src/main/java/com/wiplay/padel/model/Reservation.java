package com.wiplay.padel.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Modelo que representa una reserva de pista
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    
    /**
     * ID único de la reserva
     */
    private String id;
    
    /**
     * ID de la pista reservada
     */
    private String courtId;
    
    /**
     * Nombre de la pista
     */
    private String courtName;
    
    /**
     * Fecha de la reserva (formato: "yyyy-MM-dd")
     */
    private String date;
    
    /**
     * Hora de inicio (formato: "HH:mm")
     */
    private String startTime;
    
    /**
     * Hora de fin (formato: "HH:mm")
     */
    private String endTime;
    
    /**
     * Nombre del usuario que realizó la reserva
     */
    private String userName;
    
    /**
     * Estado de la reserva (confirmada/cancelada)
     */
    private String status;
    
    /**
     * Precio total de la reserva
     */
    private double totalPrice;
}
