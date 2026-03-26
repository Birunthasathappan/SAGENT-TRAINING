package com.example.seatbooking.service;

import com.example.seatbooking.dto.EventCreateDTO;
import com.example.seatbooking.entity.Events;
import com.example.seatbooking.entity.Events.ShowStatus;
import com.example.seatbooking.entity.User;
import com.example.seatbooking.repository.EventsRepository;
import com.example.seatbooking.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class EventsService {

    private final EventsRepository eventsRepository;
    private final UserRepository userRepository;

    public EventsService(EventsRepository eventsRepository, UserRepository userRepository) {
        this.eventsRepository = eventsRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Events createEvent(EventCreateDTO dto) {
        User organizer = userRepository.findById(dto.getOrganizerId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Organizer not found with id: " + dto.getOrganizerId()));

        Events event = Events.builder()
                .organizer(organizer)
                .title(dto.getTitle())
                .category(dto.getCategory())
                .genre(dto.getGenre())
                .description(dto.getDescription())
                .duration(dto.getDuration())
                .language(dto.getLanguage())
                .tag(dto.getTag())
                .showStatus(ShowStatus.valueOf(dto.getShowStatus()))
                .image(dto.getImage())
                .build();

        return eventsRepository.save(event);
    }

    // ✅ @Transactional ensures lazy-loaded organizer is accessible during serialization
    @Transactional(readOnly = true)
    public List<Events> getAllEvents() {
        return eventsRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Events> getEventById(Long id) {
        return eventsRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Events> getEventsByCategory(String category) {
        return eventsRepository.findByCategory(category);
    }

    @Transactional(readOnly = true)
    public List<Events> getEventsByGenre(String genre) {
        return eventsRepository.findByGenre(genre);
    }

    @Transactional(readOnly = true)
    public List<Events> getEventsByLanguage(String language) {
        return eventsRepository.findByLanguage(language);
    }

    @Transactional(readOnly = true)
    public List<Events> getEventsByStatus(ShowStatus status) {
        return eventsRepository.findByShowStatus(status);
    }

    @Transactional(readOnly = true)
    public List<Events> getEventsByOrganizer(Long organizerId) {
        return eventsRepository.findByOrganizer_UserId(organizerId);
    }

    @Transactional
    public Events updateEvent(Long id, EventCreateDTO dto) {
        Events existing = eventsRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Event not found with id: " + id));

        User organizer = userRepository.findById(dto.getOrganizerId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Organizer not found with id: " + dto.getOrganizerId()));

        existing.setOrganizer(organizer);
        existing.setTitle(dto.getTitle());
        existing.setCategory(dto.getCategory());
        existing.setGenre(dto.getGenre());
        existing.setDescription(dto.getDescription());
        existing.setDuration(dto.getDuration());
        existing.setLanguage(dto.getLanguage());
        existing.setTag(dto.getTag());
        existing.setShowStatus(ShowStatus.valueOf(dto.getShowStatus()));
        existing.setImage(dto.getImage());

        return eventsRepository.save(existing);
    }

    @Transactional
    public void deleteEvent(Long id) {
        if (!eventsRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found with id: " + id);
        }
        eventsRepository.deleteById(id);
    }
}