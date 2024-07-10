package com.ai.e_learning.dto;

import com.ai.e_learning.model.Course;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

public class Question_TypePDFExporter {
    private List<Course> courseList;

    public Question_TypePDFExporter(List<Course> courseList) {
        this.courseList = courseList;
    }

    private void writeCourseCount(Document document) throws DocumentException {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setSize(12);

        Paragraph courseCount = new Paragraph("Total Number of Courses: " + courseList.size(), font);
        courseCount.setAlignment(Paragraph.ALIGN_LEFT);
        document.add(courseCount);
    }

    public void export(HttpServletResponse response) throws IOException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setSize(18);

        Paragraph title = new Paragraph("Course Report", font);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);

        writeCourseCount(document);

        document.close();
    }
}