package com.ai.e_learning.service;

import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.dto.UserDto;
import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.Role;
import com.ai.e_learning.model.User;
import com.ai.e_learning.repository.RoleRepository;
import com.ai.e_learning.repository.UserRepository;
import com.ai.e_learning.util.DtoUtil;
import com.ai.e_learning.util.EntityUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final RoleRepository roleRepository;

    public void updateExcel(MultipartFile file) {
        if (ExcelUploadService.isValidExcelFile(file)) {
            try {
                List<User> insert_user = new ArrayList<>();
                List<User> users = ExcelUploadService.getUserDataFromExcel(file.getInputStream());
                for (User user : users) {
                    User update_user = userRepository.findUserByStaffId(user.getStaffId());
                    if (update_user != null) {
                        if (!update_user.getDivision().equalsIgnoreCase(user.getDivision())) {
                            update_user.setDivision(user.getDivision());
                        } else {
                            update_user.setDivision(update_user.getDivision());
                        }

                        if (!update_user.getName().equalsIgnoreCase(user.getName())) {
                            update_user.setName(user.getName());
                        } else {
                            update_user.setName(update_user.getName());
                        }

                        if (update_user.getDoorLogNo() != user.getDoorLogNo()) {
                            update_user.setDoorLogNo(user.getDoorLogNo());
                        } else {
                            update_user.setDoorLogNo(update_user.getDoorLogNo());
                        }

                        if (!update_user.getDepartment().equalsIgnoreCase(user.getDepartment())) {
                            update_user.setDepartment(user.getDepartment());
                        } else {
                            update_user.setDepartment(update_user.getDepartment());
                        }

                        if (!update_user.getTeam().equalsIgnoreCase(user.getTeam())) {
                            update_user.setTeam(user.getTeam());
                        } else {
                            update_user.setTeam(update_user.getTeam());
                        }

                        if (!update_user.getStatus().equalsIgnoreCase(user.getStatus())) {
                            update_user.setStatus(user.getStatus());
                        } else {
                            update_user.setStatus(update_user.getStatus());
                        }

                        if(update_user.getPassword().equalsIgnoreCase("")) {
                            update_user.setPassword(passwordEncoder.encode("123@dirace"));
                        }
                        // add for custom photo
//                        if(update_user.getPhoto().equals("")) {
//                            update_user.setPhoto(ImageUtil.convertImageToBase64("public/custom_image.png"));
//                        }

                        insert_user.add(update_user);
                    } else {
                        user.setPassword(passwordEncoder.encode("123@dirace"));
// add photo in this place
                        insert_user.add(user);
                    }

                }
                this.userRepository.saveAll(insert_user);
            } catch (IOException e) {
                throw new IllegalArgumentException("This file is not a valid excel file");
            }
        }
    }

    @Override
    public List<UserDto> getUsers() {
        List<User> userList = EntityUtil.getAllEntities(userRepository);
        if(userList==null)
            return null;
        return DtoUtil.mapList(userList, UserDto.class, modelMapper);
    }

    @Override
    public UserDto getCurrentUser(String staffId) {
        User user=userRepository.findUserByStaffId(staffId);
        return DtoUtil.map(user,UserDto.class,modelMapper);

    }

    @Override
    public List<UserDto> getAllUser() {
        List<User> allUsers = userRepository.findAll();
        return allUsers.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDto)
                .orElse(null);
    }

    @Override
    public UserDto updateUser(Long id, UserDto userDto) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    userDto.setId(existingUser.getId());
                    modelMapper.map(userDto, existingUser);

                    // Handle roles
                    Set<Role> roles = new HashSet<>();
                    for (Long roleId : userDto.getRoleIdList()) {
                        Role role = roleRepository.findById(roleId).orElseThrow(() -> new RuntimeException("Role not found"));
                        roles.add(role);
                    }
                    existingUser.setRoles(roles);

                    User updatedUser = userRepository.save(existingUser);
                    return convertToDto(updatedUser);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public void softDeleteUser(Long id) {
        userRepository.findById(id)
                .ifPresent(user -> {
                    user.setStatus("InActive");
                    userRepository.save(user);
                });
    }

    private UserDto convertToDto(User user) {
        UserDto userDto = modelMapper.map(user, UserDto.class);
        return userDto;
    }

}
