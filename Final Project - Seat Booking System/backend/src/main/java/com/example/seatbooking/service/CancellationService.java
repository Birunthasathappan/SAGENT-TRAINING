package com.example.seatbooking.service;

import com.example.seatbooking.entity.Cancellation;
import com.example.seatbooking.entity.Cancellation.Status;
import com.example.seatbooking.repository.CancellationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CancellationService {

    private final CancellationRepository cancellationRepository;
    private final EmailService emailService;

    public CancellationService(CancellationRepository cancellationRepository,
                               EmailService emailService) {
        this.cancellationRepository = cancellationRepository;
        this.emailService = emailService;
    }

    @Transactional
    public Cancellation createCancellation(Cancellation cancellation) {
        Optional<Cancellation> existing = cancellationRepository
                .findByBooking_BookingIdAndStatus(
                        cancellation.getBooking().getBookingId(), Status.PENDING);

        Cancellation toSave;
        if (existing.isPresent()) {
            Cancellation old = existing.get();
            old.setReason(cancellation.getReason());
            old.setAmount(cancellation.getAmount());
            toSave = cancellationRepository.save(old);
        } else {
            cancellation.setStatus(Status.PENDING);
            toSave = cancellationRepository.save(cancellation);
        }

        // ✅ Send cancellation requested mail
        try {
            Cancellation fresh = cancellationRepository
                    .findByIdWithDetails(toSave.getCancellationId())
                    .orElse(toSave);
            emailService.sendCancellationMail(fresh.getBooking(), fresh.getReason());
        } catch (Exception e) {
            System.err.println("⚠️ Cancellation email skipped: " + e.getMessage());
        }

        return toSave;
    }

    @Transactional(readOnly = true)
    public List<Cancellation> getAllCancellations() {
        return cancellationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Cancellation> getCancellationById(Long id) {
        return cancellationRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Cancellation> getCancellationsByUser(Long userId) {
        return cancellationRepository.findByUser_UserId(userId);
    }

    @Transactional(readOnly = true)
    public List<Cancellation> getCancellationsByBooking(Long bookingId) {
        return cancellationRepository.findByBooking_BookingId(bookingId);
    }

    @Transactional(readOnly = true)
    public List<Cancellation> getCancellationsByStatus(Status status) {
        return cancellationRepository.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public List<Cancellation> getCancellationsByUserAndStatus(Long userId, Status status) {
        return cancellationRepository.findByUser_UserIdAndStatus(userId, status);
    }

    @Transactional
    public Cancellation updateStatus(Long id, Status status) {
        Cancellation existing = cancellationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cancellation not found with id: " + id));
        existing.setStatus(status);
        Cancellation saved = cancellationRepository.save(existing);

        // ✅ Send approved or rejected mail to user
        try {
            Cancellation fresh = cancellationRepository
                    .findByIdWithDetails(saved.getCancellationId())
                    .orElse(saved);

            if (status == Status.APPROVED) {
                emailService.sendCancellationApprovedMail(fresh.getBooking(), fresh.getAmount().doubleValue());
                System.out.println("✅ Approved mail sent to: " + fresh.getBooking().getUser().getEmail());
            } else if (status == Status.REJECTED) {
                emailService.sendCancellationRejectedMail(fresh.getBooking(), fresh.getReason());
                System.out.println("✅ Rejected mail sent to: " + fresh.getBooking().getUser().getEmail());
            }
        } catch (Exception e) {
            System.err.println("⚠️ Status update email skipped: " + e.getMessage());
        }

        return saved;
    }

    @Transactional
    public Cancellation updateCancellation(Long id, Cancellation updatedCancellation) {
        Cancellation existing = cancellationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cancellation not found with id: " + id));
        existing.setReason(updatedCancellation.getReason());
        existing.setAmount(updatedCancellation.getAmount());
        existing.setStatus(updatedCancellation.getStatus());
        return cancellationRepository.save(existing);
    }

    @Transactional
    public void deleteCancellation(Long id) {
        if (!cancellationRepository.existsById(id)) {
            throw new RuntimeException("Cancellation not found with id: " + id);
        }
        cancellationRepository.deleteById(id);
    }
}