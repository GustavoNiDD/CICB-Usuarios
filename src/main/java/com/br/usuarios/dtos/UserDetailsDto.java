// Altere seu arquivo UserDto.java para este conteúdo e renomeie o arquivo para UserDetailsDto.java:
// src/main/java/com/br/usuarios/dtos/UserDetailsDto.java
package com.br.usuarios.dtos;

import com.br.usuarios.models.Role;
import com.br.usuarios.models.StudentDetails;
import com.br.usuarios.models.UserProfile;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

/**
 * DTO de Saída para exibir os detalhes completos de um usuário.
 * Isola a entidade de banco de dados da exposição externa, contendo
 * apenas os campos seguros e necessários para exibição.
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL) // Boa prática: não mostra campos nulos no JSON
public class UserDetailsDto {

    // Identificador interno do MongoDB.
    private String id;

    // Identificador público do Firebase.
    private String uid;

    private String email;
    private String name;
    private Role role;

    // Objetos completos com os detalhes, se existirem.
    private UserProfile profile;
    private StudentDetails studentDetails;
}