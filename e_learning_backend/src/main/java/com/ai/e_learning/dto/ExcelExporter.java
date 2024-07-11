//package com.ai.e_learning.dto;
//
//import com.ai.e_learning.model.Course;
//import com.ai.e_learning.model.User;
//import com.ai.e_learning.repository.CourseRepository;
//import com.ai.e_learning.repository.UserRepository;
//import jakarta.servlet.ServletOutputStream;
//import jakarta.servlet.http.HttpServletResponse;
//import org.apache.poi.hssf.usermodel.HSSFWorkbook;
//import org.apache.poi.ss.usermodel.*;
//import org.apache.poi.xssf.usermodel.XSSFWorkbook;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//import org.springframework.stereotype.Service;
//
//import java.io.IOException;
//import java.util.List;
//import java.util.Map;


//public class ExcelExporter {



//    public void export(HttpServletResponse response) throws IOException {
//        List<?> courses = courseRepository.findAll();
//        long studentCount = userRepository.countByRoleId(1);
//
//        Workbook workbook = new XSSFWorkbook();
//        Sheet sheet = workbook.createSheet("Report");
//
//        // Header row
//        Row headerRow = sheet.createRow(0);
//        CellStyle headerCellStyle = workbook.createCellStyle();
//        headerCellStyle.setFillForegroundColor(IndexedColors.WHITE.getIndex());
//        headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
//
//        Cell headerCell = headerRow.createCell(0);
//        headerCell.setCellValue("Course Count");
//        headerCell.setCellStyle(headerCellStyle);
//
//        headerCell = headerRow.createCell(1);
//        headerCell.setCellValue("Student Count");
//        headerCell.setCellStyle(headerCellStyle);
//
//        // Data row
//        Row dataRow = sheet.createRow(1);
//        dataRow.createCell(0).setCellValue(courses.size());
//        dataRow.createCell(1).setCellValue(studentCount);
//
//        // Adjust column widths
//        sheet.autoSizeColumn(0);
//        sheet.autoSizeColumn(1);
//
//
//
//        workbook.write(response.getOutputStream());
//        workbook.close();
//    }
package com.ai.e_learning.dto;

import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.User;
import com.ai.e_learning.repository.CourseRepository;
import com.ai.e_learning.service.UserService;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


import java.io.IOException;
import java.util.List;

@Component
public class ExcelExporter {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserService userService;

    public void exportCoursesByInstructor(Long instructorRoleId, HttpServletResponse response) throws IOException {
        // Fetch courses by instructor role ID
        List<Course> courses = courseRepository.findByUser_Roles_Id(instructorRoleId);

        // Fetch student count by instructor role ID
        long studentCount = userService.countStudentsByRoleId(instructorRoleId);

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
        cell.setCellValue("Student Count");
        cell.setCellStyle(style);

        // Iterate over courses and populate data rows
        for (Course course : courses) {
            Row row = sheet.createRow(rowCount++);

            cell = row.createCell(0);
            cell.setCellValue(course.getUser().getName()); // Assuming User contains instructor details

            cell = row.createCell(1);
            cell.setCellValue(course.getName());

            cell = row.createCell(2);
            cell.setCellValue(course.getLevel());

            cell = row.createCell(3);
            cell.setCellValue(course.getDuration());

            cell = row.createCell(4);
            cell.setCellValue(course.getDescription());

            cell = row.createCell(5);
            cell.setCellValue(studentCount); // Same student count for all courses by this instructor
        }

        // Set content type and header for the response
        response.setContentType("application/octet-stream");
        String currentDateTime = java.time.LocalDateTime.now().toString().replace(":", "-");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=courses_" + currentDateTime + ".xls";
        response.setHeader(headerKey, headerValue);

        // Write workbook to the response output stream
        ServletOutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);
        workbook.close();

        outputStream.close();
    }
}










