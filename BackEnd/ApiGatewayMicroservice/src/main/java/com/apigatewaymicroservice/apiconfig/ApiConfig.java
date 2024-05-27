package com.apigatewaymicroservice.apiconfig;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApiConfig {
	
    // Configures custom route locator for API gateway
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            // Route for accessing doctor-related endpoints
            .route("HospitalManagementService Doctor", r -> r
                .path("/doctor/**")
                .uri("http://localhost:8061"))
            // Route for accessing patient-related endpoints
            .route("HospitalManagementService Patient", r -> r
                .path("/patient/**")
                .uri("http://localhost:8061"))
            // Route for accessing appointment-related endpoints
            .route("HospitalManagementService Appointment", r -> r
                .path("/appointment/**")
                .uri("http://localhost:8061"))
            // Route for accessing doctor availability-related endpoints
            .route("HospitalManagementService Doctor Availability", r -> r
                .path("/doctorAvailability/**")
                .uri("http://localhost:8061"))
            .build();
    }
}
