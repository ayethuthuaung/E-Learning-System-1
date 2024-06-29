package com.ai.e_learning.service;

import com.ai.e_learning.dto.ChatMessage;
import com.ai.e_learning.model.ChatRoom;
import com.ai.e_learning.model.Message;
import com.ai.e_learning.model.Role;
import com.ai.e_learning.model.User;
import com.ai.e_learning.repository.ChatRoomRepository;
import com.ai.e_learning.repository.MessageRepository;
import com.ai.e_learning.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ChatService {
    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

//    @PostConstruct
//    public void init() {
//        createPrivateChatRoom();
//        createGroupChatRoom();
//    }
//
//    public void createPrivateChatRoom(){
//
//        ChatRoom chatRoom=new ChatRoom();
//        chatRoom.setName("private");
//        chatRoomRepository.save(chatRoom);
//
//    }
//    public void createGroupChatRoom(){
//        ChatRoom chatRoom1=new ChatRoom();
//        chatRoom1.setName("group");
//        chatRoomRepository.save(chatRoom1);
//    }

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
        return chatMessage;
    }

    public List<Message> getChatHistory(Long chatRoomId) {
        if (chatRoomId == null) {
            throw new IllegalArgumentException("Chat room ID must not be null");
        }
        return messageRepository.findByChatRoomId(chatRoomId);
    }
    public List<User> getUserConversationList(Long userId) {
        return chatRoomRepository.findUsersByUserId(userId);
    }

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }
    // Fetch chat history for a specific chat room and user
    public List<Message> getChatHistoryForUser(Long chatRoomId, Long userId) {
        if (chatRoomId == null || userId == null) {
            throw new IllegalArgumentException("Chat room ID and User ID must not be null");
        }
        return messageRepository.findByChatRoomIdAndSenderId(chatRoomId, userId);
    }
}