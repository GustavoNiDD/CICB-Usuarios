// Altere ou crie este arquivo:
// src/main/java/com/br/usuarios/mappers/UserMapper.java
package com.br.usuarios.mappers;

import com.br.usuarios.dtos.UserCreationDto;
import com.br.usuarios.dtos.UserDetailsDto;
import com.br.usuarios.models.User;
import com.br.usuarios.models.UserProfile;
import org.springframework.stereotype.Component;

/**
 * Componente responsável por mapear (converter) entre Entidades User e seus DTOs.
 */
@Component
public class UserMapper {

    /**
     * Converte uma entidade User em um DTO de detalhes (saída).
     *
     * @param user A entidade do banco de dados.
     * @return O DTO com os detalhes para exibição.
     */
    public UserDetailsDto toDetailsDto(User user) {
        if (user == null) {
            return null;
        }

        UserDetailsDto dto = new UserDetailsDto();
        dto.setId(user.getId());
        dto.setUid(user.getUid());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setRole(user.getRole());
        dto.setProfile(user.getProfile()); // Mapeia o objeto de perfil diretamente
        dto.setStudentDetails(user.getStudentDetails()); // Mapeia os detalhes de estudante diretamente

        return dto;
    }

    /**
     * Converte um DTO de criação (entrada) em uma entidade User.
     * Note que este método NÃO lida com o StudentDetails, pois isso
     * requer lógica de persistência que pertence ao Service.
     *
     * @param dto O DTO vindo da requisição da API.
     * @return Uma entidade User pronta para ser persistida.
     */
    public User fromCreationDto(UserCreationDto dto) {
        if (dto == null) {
            return null;
        }
        
        // Usamos o padrão Builder da entidade User para criar o objeto
        return User.builder()
                .uid(dto.getUid())
                .email(dto.getEmail())
                .name(dto.getName())
                .role(dto.getRole())
                .profile(mapProfile(dto.getProfile())) // Usa um método auxiliar para o perfil
                .build();
    }

    /**
     * Método auxiliar privado para mapear os dados do perfil.
     *
     * @param profileData O sub-objeto de perfil do DTO de criação.
     * @return Uma entidade UserProfile.
     */
    private UserProfile mapProfile(UserCreationDto.ProfileData profileData) {
        if (profileData == null) {
            return null;
        }

        return UserProfile.builder()
                .dateOfBirth(profileData.getDateOfBirth())
                .phoneNumber(profileData.getPhoneNumber())
                .address(profileData.getAddress()) // O objeto Address é reutilizado
                .build();
    }
}