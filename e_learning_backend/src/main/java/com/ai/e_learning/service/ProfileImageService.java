package com.ai.e_learning.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

public class ProfileImageService {
  public static String generateStringOfImage(byte[] imgSrc) {
    if (imgSrc == null) {
      return null;
    }
    return Base64.getEncoder().encodeToString(imgSrc);
  }

  public static byte[] convertStringToByteArray(String base64Image) {
    try {
      // Decode Base64 string to byte array
      return Base64.getDecoder().decode(base64Image);
    } catch (IllegalArgumentException e) {
      e.printStackTrace();
      return null; // Return null in case of error
    }
  }

  public static byte[] convertMultipartFileToByteArray(MultipartFile file) {
    try {
      return file.getBytes();
    } catch (IOException e) {
      e.printStackTrace();
      return null; // Return null in case of error
    }
  }
}
