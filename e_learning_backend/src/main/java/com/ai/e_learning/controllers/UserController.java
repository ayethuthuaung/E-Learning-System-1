package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.UserDto;
import com.ai.e_learning.model.User;
import com.ai.e_learning.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController

@RequestMapping("/addUser")
@AllArgsConstructor
public class UserController {


  private UserService userService;

  @PostMapping("/upload-user-data")
  public ResponseEntity<?> uploadUsers(@RequestParam("file") MultipartFile file) {
    if (file.isEmpty()) {
      return ResponseEntity.badRequest().body("File is empty");
    }
    System.out.println("hi");
    this.userService.updateExcel(file);
    return ResponseEntity.ok(Map.of("Message", "User data upload and saved To Database successfully."));
  }

  @GetMapping("/showData")
  public ResponseEntity<List<UserDto>> getAllUser() {
    return new ResponseEntity<>(userService.getUsers(), HttpStatus.FOUND);
  }
/*hello*/
}

