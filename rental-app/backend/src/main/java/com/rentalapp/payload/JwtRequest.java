package com.rentalapp.payload;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
}


