package com.ai.e_learning.dto;

import com.ai.e_learning.service.CourseService;
import com.ai.e_learning.service.UserCourseService;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class PdfExporterCoursesForInstructor {

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserCourseService userCourseService;

    public void exportCoursesForInstructor(Long userId, HttpServletResponse response) throws IOException, DocumentException {
        // Fetch courses for the specific instructor
        List<CourseDto> courses = courseService.getCoursesByUserId(userId);

        // Fetch all user courses to calculate student count
        List<UserCourseDto> userCourses = userCourseService.getAllUserCourses();

        // Create a new document
        Document document = new Document();
        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        // Add title
        document.add(new Paragraph("Instructor Courses Report"));

        // Create a table
        PdfPTable table = new PdfPTable(8); // Number of columns
        table.setWidthPercentage(100);

        // Add table headers
        addTableHeader(table);

        // Date formatter
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // Iterate over courses and populate table rows
        int index = 1; // For numbering rows
        for (CourseDto course : courses) {
            table.addCell(String.valueOf(index++));
            table.addCell(course.getName());
            table.addCell(course.getLevel());
            table.addCell(course.getDuration());
            table.addCell(course.getDescription());

            // Convert createdAt timestamp to formatted date string
            LocalDateTime createdAt = LocalDateTime.ofInstant(Instant.ofEpochMilli(course.getCreatedAt()), ZoneId.systemDefault());
            table.addCell(createdAt.format(formatter));

            table.addCell(course.getStatus()); // Assuming CourseDto contains course status

            // Calculate student count for the course
            long studentCount = userCourses.stream()
                    .filter(userCourse -> userCourse.getCourse().getId().equals(course.getId()))
                    .count();
            table.addCell(String.valueOf(studentCount));
        }

        document.add(table);
        document.close();
    }

    private void addTableHeader(PdfPTable table) {
        PdfPCell cell = new PdfPCell(new Paragraph("No"));
        table.addCell(cell);

        cell = new PdfPCell(new Paragraph("Course Name"));
        table.addCell(cell);

        cell = new PdfPCell(new Paragraph("Course Level"));
        table.addCell(cell);

        cell = new PdfPCell(new Paragraph("Course Duration"));
        table.addCell(cell);

        cell = new PdfPCell(new Paragraph("Course Description"));
        table.addCell(cell);

        cell = new PdfPCell(new Paragraph("Created Date"));
        table.addCell(cell);

        cell = new PdfPCell(new Paragraph("Status"));
        table.addCell(cell);

        cell = new PdfPCell(new Paragraph("Students"));
        table.addCell(cell);
    }
}
