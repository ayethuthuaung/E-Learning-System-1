package com.ai.e_learning.service;

import com.ai.e_learning.dto.ChatMessageDto;
import com.ai.e_learning.model.ChatRoom;
import com.ai.e_learning.model.Message;
import com.ai.e_learning.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

public interface ChatService {
    ChatMessageDto sendMessage(Long chatRoomId, Long senderId, String content, String file, String messageType, String sessionId,boolean read)throws IOException, GeneralSecurityException;
    List<Message> getChatHistory(Long chatRoomId);
    Message saveMessage(Message message);
    List<User> getChatRoomsForUser(Long userId);
    Long getChatRoomIdForUsers(Long instructorId, Long studentId);
    ChatRoom getOrCreateChatRoom(Long instructorId, Long studentId);
    void softDeleteMessage(Long messageId);
    long getUnreadMessageCount(Long chatRoomId, Long userId);

}
