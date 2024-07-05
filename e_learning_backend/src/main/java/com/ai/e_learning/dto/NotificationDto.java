package com.ai.e_learning.dto;

import com.ai.e_learning.model.Role;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class NotificationDto {
    private Long id;
    private String message;
    private String role;
    private boolean isRead ;
    private boolean isDeleted ;
}
