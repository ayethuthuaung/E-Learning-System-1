
package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.ExcelExporter;
import com.ai.e_learning.dto.ExcelExporterForAdmin;
import com.ai.e_learning.dto.PDFExporter;
import com.ai.e_learning.dto.PDFExporterForAdmin;
import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.User;
import com.ai.e_learning.repository.CourseRepository;
import com.ai.e_learning.repository.UserRepository;
import com.ai.e_learning.service.CourseService;
import com.ai.e_learning.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/report")
@CrossOrigin("*")
public class ReportController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private ExcelExporter excelExporter;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExcelExporterForAdmin excelExporterForAdmin;

    @Autowired
    private PDFExporterForAdmin pdfExporterForAdmin;


    @GetMapping("/export/instructor/pdf")
    public void exportToPdf(@RequestParam("instructorId") Long instructorId, HttpServletResponse response) throws IOException {
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());

        response.setContentType("application/pdf");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=courses_" + currentDateTime + ".pdf";
        response.setHeader(headerKey, headerValue);

        // Instantiate the PDFExporter and call the export method
        PDFExporter exporter = new PDFExporter();
        exporter.exportCoursesByInstructor(instructorId, response);
    }
    @GetMapping("/export/admin/pdf")
    public void exportToPdf(HttpServletResponse response) throws IOException {
        pdfExporterForAdmin.exportAllCourses(response);
    }

    @GetMapping("/export/instructor/excel")
    public void exportCoursesByInstructor(@RequestParam(name = "instructorId") Long instructorId,
                                          HttpServletResponse response) throws IOException {
        // Call the ExcelExporter to export courses by instructor ID
        excelExporter.exportCoursesByInstructor(instructorId, response);
    }
    @GetMapping("/export/admin/excel")
    public void exportAllCourses(HttpServletResponse response) throws IOException {
        excelExporterForAdmin.exportAllCourses(response);
    }
}
