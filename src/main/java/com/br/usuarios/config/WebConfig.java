package com.br.usuarios.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import javax.annotation.PostConstruct;
import java.util.Arrays;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @PostConstruct
    public void init() {
        System.out.println(">>> WebConfig: Bean inicializado e carregado pelo Spring.");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        System.out.println(">>> WebConfig: Aplicando mapeamentos CORS (incluindo Heroku)...");
        
        registry.addMapping("/**")
                .allowedOriginPatterns("*") // Usar allowedOriginPatterns em vez de allowedOrigins
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")
                .allowedHeaders("*")
                .exposedHeaders("Authorization", "Content-Type", "X-Requested-With", "Access-Control-Allow-Origin")
                .allowCredentials(true)
                .maxAge(3600);
        
        System.out.println(">>> WebConfig: Mapeamentos CORS aplicados com allowedOriginPatterns(*)");
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*")); // Permitir todas as origens
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Access-Control-Allow-Origin"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        System.out.println(">>> WebConfig: CorsConfigurationSource configurado com allowedOriginPatterns(*)");
        return source;
    }
}
