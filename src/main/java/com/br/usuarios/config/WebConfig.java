package com.br.usuarios.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import javax.annotation.PostConstruct;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @PostConstruct
    public void init() {
        System.out.println(">>> WebConfig: Bean inicializado e carregado pelo Spring.");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        System.out.println(">>> WebConfig: Aplicando mapeamentos CORS (TODAS as origens)...");
        registry.addMapping("/")
                .allowedOrigins("") // ATENÇÃO: ISSO PERMITE TODAS AS ORIGENS **
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("")
                .allowCredentials(true); // Se allowCredentials for true, allowedOrigins NÃO PODE ser "*" para alguns navegadores.
                                          // Veja a NOTA IMPORTANTE abaixo.
        System.out.println(">>> WebConfig: Mapeamentos CORS aplicados para TODAS as origens.");
    }
}
