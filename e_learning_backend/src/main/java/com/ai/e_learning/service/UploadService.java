package com.ai.e_learning.service;

import com.ai.e_learning.dto.ImageResponse;
import com.ai.e_learning.util.GoogleDriveJSONConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.security.GeneralSecurityException;

@Service
public class UploadService {

    public String getPathToGoogleCredentials() {
        return GoogleDriveJSONConnector.getPathToGoodleCredentials();
    }

    public ImageResponse uploadFileToDrive(File file, String contentType) throws GeneralSecurityException, IOException {
        return new GoogleDriveJSONConnector().uploadFileToDrive(file, contentType);
    }

//    public void uploadFile(MultipartFile file) {
//    }
}
