package org.example.auth_clean.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    @GetMapping("/profile")
    public ResponseEntity<?> profile(Authentication authentication){
        if (authentication == null || !authentication.isAuthenticated()){
            return ResponseEntity.status(401).body(Map.of("error:", "unauthenticated"));
        }

        return ResponseEntity.ok(Map.of(
                "name", authentication.getName(),
                "role", authentication.getAuthorities()));
    }
}
