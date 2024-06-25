package com.ai.e_learning.controllers;

import com.ai.e_learning.model.ChatRoom;
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

//    @PostMapping("/create-rooms")
//    public ResponseEntity<List<ChatRoom>> createChatRooms() {
//        List<ChatRoom> createdChatRooms = chatService.createChatRooms();
//        return ResponseEntity.ok(createdChatRooms);
//    }

//    @GetMapping("/history/{chatRoomId}")
//    public ResponseEntity<List<Message>> getChatHistory(@PathVariable Long chatRoomId) {
//        if (chatRoomId == null) {
//            return ResponseEntity.badRequest().body(null);
//        }
//        List<Message> history = chatService.getChatHistory(chatRoomId);
//        return ResponseEntity.ok(history);
//    }
@GetMapping("/conversation-list/{userId}")
public ResponseEntity<List<ChatRoom>> getUserConversationList(@PathVariable Long userId) {
    List<ChatRoom> conversationList = chatService.getUserConversationList(userId);
    return ResponseEntity.ok(conversationList);
}

    @GetMapping("/history/{chatRoomId}/{userId}")
    public ResponseEntity<List<Message>> getChatHistoryForUser(@PathVariable Long chatRoomId, @PathVariable Long userId) {
        List<Message> history = chatService.getChatHistoryForUser(chatRoomId, userId);
        return ResponseEntity.ok(history);
    }
    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public Message sendMessage(Message message) {
        // Logic to handle sending a message
        return chatService.saveMessage(message);
    }
}
