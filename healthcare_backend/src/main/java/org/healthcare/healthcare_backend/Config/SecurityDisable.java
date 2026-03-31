package org.healthcare.healthcare_backend.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityDisable {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // important
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/doctors/register").permitAll()
                        .anyRequest().permitAll() // abhi sab allow kar do
                );

        return http.build();
    }
}
