package com.ai.e_learning.dto;

import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.User;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
public class CertificateDto {

    private Long id, userId, courseId;

    private User user;

    private Course course;

    private Long createdAt;

    private Date createdAtDate;

}
