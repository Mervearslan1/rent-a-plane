package com.example.rentaplane.module.aircraft;

import com.example.rentaplane.common.exception.AircraftNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;


@Service

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
                .orElseThrow(() -> new AircraftNotFoundException(id));
    }
}
