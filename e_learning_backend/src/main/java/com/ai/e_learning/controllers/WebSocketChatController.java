package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.ChatMessage;
import com.ai.e_learning.model.Message;
import com.ai.e_learning.model.User;
import com.ai.e_learning.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @Autowired
    public WebSocketChatController(SimpMessagingTemplate messagingTemplate, ChatService chatService) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        System.out.println(chatMessage.toString());
        return chatService.sendMessage(chatMessage.getChatRoomId(), chatMessage.getSenderId(), chatMessage.getContent(),chatMessage.getSessionId()); // Make sure message is serialized as JSON
    }


    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public User addUser(@Payload ChatMessage chatMessage) {
        // Logic to add user to chat room can be implemented here
        return null;
    }
}