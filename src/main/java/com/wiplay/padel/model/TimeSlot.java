package com.wiplay.padel.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Modelo que representa un slot de tiempo disponible para reserva
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlot {
    
    /**
     * Hora de inicio (formato: "HH:mm")
     */
    private String startTime;
    
    /**
     * Hora de fin (formato: "HH:mm")
     */
    private String endTime;
    
    /**
     * Si el slot está disponible
     */
    private boolean available;
}
