// Crie este novo arquivo:
// src/main/java/com/br/usuarios/dtos/UserCreationDto.java
package com.br.usuarios.dtos;

import com.br.usuarios.models.Address;
import com.br.usuarios.models.ParentInfo;
import com.br.usuarios.models.Role;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO de Entrada para receber os dados de criação de um novo usuário.
 * Este é o "contrato" que o cliente (frontend) deve seguir ao enviar um POST.
 */
@Data
@NoArgsConstructor
public class UserCreationDto {

    // Dados principais do User
    private String uid;
    private String email;
    private String name;
    private Role role;

    // Dados para criar o UserProfile
    private ProfileData profile;

    // Dados para criar o StudentDetails (opcional, enviado apenas se role for ALUNO)
    private StudentData studentDetails;

    // --- Classes aninhadas para organização do JSON ---

    @Data
    @NoArgsConstructor
    public static class ProfileData {
        private LocalDate dateOfBirth;
        private String phoneNumber;
        private Address address;
    }

    @Data
    @NoArgsConstructor
    public static class StudentData {
        private String enrollmentId;
        private List<ParentInfo> parents;
    }
}