package com.lumera.academy.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @Size(min = 1, max = 50, message = "First name must be between 1 and 50 characters")
    private String firstName;

    @Size(min = 1, max = 50, message = "Last name must be between 1 and 50 characters")
    private String lastName;

    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phone;

    @Size(max = 2000, message = "Bio must not exceed 2000 characters")
    private String bio;

    @Size(max = 100, message = "Specialty must not exceed 100 characters")
    private String specialty;

    @Size(max = 200, message = "Website URL must not exceed 200 characters")
    private String website;

    @Size(max = 100, message = "Instagram handle must not exceed 100 characters")
    private String instagram;

    private String timezone;
}
