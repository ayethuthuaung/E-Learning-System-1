package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.AuthDto;
import com.ai.e_learning.dto.UserDto;
import com.ai.e_learning.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testLoginUser_Success() throws Exception {
        AuthDto authDto = new AuthDto();
        authDto.setStaffId("staff123");
        authDto.setPassword("password");

        UserDto userDto = new UserDto(); // Populate with test data
        userDto.setStaffId("staff123");

        Authentication authentication = new UsernamePasswordAuthenticationToken("staff123", "password");
        when(authenticationManager.authenticate(any(Authentication.class))).thenReturn(authentication);
        when(userService.getCurrentUser(anyString())).thenReturn(userDto);

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"staffId\": \"staff123\", \"password\": \"password\"}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.currentUser.staffId").value("staff123"));
    }

    @Test
    public void testLoginUser_Failure() throws Exception {
        AuthDto authDto = new AuthDto();
        authDto.setStaffId("staff123");
        authDto.setPassword("password");

        when(authenticationManager.authenticate(any(Authentication.class)))
                .thenThrow(new RuntimeException("Invalid credentials"));

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"staffId\": \"staff123\", \"password\": \"password\"}"))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized())
                .andExpect(MockMvcResultMatchers.jsonPath("$.error").value("Login failed: Invalid credentials"));
    }
}
