// src/main/java/com/br/usuarios/config/FirebaseConfig.java
package com.br.usuarios.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import java.io.IOException;

/**
 * Configuração para inicializar o Firebase Admin SDK na inicialização da aplicação.
 * Garante que a aplicação possa se comunicar com os serviços do Firebase de forma segura.
 */
@Configuration
public class FirebaseConfig {

    // Injeta o caminho do arquivo de credenciais a partir do application.properties.
    // Usar 'classpath:' indica que o arquivo está na pasta 'src/main/resources'.
    @Value("classpath:serviceAccountKey.json")
    private Resource serviceAccountKeyResource;

    /**
     * Método executado automaticamente após a construção do bean para inicializar o FirebaseApp.
     * A anotação @PostConstruct é ideal para tarefas de inicialização.
     */
    @PostConstruct
    public void initialize() {
        try {
            // Verifica se uma instância do FirebaseApp já foi inicializada para evitar erros.
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccountKeyResource.getInputStream()))
                        .build();

                FirebaseApp.initializeApp(options);
            }
        } catch (IOException e) {
            // Lança uma exceção em tempo de execução se não for possível ler o arquivo de credenciais.
            // Isso interrompe a inicialização da aplicação, pois a integração com o Firebase é crítica.
            throw new RuntimeException("Falha ao inicializar o Firebase Admin SDK", e);
        }
    }
}
