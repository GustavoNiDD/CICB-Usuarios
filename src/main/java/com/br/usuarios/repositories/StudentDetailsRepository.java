// src/main/java/com/br/usuarios/repositories/StudentDetailsRepository.java
package com.br.usuarios.repositories;

import com.br.usuarios.models.StudentDetails;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositório para a entidade StudentDetails.
 * Fornece métodos CRUD para a coleção "student_details" no MongoDB.
 */
@Repository
public interface StudentDetailsRepository extends MongoRepository<StudentDetails, String> {
}