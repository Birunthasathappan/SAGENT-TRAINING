package com.example.seatbooking.repository;

import com.example.seatbooking.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {

    List<Venue> findByDistrict(String district);
    List<Venue> findByRegion(String region);
    boolean existsByVenueName(String venueName);
}