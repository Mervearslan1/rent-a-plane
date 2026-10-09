package com.example.rentaplane.module.aircraft;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AircraftRepository extends JpaRepository<Aircraft, Long> {
    List<Aircraft> findByAvailableTrue();
}
