package com.ai.e_learning.dto;

import com.ai.e_learning.dto.UserCourseDto;
import com.ai.e_learning.service.CourseService;
import com.ai.e_learning.service.CourseModuleService;
import com.ai.e_learning.service.UserCourseService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class PdfExporterAttendStudentForAdmin {

    @Autowired
    private UserCourseService userCourseService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private CourseModuleService courseModuleService;

    public void exportStudentList(HttpServletResponse response) throws IOException {
        List<UserCourseDto> userCourses = userCourseService.getAllAcceptedUserCourses();

        // Check if there are any user courses
        if (userCourses.isEmpty()) {
            response.setContentType("text/plain");
            response.getWriter().write("No user courses found.");
            return;
        }

        // Create a new document
        Document document = new Document();
        try {
            PdfWriter.getInstance(document, response.getOutputStream());
            document.open();

            // Set document title
            Paragraph title = new Paragraph("Attend Student List Report");
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            // Create a table with 12 columns
            PdfPTable table = new PdfPTable(13);
            table.setWidthPercentage(100);

            // Add table header
            String[] headers = {"No", "Staff ID","Student", "Course", "Email", "Team", "Department", "Division", "Progress", "Certificate", "Request Date", "Status", "Accept/Reject Date"};
            Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);

            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, font));
                table.addCell(cell);
            }

            // Format for dates
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            // Add table rows
            int rowIndex = 1;
            for (UserCourseDto userCourse : userCourses) {
                table.addCell(String.valueOf(rowIndex++)); // No
                table.addCell(userCourse.getUser().getStaffId()); // Staff ID
                table.addCell(userCourse.getUser().getName());
                table.addCell(userCourse.getCourse().getName()); // Course
                table.addCell(userCourse.getUser().getEmail()); // Email
                table.addCell(userCourse.getUser().getTeam()); // Team
                table.addCell(userCourse.getUser().getDepartment()); // Department
                table.addCell(userCourse.getUser().getDivision()); // Division

                // Progress as percentage
                Double completionPercentage = courseModuleService.calculateCompletionPercentage(userCourse.getUser().getId(), userCourse.getCourse().getId());
                table.addCell(completionPercentage != null ? String.format("%.2f%%", completionPercentage) : "N/A");

                // Certificate
                table.addCell(userCourse.isCompleted() ? "Available" : "Unavailable");

                // Request Date
                table.addCell(formatter.format(LocalDateTime.ofInstant(Instant.ofEpochMilli(userCourse.getCreatedAt()), ZoneId.systemDefault())));

                // Status
                table.addCell(userCourse.getStatus());

                // Accept/Reject Date
                table.addCell(userCourse.getStatusChangeTimestamp() != null ?
                        formatter.format(LocalDateTime.ofInstant(Instant.ofEpochMilli(userCourse.getStatusChangeTimestamp()), ZoneId.systemDefault())) :
                        "N/A");
            }

            // Add the table to the document
            document.add(table);

        } catch (Exception e) {
            throw new IOException("Error generating PDF document", e);
        } finally {
            document.close();
        }
    }
}
