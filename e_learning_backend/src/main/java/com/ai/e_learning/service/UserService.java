package com.ai.e_learning.service;


import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.dto.ImageResponse;
import com.ai.e_learning.dto.UserDto;
import com.ai.e_learning.model.User;
import com.ai.e_learning.model.UserCourse;
import com.ai.e_learning.repository.UserRepository;
import com.ai.e_learning.util.DtoUtil;
import com.ai.e_learning.util.EntityUtil;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.List;

public interface UserService {
    void updateExcel(MultipartFile file);
    List<UserDto> getUsers();
    UserDto getCurrentUser(String staffId);
    List<UserDto> getAllUser();
    UserDto getUserById(Long id);
    UserDto updateUser(Long id, UserDto userDto);
    void softDeleteUser(Long id);
    UserDto getUserByStaffId(String staff_id);
    UserDto getUserByEmail(String email);
    int updatePassword(String email, String newPassword);
    boolean checkPassword(String oldPassword, String inputPassword);

    void addAdmin();

    ImageResponse uploadProfile(MultipartFile file, Long userId) throws IOException, GeneralSecurityException;
}
