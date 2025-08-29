package com.rentalapp.controller;

import com.rentalapp.model.House;
import com.rentalapp.model.User;
import com.rentalapp.service.HouseService;
import com.rentalapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.Arrays;

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
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            Authentication authentication) {

        try {
            String username = authentication.getName();
            User owner = (User) userService.loadUserByUsername(username);

            House house = new House();
            house.setType(type);
            house.setPhoneNumber(phoneNumber);
            house.setDistrict(district);
            house.setCity(city);

            House saved = houseService.createHouseWithImage(house, owner, imageFile);

            return ResponseEntity.ok(Map.of(
                    "message", "House added successfully",
                    "house", Map.of(
                            "id", saved.getId(),
                            "type", saved.getType(),
                            "phoneNumber", saved.getPhoneNumber(),
                            "district", saved.getDistrict(),
                            "city", saved.getCity()
                    )
            ));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error processing image"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam(value = "district", required = false) String district,
            @RequestParam(value = "city", required = false) String city) {

        List<House> houses = houseService.searchHousesByLocation(district, city);
        List<Map<String, Object>> houseList = houses.stream().map(h -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", h.getId());
            m.put("type", h.getType());
            m.put("phoneNumber", h.getPhoneNumber());
            m.put("district", h.getDistrict());
            m.put("city", h.getCity());
            m.put("hasImage", h.getImageData() != null && h.getImageData().length > 0);
            m.put("createdAt", h.getCreatedAt());
            return m;
        }).toList();

        return ResponseEntity.ok(Map.of("houses", houseList));
    }

    @GetMapping("/districts")
    public ResponseEntity<?> districts() {
        List<String> districts = Arrays.asList(
                "Hyderabad", "Ranga Reddy", "Medchal", "Warangal", "Nizamabad", "Karimnagar"
        );
        return ResponseEntity.ok(Map.of("districts", districts));
    }

    @GetMapping("/cities/{district}")
    public ResponseEntity<?> cities(@PathVariable String district) {
        Map<String, List<String>> map = new HashMap<>();
        map.put("Hyderabad", Arrays.asList("Gachibowli", "Madhapur", "Kukatpally"));
        map.put("Ranga Reddy", Arrays.asList("Shamshabad", "Ibrahimpatnam"));
        map.put("Medchal", Arrays.asList("Medchal", "Kompally"));
        map.put("Warangal", Arrays.asList("Hanamkonda", "Kazipet"));
        map.put("Nizamabad", Arrays.asList("Armoor", "Bodhan"));
        map.put("Karimnagar", Arrays.asList("Huzurabad", "Jagtial"));

        List<String> cities = map.getOrDefault(district, new ArrayList<>());
        return ResponseEntity.ok(Map.of("cities", cities));
    }

    @GetMapping("/my")
    public ResponseEntity<?> myHouses(Authentication authentication) {
        String username = authentication.getName();
        User owner = (User) userService.loadUserByUsername(username);
        List<House> houses = houseService.getHousesByOwner(owner);

        List<Map<String, Object>> houseList = houses.stream().map(h -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", h.getId());
            m.put("type", h.getType());
            m.put("phoneNumber", h.getPhoneNumber());
            m.put("district", h.getDistrict());
            m.put("city", h.getCity());
            m.put("hasImage", h.getImageData() != null && h.getImageData().length > 0);
            m.put("createdAt", h.getCreatedAt());
            return m;
        }).toList();

        return ResponseEntity.ok(Map.of("houses", houseList));
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> image(@PathVariable Long id) {
        House h = houseService.getHouseById(id).orElse(null);
        if (h == null || h.getImageData() == null) {
            return ResponseEntity.notFound().build();
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);
        return ResponseEntity.ok().headers(headers).body(h.getImageData());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        User owner = (User) userService.loadUserByUsername(username);
        try {
            houseService.deleteHouse(id, owner);
            return ResponseEntity.ok(Map.of("message", "House deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}


