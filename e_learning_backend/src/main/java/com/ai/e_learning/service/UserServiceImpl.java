package com.ai.e_learning.service;

import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.dto.ImageResponse;
import com.ai.e_learning.dto.UserDto;
import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.Role;
import com.ai.e_learning.model.User;
import com.ai.e_learning.repository.RoleRepository;
import com.ai.e_learning.repository.UserRepository;
import com.ai.e_learning.util.DtoUtil;
import com.ai.e_learning.util.EntityUtil;
import com.ai.e_learning.util.GoogleDriveJSONConnector;
import com.ai.e_learning.util.Helper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.*;
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
    private final Helper helper;

    public void updateExcel(MultipartFile file) {
      if (ExcelUploadService.isValidExcelFile(file)) {
        try {
          List<User> insert_user = new ArrayList<>();
          List<User> users = ExcelUploadService.getUserDataFromExcel(file.getInputStream());

          // Fetch all users from the database
          List<User> allUsers = userRepository.findAll();

          // Convert the list of users from the Excel file to a set of staff IDs
          Set<String> uploadedStaffIds = users.stream()
            .map(User::getStaffId)
            .collect(Collectors.toSet());

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
                        user.setPhoto("userPhoto.png");
// add photo in this place
                        insert_user.add(user);
                    }

                }




          // Set the status of users not present in the uploaded file to "Inactive"
          for (User dbUser : allUsers) {
            if (!uploadedStaffIds.contains(dbUser.getStaffId()) && dbUser.getStatus().equalsIgnoreCase("Active")) {
              dbUser.setStatus("Inactive");
              insert_user.add(dbUser);
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
        try {
            GoogleDriveJSONConnector driveConnector = new GoogleDriveJSONConnector();
            String fileId = driveConnector.getFileIdByName(user.getPhoto());
            String thumbnailLink = driveConnector.getFileThumbnailLink(fileId);
            user.setPhoto(thumbnailLink);
        } catch (IOException | GeneralSecurityException e) {

        }
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
    @Override
    public UserDto getUserByStaffId(String staff_id){
      User user = userRepository.findUserByStaffId(staff_id);
      if (user == null)
        return null;
        try {
            GoogleDriveJSONConnector driveConnector = new GoogleDriveJSONConnector();
            String fileId = driveConnector.getFileIdByName(user.getPhoto());
            String thumbnailLink = driveConnector.getFileThumbnailLink(fileId);
            user.setPhoto(thumbnailLink);
        } catch (IOException | GeneralSecurityException e) {

        }
      return DtoUtil.map(user,UserDto.class,modelMapper);
    }



    @Override
    public UserDto getUserByEmail(String email) {
      User user = userRepository.findUserByEmail(email);
      return user != null ? new UserDto(user) : null;
    }

    @Override
    public int updatePassword(String email, String newPassword) {
    User user = userRepository.findUserByEmail(email);
    if (user == null) {
      return 0; // User not found
    }
    if (passwordEncoder.matches(newPassword, user.getPassword())) {
      return 2; // New password is the same as the old password
    }
    user.setPassword(passwordEncoder.encode(newPassword));
    userRepository.save(user);
    return 1; // Password updated successfully
  }

  @Override
  public boolean checkPassword(String oldPassword, String inputPassword) {
    if (oldPassword != inputPassword) {
      return false;
    } else
      return true;
  }


  private UserDto convertToDto(User user) {
        UserDto userDto = modelMapper.map(user, UserDto.class);
        return userDto;
    }

    @Override
    public void addAdmin() {
        Optional<Role> adminRoleOpt = roleRepository.findByName("ADMIN");
        Role adminRole;

        if (adminRoleOpt.isEmpty()) {
            adminRole = new Role();
            adminRole.setName("ADMIN");
            roleRepository.save(adminRole);
        } else {
            adminRole = adminRoleOpt.get();
        }

        User user = new User(
                1L,
                "11-11111",
                "Admin",
                "admin@gmail.com",
                11111L,
                "Admin",
                "HR",
                "Admin/HR",
                "Active",
                "userPhoto.png",
                passwordEncoder.encode("11111"),
                System.currentTimeMillis(),
                new HashSet<>(Collections.singletonList(adminRole)),
                null

        );

        userRepository.save(user);
    }

    @Override
    public ImageResponse uploadProfile(MultipartFile file,Long userId) throws IOException, GeneralSecurityException {
        User user = EntityUtil.getEntityById(userRepository, userId,"user");
        File tempFile = File.createTempFile(user.getName() + "_" + Helper.getCurrentTimestamp(), null);
        file.transferTo(tempFile);
        String imageUrl = helper.uploadImageToDrive(tempFile, "user");
        //boolean isUploaded = helper.uploadImageToDrive(tempFile);
       // return new GoogleDriveJSONConnector().uploadFileToDrive(file, contentType);
        user.setPhoto(tempFile.getName());
        userRepository.save(user);
        ImageResponse imageResponse = new ImageResponse();
        imageResponse.setStatus(200);
        imageResponse.setMessage("File Successfully Uploaded To Drive");
        GoogleDriveJSONConnector driveConnector = new GoogleDriveJSONConnector();
        String fileId = driveConnector.getFileIdByName(user.getPhoto());
        System.out.println("fileId"+fileId);
        String thumbnailLink = driveConnector.getFileThumbnailLink(fileId);
        imageResponse.setUrl(thumbnailLink);
        System.out.println("thumnailLink"+thumbnailLink);
        return imageResponse;
    }

}
