package com.ai.e_learning.dto;

import com.ai.e_learning.service.CourseModuleService;
import com.ai.e_learning.service.CourseService;
import com.ai.e_learning.service.UserCourseService;
import com.lowagie.text.*;
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
public class PDFExporter {

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserCourseService userCourseService;

    @Autowired
    private CourseModuleService courseModuleService;

    public void exportCoursesByInstructor(Long instructorId, HttpServletResponse response) throws IOException {
        // Fetch courses by instructor ID
        List<CourseDto> courses = courseService.getCoursesByUserId(instructorId);

        // Fetch user courses by instructor ID
        List<UserCourseDto> userCourses = userCourseService.getAllUserCourseByUserId(instructorId);

        // Create PDF document
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph("Courses and Students Report", titleFont);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);

        // Create a table with 12 columns
        PdfPTable table = new PdfPTable(12);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);

        // Create header cells
        createHeaderCells(table);

        // Date formatter
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // Iterate over courses and populate data rows
        int rowIndex = 1;  // Initialize row index for "No" column
        for (CourseDto course : courses) {
            // Student details rows
            List<UserCourseDto> courseUserCourses = userCourses.stream()
                    .filter(userCourse -> userCourse.getCourse().getId().equals(course.getId()))
                    .collect(Collectors.toList());

            for (UserCourseDto userCourse : courseUserCourses) {
                createStudentCells(table, userCourse, course, formatter, rowIndex++);
            }
        }

        document.add(table);
        document.close();

        // Set content type and header for the response
        response.setContentType("application/pdf");
        String currentDateTime = java.time.LocalDateTime.now().toString().replace(":", "-");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=courses_by_instructor_" + currentDateTime + ".pdf";
        response.setHeader(headerKey, headerValue);
    }

    private void createHeaderCells(PdfPTable table) {
        String[] headers = {"No", "Staff ID", "Course", "Email", "Team", "Department", "Division", "Progress", "Certificate", "Request Date", "Status", "Accept/Reject Date"};
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);

        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, font));
            table.addCell(cell);
        }
    }

    private void createStudentCells(PdfPTable table, UserCourseDto userCourse, CourseDto course, DateTimeFormatter formatter, int rowIndex) {
        Long userId = userCourse.getUser().getId(); // Ensure you fetch the correct user ID

        Font font = FontFactory.getFont(FontFactory.HELVETICA, 10);

        PdfPCell cell = new PdfPCell(new Phrase(String.valueOf(rowIndex), font));
        table.addCell(cell);

        cell = new PdfPCell(new Phrase(userCourse.getUser().getStaffId(), font));
        table.addCell(cell);

        cell = new PdfPCell(new Phrase(course.getName(), font));
        table.addCell(cell);

        cell = new PdfPCell(new Phrase(userCourse.getUser().getEmail(), font));
        table.addCell(cell);

        cell = new PdfPCell(new Phrase(userCourse.getUser().getTeam(), font));
        table.addCell(cell);

        cell = new PdfPCell(new Phrase(userCourse.getUser().getDepartment(), font));
        table.addCell(cell);

        cell = new PdfPCell(new Phrase(userCourse.getUser().getDivision(), font));
        table.addCell(cell);

        Double completionPercentage = courseModuleService.calculateCompletionPercentage(userId, course.getId());
        if (completionPercentage != null) {
            cell = new PdfPCell(new Phrase(String.format("%.2f%%", completionPercentage), font));
        } else {
            cell = new PdfPCell(new Phrase("N/A", font));
        }
        table.addCell(cell);

        cell = new PdfPCell(new Phrase(userCourse.isCompleted() ? "Available" : "Unavailable", font));
        table.addCell(cell);

        cell = new PdfPCell(new Phrase(formatter.format(LocalDateTime.ofInstant(Instant.ofEpochMilli(userCourse.getCreatedAt()), ZoneId.systemDefault())), font));
        table.addCell(cell);

        cell = new PdfPCell(new Phrase(userCourse.getStatus(), font));
        table.addCell(cell);

        if (userCourse.getStatusChangeTimestamp() != null) {
            cell = new PdfPCell(new Phrase(formatter.format(LocalDateTime.ofInstant(Instant.ofEpochMilli(userCourse.getStatusChangeTimestamp()), ZoneId.systemDefault())), font));
        } else {
            cell = new PdfPCell(new Phrase("N/A", font));
        }
        table.addCell(cell);
    }
}
