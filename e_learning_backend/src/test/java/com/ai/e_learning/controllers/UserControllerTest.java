package com.ai.e_learning.controllers;

import com.ai.e_learning.controllers.UserController;
import com.ai.e_learning.dto.ImageResponse;
import com.ai.e_learning.dto.UserDto;
import com.ai.e_learning.service.MailSenderService;
import com.ai.e_learning.service.OtpStoreService;
import com.ai.e_learning.service.UserCourseService;
import com.ai.e_learning.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private UserCourseService userCourseService;

    @MockBean
    private MailSenderService mailSenderService;

    @MockBean
    private OtpStoreService otpStoreService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testUploadUsers_Success() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "users.xlsx", "application/vnd.ms-excel", "some data".getBytes());

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/user/upload-user-data")
                        .file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.Message").value("User data upload and saved To Database successfully."));
    }

    @Test
    public void testGetAllUser_Success() throws Exception {
        UserDto user1 = new UserDto();
        user1.setEmail("test1@example.com");
        UserDto user2 = new UserDto();
        user2.setEmail("test2@example.com");

        when(userService.getUsers()).thenReturn(Arrays.asList(user1, user2));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isFound())
                .andExpect(jsonPath("$[0].email").value("test1@example.com"))
                .andExpect(jsonPath("$[1].email").value("test2@example.com"));
    }

    @Test
    public void testSendOTP_Success() throws Exception {
        UserDto user = new UserDto();
        user.setEmail("test@example.com");

        when(userService.getUserByEmail(anyString())).thenReturn(user);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/sendOTP")
                        .param("email", "test@example.com")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Send OTP..."));
    }

    @Test
    public void testMatchOTP_Success() throws Exception {
        when(otpStoreService.retrieveData()).thenReturn(123456);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/matchOTP")
                        .param("otp", "123456")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("OTP Match..."));
    }

    @Test
    public void testChangePassword_Success() throws Exception {
        when(userService.updatePassword(anyString(), anyString())).thenReturn(1);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/changePassword")
                        .param("newPassword", "newPass")
                        .param("email", "test@example.com")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password is updated."));
    }

    @Test
    public void testChangePasswordByStaffId_Success() throws Exception {
        when(userService.updatePasswordByStaffId(anyString(), anyString())).thenReturn(1);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/changePasswordByStaffId")
                        .param("newPassword", "newPass")
                        .param("staffId", "staff123")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password is updated."));
    }

    @Test
    public void testHandleFileUpload_Success() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "profile.png", "image/png", "some image data".getBytes());

        ImageResponse imageResponse = new ImageResponse(200, "File uploaded successfully", "url_to_image");
        when(userService.uploadProfile(any(MultipartFile.class), anyLong())).thenReturn(imageResponse);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/user/updateProfile")
                        .file(file)
                        .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.message").value("File uploaded successfully"));
    }

    @Test
    public void testCheckExamOwner_Success() throws Exception {
        when(userService.isExamOwner(anyLong(), anyLong())).thenReturn(true);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/checkExamOwner")
                        .param("examId", "1")
                        .param("userId", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(true));
    }

    @Test
    public void testGetUserById_Success() throws Exception {
        UserDto user = new UserDto();
        user.setEmail("test@example.com");

        when(userService.getUserById(anyLong())).thenReturn(user);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    public void testUpdateUser_Success() throws Exception {
        UserDto user = new UserDto();
        user.setEmail("updated@example.com");

        when(userService.updateUser(anyLong(), any(UserDto.class))).thenReturn(user);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/user/update/1")
                        .content("{\"email\":\"updated@example.com\"}")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("updated@example.com"));
    }

    @Test
    public void testSoftDeleteUser_Success() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/user/delete/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }
}
