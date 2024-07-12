package com.ai.e_learning.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChatMessageDto {
    private Long chatRoomId;
    private Long senderId;
    private String content;
    private  String message_side;
    private String sessionId;
    private Long timestamp;
    private boolean softDeleted;
    private String voiceMessageUrl;

    // Getters and setters
}
