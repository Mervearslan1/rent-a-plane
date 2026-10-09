package com.example.rentaplane.module.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
}
