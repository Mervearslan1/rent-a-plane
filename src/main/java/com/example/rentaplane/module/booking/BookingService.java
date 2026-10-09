package com.example.rentaplane.module.booking;

import com.example.rentaplane.common.exception.AircraftNotFoundException;
import com.example.rentaplane.module.aircraft.Aircraft;
import com.example.rentaplane.module.aircraft.AircraftRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final AircraftRepository aircraftRepository;

    public BookingService(
            BookingRepository bookingRepository,
            AircraftRepository aircraftRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.aircraftRepository = aircraftRepository;
    }

    @Transactional
    public Booking createBooking(
            Long aircraftId,
            String customerName,
            LocalDate startDate,
            LocalDate endDate
    ) {
        if (customerName == null || customerName.isBlank()) {
            throw new IllegalArgumentException(
                    "Customer name must not be empty"
            );
        }

        if (startDate == null || endDate == null
                || !endDate.isAfter(startDate)) {
            throw new IllegalArgumentException(
                    "End date must be after start date"
            );
        }

        Aircraft aircraft = aircraftRepository.findById(aircraftId)
                .orElseThrow(() ->
                        new AircraftNotFoundException(aircraftId));

        if (!Boolean.TRUE.equals(aircraft.getAvailable())) {
            throw new IllegalStateException(
                    "Aircraft is not available"
            );
        }

        Booking booking = new Booking(
                aircraft,
                customerName,
                startDate,
                endDate
        );

        return bookingRepository.save(booking);
    }
}