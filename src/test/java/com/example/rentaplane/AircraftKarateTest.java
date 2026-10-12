
package com.example.rentaplane;

import io.karatelabs.junit6.Karate;
import org.junit.jupiter.api.DynamicNode;

class AircraftKarateTest {

    @Karate.Test
    Iterable<DynamicNode> aircraftApi() {
        return Karate.run(
                "classpath:karete/aircraft.feature"
        ).relativeTo(getClass());
    }
}

