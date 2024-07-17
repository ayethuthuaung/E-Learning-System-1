package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.ChatMessageDto;
import com.ai.e_learning.model.ChatRoom;
import com.ai.e_learning.model.User;
import com.ai.e_learning.util.CloudinaryService;
import com.ai.e_learning.util.CloudinaryServiceImpl;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import com.ai.e_learning.model.Message;
import com.ai.e_learning.service.impl.ChatServiceImpl;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatServiceImpl chatServiceImpl;
    private final ModelMapper modelMapper;
    @Autowired
    private CloudinaryService cloudinaryService;

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
    @PutMapping("/update-message-content/{messageId}")
    public ResponseEntity<?> updateMessageContent(@PathVariable Long messageId, @RequestParam String newContent) {
        try {
            Message updatedMessage = chatServiceImpl.updateMessageContent(messageId, newContent);
            ChatMessageDto updatedMessageDto = modelMapper.map(updatedMessage, ChatMessageDto.class);
            return ResponseEntity.ok(updatedMessageDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating message content");
        }
    }

    @PutMapping("/soft-delete/{messageId}")
    public ResponseEntity<?> softDeleteMessage(@PathVariable Long messageId) {
        try {
            chatServiceImpl.softDeleteMessage(messageId);
            return ResponseEntity.ok().build(); // or return ResponseEntity.ok("Success");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting message");
        }
    }

    @PostMapping("/uploadFile")
    public ResponseEntity<String> handleFileUpload(@RequestParam("file") MultipartFile file,@RequestParam("fileType") String fileType) {
        try {
            String fileUrl=null;
            String messageType=fileType;
            if ("image".equalsIgnoreCase(messageType)) {
                fileUrl = cloudinaryService.uploadFile(file);
            } else if ("voice".equalsIgnoreCase(messageType)) {
                fileUrl = cloudinaryService.uploadVoice(file);
            } else if ("video".equalsIgnoreCase(messageType)) {
                fileUrl = cloudinaryService.uploadVideo(file);
            } else {
                throw new IllegalArgumentException("Unsupported message type: " + messageType);
            }

//            message.setFileUrl(fileUrl);
//            message.setContent(file.getOriginalFilename());
//            String fileUrl = cloudinaryService.uploadFile(file); // Implement this method to save the file and return its URL
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed");
        }
    }
}
