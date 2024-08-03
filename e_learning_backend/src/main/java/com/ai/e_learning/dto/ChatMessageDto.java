package com.ai.e_learning.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor

//@JsonIgnoreProperties(ignoreUnknown = true)
public class ChatMessageDto {
    private Long id;
    private Long chatRoomId;
    private Long senderId;
    private String content;
    private  String message_side;
    private String sessionId;
    private Long timestamp;
    private boolean softDeleted,showDropdown;
//    private MultipartFile file;
    private String fileUrl;
    private String messageType;
    private  boolean isRead;

    // Getters and setters
}
