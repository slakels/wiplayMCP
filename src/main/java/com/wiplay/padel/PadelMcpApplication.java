package com.wiplay.padel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Aplicación principal de Wiplay Padel MCP Server
 * 
 * Servidor para gestión de reservas de pistas de pádel con herramientas estilo MCP
 * Incluye:
 * - API REST con herramientas MCP-style para gestión de reservas
 * - 4 herramientas: list_courts, check_availability, create_reservation, list_my_reservations
 * - API REST para la interfaz web
 * - Interfaz web HTML/JavaScript
 * 
 * Para ejecutar: mvn spring-boot:run
 * Acceder a: http://localhost:8080
 */
@SpringBootApplication
public class PadelMcpApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(PadelMcpApplication.class, args);
    }
}
