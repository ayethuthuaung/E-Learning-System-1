package com.ai.e_learning.dto;

import com.ai.e_learning.model.Lesson;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Getter
@Setter
@ToString
public class CourseModuleDto {
    private  Long id;
    private String name,fileType;
    private Long createdAt;
    private Set<Lesson> lessons;
    private String file;
    private MultipartFile fileInput;

}
