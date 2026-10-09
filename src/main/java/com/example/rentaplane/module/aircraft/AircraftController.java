package com.example.rentaplane.module.aircraft;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aircraft")
public class AircraftController {

    private final AircraftService aircraftService;

    public AircraftController(AircraftService aircraftService) {
        this.aircraftService = aircraftService;
    }
    @GetMapping
    public ResponseEntity<List<Aircraft>> getAllAircraft(
            @RequestParam(required = false) Boolean available
    ) {
        List<Aircraft> aircraft;

        if (Boolean.TRUE.equals(available)) {
            aircraft = aircraftService.getAvailableAircraft();
        } else {
            aircraft = aircraftService.getAllAircraft();
        }

        return ResponseEntity.ok(aircraft);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aircraft> getAircraftById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                aircraftService.getAircraftById(id)
        );
    }
}