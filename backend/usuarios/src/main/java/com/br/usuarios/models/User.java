// src/main/java/com/br/usuarios/models/User.java
package com.br.usuarios.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef; // Importar DBRef
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String uid;

    @Indexed(unique = true)
    private String email;

    private String name;

    private Role role;

    // 1. Perfil com informações comuns, que será um sub-documento.
    private UserProfile profile;

    // 2. Referência para os detalhes específicos do aluno.
    //    Será nulo se o usuário não for um aluno.
    @DBRef
    private StudentDetails studentDetails;
}