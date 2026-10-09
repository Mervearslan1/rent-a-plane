package com.example.rentaplane.module.booking;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

        import java.time.LocalDate;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestBody CreateBookingRequest request
    ) {
        Booking booking = bookingService.createBooking(
                request.aircraftId(),
                request.customerName(),
                request.startDate(),
                request.endDate()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(booking);
    }

    public record CreateBookingRequest(
            Long aircraftId,
            String customerName,
            LocalDate startDate,
            LocalDate endDate
    ) {
    }
}