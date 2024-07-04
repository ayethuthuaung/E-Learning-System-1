package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.ChatMessage;
import com.ai.e_learning.model.ChatRoom;
import com.ai.e_learning.model.User;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import com.ai.e_learning.model.Message;
import com.ai.e_learning.service.ChatService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final ModelMapper modelMapper;

    public ChatController(ChatService chatService,ModelMapper modelMapper) {
        this.chatService = chatService;
        this.modelMapper = modelMapper;
    }

    @PostMapping(value = "/create", produces = "application/json")
    public ResponseEntity<?> createChatRoom(@RequestParam(value = "instructorId") Long instructorId, @RequestParam(value = "studentId") Long studentId) {
        try {
            ChatRoom chatRoom = chatService.getOrCreateChatRoom(instructorId, studentId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Create Chat Successfully");
            response.put("chatRoomId", chatRoom.getId());
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected Error Occurred");
        }
    }
    @GetMapping("/history/{chatRoomId}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable Long chatRoomId) {
        List<Message> history = chatService.getChatHistory(chatRoomId);
        List<ChatMessage> messages = history.stream()
                .map(message -> {
                    ChatMessage chatMessage = modelMapper.map(message, ChatMessage.class);
                    chatMessage.setMessage_side(message.getSender().getId().equals(message.getChatRoom().getParticipants().stream()
                            .filter(user -> !user.getId().equals(message.getSender().getId())).findFirst().get().getId()) ? "sender" : "receiver");
                    return chatMessage;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok().body(messages);
    }
    @GetMapping("/conversation-list/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getConversationList(@PathVariable Long userId) {
        try {
            List<User> users = chatService.getChatRoomsForUser(userId);
            List<Map<String, Object>> userDetails = users.stream()
                    .map(user -> {
                        Map<String, Object> userMap = new HashMap<>();
                        userMap.put("id", user.getId());
                        userMap.put("name", user.getName());
                        userMap.put("photoUrl", user.getPhoto());
                        Long chatRoomId = chatService.getChatRoomIdForUsers(userId, user.getId());
                        userMap.put("chatRoomId", chatRoomId);
                        return userMap;
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(userDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public Message sendMessage(Message message) {
        // Logic to handle sending a message
        return chatService.saveMessage(message);
    }
}
