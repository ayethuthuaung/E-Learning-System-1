package com.ai.e_learning.dto;

import com.ai.e_learning.dto.UserCourseDto;
import com.ai.e_learning.service.CourseService;
import com.ai.e_learning.service.CourseModuleService;
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
public class ExcelExporterStudentListForAdmin {

    @Autowired
    private UserCourseService userCourseService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private CourseModuleService courseModuleService;

    public void exportStudentList(HttpServletResponse response) throws IOException {
        // Fetch all user courses
        List<UserCourseDto> userCourses = userCourseService.getAllUserCourses();

        // Debugging statement
        System.out.println("User Courses Retrieved: " + userCourses.size());

        if (userCourses.isEmpty()) {
            System.out.println("No user courses found.");
            return;
        }

        // Create a new workbook
        HSSFWorkbook workbook = new HSSFWorkbook();
        Sheet sheet = workbook.createSheet("Student List");

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

        // Iterate over user courses and populate data rows
        int rowIndex = 1;  // Initialize row index for "No" column
        for (UserCourseDto userCourse : userCourses) {
            Row row = sheet.createRow(rowCount++);
            createStudentCells(row, userCourse, formatter, workbook, rowIndex++);
        }

        // Apply auto-filter to the header row
        sheet.setAutoFilter(new CellRangeAddress(0, 0, 0, 11)); // Apply filter to the first row, covering columns 0 to 11

        for (int i = 0; i < 12; i++) { // Adjust the loop limit to account for all columns
            sheet.autoSizeColumn(i);
        }

        // Set content type and header for the response
        response.setContentType("application/octet-stream");
        String currentDateTime = java.time.LocalDateTime.now().toString().replace(":", "-");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=student_list_" + currentDateTime + ".xls";
        response.setHeader(headerKey, headerValue);

        // Write workbook to the response output stream
        try (ServletOutputStream outputStream = response.getOutputStream()) {
            workbook.write(outputStream);
        } finally {
            workbook.close();
        }
    }

    private void createHeaderCells(Row headerRow, CellStyle style) {
        String[] headers = {"No", "Staff ID", "Course", "Email", "Team", "Department", "Division", "Progress", "Certificate", "Request Date", "Status", "Accept/Reject Date"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(style);
        }
    }

    private void createStudentCells(Row row, UserCourseDto userCourse, DateTimeFormatter formatter, HSSFWorkbook workbook, int rowIndex) {
        Cell cell = row.createCell(0);
        cell.setCellValue(rowIndex);  // Row index as "No"

        cell = row.createCell(1);
        cell.setCellValue(userCourse.getUser().getStaffId());  // Add getter for Staff ID

        cell = row.createCell(2);
        cell.setCellValue(userCourse.getCourse().getName());  // Add getter for Course name

        cell = row.createCell(3);
        cell.setCellValue(userCourse.getUser().getEmail());  // Add getter for Email

        cell = row.createCell(4);
        cell.setCellValue(userCourse.getUser().getTeam());  // Add getter for Team

        cell = row.createCell(5);
        cell.setCellValue(userCourse.getUser().getDepartment());  // Add getter for Department

        cell = row.createCell(6);
        cell.setCellValue(userCourse.getUser().getDivision());  // Add getter for Division

        cell = row.createCell(7);
        Double completionPercentage = courseModuleService.calculateCompletionPercentage(userCourse.getUser().getId(), userCourse.getCourse().getId());
        if (completionPercentage != null) {
            cell.setCellValue(completionPercentage / 100); // Adjust as needed based on the range of your completionPercentage
            CellStyle cellStyle = workbook.createCellStyle();
            cellStyle.setDataFormat(workbook.createDataFormat().getFormat("0.00%")); // Format as percentage
            cell.setCellStyle(cellStyle);
        } else {
            cell.setCellValue("N/A");
        }

        cell = row.createCell(8);
        cell.setCellValue(userCourse.isCompleted() ? "Available" : "Unavailable");

        cell = row.createCell(9);
        cell.setCellValue(formatter.format(LocalDateTime.ofInstant(Instant.ofEpochMilli(userCourse.getCreatedAt()), ZoneId.systemDefault())));  // Convert createdAt to LocalDateTime

        cell = row.createCell(10);
        cell.setCellValue(userCourse.getStatus());

        cell = row.createCell(11);
        if (userCourse.getStatusChangeTimestamp() != null) {
            cell.setCellValue(formatter.format(LocalDateTime.ofInstant(Instant.ofEpochMilli(userCourse.getStatusChangeTimestamp()), ZoneId.systemDefault())));
        } else {
            cell.setCellValue("N/A");
        }
    }
}
