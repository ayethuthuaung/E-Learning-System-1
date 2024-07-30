package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.*;
import com.ai.e_learning.model.Category;
import com.ai.e_learning.model.Course;
import com.ai.e_learning.service.CourseService;
import com.ai.e_learning.service.ProfileImageService;
import com.ai.e_learning.util.DtoUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lowagie.text.DocumentException;
import jakarta.servlet.http.HttpServletResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*") // Change this to your frontend URL
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private ExcelExporter excelExporter;

    @Autowired
    private ExcelExporterAttendStudentForAdmin excelExporterAttendStudentForAdmin;

    @Autowired
    private PdfExporterAttendStudentForAdmin pdfExporterAttendStudentForAdmin;

    @Autowired
    private PdfExporterCoursesForInstructor pdfExporterCoursesForInstructor;

    @Autowired
    private ExcelExporterCoursesForInstructor excelExporterCoursesForInstructor;

    @Autowired
    private ExcelExporterStudentListForAdmin excelExporterStudentListForAdmin;

    @Autowired
    private PdfExporterStudentListForAdmin pdfExporterStudentListForAdmin;


    @Autowired
    private ExcelExporterForAdmin excelExporterForAdmin;

    @Autowired
    private PDFExporterForAdmin pdfExporterForAdmin;


    @Autowired
    private PDFExporter pdfExporter;

    @Autowired
    private ModelMapper modelMapper;




    @GetMapping(value = "/courselist", produces = "application/json")
    public ResponseEntity<List<CourseDto>> displayCourse(ModelMap model, @RequestParam(value = "status", required = false) String status) {
        if ("all".equalsIgnoreCase(status) || status == null) {
            return ResponseEntity.ok(courseService.getAllCourseList());
        }
        return ResponseEntity.ok(courseService.getAllCourses(status));
    }

    //AT
    @GetMapping(value = "/allCoursesList", produces = "application/json")
    public List<CourseDto> allCourses() {
        return courseService.getAllCourses();
    }
    //AT

    @GetMapping(value = "/instructorcourselist", produces = "application/json")
    public List<CourseDto> displayInstructorCourse(ModelMap model, @RequestParam(value = "userId") Long userId) {
        return courseService.getCoursesByUserId(userId);
    }

    @PostMapping(value = "/changeStatus", produces = "application/json")
    public ResponseEntity<?> changeStatus(ModelMap model, @RequestParam(value = "id") Long id, @RequestParam(value = "status") String status) {
        try {
            courseService.changeStatus(id, status);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Change Status Successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected Error Occur");
        }
    }


    @PostMapping(value = "/addcourse", produces = "application/json", consumes = "multipart/form-data")
    public ResponseEntity<CourseDto> addCourse(
            @RequestPart("course") CourseDto courseDto,
            @RequestParam(value = "photo", required = false) MultipartFile photo) throws IOException, GeneralSecurityException {
        if (photo.isEmpty()) {
            return ResponseEntity.badRequest().body(courseDto);
        }
        courseDto.setPhotoInput(photo);
        CourseDto savedCourse = courseService.saveCourse(courseDto);
        if (savedCourse != null) {
            return ResponseEntity.ok(savedCourse);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<CourseDto> getCourseById(@PathVariable Long id) {
        CourseDto courseDto = courseService.getCourseById(id);
        if (courseDto != null) {
            return ResponseEntity.ok(courseDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping(value = "/updatecourse/{id}", produces = "application/json", consumes = "multipart/form-data")
    public ResponseEntity<CourseDto> updateCourse(@PathVariable Long id,
                                                  @RequestPart CourseDto courseDto,
                                                  @RequestParam(value = "photo", required = false) MultipartFile photo) {
        courseDto.setPhotoInput(photo);
        System.out.println(courseDto.toString());
        CourseDto updatedCourse = courseService.updateCourse(id, courseDto);

        if (updatedCourse == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedCourse);
    }


    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<Void> softDeleteCourse(@PathVariable Long id) {
        courseService.softDeleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/byCategory/{categoryId}", produces = "application/json")
    public ResponseEntity<List<CourseDto>> getCoursesByCategory(@PathVariable Long categoryId) {
        List<CourseDto> courses = courseService.getCoursesByCategory(categoryId);
        return ResponseEntity.ok(courses);
    }

    @PostMapping(value = "/{courseId}/categories/{categoryId}", produces = "application/json")
    public ResponseEntity<Void> addCategoryToCourse(@PathVariable Long courseId, @PathVariable Long categoryId) {
        courseService.addCategoryToCourse(courseId, categoryId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/existsByName")
    public boolean isCourseNameAlreadyExists(@RequestParam String name) {
        return courseService.isCourseNameAlreadyExists(name);
    }


    @GetMapping(value = "/latestAccepted", produces = "application/json")
    public ResponseEntity<List<CourseDto>> getLatestAcceptedCourses() {
        List<CourseDto> courses = courseService.getLatestAcceptedCourses();
        if (courses.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    @GetMapping("/lessons/{lessonId}/courseId")
    public Long getCourseIdByLessonId(@PathVariable Long lessonId) {

        return courseService.getCourseId(lessonId);
    }

    @GetMapping("/requestWithExamId/{examId}")
    public Long getCourseIdByExamId(@PathVariable Long examId) {

        return courseService.getCourseIdByExamId(examId);
    }

    //report

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

    @GetMapping("/export/instructor/pdf")
    public void exportToPdf(@RequestParam(name = "instructorId") Long instructorId, HttpServletResponse response) throws IOException {
        System.out.println("Received instructorId: " + instructorId);
        try {
            response.setContentType("application/pdf");
            String headerKey = "Content-Disposition";
            String headerValue = "attachment; filename=courses_" + new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss").format(new Date()) + ".pdf";
            response.setHeader(headerKey, headerValue);

            pdfExporter.exportCoursesByInstructor(instructorId, response);
        } catch (IOException ex) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error generating PDF");
            ex.printStackTrace();
        }
    }

    @GetMapping("/export/admin/pdf")
    public void exportToPdf(HttpServletResponse response) throws IOException {
        pdfExporterForAdmin.exportAllCourses(response);
    }


    @GetMapping("/export/courses")
    public void exportCoursesForInstructor(
            @RequestParam("userId") Long userId,
            HttpServletResponse response) throws IOException {
        excelExporterCoursesForInstructor.exportCoursesForInstructor(userId, response);
    }

    @GetMapping("/export/courses/pdf")
    public void exportCoursesForInstructorPdf(
            @RequestParam("userId") Long userId,
            HttpServletResponse response) throws IOException, DocumentException {
        pdfExporterCoursesForInstructor.exportCoursesForInstructor(userId, response);
    }

    @GetMapping("/export/student-list/excel")
    public void exportStudentList(HttpServletResponse response) throws IOException {
        excelExporterStudentListForAdmin.exportStudentList(response);
    }
    @GetMapping("/export/student-list/pdf")
    public void exportStudentListPdf(HttpServletResponse response) throws IOException {
        pdfExporterStudentListForAdmin.exportStudentList(response);
    }

    @GetMapping("/export/attended-students/excel")
    public void exportAttendedStudents(HttpServletResponse response) throws IOException {
        excelExporterAttendStudentForAdmin.exportAttendStudentList(response);
    }

    @GetMapping("/export/attend-students/pdf")
    public void exportAttendStudentReport(HttpServletResponse response) throws IOException {
        response.setContentType("application/pdf");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=Attend_Student_List_Report.pdf";
        response.setHeader(headerKey, headerValue);

        pdfExporterAttendStudentForAdmin.exportStudentList(response);
    }

}
