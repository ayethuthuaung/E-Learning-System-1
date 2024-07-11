//package com.ai.e_learning.controllers;
//
//
//import com.ai.e_learning.dto.Question_TypePDFExporter;
//import com.ai.e_learning.model.QuestionType;
//import com.ai.e_learning.repository.Question_TypeRepository;
//import com.ai.e_learning.service.Question_TypeService;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.io.IOException;
//import java.text.DateFormat;
//import java.text.SimpleDateFormat;
//import java.util.Date;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/report")
//@CrossOrigin("*")
//public class ReportController {
//
//    @Autowired
//    Question_TypeRepository questionTypeRepository;
//
//
//    @GetMapping("/export")
//    public void exportToPdf(HttpServletResponse response) throws IOException {
//        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
//
//        response.setContentType("application/pdf");
//        String currentDateTime = dateFormatter.format(new Date());
//        String headerKey = "Content-Disposition";
//        String headerValue = "attachment; filename=questionType_" + currentDateTime + ".pdf";
//
//        response.setHeader(headerKey,headerValue);
//
//        List<QuestionType> questionTypeList = questionTypeRepository.findAll();
//
//        Question_TypePDFExporter exporter = new Question_TypePDFExporter(questionTypeList);
//
//        exporter.export(response);
//    }
//}
package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.ExcelExporter;
import com.ai.e_learning.dto.PDFExporter;
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

    @GetMapping("/export/pdf")
    public void exportToPdf(HttpServletResponse response) throws IOException {
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");

        response.setContentType("application/pdf");
        String currentDateTime = dateFormatter.format(new Date());
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=courses_" + currentDateTime + ".pdf";

        response.setHeader(headerKey, headerValue);

        List<Course> courseList = courseRepository.findAll();
        long studentCount = userService.countStudents();

        PDFExporter exporter = new PDFExporter(courseList, studentCount);

        exporter.export(response);
    }
    @GetMapping("/export/excel")
//    public void exportToExcel(HttpServletResponse response) throws IOException {
//        List<Course> courses = courseService.getAllCourses("Active"); // Fetch all active courses
//
//        // Map to store instructor and their courses
//        Map<User, List<Course>> instructorCourseMap = new HashMap<>();
//
//        // Populate instructorCourseMap with courses by instructor
//        for (Course course : courses) {
//            User instructor = course.getUser(); // Assuming each course has a user (instructor)
//            if (instructor != null) {
//                instructorCourseMap.computeIfAbsent(instructor, k -> {
//                    return courseService.getCoursesByUserId(instructor.getId());
//                });
//            }
//        }
//
//        // Set student count for each course
//        long studentCount = userService.countStudents();
//
//        // Configure Excel Exporter
//        excelExporter.setInstructorCourseMap(instructorCourseMap);
//        excelExporter.setStudentCount(studentCount);
//
//        // Export to Excel
//        response.setContentType("application/octet-stream");
//        String currentDateTime = java.time.LocalDateTime.now().toString().replace(":", "-");
//        String headerKey = "Content-Disposition";
//        String headerValue = "attachment; filename=courses_" + currentDateTime + ".xls";
//        response.setHeader(headerKey, headerValue);
//
//        // Use ExcelExporter to export courses and student count
//        excelExporter.export(response);
//    }
    public void exportCoursesByInstructor(
            @RequestParam(name = "instructorRoleId") Long instructorRoleId,
            HttpServletResponse response) throws IOException {

        // Call the ExcelExporter to export courses by instructor role ID
        excelExporter.exportCoursesByInstructor(instructorRoleId, response);
    }

    @GetMapping("/export/pdf/instructors")
    public void exportToPdfByInstructors(HttpServletResponse response) throws IOException {
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");

        response.setContentType("application/pdf");
        String currentDateTime = dateFormatter.format(new Date());
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=courses_instructors_" + currentDateTime + ".pdf";

        response.setHeader(headerKey, headerValue);

        // Fetch users with role_id = 2 (assuming role_id 2 is for instructors)
        List<User> instructors = userRepository.findByRoleId(2L);
        List<Course> courseList = new ArrayList<>();

        // Fetch courses created by each instructor
        for (User instructor : instructors) {
            courseList.addAll(courseRepository.findByUserId(instructor.getId()));
        }

        long studentCount = userService.countStudents();

        PDFExporter exporter = new PDFExporter(courseList, studentCount);
        exporter.export(response);
    }


//    @GetMapping("/export/excel/instructors")
//    public void exportToExcelByInstructors(HttpServletResponse response) throws IOException {
//        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
//
//        response.setContentType("application/octet-stream");
//        String currentDateTime = dateFormatter.format(new Date());
//        String headerKey = "Content-Disposition";
//        String headerValue = "attachment; filename=courses_instructors_" + currentDateTime + ".xls";
//
//        response.setHeader(headerKey, headerValue);
//
//        // Fetch users with role_id = 2 (assuming role_id 2 is for instructors)
//        List<User> instructors = userRepository.findByRoleId(2L);
//        Map<User, List<Course>> instructorCourseMap = new HashMap<>();
//
//        // Fetch courses created by each instructor
//        for (User instructor : instructors) {
//            List<Course> courses = courseRepository.findByUserId(instructor.getId());
//            instructorCourseMap.put(instructor, courses);
//        }
//
//        long studentCount = userService.countStudents();
//
//        ExcelExporter exporter = new ExcelExporter(instructorCourseMap, studentCount);
//        exporter.export(response);
//    }
}
