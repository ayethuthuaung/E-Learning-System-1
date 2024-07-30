package com.ai.e_learning.dto;

import com.ai.e_learning.service.CourseService;
import com.ai.e_learning.service.UserCourseService;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
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
import java.util.stream.Collectors;

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

            // Aggregate request dates and status change dates
            List<UserCourseDto> courseUserCourses = userCourses.stream()
                    .filter(userCourse -> userCourse.getCourse().getId().equals(course.getId()))
                    .collect(Collectors.toList());

            StringBuilder requestDates = new StringBuilder();
            StringBuilder statusChangeDates = new StringBuilder();
            for (UserCourseDto userCourse : courseUserCourses) {
                // Add request date
                LocalDateTime requestDate = LocalDateTime.ofInstant(Instant.ofEpochMilli(userCourse.getCreatedAt()), ZoneId.systemDefault());
                requestDates.append(requestDate.format(formatter)).append("\n");

                // Add accept/reject date if available
                if (userCourse.getStatusChangeTimestamp() != null) {
                    LocalDateTime statusChangeDate = LocalDateTime.ofInstant(Instant.ofEpochMilli(userCourse.getStatusChangeTimestamp()), ZoneId.systemDefault());
                    statusChangeDates.append(statusChangeDate.format(formatter)).append("\n");
                } else {
                    statusChangeDates.append("N/A\n");
                }
            }

            table.addCell(requestDates.toString().trim());
            table.addCell(course.getStatus()); // Assuming CourseDto contains course status
            table.addCell(statusChangeDates.toString().trim());

            // Calculate student count for the course
            long studentCount = courseUserCourses.size();
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

        cell = new PdfPCell(new Paragraph("Request Date"));
        table.addCell(cell);

        cell = new PdfPCell(new Paragraph("Status"));
        table.addCell(cell);

        cell = new PdfPCell(new Paragraph("Accept/Reject Date"));
        table.addCell(cell);

        cell = new PdfPCell(new Paragraph("Students"));
        table.addCell(cell);
    }
}
