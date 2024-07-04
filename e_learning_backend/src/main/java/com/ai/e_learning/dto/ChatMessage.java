package com.ai.e_learning.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ChatMessage {
    private Long chatRoomId;
    private Long senderId;
    private String content;
    private  String message_side;
    private String sessionId;
    private Long timestamp;

    // Getters and setters
}
