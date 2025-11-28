package com.lumera.academy.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationPreferencesDTO {
    private boolean emailNotifications;
    private boolean classReminders;
    private boolean studentEnrollments;
    private boolean marketingEmails;
    private boolean weeklyDigest;
}
