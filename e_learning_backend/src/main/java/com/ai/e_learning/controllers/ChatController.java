package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.ChatMessageDto;
import com.ai.e_learning.model.ChatRoom;
import com.ai.e_learning.model.User;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import com.ai.e_learning.model.Message;
import com.ai.e_learning.service.impl.ChatServiceImpl;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatServiceImpl chatServiceImpl;
    private final ModelMapper modelMapper;

    public ChatController(ChatServiceImpl chatServiceImpl, ModelMapper modelMapper) {
        this.chatServiceImpl = chatServiceImpl;
        this.modelMapper = modelMapper;
    }

    @PostMapping(value = "/create", produces = "application/json")
    public ResponseEntity<?> createChatRoom(@RequestParam(value = "instructorId") Long instructorId, @RequestParam(value = "studentId") Long studentId) {
        try {
            ChatRoom chatRoom = chatServiceImpl.getOrCreateChatRoom(instructorId, studentId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Create Chat Successfully");
            response.put("chatRoomId", chatRoom.getId());
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected Error Occurred");
        }
    }
    @GetMapping("/history/{chatRoomId}")
    public ResponseEntity<List<ChatMessageDto>> getChatHistory(@PathVariable Long chatRoomId) {
        List<Message> history = chatServiceImpl.getChatHistory(chatRoomId);
        List<ChatMessageDto> messages = history.stream()
                .map(message -> {
                    ChatMessageDto chatMessageDto = modelMapper.map(message, ChatMessageDto.class);
                    chatMessageDto.setMessage_side(message.getSender().getId().equals(message.getChatRoom().getParticipants().stream()
                            .filter(user -> !user.getId().equals(message.getSender().getId())).findFirst().get().getId()) ? "sender" : "receiver");
                    return chatMessageDto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok().body(messages);
    }
    @GetMapping("/conversation-list/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getConversationList(@PathVariable Long userId) {
        try {
            List<User> users = chatServiceImpl.getChatRoomsForUser(userId);
            List<Map<String, Object>> userDetails = users.stream()
                    .map(user -> {
                        Map<String, Object> userMap = new HashMap<>();
                        userMap.put("id", user.getId());
                        userMap.put("name", user.getName());
                        userMap.put("photoUrl", user.getPhoto());
                        Long chatRoomId = chatServiceImpl.getChatRoomIdForUsers(userId, user.getId());
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
        return chatServiceImpl.saveMessage(message);
    }
    @PostMapping("/uploadVoiceMessage")
    public ResponseEntity<String> uploadVoiceMessage(@RequestParam("voiceMessage") MultipartFile voiceMessage) {
        try {
            // Save the voice message file and get the URL
            System.out.println(voiceMessage);
            String fileUrl = chatServiceImpl.saveVoiceMessageFile(voiceMessage);

            return ResponseEntity.ok(fileUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/soft-delete/{messageId}")
    public ResponseEntity<?> softDeleteMessage(@PathVariable Long messageId) {
        try {
            chatServiceImpl.softDeleteMessage(messageId);
            return ResponseEntity.ok("Message soft deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting message");
        }
    }
}
