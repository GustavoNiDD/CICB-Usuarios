// src/main/java/com/br/usuarios/mappers/UserMapper.java
package com.br.usuarios.mappers;

import com.br.usuarios.dtos.UserDto;
import com.br.usuarios.models.User;
import org.springframework.stereotype.Component;

/**
 * Componente responsável por mapear (converter) entre a entidade User e o UserDto.
 * Essencial para manter a camada de API desacoplada da camada de persistência.
 */
@Component
public class UserMapper {

    /**
     * Converte uma entidade User para um UserDto.
     * @param user A entidade a ser convertida.
     * @return O DTO correspondente, seguro para ser exposto na API.
     */
    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }
        return new UserDto(user.getUid(), user.getEmail(), user.getName(), user.getRole());
    }

    /**
     * Converte um UserDto para uma entidade User.
     * Útil para operações de criação ou atualização a partir de dados da API.
     * @param userDto O DTO a ser convertido.
     * @return A entidade correspondente.
     */
    public User toEntity(UserDto userDto) {
        if (userDto == null) {
            return null;
        }
        return User.builder()
                .uid(userDto.uid())
                .email(userDto.email())
                .name(userDto.name())
                .role(userDto.role())
                .build();
    }
}