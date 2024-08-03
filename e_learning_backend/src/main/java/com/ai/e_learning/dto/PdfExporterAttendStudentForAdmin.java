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

        // Create a new document in landscape orientation
        Document document = new Document(PageSize.TABLOID);
        try {
            PdfWriter.getInstance(document, response.getOutputStream());
            document.open();

            // Set document title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            Paragraph title = new Paragraph("Attend Student List Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            // Create a table with 13 columns
            PdfPTable table = new PdfPTable(13);
            table.setWidthPercentage(100);





            // Set relative column widths to make sure headers are wide enough
            float[] columnWidths = {1f, 1.5f, 2f, 2f, 2.5f, 1.5f, 2.7f, 2f, 2.5f, 2.5f, 2.5f, 1.9f, 2.5f};
            table.setWidths(columnWidths);

            // Add table header
            String[] headers = {"No", "Staff ID", "Student", "Course", "Email", "Team", "Department", "Division", "Progress", "Certificate", "Req Date", "Status", "Acc/Rej Date"};
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);

            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            // Format for dates
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            // Add table rows
            Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
            int rowIndex = 1;
            for (UserCourseDto userCourse : userCourses) {
                table.addCell(new PdfPCell(new Phrase(String.valueOf(rowIndex++), cellFont))); // No
                table.addCell(new PdfPCell(new Phrase(userCourse.getUser().getStaffId(), cellFont))); // Staff ID
                table.addCell(new PdfPCell(new Phrase(userCourse.getUser().getName(), cellFont))); // Student
                table.addCell(new PdfPCell(new Phrase(userCourse.getCourse().getName(), cellFont))); // Course
                table.addCell(new PdfPCell(new Phrase(userCourse.getUser().getEmail(), cellFont))); // Email
                table.addCell(new PdfPCell(new Phrase(userCourse.getUser().getTeam(), cellFont))); // Team
                table.addCell(new PdfPCell(new Phrase(userCourse.getUser().getDepartment(), cellFont))); // Department
                table.addCell(new PdfPCell(new Phrase(userCourse.getUser().getDivision(), cellFont))); // Division

                // Progress as percentage
                Double completionPercentage = courseModuleService.calculateCompletionPercentage(userCourse.getUser().getId(), userCourse.getCourse().getId());
                table.addCell(new PdfPCell(new Phrase(completionPercentage != null ? String.format("%.2f%%", completionPercentage) : "N/A", cellFont))); // Progress

                // Certificate
                table.addCell(new PdfPCell(new Phrase(userCourse.isCompleted() ? "Available" : "Unavailable", cellFont))); // Certificate

                // Request Date
                table.addCell(new PdfPCell(new Phrase(formatter.format(LocalDateTime.ofInstant(Instant.ofEpochMilli(userCourse.getCreatedAt()), ZoneId.systemDefault())), cellFont))); // Request Date

                // Status
                table.addCell(new PdfPCell(new Phrase(userCourse.getStatus(), cellFont))); // Status

                // Accept/Reject Date
                table.addCell(new PdfPCell(new Phrase(userCourse.getStatusChangeTimestamp() != null ?
                        formatter.format(LocalDateTime.ofInstant(Instant.ofEpochMilli(userCourse.getStatusChangeTimestamp()), ZoneId.systemDefault())) :
                        "N/A", cellFont))); // Accept/Reject Date
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
