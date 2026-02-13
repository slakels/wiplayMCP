package com.wiplay.padel.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Modelo que representa una pista de pádel
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PadelCourt {
    
    /**
     * ID único de la pista
     */
    private String id;
    
    /**
     * Nombre de la pista
     */
    private String name;
    
    /**
     * Tipo de pista (interior/exterior)
     */
    private String type;
    
    /**
     * Estado de la pista (disponible/mantenimiento)
     */
    private String status;
    
    /**
     * Precio por hora en euros
     */
    private double pricePerHour;
    
    /**
     * Descripción adicional de la pista
     */
    private String description;
}
