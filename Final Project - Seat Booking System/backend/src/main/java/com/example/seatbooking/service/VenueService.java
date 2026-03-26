package com.example.seatbooking.service;

import com.example.seatbooking.entity.Venue;
import com.example.seatbooking.repository.VenueRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class VenueService {

    private final VenueRepository venueRepository;

    public VenueService(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }

    public Venue createVenue(Venue venue) {
        if (venueRepository.existsByVenueName(venue.getVenueName())) {
            throw new RuntimeException("Venue already exists: " + venue.getVenueName());
        }
        return venueRepository.save(venue);
    }

    public List<Venue> getAllVenues() {
        return venueRepository.findAll();
    }

    public Optional<Venue> getVenueById(Long id) {
        return venueRepository.findById(id);
    }

    public List<Venue> getVenuesByDistrict(String district) {
        return venueRepository.findByDistrict(district);
    }

    public Venue updateVenue(Long id, Venue updatedVenue) {
        Venue existing = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));
        existing.setVenueName(updatedVenue.getVenueName());
        existing.setAddress(updatedVenue.getAddress());
        existing.setDistrict(updatedVenue.getDistrict());
        existing.setRegion(updatedVenue.getRegion());
        existing.setCapacity(updatedVenue.getCapacity());
        return venueRepository.save(existing);
    }

    public void deleteVenue(Long id) {
        if (!venueRepository.existsById(id)) {
            throw new RuntimeException("Venue not found with id: " + id);
        }
        venueRepository.deleteById(id);
    }
}