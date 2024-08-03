package com.ai.e_learning.dto;

import com.ai.e_learning.service.CourseModuleService;
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
        int rowIndex = 1;  // Initialize row index for "No" column
        for (CourseDto course : courses) {
            // Student details rows
            List<UserCourseDto> courseUserCourses = userCourses.stream()
                    .filter(userCourse -> userCourse.getCourse().getId().equals(course.getId()))
                    .collect(Collectors.toList());

            for (UserCourseDto userCourse : courseUserCourses) {
                Row row = sheet.createRow(rowCount++);
                createStudentCells(row, userCourse, course, formatter, workbook, rowIndex++);
            }
        }

        // Apply auto-filter to the header row
        sheet.setAutoFilter(new CellRangeAddress(0, 0, 0, 12)); // Apply filter to the first row, covering columns 0 to 11

        for (int i = 0; i < 13; i++) { // Adjust the loop limit to account for all columns
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
        String[] headers = {"No", "Staff ID","Student", "Course", "Email", "Team", "Department", "Division", "Progress", "Certificate", "Request Date", "Status", "Accept/Reject Date"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(style);
        }
    }

    private void createStudentCells(Row row, UserCourseDto userCourse, CourseDto course, DateTimeFormatter formatter, HSSFWorkbook workbook, int rowIndex) {
        Long userId = userCourse.getUser().getId(); // Ensure you fetch the correct user ID

        Cell cell = row.createCell(0);
        cell.setCellValue(rowIndex);  // Row index as "No"

        cell = row.createCell(1);
        cell.setCellValue(userCourse.getUser().getStaffId());  // Add getter for Staff ID

        cell = row.createCell(2);
        cell.setCellValue(userCourse.getUser().getName());

        cell = row.createCell(3);
        cell.setCellValue(course.getName());

        cell = row.createCell(4);
        cell.setCellValue(userCourse.getUser().getEmail());  // Add getter for Email

        cell = row.createCell(5);
        cell.setCellValue(userCourse.getUser().getTeam());  // Add getter for Team

        cell = row.createCell(6);
        cell.setCellValue(userCourse.getUser().getDepartment());  // Add getter for Department

        cell = row.createCell(7);
        cell.setCellValue(userCourse.getUser().getDivision());  // Add getter for Division

        cell = row.createCell(8);
        Double completionPercentage = courseModuleService.calculateCompletionPercentage(userId, course.getId());
        if (completionPercentage != null) {
            cell.setCellValue(completionPercentage / 100); // Adjust as needed based on the range of your completionPercentage
            CellStyle cellStyle = workbook.createCellStyle();
            cellStyle.setDataFormat(workbook.createDataFormat().getFormat("0.00%")); // Format as percentage
            cell.setCellStyle(cellStyle);
        } else {
            cell.setCellValue("N/A");
        }

        cell = row.createCell(9);
        cell.setCellValue(userCourse.isCompleted() ? "Available" : "Unavailable");

        cell = row.createCell(10);
        cell.setCellValue(formatter.format(LocalDateTime.ofInstant(Instant.ofEpochMilli(userCourse.getCreatedAt()), ZoneId.systemDefault())));  // Convert createdAt to LocalDateTime

        cell = row.createCell(11);
        cell.setCellValue(userCourse.getStatus());

        cell = row.createCell(12); // Adjust cell index based on your layout
        if (userCourse.getStatusChangeTimestamp() != null) {
            cell.setCellValue(formatter.format(LocalDateTime.ofInstant(Instant.ofEpochMilli(userCourse.getStatusChangeTimestamp()), ZoneId.systemDefault())));
        } else {
            cell.setCellValue("N/A");
        }
    }
}
