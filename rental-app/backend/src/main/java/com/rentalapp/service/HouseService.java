package com.rentalapp.service;

import com.rentalapp.model.House;
import com.rentalapp.model.User;
import com.rentalapp.repository.HouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class HouseService {

    @Autowired
    private HouseRepository houseRepository;

    public House createHouseWithImage(House house, User owner, MultipartFile imageFile) throws IOException {
        house.setOwner(owner);
        if (imageFile != null && !imageFile.isEmpty()) {
            house.setImageData(imageFile.getBytes());
        }
        return houseRepository.save(house);
    }

    public List<House> getHousesByOwner(User owner) {
        return houseRepository.findByOwner(owner);
    }

    public List<House> searchHousesByLocation(String district, String city) {
        String d = district == null ? "" : district;
        String c = city == null ? "" : city;
        return houseRepository.findByDistrictContainingIgnoreCaseAndCityContainingIgnoreCase(d, c);
    }

    public Optional<House> getHouseById(Long id) {
        return houseRepository.findById(id);
    }

    public void deleteHouse(Long id, User owner) {
        House house = houseRepository.findById(id).orElseThrow();
        if (!house.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Not authorized to delete this house");
        }
        houseRepository.deleteById(id);
    }
}


