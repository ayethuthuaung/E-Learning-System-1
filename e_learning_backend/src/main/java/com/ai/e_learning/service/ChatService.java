package com.ai.e_learning.service;

import com.ai.e_learning.dto.ChatMessageDto;
import com.ai.e_learning.model.ChatRoom;
import com.ai.e_learning.model.Message;
import com.ai.e_learning.model.User;

import java.util.List;

public interface ChatService {
    ChatMessageDto sendMessage(Long chatRoomId, Long senderId, String content, String sessionId);
    List<Message> getChatHistory(Long chatRoomId);
    Message saveMessage(Message message);
    List<User> getChatRoomsForUser(Long userId);
    Long getChatRoomIdForUsers(Long instructorId, Long studentId);
    ChatRoom getOrCreateChatRoom(Long instructorId, Long studentId);

}
