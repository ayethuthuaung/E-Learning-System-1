package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.ImageResponse;
import com.ai.e_learning.service.UploadService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Map;

@RestController
@RequestMapping("/api/fileUpload")
@AllArgsConstructor
public class FileUploadController {
    private final UploadService uploadService;

    @PostMapping("/uploadToDrive")
    public ResponseEntity<ImageResponse> handleFileUpload(@RequestParam("file") MultipartFile file) throws IOException, GeneralSecurityException {
        System.out.println(file.getContentType());
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new ImageResponse(400, "File is empty", null));
        }

        File tempFile = File.createTempFile("temp", null);
        file.transferTo(tempFile);

        // Get the original content type of the file
        String contentType = file.getContentType();

        ImageResponse imageResponse = uploadService.uploadFileToDrive(tempFile, contentType);
        tempFile.delete(); // Delete the temporary file after processing

        return ResponseEntity.status(imageResponse.getStatus()).body(imageResponse);
    }
}

