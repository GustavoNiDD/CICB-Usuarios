package com.br.usuarios.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
// import org.springframework.core.io.Resource; // Esta linha não é mais necessária!
import java.io.ByteArrayInputStream; // Novo import necessário
import java.io.IOException;
import java.io.InputStream; // Novo import necessário

/**
 * Configuração para inicializar o Firebase Admin SDK na inicialização da aplicação.
 * Garante que a aplicação possa se comunicar com os serviços do Firebase de forma segura.
 */
@Configuration
public class FirebaseConfig {

    // INJEÇÃO DA VARIÁVEL DE AMBIENTE COMO STRING
    // O conteúdo do JSON virá diretamente para esta string.
    @Value("${FIREBASE_SERVICE_ACCOUNT_KEY}")
    private String serviceAccountKeyJson; // Mudei o tipo para String

    /**
     * Método executado automaticamente após a construção do bean para inicializar o FirebaseApp.
     */
    @PostConstruct
    public void initialize() {
        try {
            // Verifica se uma instância do FirebaseApp já foi inicializada para evitar erros.
            if (FirebaseApp.getApps().isEmpty()) {
                // CONVERTENDO A STRING JSON EM UM InputStream
                // O GoogleCredentials.fromStream() precisa de um InputStream,
                // então convertemos a string JSON para bytes e depois para um InputStream.
                InputStream serviceAccount = new ByteArrayInputStream(serviceAccountKeyJson.getBytes());

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                FirebaseApp.initializeApp(options);
                System.out.println(">>> Firebase Admin SDK inicializado com sucesso a partir da variável de ambiente.");
            }
        } catch (IOException e) {
            // Lança uma exceção em tempo de execução se não for possível ler as credenciais.
            throw new RuntimeException("Falha ao inicializar o Firebase Admin SDK: Erro ao processar as credenciais da variável de ambiente. Verifique o formato JSON.", e);
        } catch (Exception e) {
            // Captura outras exceções que podem ocorrer, como JSON malformado na variável de ambiente
            throw new RuntimeException("Erro inesperado durante a inicialização do Firebase Admin SDK. Verifique a variável FIREBASE_SERVICE_ACCOUNT_KEY.", e);
        }
    }
}
