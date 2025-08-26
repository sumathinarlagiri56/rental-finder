package com.rentalfinder.repository;

import com.rentalfinder.model.House;
import com.rentalfinder.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HouseRepository extends JpaRepository<House, Long> {
    List<House> findByOwner(User owner);
    List<House> findByDistrictAndCity(String district, String city);
    List<House> findByDistrict(String district);
    List<House> findByCity(String city);
    
    @Query("SELECT h FROM House h WHERE h.district = :district AND h.city = :city")
    List<House> searchByLocation(@Param("district") String district, @Param("city") String city);
    
    @Query("SELECT DISTINCT h.district FROM House h ORDER BY h.district")
    List<String> findAllDistricts();
    
    @Query("SELECT DISTINCT h.city FROM House h WHERE h.district = :district ORDER BY h.city")
    List<String> findCitiesByDistrict(@Param("district") String district);
} 