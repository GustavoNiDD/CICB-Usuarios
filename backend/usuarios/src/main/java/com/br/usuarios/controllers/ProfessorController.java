// src/main/java/com/br/usuarios/controllers/ProfessorController.java
package com.br.usuarios.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador para endpoints acessíveis por usuários com o papel
 * de PROFESSOR ou ADMIN.
 */
@RestController
@RequestMapping("/api/professor")
public class ProfessorController {

    @GetMapping("/data")
    public String getProfessorData() {
        return "Informações disponíveis para Professores e Administradores.";
    }
}