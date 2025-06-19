// src/main/java/com/br/usuarios/controllers/PublicController.java
package com.br.usuarios.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Controlador para endpoints públicos que não exigem autenticação.
 * Ideal para páginas de status, informações gerais, etc.
 */
@RestController
@RequestMapping("/public")
public class PublicController {

    @Value("${server.port:8080}")
    private String serverPort;

    @GetMapping("/status")
    public String getPublicData() {
        return "API de Usuários está online.";
    }

    @GetMapping("/health")
    public Map<String, Object> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now().toString());
        health.put("port", serverPort);
        health.put("message", "API de Usuários funcionando corretamente");
        return health;
    }

    @GetMapping("/")
    public Map<String, Object> root() {
        Map<String, Object> info = new HashMap<>();
        info.put("application", "API de Usuários");
        info.put("version", "1.0.0");
        info.put("status", "running");
        info.put("timestamp", LocalDateTime.now().toString());
        info.put("endpoints", Map.of(
            "health", "/public/health",
            "status", "/public/status"
        ));
        return info;
    }
}