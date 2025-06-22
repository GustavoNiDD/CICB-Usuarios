// src/main/java/com/br/usuarios/models/UserProfile.java
package com.br.usuarios.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    private LocalDate dateOfBirth;
    private String phoneNumber;
    private Address address;
}