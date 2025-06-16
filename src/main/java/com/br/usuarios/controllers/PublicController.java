// src/main/java/com/br/usuarios/controllers/PublicController.java
package com.br.usuarios.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador para endpoints públicos que não exigem autenticação.
 * Ideal para páginas de status, informações gerais, etc.
 */
@RestController
@RequestMapping("/public")
public class PublicController {

    @GetMapping("/status")
    public String getPublicData() {
        return "API de Usuários está online.";
    }
}