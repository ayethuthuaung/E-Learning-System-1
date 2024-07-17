package com.ai.e_learning.util;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public interface CloudinaryService {
    String uploadFile (MultipartFile multipartFile) throws IOException;
    String uploadVoice(MultipartFile multipartFile) throws IOException;

    String uploadVideo(MultipartFile multipartFile) throws IOException;
    Boolean deleteFile(String imgUrl);
    String getFileType(String fileId) throws Exception;

}