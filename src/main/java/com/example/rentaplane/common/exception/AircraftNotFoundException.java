package com.example.rentaplane.common.exception;

public class AircraftNotFoundException extends RuntimeException {
    public AircraftNotFoundException(Long id) {
        super("Aircraft not found with id: " + id);

    }
}
