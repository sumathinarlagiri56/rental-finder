package com.rentalfinder.payload;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchResponse {
    
    private List<HouseDto> houses;
    private long totalCount;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HouseDto {
        private Long id;
        private String type;
        private String phoneNumber;
        private String district;
        private String city;
        private String imageUrl;
        private LocalDateTime createdAt;
        private String ownerUsername;
    }
}
