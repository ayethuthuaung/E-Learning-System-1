package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.dto.UserDto;
import com.ai.e_learning.model.User;
import com.ai.e_learning.service.UserService;
import lombok.AllArgsConstructor;
import org.apache.xmlbeans.impl.xb.xsdschema.Attribute;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@AllArgsConstructor
public class UserController {

  @Autowired
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

  @GetMapping("/")
  public ResponseEntity<List<UserDto>> getAllUser() {

    return new ResponseEntity<>(userService.getUsers(), HttpStatus.FOUND);
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

