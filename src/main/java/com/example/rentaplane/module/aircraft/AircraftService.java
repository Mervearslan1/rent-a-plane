package com.example.rentaplane.module.aircraft;

import com.example.rentaplane.common.exception.AircraftNotFoundException;

import java.util.List;

public class AircraftService {

    private final AircraftRepository aircraftRepository;

    public AircraftService(AircraftRepository aircraftRepository) {
        this.aircraftRepository = aircraftRepository;
    }

    public List<Aircraft> getAllAircraft() {
        return aircraftRepository.findAll();
    }

    public List<Aircraft> getAvailableAircraft() {
        return aircraftRepository.findByAvailableTrue();
    }

    public Aircraft getAircraftById(Long id) {
        return aircraftRepository.findById(id)
                .orElseThrow(() ->
                        new AircraftNotFoundException(id));
    }
}
