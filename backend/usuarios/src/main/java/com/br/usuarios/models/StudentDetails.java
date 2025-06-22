// src/main/java/com/br/usuarios/models/StudentDetails.java
package com.br.usuarios.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

// Esta é uma nova entidade, mapeada para sua própria coleção.
@Document(collection = "student_details")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDetails {
    @Id
    private String id;
    private String enrollmentId; // Matrícula
    private List<ParentInfo> parents;
}