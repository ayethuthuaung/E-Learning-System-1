package com.ai.e_learning.dto;

import com.ai.e_learning.service.CourseService;
import com.ai.e_learning.service.UserCourseService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
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
public class PDFExporter {

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserCourseService userCourseService;

    public void exportCoursesByInstructor(Long instructorId, HttpServletResponse response) throws IOException {
        // Fetch courses by instructor ID
        List<CourseDto> courses = courseService.getCoursesByUserId(instructorId);

        // Fetch user courses by instructor ID
        List<UserCourseDto> userCourses = userCourseService.getAllUserCourseByUserId(instructorId);

        // Create PDF document
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        titleFont.setSize(18);

        Paragraph title = new Paragraph("Course Report", titleFont);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);

        writeCourseDetails(document, courses, userCourses);

        document.close();
    }

    private void writeCourseDetails(Document document, List<CourseDto> courses, List<UserCourseDto> userCourses) throws DocumentException {
        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setSize(12);

        // Date formatter
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        for (CourseDto course : courses) {
            String instructorName = course.getUser().getName();

            Paragraph instructorParagraph = new Paragraph("Instructor: " + instructorName, font);
            instructorParagraph.setAlignment(Paragraph.ALIGN_LEFT);
            document.add(instructorParagraph);

            Paragraph courseInfo = new Paragraph("Course Name: " + course.getName(), font);
            courseInfo.setAlignment(Paragraph.ALIGN_LEFT);
            document.add(courseInfo);

            LocalDateTime createdAt = LocalDateTime.ofInstant(Instant.ofEpochMilli(course.getCreatedAt()), ZoneId.systemDefault());
            Paragraph createdAtParagraph = new Paragraph("Created At: " + createdAt.format(formatter), font);
            createdAtParagraph.setAlignment(Paragraph.ALIGN_LEFT);
            document.add(createdAtParagraph);

            Paragraph courseLevel = new Paragraph("Course Level: " + course.getLevel(), font);
            courseLevel.setAlignment(Paragraph.ALIGN_LEFT);
            document.add(courseLevel);

            Paragraph courseDuration = new Paragraph("Course Duration: " + course.getDuration(), font);
            courseDuration.setAlignment(Paragraph.ALIGN_LEFT);
            document.add(courseDuration);

            Paragraph courseDescription = new Paragraph("Course Description: " + course.getDescription(), font);
            courseDescription.setAlignment(Paragraph.ALIGN_LEFT);
            document.add(courseDescription);

            // Calculate student count for the course
            long studentCount = userCourses.stream()
                    .filter(userCourse -> userCourse.getCourse().getId().equals(course.getId()))
                    .count();

            Paragraph studentCountParagraph = new Paragraph("Student Count: " + studentCount, font);
            studentCountParagraph.setAlignment(Paragraph.ALIGN_LEFT);
            document.add(studentCountParagraph);

            document.add(new Paragraph(" "));
        }
    }
}
