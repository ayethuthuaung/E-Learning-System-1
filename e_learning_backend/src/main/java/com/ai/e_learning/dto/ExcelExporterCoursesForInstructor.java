package com.ai.e_learning.dto;

import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.dto.UserCourseDto;
import com.ai.e_learning.service.CourseService;
import com.ai.e_learning.service.UserCourseService;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
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
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ExcelExporterCoursesForInstructor {

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserCourseService userCourseService;

    public void exportCoursesForInstructor(Long userId, HttpServletResponse response) throws IOException {
        // Fetch courses for the specific instructor
        List<CourseDto> courses = courseService.getCoursesByUserId(userId);

        // Fetch all user courses to calculate student count
        List<UserCourseDto> userCourses = userCourseService.getAllUserCourses();

        // Create a new workbook
        HSSFWorkbook workbook = new HSSFWorkbook();
        Sheet sheet = workbook.createSheet("Instructor Courses");

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
        int index = 1; // For numbering rows
        for (CourseDto course : courses) {
            Row row = sheet.createRow(rowCount++);

            Cell cell = row.createCell(0);
            cell.setCellValue(index++);

            cell = row.createCell(1);
            cell.setCellValue(course.getName());

            cell = row.createCell(2);
            cell.setCellValue(course.getLevel());

            cell = row.createCell(3);
            cell.setCellValue(course.getDuration());

            // Convert createdAt timestamp to formatted date string
            LocalDateTime createdAt = LocalDateTime.ofInstant(Instant.ofEpochMilli(course.getCreatedAt()), ZoneId.systemDefault());
            cell = row.createCell(4);
            cell.setCellValue(createdAt.format(formatter));

            cell = row.createCell(5);
            cell.setCellValue(course.getStatus()); // Assuming CourseDto contains course status

            // Calculate student count for the course
            long studentCount = userCourses.stream()
                    .filter(userCourse -> userCourse.getCourse().getId().equals(course.getId()))
                    .count();

            cell = row.createCell(8);
            cell.setCellValue(studentCount);

            // Populate additional fields from UserCourseDto
            List<UserCourseDto> courseUserCourses = userCourses.stream()
                    .filter(userCourse -> userCourse.getCourse().getId().equals(course.getId()))
                    .collect(Collectors.toList());

            // Request dates
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

            cell = row.createCell(6);
            cell.setCellValue(requestDates.toString());

            cell = row.createCell(7);
            cell.setCellValue(statusChangeDates.toString());
        }

        // Apply filter to the header row
        sheet.setAutoFilter(new CellRangeAddress(0, 0, 0, 8)); // Adjust range according to your columns

        // Auto size all columns
        for (int i = 0; i < 9; i++) {
            sheet.autoSizeColumn(i);
        }

        // Set content type and header for the response
        response.setContentType("application/vnd.ms-excel");
        String currentDateTime = java.time.LocalDateTime.now().toString().replace(":", "-");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=instructor_courses_" + currentDateTime + ".xls";
        response.setHeader(headerKey, headerValue);

        // Write workbook to the response output stream
        ServletOutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);
        workbook.close();

        outputStream.close();
    }

    private void createHeaderCells(Row headerRow, CellStyle style) {
        Cell cell = headerRow.createCell(0);
        cell.setCellValue("No");
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
        cell.setCellValue("Created Date");
        cell.setCellStyle(style);

        cell = headerRow.createCell(5);
        cell.setCellValue("Status");
        cell.setCellStyle(style);

        cell = headerRow.createCell(8);
        cell.setCellValue("Students");
        cell.setCellStyle(style);

        cell = headerRow.createCell(6);
        cell.setCellValue("Request Date");
        cell.setCellStyle(style);

        cell = headerRow.createCell(7);
        cell.setCellValue("Accept/Reject Date");
        cell.setCellStyle(style);
    }
}
