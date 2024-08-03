package com.ai.e_learning.dto;

import com.ai.e_learning.service.CourseService;
import com.ai.e_learning.service.UserCourseService;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
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

    @Autowired
    private UserCourseService userCourseService;

    public void exportAllCourses(HttpServletResponse response) throws IOException {
        // Fetch all courses
        List<CourseDto> courses = courseService.getAllCourseList();

        // Create a new workbook
        HSSFWorkbook workbook = new HSSFWorkbook();
        Sheet sheet = workbook.createSheet("Courses");

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
        int rowIndex = 1;  // Initialize row index for "No" column
        for (CourseDto course : courses) {
            Row row = sheet.createRow(rowCount++);
            createCourseCells(row, course, formatter, rowIndex++);
        }

        // Apply auto-filter to the header row
        sheet.setAutoFilter(new CellRangeAddress(0, 0, 0, 5)); // Apply filter to the first row, covering columns 0 to 5

        for (int i = 0; i < 6; i++) { // Adjust the loop limit to account for all columns
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
        String[] headers = {"No", "Course Name", "Course Level", "Course Duration", "Instructor", "Status"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(style);
        }
    }

    private void createCourseCells(Row row, CourseDto course, DateTimeFormatter formatter, int rowIndex) {
        Cell cell = row.createCell(0);
        cell.setCellValue(rowIndex);  // Row index as "No"

        cell = row.createCell(1);
        cell.setCellValue(course.getName());

        cell = row.createCell(2);
        cell.setCellValue(course.getLevel());

        cell = row.createCell(3);
        cell.setCellValue(course.getDuration());

        cell = row.createCell(4);
        cell.setCellValue(course.getUser().getName()); // Assuming CourseDto contains instructor details

        cell = row.createCell(5);
        cell.setCellValue(course.getStatus()); // Assuming CourseDto contains course status
    }
}
