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
import java.time.format.DateTimeFormatter;
import java.util.List;

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

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        titleFont.setSize(18);
        Paragraph title = new Paragraph("Courses and Students Report", titleFont);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);

        // Create a table with 7 columns
        PdfPTable table = new PdfPTable(7);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);

        // Create header cells
        createHeaderCells(table);

        // Date formatter
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // Iterate over courses and populate data rows
        for (CourseDto course : courses) {
            // Iterate over user courses for the current course
            for (UserCourseDto userCourse : userCourses) {
                if (userCourse.getCourse().getId().equals(course.getId())) {
                    // Directly retrieve user information from userCourse
                    String studentName = userCourse.getUser().getName();
                    String studentEmail = userCourse.getUser().getEmail();
                    String studentTeam = userCourse.getUser().getTeam();
                    String studentDivision = userCourse.getUser().getDivision();
                    String studentDepartment = userCourse.getUser().getDepartment();


                    // Add course and student details to the table
                    table.addCell(course.getName());
                    table.addCell(studentName);
                    table.addCell(studentEmail);
                    table.addCell(studentTeam);
                    table.addCell(studentDivision);
                    table.addCell(studentDepartment);

                    // Completion progress
                    Double completionPercentage = courseModuleService.calculateCompletionPercentage(userCourse.getUser().getId(), course.getId());
                    String completionProgress = (completionPercentage != null) ? String.format("%.2f%%", completionPercentage) : "N/A";
                    table.addCell(completionProgress);
                }
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
        PdfPCell cell = new PdfPCell();
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setSize(12);
        cell.setPhrase(new Phrase("Course Name", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Student Name", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Email", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Team", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Division", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Department", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Completion Progress", font));
        table.addCell(cell);
    }
}
