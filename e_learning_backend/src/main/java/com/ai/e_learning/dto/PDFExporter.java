package com.ai.e_learning.dto;

import com.ai.e_learning.service.CourseModuleService;
import com.ai.e_learning.service.CourseService;
import com.ai.e_learning.service.UserCourseService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class PDFExporter {

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

        // Create PDF document
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        titleFont.setSize(18);

        // Iterate over courses and write details
        for (CourseDto course : courses) {
            // Write course details
            writeCourseDetails(document, course, userCourses);

            // Add space between courses
            document.add(Chunk.NEWLINE);
        }

        document.close();
    }

    private void writeCourseDetails(Document document, CourseDto course, List<UserCourseDto> userCourses) throws DocumentException {
        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setSize(12);

        // Date formatter
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // Course details
        Paragraph courseName = new Paragraph("Course Name: " + course.getName(), font);
        document.add(courseName);

        Paragraph courseDescription = new Paragraph("Course Description: " + course.getDescription(), font);
        document.add(courseDescription);

        // Iterate over user courses for the current course
        for (UserCourseDto userCourse : userCourses) {
            if (userCourse.getCourse().getId().equals(course.getId())) {
                // Directly retrieve user information from userCourse
                String studentName = userCourse.getUser().getName(); // Ensure this returns the correct value
                String studentEmail = userCourse.getUser().getEmail();
                String studentTeam = userCourse.getUser().getTeam();
                String studentDivision = userCourse.getUser().getDivision();
                String studentDepartment = userCourse.getUser().getDepartment();

                Paragraph studentNameParagraph = new Paragraph("Student Name: " + studentName, font);
                document.add(studentNameParagraph);

                Paragraph studentEmailParagraph = new Paragraph("Email: " + studentEmail, font);
                document.add(studentEmailParagraph);

                Paragraph studentTeamParagraph = new Paragraph("Team: " + studentTeam, font);
                document.add(studentTeamParagraph);

                Paragraph studentDivisionParagraph = new Paragraph("Division: " + studentDivision, font);
                document.add(studentDivisionParagraph);

                Paragraph studentDepartmentParagraph = new Paragraph("Department: " + studentDepartment, font);
                document.add(studentDepartmentParagraph);


                // Completion progress
                Double completionPercentage = courseModuleService.calculateCompletionPercentage(userCourse.getUser().getId(), course.getId());
                Paragraph completionProgressParagraph;
                if (completionPercentage != null) {
                    completionProgressParagraph = new Paragraph("Completion Progress: " + String.format("%.2f%%", completionPercentage), font);
                } else {
                    completionProgressParagraph = new Paragraph("Completion Progress: N/A", font);
                }
                document.add(completionProgressParagraph);

                // Add space between students
                document.add(Chunk.NEWLINE);
            }
        }
    }
}
