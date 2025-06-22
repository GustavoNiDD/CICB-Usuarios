// src/main/java/com/br/usuarios/models/ParentInfo.java
package com.br.usuarios.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParentInfo {
    private String name;
    private String email;
    private String phoneNumber;
    private String relationship; // Ex: "Pai", "Mãe", "Responsável Legal"
}