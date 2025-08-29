package com.rentalapp.repository;

import com.rentalapp.model.House;
import com.rentalapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HouseRepository extends JpaRepository<House, Long> {
    List<House> findByOwner(User owner);
    List<House> findByDistrictContainingIgnoreCaseAndCityContainingIgnoreCase(String district, String city);
}


