package com.ai.e_learning.dto;

import com.ai.e_learning.service.CourseService;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class ExcelExporterForAdmin {

    @Autowired
    private CourseService courseService;

    public void exportAllCourses(HttpServletResponse response) throws IOException {
        // Fetch all courses
        List<CourseDto> courses = courseService.getAllCourseList();

        // Create a new workbook
        HSSFWorkbook workbook = new HSSFWorkbook();
        Sheet sheet = workbook.createSheet("All Courses");

        int rowCount = 0;

        // Create header row
        Row headerRow = sheet.createRow(rowCount++);
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);

        // Create header cells
        createHeaderCells(headerRow, style);

        // Date formatter
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // Iterate over courses and populate data rows
        for (CourseDto course : courses) {
            Row row = sheet.createRow(rowCount++);

            Cell cell = row.createCell(0);
            cell.setCellValue(course.getUser().getName()); // Assuming CourseDto contains instructor details

            cell = row.createCell(1);
            cell.setCellValue(course.getName());

            cell = row.createCell(2);
            cell.setCellValue(course.getLevel());

            cell = row.createCell(3);
            cell.setCellValue(course.getDuration());

            cell = row.createCell(4);
            cell.setCellValue(course.getDescription());

            // Convert createdAt timestamp to formatted date string
            LocalDateTime createdAt = LocalDateTime.ofInstant(Instant.ofEpochMilli(course.getCreatedAt()), ZoneId.systemDefault());
            cell = row.createCell(5);
            cell.setCellValue(createdAt.format(formatter));

            cell = row.createCell(6);
            cell.setCellValue(course.getStatus()); // Assuming CourseDto contains course status
        }

        // Auto size all columns
        for (int i = 0; i < 7; i++) {
            sheet.autoSizeColumn(i);
        }

        // Set content type and header for the response
        response.setContentType("application/octet-stream");
        String currentDateTime = java.time.LocalDateTime.now().toString().replace(":", "-");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=all_courses_" + currentDateTime + ".xls";
        response.setHeader(headerKey, headerValue);

        // Write workbook to the response output stream
        ServletOutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);
        workbook.close();

        outputStream.close();
    }

    private void createHeaderCells(Row headerRow, CellStyle style) {
        Cell cell = headerRow.createCell(0);
        cell.setCellValue("Instructor");
        cell.setCellStyle(style);

        cell = headerRow.createCell(1);
        cell.setCellValue("Course Name");
        cell.setCellStyle(style);

        cell = headerRow.createCell(2);
        cell.setCellValue("Course Level");
        cell.setCellStyle(style);

        cell = headerRow.createCell(3);
        cell.setCellValue("Course Duration");
        cell.setCellStyle(style);

        cell = headerRow.createCell(4);
        cell.setCellValue("Course Description");
        cell.setCellStyle(style);

        cell = headerRow.createCell(5);
        cell.setCellValue("Course Created AT");
        cell.setCellStyle(style);

        cell = headerRow.createCell(6);
        cell.setCellValue("Course Status");
        cell.setCellStyle(style);
    }
}
