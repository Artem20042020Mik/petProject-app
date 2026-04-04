package org.example.auth_clean.controller;

import org.example.auth_clean.dto.RegisterRequest;
import org.example.auth_clean.model.User;
import org.example.auth_clean.service.AuthService;
import org.example.auth_clean.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController{
    private final UserService userService;
    private final AuthService authService;
    public AuthController(UserService userService, AuthService authService){
        this.userService = userService;
        this.authService=authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register (@RequestBody RegisterRequest registerRequest){
        try{
            User savedUser = userService.register(registerRequest.email(), registerRequest.password() );
            return ResponseEntity.ok("user saved with email: " + savedUser.getEmail() );
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body("there was an error" + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody RegisterRequest loginRequest){
        return authService.login(loginRequest.email(), loginRequest.password())
                .map(loginResult->
                        ResponseEntity.ok(Map.of(
                                "accessToken", loginResult.accessToken,
                                "refreshToken", loginResult.refreshToken)))
                .orElseGet(()-> ResponseEntity.status(401).body(Map.of("error", "invalid credentials")));
    }

    record RefreshRequest(String oldRefreshToken){}

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshRequest refreshRequest){
        return authService.refresh(refreshRequest.oldRefreshToken)
                .map(loginResult ->
                        ResponseEntity.ok(Map.of(
                                "newAccessToken", loginResult.accessToken,
                                "newRefreshToken", loginResult.refreshToken
                        )))
                .orElseGet(() -> ResponseEntity.status(401)
                        .body(Map.of("error", "some problem with refreshToken")));
    }

    record LogoutRequest(String accessToken, String refreshToken) {}

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody LogoutRequest logoutRequest){
        Boolean revokedRefreshToken = authService.revokeRefreshToken(logoutRequest.refreshToken());
        Boolean blacklistedAccessToken = authService.blackListAccessToken(logoutRequest.accessToken());
        return ResponseEntity.ok
                (Map.of(
                        "revokedRefreshToken", revokedRefreshToken,
                        "blacklistedAccessToken", blacklistedAccessToken));
    }
}