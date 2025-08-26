package com.rentalfinder.service;

import com.rentalfinder.model.House;
import com.rentalfinder.model.User;
import com.rentalfinder.repository.HouseRepository;
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

    public House createHouse(House house, User owner) {
        house.setOwner(owner);
        return houseRepository.save(house);
    }

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
        if (district != null && city != null) {
            return houseRepository.searchByLocation(district, city);
        } else if (district != null) {
            return houseRepository.findByDistrict(district);
        } else if (city != null) {
            return houseRepository.findByCity(city);
        }
        return houseRepository.findAll();
    }

    public List<String> getAllDistricts() {
        return houseRepository.findAllDistricts();
    }

    public List<String> getCitiesByDistrict(String district) {
        return houseRepository.findCitiesByDistrict(district);
    }

    public Optional<House> getHouseById(Long id) {
        return houseRepository.findById(id);
    }

    public void deleteHouse(Long id, User owner) {
        Optional<House> house = houseRepository.findById(id);
        if (house.isPresent() && house.get().getOwner().getId().equals(owner.getId())) {
            houseRepository.deleteById(id);
        }
    }
} 