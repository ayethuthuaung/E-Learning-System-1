
package com.ai.e_learning.dto;

import com.ai.e_learning.service.CourseModuleService;
import com.ai.e_learning.service.CourseService;
import com.ai.e_learning.service.UserCourseService;
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
import java.util.stream.Collectors;

@Component
public class ExcelExporter {

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
        for (CourseDto course : courses) {
            // Student details rows
            List<UserCourseDto> courseUserCourses = userCourses.stream()
                    .filter(userCourse -> userCourse.getCourse().getId().equals(course.getId()))
                    .collect(Collectors.toList());

            for (UserCourseDto userCourse : courseUserCourses) {
                Row row = sheet.createRow(rowCount++);
                createStudentCells(row, userCourse, course, formatter, workbook);
            }
        }

        for (int i = 0; i < 10; i++) { // Adjust the loop limit to account for all columns
            sheet.autoSizeColumn(i);
        }

        // Set content type and header for the response
        response.setContentType("application/octet-stream");
        String currentDateTime = java.time.LocalDateTime.now().toString().replace(":", "-");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=students_" + currentDateTime + ".xls";
        response.setHeader(headerKey, headerValue);

        // Write workbook to the response output stream
        ServletOutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);
        workbook.close();

        outputStream.close();
    }

    private void createHeaderCells(Row headerRow, CellStyle style) {
        Cell cell = headerRow.createCell(0);
        cell.setCellValue("Name");
        cell.setCellStyle(style);

        cell = headerRow.createCell(1);
        cell.setCellValue("Email");
        cell.setCellStyle(style);

        cell = headerRow.createCell(2);
        cell.setCellValue("Status");
        cell.setCellStyle(style);

        cell = headerRow.createCell(3);
        cell.setCellValue("Team");
        cell.setCellStyle(style);

        cell = headerRow.createCell(4);
        cell.setCellValue("Department");
        cell.setCellStyle(style);

        cell = headerRow.createCell(5);
        cell.setCellValue("Division");
        cell.setCellStyle(style);

        cell = headerRow.createCell(6);
        cell.setCellValue("Course Name");
        cell.setCellStyle(style);

        cell = headerRow.createCell(7);
        cell.setCellValue("Course Level");
        cell.setCellStyle(style);

        cell = headerRow.createCell(8);
        cell.setCellValue("Course Duration");
        cell.setCellStyle(style);

        cell = headerRow.createCell(9);
        cell.setCellValue("Completion Percentage");
        cell.setCellStyle(style);
    }

    private void createStudentCells(Row row, UserCourseDto userCourse, CourseDto course, DateTimeFormatter formatter, HSSFWorkbook workbook) {
        UserDto user = new UserDto(userCourse.getUser());
        Long userId = userCourse.getUser().getId(); // Ensure you fetch the correct user ID

        Cell cell = row.createCell(0);
        cell.setCellValue(userCourse.getUser().getName());

        cell = row.createCell(1);
        cell.setCellValue(userCourse.getUser().getEmail());

        cell = row.createCell(2);
        cell.setCellValue(userCourse.getStatus());

        cell = row.createCell(3);
        cell.setCellValue(userCourse.getUser().getTeam());

        cell = row.createCell(4);
        cell.setCellValue(userCourse.getUser().getDepartment());

        cell = row.createCell(5);
        cell.setCellValue(userCourse.getUser().getDivision());

        cell = row.createCell(6);
        cell.setCellValue(course.getName());

        cell = row.createCell(7);
        cell.setCellValue(course.getLevel());

        cell = row.createCell(8);
        cell.setCellValue(course.getDuration());

        // Pass correct userId and courseId
        Double completionPercentage = courseModuleService.calculateCompletionPercentage(userId, course.getId());
        System.out.println("User ID: " + userId + ", Course ID: " + course.getId() + ", Completion Percentage: " + completionPercentage);
        cell = row.createCell(9);
        if (completionPercentage != null) {
            cell.setCellValue(completionPercentage / 100); // Adjust as needed based on the range of your completionPercentage
            CellStyle cellStyle = workbook.createCellStyle();
            cellStyle.setDataFormat(workbook.createDataFormat().getFormat("0.00%")); // Format as percentage
            cell.setCellStyle(cellStyle);
        } else {
            cell.setCellValue("N/A");
        }
    }

    private void wrapText(Cell cell, HSSFWorkbook workbook) {
        CellStyle cellStyle = workbook.createCellStyle();
        cellStyle.setWrapText(true);
        cell.setCellStyle(cellStyle);

        // Auto-size row height to fit the wrapped text
        Row row = cell.getRow();
        row.setHeight((short) -1); // Set row height to auto
    }
}


