package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.ChatMessageDto;
import com.ai.e_learning.model.ChatRoom;
import com.ai.e_learning.model.Message;
import com.ai.e_learning.model.User;
import com.ai.e_learning.repository.ChatRoomRepository;
import com.ai.e_learning.repository.MessageRepository;
import com.ai.e_learning.repository.UserRepository;
import com.ai.e_learning.util.CloudinaryService;
import com.ai.e_learning.util.EntityUtil;
import com.ai.e_learning.util.GoogleDriveJSONConnector;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

public class ChatServiceImplTest {

    @Mock
    private ChatRoomRepository chatRoomRepository;

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private GoogleDriveJSONConnector googleDriveJSONConnector;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Mock
    private CloudinaryService cloudinaryService;

    @InjectMocks
    private ChatServiceImpl chatServiceImpl;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSendMessage_TextMessage() throws IOException, GeneralSecurityException {
        Long chatRoomId = 1L;
        Long senderId = 1L;
        String content = "Hello";
        String file = null;
        String messageType = "text";
        String sessionId = "sessionId";
        boolean read = false;

        ChatRoom chatRoom = new ChatRoom();
        User sender = new User();
        sender.setId(senderId);

        when(chatRoomRepository.findById(chatRoomId)).thenReturn(Optional.of(chatRoom));
        when(userRepository.findById(senderId)).thenReturn(Optional.of(sender));

        Message savedMessage = new Message();
        savedMessage.setSender(sender);
        savedMessage.setChatRoom(chatRoom);
        savedMessage.setContent(content);
        savedMessage.setMessageType(messageType);
        savedMessage.setRead(read);

        when(messageRepository.save(any(Message.class))).thenReturn(savedMessage);

        ChatMessageDto chatMessageDto = new ChatMessageDto();
        chatMessageDto.setSessionId(sessionId);
        chatMessageDto.setMessage_side("sender");

        when(modelMapper.map(any(Message.class), eq(ChatMessageDto.class))).thenReturn(chatMessageDto);

        ChatMessageDto result = chatServiceImpl.sendMessage(chatRoomId, senderId, content, file, messageType, sessionId, read);

        assertEquals(chatMessageDto, result);
    }

    @Test
    public void testGetChatHistory() {
        Long chatRoomId = 1L;

        List<Message> messages = new ArrayList<>();
        when(messageRepository.findByChatRoomIdAndSoftDeletedFalse(chatRoomId)).thenReturn(messages);

        List<Message> result = chatServiceImpl.getChatHistory(chatRoomId);

        assertEquals(messages, result);
    }

    @Test
    public void testSaveMessage() {
        Message message = new Message();

        when(messageRepository.save(message)).thenReturn(message);

        Message result = chatServiceImpl.saveMessage(message);

        assertEquals(message, result);
    }

    @Test
    public void testGetChatRoomsForUser() {
        Long userId = 1L;
        User user = new User();
        user.setId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        List<User> usersInChatRooms = new ArrayList<>();
        usersInChatRooms.add(new User());
        usersInChatRooms.add(new User());

        when(chatRoomRepository.findUsersByUserId(userId)).thenReturn(usersInChatRooms);

        List<User> result = chatServiceImpl.getChatRoomsForUser(userId);

        assertEquals(usersInChatRooms.size() - 1, result.size()); // Exclude the current user
    }

    @Test
    public void testGetChatRoomIdForUsers() {
        Long instructorId = 1L;
        Long studentId = 2L;
        User instructor = new User();
        instructor.setId(instructorId);
        User student = new User();
        student.setId(studentId);

        when(userRepository.findById(instructorId)).thenReturn(Optional.of(instructor));
        when(userRepository.findById(studentId)).thenReturn(Optional.of(student));

        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setId(1L);
        when(chatRoomRepository.findByParticipants(instructor, student)).thenReturn(Optional.of(chatRoom));

        Long result = chatServiceImpl.getChatRoomIdForUsers(instructorId, studentId);

        assertEquals(chatRoom.getId(), result);
    }

    @Test
    public void testGetOrCreateChatRoom_ExistingChatRoom() {
        Long instructorId = 1L;
        Long studentId = 2L;
        User instructor = new User();
        User student = new User();

        when(userRepository.findById(instructorId)).thenReturn(Optional.of(instructor));
        when(userRepository.findById(studentId)).thenReturn(Optional.of(student));

        ChatRoom chatRoom = new ChatRoom();
        when(chatRoomRepository.findByParticipants(instructor, student)).thenReturn(Optional.of(chatRoom));

        ChatRoom result = chatServiceImpl.getOrCreateChatRoom(instructorId, studentId);

        assertEquals(chatRoom, result);
    }

    @Test
    public void testGetOrCreateChatRoom_NewChatRoom() {
        Long instructorId = 1L;
        Long studentId = 2L;
        User instructor = new User();
        User student = new User();

        when(userRepository.findById(instructorId)).thenReturn(Optional.of(instructor));
        when(userRepository.findById(studentId)).thenReturn(Optional.of(student));

        when(chatRoomRepository.findByParticipants(instructor, student)).thenReturn(Optional.empty());

        ChatRoom newChatRoom = new ChatRoom();
        when(chatRoomRepository.save(any(ChatRoom.class))).thenReturn(newChatRoom);

        ChatRoom result = chatServiceImpl.getOrCreateChatRoom(instructorId, studentId);

        assertEquals(newChatRoom, result);
    }

    @Test
    public void testSoftDeleteMessage() {
        Long messageId = 1L;
        Message message = new Message();

        when(messageRepository.findById(messageId)).thenReturn(Optional.of(message));

        chatServiceImpl.softDeleteMessage(messageId);

        assertEquals(true, message.isSoftDeleted());
    }

    @Test
    public void testUpdateMessageContent() {
        Long messageId = 1L;
        String newContent = "New Content";
        Message message = new Message();

        when(messageRepository.findById(messageId)).thenReturn(Optional.of(message));

        message.setContent(newContent);

        when(messageRepository.save(message)).thenReturn(message);

        Message result = chatServiceImpl.updateMessageContent(messageId, newContent);

        assertEquals(newContent, result.getContent());
    }

    @Test
    public void testMarkAllMessagesAsRead() {
        Long chatRoomId = 1L;

        List<Message> messages = new ArrayList<>();
        Message unreadMessage = new Message();
        unreadMessage.setRead(false);
        messages.add(unreadMessage);

        when(messageRepository.findByChatRoomIdAndSoftDeletedFalse(chatRoomId)).thenReturn(messages);

        chatServiceImpl.markAllMessagesAsRead(chatRoomId);

        assertEquals(true, unreadMessage.isRead());
    }
}
