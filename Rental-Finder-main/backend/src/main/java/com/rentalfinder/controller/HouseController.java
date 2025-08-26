package com.rentalfinder.controller;

import com.rentalfinder.model.House;
import com.rentalfinder.model.User;
import com.rentalfinder.service.HouseService;
import com.rentalfinder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/houses")
@CrossOrigin(origins = "*")
public class HouseController {

    @Autowired
    private HouseService houseService;

    @Autowired
    private UserService userService;

    @PostMapping("/add")
    public ResponseEntity<?> addHouse(
            @RequestParam("type") String type,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("district") String district,
            @RequestParam("city") String city,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User owner = userService.findByUsername(username).orElse(null);
            
            if (owner == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not found"));
            }

            House house = new House();
            house.setType(type);
            house.setPhoneNumber(phoneNumber);
            house.setDistrict(district);
            house.setCity(city);

            House savedHouse = houseService.createHouseWithImage(house, owner, imageFile);
            
            return ResponseEntity.ok(Map.of(
                "message", "House added successfully",
                "house", Map.of(
                    "id", savedHouse.getId(),
                    "type", savedHouse.getType(),
                    "phoneNumber", savedHouse.getPhoneNumber(),
                    "district", savedHouse.getDistrict(),
                    "city", savedHouse.getCity()
                )
            ));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error processing image"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchHouses(
            @RequestParam(value = "district", required = false) String district,
            @RequestParam(value = "city", required = false) String city) {
        
        List<House> houses = houseService.searchHousesByLocation(district, city);
        
        List<Map<String, Object>> houseList = houses.stream()
                .map(house -> {
                    Map<String, Object> houseMap = new HashMap<>();
                    houseMap.put("id", house.getId());
                    houseMap.put("type", house.getType());
                    houseMap.put("phoneNumber", house.getPhoneNumber());
                    houseMap.put("district", house.getDistrict());
                    houseMap.put("city", house.getCity());
                    houseMap.put("hasImage", house.getImageData() != null && house.getImageData().length > 0);
                    houseMap.put("createdAt", house.getCreatedAt());
                    return houseMap;
                })
                .toList();
        
        return ResponseEntity.ok(Map.of("houses", houseList));
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyHouses() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User owner = userService.findByUsername(username).orElse(null);
        
        if (owner == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not found"));
        }

        List<House> houses = houseService.getHousesByOwner(owner);
        
        List<Map<String, Object>> houseList = houses.stream()
                .map(house -> {
                    Map<String, Object> houseMap = new HashMap<>();
                    houseMap.put("id", house.getId());
                    houseMap.put("type", house.getType());
                    houseMap.put("phoneNumber", house.getPhoneNumber());
                    houseMap.put("district", house.getDistrict());
                    houseMap.put("city", house.getCity());
                    houseMap.put("hasImage", house.getImageData() != null && house.getImageData().length > 0);
                    houseMap.put("createdAt", house.getCreatedAt());
                    return houseMap;
                })
                .toList();
        
        return ResponseEntity.ok(Map.of("houses", houseList));
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getHouseImage(@PathVariable Long id) {
        House house = houseService.getHouseById(id).orElse(null);
        
        if (house == null || house.getImageData() == null) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(house.getImageData());
    }

    @GetMapping("/districts")
    public ResponseEntity<?> getAllDistricts() {
        List<String> districts = houseService.getAllDistricts();
        return ResponseEntity.ok(Map.of("districts", districts));
    }

    @GetMapping("/cities/{district}")
    public ResponseEntity<?> getCitiesByDistrict(@PathVariable String district) {
        List<String> cities = houseService.getCitiesByDistrict(district);
        return ResponseEntity.ok(Map.of("cities", cities));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHouse(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User owner = userService.findByUsername(username).orElse(null);
        
        if (owner == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not found"));
        }

        try {
            houseService.deleteHouse(id, owner);
            return ResponseEntity.ok(Map.of("message", "House deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete house"));
        }
    }
} 