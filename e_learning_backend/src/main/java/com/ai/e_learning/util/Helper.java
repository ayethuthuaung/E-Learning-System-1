package com.ai.e_learning.util;

import com.google.api.client.http.FileContent;
import com.google.api.services.drive.Drive;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Date;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class Helper {

    private final GoogleDriveJSONConnector googleDriveJSONConnector;

    public static String convertLongToLocalDate(Long milliseconds){
        if (milliseconds == null) {
            throw new IllegalArgumentException("Milliseconds cannot be null");
        }

        Instant instant = Instant.ofEpochMilli(milliseconds);
        LocalDate localDate = instant.atZone(ZoneId.systemDefault()).toLocalDate();
        return localDate.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
    }

  public static String generateOTPCode() {
    // Create an instance of the Random class
    Random random = new Random();

    // Define the range for a 6-digit number
    int min = 100000;
    int max = 999999;

    // Generate a 6-digit random number
    int randomNumber = random.nextInt(max - min + 1) + min;

    // Format the number to ensure it has 6 digits with leading zeros if necessary
    return String.format("%06d", randomNumber);
  }

    public static long getCurrentTimestamp() {
        Date createdAt = new Date();
        return createdAt.getTime();
    }


    public String uploadImageToDrive(File file, String folderName) throws GeneralSecurityException, IOException {
        String imageUrl = null;
       // boolean isUploaded = false;
        try {
            String folderId = null;
            if("user".equals(folderName)){
                 folderId = "1aiMK2NcdgIgCzJIwj-g_SEkFdEQfZOoC";
            }
            if("course".equals(folderName)){
                folderId = "1dvIGCGwgdeWUKKiC9H5qq5ZT_ZP77n7I";
            }
            if("module".equals(folderName)){
                folderId = "1SnpP8IX_YJea7dN6fGv-gf51XVbABNG7";
            }


            Drive drive = googleDriveJSONConnector.createDriveService();
            com.google.api.services.drive.model.File fileMetaData = new com.google.api.services.drive.model.File();
            fileMetaData.setName(file.getName());
            fileMetaData.setParents(Collections.singletonList(folderId));
            FileContent mediaContent = new FileContent("image/jpeg", file);
            com.google.api.services.drive.model.File uploadedFile = drive.files().create(fileMetaData, mediaContent).setFields("id").execute();
            System.out.println(uploadedFile.getName());
            imageUrl = uploadedFile.getId();
            //System.out.println("IMAGE URL : " + imageUrl);
            file.delete();
            //isUploaded = true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            //isUploaded = false;
            imageUrl=null;
        }
        return imageUrl;
    }



}
