package com.ai.e_learning.util;

import com.cloudinary.Cloudinary;
import com.cloudinary.api.ApiResponse;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;
import java.io.IOException;
import java.util.Map;


@Service
public class CloudinaryServiceImpl implements CloudinaryService {
    @Autowired
    Cloudinary cloudinary;

    @Override
    public String uploadFile(MultipartFile multipartFile) throws IOException {
        return cloudinary.uploader().upload(multipartFile.getBytes(), Map.of("public_id", UUID.randomUUID().toString()))
                .get("url").toString();
    }
    @Override
    public String uploadVideo(MultipartFile multipartFile) throws IOException {
        // Generate a unique public ID for the video
        String publicId = "videos/" + UUID.randomUUID().toString();

        // Upload the video file to Cloudinary
        Map<String, Object> options = Map.of("resource_type", "video", "public_id", publicId);
        Map<String, Object> uploadResult = cloudinary.uploader().upload(multipartFile.getBytes(), options);

        // Extract and return the URL of the uploaded video
        return uploadResult.get("url").toString();
    }
    @Override
    public String uploadVoice(MultipartFile multipartFile) throws IOException {
        String publicId = "voice/" + UUID.randomUUID().toString();
        Map<String, Object> options = Map.of(
                "resource_type", "video",
                "public_id", publicId
        );
        Map<String, Object> uploadResult = cloudinary.uploader().upload(multipartFile.getBytes(), options);
        return uploadResult.get("url").toString();
    }

    @Override
    public Boolean deleteFile(String imgUrl) {
        try {
            String publicId = extractPublicId(imgUrl);

            cloudinary.uploader().destroy(publicId, null);

            return true; // Deletion successful
        } catch (Exception e) {
            e.printStackTrace(); // You might want to log the exception or handle it appropriately
            return false; // Deletion failed
        }
    }

    private String extractPublicId(String imgUrl) {
        int startIndex = imgUrl.lastIndexOf("/") + 1;
        int endIndex = imgUrl.lastIndexOf(".");
        return imgUrl.substring(startIndex, endIndex);
    }

    public String getFileType(String fileId) throws Exception {
        String publicId = extractPublicId(fileId);
        ApiResponse result = cloudinary.api().resource(publicId, ObjectUtils.emptyMap());
        return result.get("resource_type").toString();
    }


}