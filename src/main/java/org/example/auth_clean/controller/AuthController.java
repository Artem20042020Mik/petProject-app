package org.example.auth_clean.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.example.auth_clean.dto.RegisterAndLoginRequest;
import org.example.auth_clean.model.User;
import org.example.auth_clean.service.AuthService;
import org.example.auth_clean.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController{
    private final UserService userService;
    private final AuthService authService;

    @Value("${app.cookie.secure:false}")
    private boolean cookieSecure;

    @Value("${app.jwt.refreshTokenTtlDays}")
    private long refreshTokenTtl;

    public AuthController(UserService userService, AuthService authService){
        this.userService = userService;
        this.authService=authService;
    }

    private String createRefreshCookie(String value){
        return ResponseCookie.from("refreshToken", value)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Strict")
                .path("/auth")
                .maxAge(Duration.ofDays(refreshTokenTtl))
                .build()
                .toString();
    }

    private String createEmptyCookie(){
        return ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Strict")
                .maxAge(0)
                .path("/auth")
                .build()
                .toString();
    }

/*    @PostMapping("/register")
    public ResponseEntity<String> register (@RequestBody RegisterAndLoginRequest registerRequest){
        try{
            User savedUser = userService.register(registerRequest.email(), registerRequest.password() );
            return ResponseEntity.ok("user saved with email: " + savedUser.getEmail() );
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body("there was an error" + e.getMessage());
        }
    }*/
@PostMapping("/register")
public ResponseEntity<String> register(@RequestBody RegisterAndLoginRequest request) {
    User savedUser = userService.register(request.email(), request.password());
    return ResponseEntity.ok("user saved with email: " + savedUser.getEmail());
}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody RegisterAndLoginRequest loginRequest, HttpServletResponse response){
        return authService.login(loginRequest.email(), loginRequest.password()).map(loginResult -> {
            response.addHeader(HttpHeaders.SET_COOKIE, createRefreshCookie(loginResult.refreshToken));
            return ResponseEntity.ok(Map.of("accessToken", loginResult.accessToken));
        }).orElseGet(() -> ResponseEntity.status(401).body(Map.of("failure", "invalid name or password")));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(name = "refreshToken", required = false) String refreshToken,
                                     HttpServletResponse response){
        if (refreshToken == null){
            return ResponseEntity.status(401).body(Map.of("problem","with refreshToken "));
        }
        return authService.refresh(refreshToken).map(result ->{
            response.addHeader(HttpHeaders.SET_COOKIE,  createRefreshCookie(result.refreshToken));
            return ResponseEntity.ok(Map.of("accessToken", result.accessToken));
        }).orElseGet(()-> ResponseEntity.status(401).body(Map.of("error", "invalid refresh token")));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String accessToken,
                                    @CookieValue(name = "refreshToken", required = false) String refreshToken,
                                    HttpServletResponse response){
        boolean accessBlackListed= false;
        if (!accessToken.isBlank()){
            accessBlackListed = authService.blackListAccessToken(accessToken);
        }
        boolean deleteRefreshToken =false;
        if (refreshToken!=null && !refreshToken.isBlank()) {
            deleteRefreshToken = authService.revokeRefreshToken(refreshToken);
        }
        response.addHeader(HttpHeaders.SET_COOKIE, createEmptyCookie());
        return ResponseEntity.ok(Map.of("message:", "user logged out",
                                        "accessBlackListed",  accessBlackListed,
                                        "deleteRefreshToken", deleteRefreshToken ));
    }
}