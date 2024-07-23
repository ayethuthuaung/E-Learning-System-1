package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.ChatMessageDto;
import com.ai.e_learning.model.User;
import com.ai.e_learning.service.ChatService;
import com.ai.e_learning.service.impl.ChatServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.GeneralSecurityException;

@Controller
public class WebSocketChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatServiceImpl;

    @Autowired
    public WebSocketChatController(SimpMessagingTemplate messagingTemplate, ChatService chatServiceImpl) {
        this.messagingTemplate = messagingTemplate;
        this.chatServiceImpl = chatServiceImpl;
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessageDto sendMessage(@Payload ChatMessageDto chatMessageDto) throws GeneralSecurityException, IOException {
        return chatServiceImpl.sendMessage(chatMessageDto.getChatRoomId(), chatMessageDto.getSenderId(),
                chatMessageDto.getContent(), chatMessageDto.getFileUrl(),
                chatMessageDto.getMessageType(), chatMessageDto.getSessionId(),chatMessageDto.isRead());
    }


    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public User addUser(@Payload ChatMessageDto chatMessageDto) {
        // Logic to add user to chat room can be implemented here
        return null;
    }
}