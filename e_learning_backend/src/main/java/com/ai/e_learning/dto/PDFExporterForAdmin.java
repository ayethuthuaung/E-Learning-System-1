package com.ai.e_learning.dto;

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

@Component
public class PDFExporterForAdmin {

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserCourseService userCourseService;

    public void exportAllCourses(HttpServletResponse response) throws IOException {
        // Fetch all courses
        List<CourseDto> courses = courseService.getAllCourseList();

        // Create a PDF document
        Document document = new Document(PageSize.TABLOID);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        titleFont.setSize(18);
        Paragraph title = new Paragraph("All Courses Report", titleFont);
        title.setAlignment(Paragraph.ALIGN_CENTER);

        document.add(title);

        // Create a table with 6 columns
        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);

        // Create header cells
        createHeaderCells(table);

        // Date formatter
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // Iterate over courses and populate data rows
        int index = 1; // For numbering rows
        for (CourseDto course : courses) {
            table.addCell(String.valueOf(index++)); // Add row number

            table.addCell(course.getName());
            table.addCell(course.getLevel());
            table.addCell(course.getDuration());
            table.addCell(course.getUser().getName()); // Assuming CourseDto contains instructor details

            table.addCell(course.getStatus()); // Assuming CourseDto contains course status
        }

        document.add(table);
        document.close();

        // Set content type and header for the response
        response.setContentType("application/pdf");
        String currentDateTime = java.time.LocalDateTime.now().toString().replace(":", "-");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=all_courses_" + currentDateTime + ".pdf";
        response.setHeader(headerKey, headerValue);
    }

    private void createHeaderCells(PdfPTable table) {
        PdfPCell cell = new PdfPCell();
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setSize(12);
        cell.setPhrase(new Phrase("No", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Course Name", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Course Level", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Course Duration", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Instructor", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Status", font));
        table.addCell(cell);
    }
}
