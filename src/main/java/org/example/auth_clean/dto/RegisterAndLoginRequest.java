package org.example.auth_clean.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterAndLoginRequest(
        @NotBlank(message = "password can't be empty")
        @Size(min = 6, message = "password should contain as least 6 characters")
        String password,
        @NotBlank(message = "email can't be empty")
        @Email(message = "not correct email")
        String email){

}