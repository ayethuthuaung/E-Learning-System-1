package com.ai.e_learning.dto;

import com.ai.e_learning.model.Lesson;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@ToString
public class CourseModuleDto {
    private  Long id, lessonId;
    private String name,fileType;
    private Long createdAt;
    private Lesson lesson;
    private String file;
    private MultipartFile fileInput;
    private boolean done;

}
