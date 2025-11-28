package com.lumera.academy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class LumeraAcademyApplication {

    public static void main(String[] args) {
        SpringApplication.run(LumeraAcademyApplication.class, args);
    }
}
