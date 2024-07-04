package com.ai.e_learning.service;

import com.ai.e_learning.dto.ChatMessage;
import com.ai.e_learning.model.ChatRoom;
import com.ai.e_learning.model.Message;
import com.ai.e_learning.model.User;
import com.ai.e_learning.repository.ChatRoomRepository;
import com.ai.e_learning.repository.MessageRepository;
import com.ai.e_learning.repository.UserRepository;
import com.ai.e_learning.util.EntityUtil;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ChatService {
    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public ChatMessage sendMessage(Long chatRoomId, Long senderId, String content,String sessionId) {
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
        ChatMessage chatMessage = modelMapper.map(savedMessage, ChatMessage.class);
        chatMessage.setSessionId(sessionId);
        chatMessage.setMessage_side(senderId.equals(sender.getId()) ? "sender" : "receiver");
        return chatMessage;
    }

    public List<Message> getChatHistory(Long chatRoomId) {
        if (chatRoomId == null) {
            throw new IllegalArgumentException("Chat room ID must not be null");
        }
        return messageRepository.findByChatRoomId(chatRoomId);
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


}