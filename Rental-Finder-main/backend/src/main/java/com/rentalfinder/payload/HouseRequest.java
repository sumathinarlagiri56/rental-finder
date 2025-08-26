package com.rentalfinder.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HouseRequest {
    
    @NotBlank(message = "House type is required")
    @Size(max = 10, message = "House type must not exceed 10 characters")
    private String type;
    
    @NotBlank(message = "Phone number is required")
    @Size(max = 15, message = "Phone number must not exceed 15 characters")
    private String phoneNumber;
    
    @NotBlank(message = "District is required")
    @Size(max = 50, message = "District must not exceed 50 characters")
    private String district;
    
    @NotBlank(message = "City is required")
    @Size(max = 50, message = "City must not exceed 50 characters")
    private String city;
    
    private MultipartFile image;
}
