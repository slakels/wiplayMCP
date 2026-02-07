package com.wiplay.padel.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador para el health check del servidor MCP
 */
@RestController
@RequestMapping("/mcp")
@CrossOrigin(origins = "*")
public class McpHealthController {
    
    /**
     * GET /mcp/health - Health check
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        response.put("server", "wiplay-padel-mcp-server");
        response.put("version", "1.0.0");
        response.put("tools_count", 4);
        
        return ResponseEntity.ok(response);
    }
}
