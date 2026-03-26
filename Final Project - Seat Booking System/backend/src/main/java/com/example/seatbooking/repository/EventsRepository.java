package com.example.seatbooking.repository;

import com.example.seatbooking.entity.Events;
import com.example.seatbooking.entity.Events.ShowStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventsRepository extends JpaRepository<Events, Long> {

    List<Events> findByCategory(String category);
    List<Events> findByGenre(String genre);
    List<Events> findByLanguage(String language);
    List<Events> findByShowStatus(ShowStatus showStatus);
    List<Events> findByOrganizer_UserId(Long organizerId);
    boolean existsByTitle(String title);
}