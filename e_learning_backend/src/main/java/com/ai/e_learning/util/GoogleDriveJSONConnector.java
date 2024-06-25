package com.ai.e_learning.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.FileContent;
import com.google.api.client.json.gson.GsonFactory;
import com.ai.e_learning.dto.ImageResponse;
import org.springframework.stereotype.Service;
import com.google.api.client.http.FileContent;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.FileList;


@Service
public class GoogleDriveJSONConnector {

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String SERVICE_ACCOUNT_kEY_PATH = getPathToGoodleCredentials();

    public static String getPathToGoodleCredentials() {
        String currentDirectory = System.getProperty("user.dir");
        Path filePath = Paths.get(currentDirectory, "cred.json");
        return filePath.toString();
    }

    public ImageResponse uploadImageToDrive(File file, String contentType) throws GeneralSecurityException, IOException {
        ImageResponse imageResponse = new ImageResponse();
        try {
            String folderId = "1PHnnlrCQb2U-pNZM6Se4bUWVJWegE_mC";
            Drive drive = createDriveService();

            com.google.api.services.drive.model.File fileMetaData = new com.google.api.services.drive.model.File();
            fileMetaData.setName(file.getName());
            fileMetaData.setParents(Collections.singletonList(folderId));

            // Use the content type passed as a parameter
            FileContent mediaContent = new FileContent(contentType, file);
            com.google.api.services.drive.model.File uploadedFile = drive.files().create(fileMetaData, mediaContent)
                    .setFields("id")
                    .execute();

            String imageUrl = "https://drive.google.com/uc?export=view&id=" + uploadedFile.getId();
            System.out.println("IMAGE URL : " + imageUrl);

            imageResponse.setStatus(200);
            imageResponse.setMessage("Image Successfully Uploaded To Drive");
            imageResponse.setUrl(imageUrl);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            imageResponse.setStatus(500);
            imageResponse.setMessage(e.getMessage());
        }
        return imageResponse;
    }

    public Drive createDriveService() throws GeneralSecurityException, IOException {
        GoogleCredential credential = GoogleCredential.fromStream(new FileInputStream(SERVICE_ACCOUNT_kEY_PATH))
        .createScoped(Collections.singleton(DriveScopes.DRIVE));
        return new Drive.Builder(GoogleNetHttpTransport.newTrustedTransport(), JSON_FACTORY, credential).setApplicationName("Vinnet").build();
    }

    public String getImageUrl(String fileId) throws GeneralSecurityException, IOException {
        return "https://drive.google.com/uc?export=view&id=" + fileId;
    }

    public String getFileIdByName(String fileName) throws IOException, GeneralSecurityException {
        Drive drive = createDriveService();
        FileList result = drive.files().list()
                .setQ("name = '" + fileName + "'")
                .setSpaces("drive")
                .execute();
        List<com.google.api.services.drive.model.File> files = result.getFiles();
        if (files == null || files.isEmpty()) {
            throw new FileNotFoundException("File not found: " + fileName);
        } else {
            return files.get(0).getId();
        }
    }

    public String getFileThumbnailLink(String fileId) throws IOException, GeneralSecurityException {
        Drive drive = createDriveService();
        com.google.api.services.drive.model.File file = drive.files().get(fileId)
                .setFields("thumbnailLink")
                .execute();
                System.out.println(file.getThumbnailLink());
        return file.getThumbnailLink();
    }


    public String getFileDownloadUrl(String fileId) throws IOException, GeneralSecurityException {
        Drive drive = createDriveService();
        com.google.api.services.drive.model.File file = drive.files().get(fileId).execute();
        // String downloadUrl = "https://www.googleapis.com/drive/v3/files/" + fileId + "?alt=media&key=AIzaSyBlIIHs6WUewImsnizCuXDcaoR6sosq_FY";
        String downloadUrl = file.getThumbnailLink();
        return downloadUrl;
    }
    public ImageResponse uploadFileToDrive(File file, String contentType) throws GeneralSecurityException, IOException {
        ImageResponse imageResponse = new ImageResponse();
        try {
            String folderId = "1PHnnlrCQb2U-pNZM6Se4bUWVJWegE_mC";
            Drive drive = createDriveService();

            com.google.api.services.drive.model.File fileMetaData = new com.google.api.services.drive.model.File();
            fileMetaData.setName(file.getName());
            fileMetaData.setParents(Collections.singletonList(folderId));

            // Use the content type passed as a parameter
            FileContent mediaContent = new FileContent(contentType, file);
            com.google.api.services.drive.model.File uploadedFile = drive.files().create(fileMetaData, mediaContent)
                    .setFields("id")
                    .execute();

            String fileUrl = "https://drive.google.com/uc?export=view&id=" + uploadedFile.getId();
            System.out.println("FILE URL : " + fileUrl);

            imageResponse.setStatus(200);
            imageResponse.setMessage("File Successfully Uploaded To Drive");
            imageResponse.setUrl(fileUrl);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            imageResponse.setStatus(500);
            imageResponse.setMessage(e.getMessage());
        }
        return imageResponse;
    }

}