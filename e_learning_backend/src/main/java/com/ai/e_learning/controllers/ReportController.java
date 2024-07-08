package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.Question_TypePDFExporter;
import com.ai.e_learning.model.Course;
import com.ai.e_learning.repository.CourseRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/report")
@CrossOrigin("*")
public class ReportController {

    @Autowired
    CourseRepository courseRepository;

    @GetMapping("/export")
    public void exportToPdf(HttpServletResponse response) throws IOException {
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");

        response.setContentType("application/pdf");
        String currentDateTime = dateFormatter.format(new Date());
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=courses_" + currentDateTime + ".pdf";

        response.setHeader(headerKey, headerValue);

        List<Course> courseList = courseRepository.findAll();

        Question_TypePDFExporter exporter = new Question_TypePDFExporter(courseList);

        exporter.export(response);
    }
}