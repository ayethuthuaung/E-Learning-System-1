package com.ai.e_learning.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import com.ai.e_learning.model.Message;
import com.ai.e_learning.service.ChatService;

import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/create-room")
    public ResponseEntity<?> createChatRoom(@RequestBody String name) {
        // Logic to create a chat room
        return ResponseEntity.ok().build();
    }

    @GetMapping("/history/{chatRoomId}")
    public ResponseEntity<List<Message>> getChatHistory(@PathVariable Long chatRoomId) {
        // Logic to retrieve chat history
        List<Message> history = chatService.getChatHistory(chatRoomId);
        return ResponseEntity.ok(history);
    }

    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public Message sendMessage(Message message) {
        // Logic to handle sending a message
        return chatService.saveMessage(message);
    }
}
