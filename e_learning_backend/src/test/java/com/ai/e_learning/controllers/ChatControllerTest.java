package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.ChatMessageDto;
import com.ai.e_learning.model.ChatRoom;
import com.ai.e_learning.model.Message;
import com.ai.e_learning.model.User;
import com.ai.e_learning.service.impl.ChatServiceImpl;
import com.ai.e_learning.util.CloudinaryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class ChatControllerTest {

    @Mock
    private ChatServiceImpl chatServiceImpl;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private CloudinaryService cloudinaryService;

    @InjectMocks
    private ChatController chatController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateChatRoom() throws Exception {
        Long instructorId = 1L;
        Long studentId = 2L;

        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setId(1L);
        when(chatServiceImpl.getOrCreateChatRoom(instructorId, studentId)).thenReturn(chatRoom);

        ResponseEntity<?> response = chatController.createChatRoom(instructorId, studentId);

        assertEquals(HttpStatus.ACCEPTED, response.getStatusCode());
        Map<String, Object> expectedResponse = new HashMap<>();
        expectedResponse.put("message", "Create Chat Successfully");
        expectedResponse.put("chatRoomId", chatRoom.getId());
        assertEquals(expectedResponse, response.getBody());
    }

    @Test
    public void testGetChatHistory() {
        Long chatRoomId = 1L;
        List<Message> messages = new ArrayList<>();
        Message message = new Message();
        User sender = new User();
        sender.setId(1L);
        message.setSender(sender);
        ChatRoom chatRoom = new ChatRoom();
        User receiver = new User();
        receiver.setId(2L);
        chatRoom.setParticipants((Set<User>) List.of(sender, receiver));
        message.setChatRoom(chatRoom);
        messages.add(message);
        when(chatServiceImpl.getChatHistory(chatRoomId)).thenReturn(messages);

        ChatMessageDto chatMessageDto = new ChatMessageDto();
        chatMessageDto.setMessage_side("sender");
        when(modelMapper.map(any(Message.class), any(Class.class))).thenReturn(chatMessageDto);

        ResponseEntity<List<ChatMessageDto>> response = chatController.getChatHistory(chatRoomId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals("sender", response.getBody().get(0).getMessage_side());
    }

    @Test
    public void testGetConversationList() {
        Long userId = 1L;
        List<User> users = new ArrayList<>();
        User user = new User();
        user.setId(2L);
        user.setName("Test User");
        user.setPhoto("test_photo_url");
        users.add(user);
        when(chatServiceImpl.getChatRoomsForUser(userId)).thenReturn(users);
        when(chatServiceImpl.getChatRoomIdForUsers(userId, user.getId())).thenReturn(1L);

        ResponseEntity<List<Map<String, Object>>> response = chatController.getConversationList(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals("Test User", response.getBody().get(0).get("name"));
        assertEquals("test_photo_url", response.getBody().get(0).get("photoUrl"));
    }

    @Test
    public void testSendMessage() {
        Message message = new Message();
        when(chatServiceImpl.saveMessage(message)).thenReturn(message);

        Message result = chatController.sendMessage(message);

        assertEquals(message, result);
    }

    @Test
    public void testUpdateMessageContent() {
        Long messageId = 1L;
        String newContent = "Updated content";
        Message message = new Message();
        when(chatServiceImpl.updateMessageContent(messageId, newContent)).thenReturn(message);

        ChatMessageDto chatMessageDto = new ChatMessageDto();
        when(modelMapper.map(message, ChatMessageDto.class)).thenReturn(chatMessageDto);

        ResponseEntity<?> response = chatController.updateMessageContent(messageId, newContent);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(chatMessageDto, response.getBody());
    }

    @Test
    public void testSoftDeleteMessage() {
        Long messageId = 1L;

        ResponseEntity<?> response = chatController.softDeleteMessage(messageId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testHandleFileUpload() throws Exception {
        MultipartFile file = null; // Mock your MultipartFile here
        String fileType = "image";
        when(cloudinaryService.uploadFile(file)).thenReturn("file_url");

        ResponseEntity<String> response = chatController.handleFileUpload(file, fileType);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("file_url", response.getBody());
    }

    @Test
    public void testMarkAllMessagesAsRead() {
        Long chatRoomId = 1L;

        ResponseEntity<Void> response = chatController.markAllMessagesAsRead(chatRoomId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
