package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.UserDto;
import com.ai.e_learning.service.MailSenderService;
import com.ai.e_learning.service.OtpStoreService;
import com.ai.e_learning.service.UserService;
import com.ai.e_learning.util.Helper;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@AllArgsConstructor
public class UserController {

  @Autowired
  private UserService userService;
  private MailSenderService mailSenderService;
  private OtpStoreService otpStoreService;

  @PostMapping ("/upload-user-data")
  public ResponseEntity<?> uploadUsers(@RequestParam("file") MultipartFile file) {
    if (file.isEmpty()) {
      return ResponseEntity.badRequest().body("File is empty");
    }
    System.out.println("hi");
    this.userService.updateExcel(file);
    return ResponseEntity.ok(Map.of("Message", "User data upload and saved To Database successfully."));
  }

  @GetMapping("/")
  public ResponseEntity<List<UserDto>> getAllUser() {

    return new ResponseEntity<>(userService.getUsers(), HttpStatus.FOUND);
  }

/*hello*/

  @PostMapping("/sendOTP")
  public ResponseEntity<Map<String, String>> sendOTP(@RequestParam("email") String email) {
    UserDto userDto = userService.getUserByEmail(email);

    Map<String, String> response = new HashMap<>();
    if (userDto == null) {
      response.put("message", "Invalid email, cannot be found with this email : " + email);
      return ResponseEntity.ok(response);
    }

    int otp_num = Integer.parseInt(Helper.generateOTPCode());
    mailSenderService.sendMail(email, "Reset Your Password for DIR-Learn", "This is your OTP num :" + otp_num);
    otpStoreService.storeData(otp_num);
    response.put("message", "Send OTP...");
    return ResponseEntity.ok(response);
  }


  @PostMapping("/matchOTP")
  public ResponseEntity<Map<String, String>> matchOTP(@RequestParam("otp") String otp) {
    int input_otp = Integer.parseInt(otp);
    int compare_otp = otpStoreService.retrieveData();
    Map<String, String> response = new HashMap<>();
    if (input_otp == compare_otp) {
      otpStoreService.clearData();
      response.put("message", "OTP Match...");
      return ResponseEntity.ok(response);
    }
    response.put("message", "Incorrect OTP...");
    return ResponseEntity.ok(response);
  }

  @PostMapping("/changePassword")
  public ResponseEntity<Map<String, String>> changePassword(@RequestParam("newPassword") String newPassword, @RequestParam("email") String email) {
    Map<String, String> response = new HashMap<>();
    int checkPassword = userService.updatePassword(email, newPassword);
    if (checkPassword == 0) {
      response.put("message", "User cannot be found.");
    } else if (checkPassword == 2) {
      response.put("message", "New password cannot be the same as the old password.");
    } else {
      response.put("message", "Password is updated.");
    }
    return ResponseEntity.ok(response);
  }


  @GetMapping(value = "/userList", produces = "application/json")
  public List<UserDto> displayUser(ModelMap model) {
    return userService.getAllUser()                                                                 ;

  }

  @GetMapping(value = "/{id}", produces = "application/json")
  public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
    UserDto userDto = userService.getUserById(id);
    if (userDto != null) {
      return ResponseEntity.ok(userDto);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @PutMapping(value = "/update/{id}", produces = "application/json")
  public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {

    UserDto updatedUser = userService.updateUser(id, userDto);

    if (updatedUser == null) {


      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(updatedUser);
  }

  @DeleteMapping(value = "/delete/{id}")
  public ResponseEntity<Void> softDeleteUser(@PathVariable Long id) {
    userService.softDeleteUser(id);
    return ResponseEntity.noContent().build();
  }

}

