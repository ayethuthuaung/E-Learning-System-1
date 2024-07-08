package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.ChatMessageDto;
import com.ai.e_learning.model.ChatRoom;
import com.ai.e_learning.model.Message;
import com.ai.e_learning.model.User;
import com.ai.e_learning.repository.ChatRoomRepository;
import com.ai.e_learning.repository.MessageRepository;
import com.ai.e_learning.repository.UserRepository;
import com.ai.e_learning.service.ChatService;
import com.ai.e_learning.util.EntityUtil;
import com.ai.e_learning.util.GoogleDriveJSONConnector;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ChatServiceImpl implements ChatService {
    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final GoogleDriveJSONConnector googleDriveJSONConnector;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatMessageDto sendMessage(Long chatRoomId, Long senderId, String content, String sessionId) {
        System.out.println("chatRoomId: " + chatRoomId + " senderId: " + senderId + " content: " + content);
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found"));
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Message message = new Message();
        message.setContent(content);
        message.setTimestamp(System.currentTimeMillis());
        message.setSender(sender);
        message.setChatRoom(chatRoom);
        Message savedMessage = messageRepository.save(message);
        ChatMessageDto chatMessageDto = modelMapper.map(savedMessage, ChatMessageDto.class);
        chatMessageDto.setSessionId(sessionId);
        chatMessageDto.setMessage_side(senderId.equals(sender.getId()) ? "sender" : "receiver");
        return chatMessageDto;
    }
    @Override
    public ChatMessageDto sendVoiceMessage(Long chatRoomId, Long senderId, MultipartFile voiceMessage, String sessionId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found"));
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Save the voice message file
        String voiceMessageUrl;
        try {
            voiceMessageUrl = saveVoiceMessageFile(voiceMessage);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save voice message", e);
        }

        Message message = new Message();
        message.setContent("Voice message");
        message.setTimestamp(System.currentTimeMillis());
        message.setSender(sender);
        message.setChatRoom(chatRoom);
        message.setVoiceMessageUrl(voiceMessageUrl); // Set the voice message URL
        System.out.println(message);
        Message savedMessage = messageRepository.save(message);

        ChatMessageDto chatMessageDto = modelMapper.map(savedMessage, ChatMessageDto.class);
        chatMessageDto.setSessionId(sessionId);
        chatMessageDto.setMessage_side(senderId.equals(sender.getId()) ? "sender" : "receiver");

        // Send the chat message to WebSocket topic for real-time updates
        messagingTemplate.convertAndSend("/topic/messages", chatMessageDto);

        return chatMessageDto;
    }


    public String saveVoiceMessageFile(MultipartFile voiceMessage) throws GeneralSecurityException, IOException {
        InputStream inputStream = voiceMessage.getInputStream();
        String fileName = voiceMessage.getOriginalFilename();
        String contentType = voiceMessage.getContentType();

        String fileId = googleDriveJSONConnector.uploadVoiceMessageToDrive(inputStream, fileName, contentType);
        return googleDriveJSONConnector.getFileDownloadUrl(fileId);
    }
    public List<Message> getChatHistory(Long chatRoomId) {
        if (chatRoomId == null) {
            throw new IllegalArgumentException("Chat room ID must not be null");
        }
        return messageRepository.findByChatRoomIdAndSoftDeletedFalse(chatRoomId);
    }
    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }
    public List<User> getChatRoomsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Use the repository method to find users by user ID
        List<User> usersInChatRooms = chatRoomRepository.findUsersByUserId(userId);

        // Exclude the current user from the result list
        return usersInChatRooms.stream()
                .filter(participant -> !participant.getId().equals(userId))
                .collect(Collectors.toList());
    }

    public Long getChatRoomIdForUsers(Long instructorId, Long studentId) {
        User user1 = userRepository.findById(instructorId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        User user2 = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findByParticipants(user1, user2);

        if (chatRoomOptional.isPresent()) {
            return chatRoomOptional.get().getId();
        } else {
            throw new IllegalArgumentException("Chat room not found for users");
        }
    }
    public ChatRoom getOrCreateChatRoom(Long instructorId, Long studentId) {
        User instructor = EntityUtil.getEntityById(userRepository, instructorId, "Instructor");
        User student = EntityUtil.getEntityById(userRepository, studentId, "Student");

        Optional<ChatRoom> existingChatRoom = chatRoomRepository.findByParticipants(instructor, student);

        if (existingChatRoom.isPresent()) {
            return existingChatRoom.get();
        } else {
            ChatRoom chatRoom = new ChatRoom();
            chatRoom.setName("private");
            chatRoom.setParticipants(Set.of(instructor, student));
            return chatRoomRepository.save(chatRoom);
        }
    }
    public void softDeleteMessage(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found"));
        message.setSoftDeleted(true);
        messageRepository.save(message);
    }

}