package com.ai.e_learning.service;

import com.ai.e_learning.model.ChatRoom;
import com.ai.e_learning.model.Message;
import com.ai.e_learning.model.User;
import com.ai.e_learning.repository.ChatRoomRepository;
import com.ai.e_learning.repository.MessageRepository;
import com.ai.e_learning.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ChatService {
    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public ChatRoom createChatRoom(String name) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setName(name);
        return chatRoomRepository.save(chatRoom);
    }

    public Message sendMessage(Long chatRoomId, Long senderId, String content) {
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

        return messageRepository.save(message);
    }

    public List<Message> getChatHistory(Long chatRoomId) {
        return messageRepository.findByChatRoomId(chatRoomId);
    }

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }
}