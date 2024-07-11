//package com.ai.e_learning.dto;
//
//import com.ai.e_learning.model.QuestionType;
//import com.lowagie.text.*;
//import com.lowagie.text.pdf.PdfPCell;
//import com.lowagie.text.pdf.PdfPTable;
//import com.lowagie.text.pdf.PdfWriter;
//import jakarta.servlet.http.HttpServletResponse;
//
//import java.io.IOException;
//import java.util.List;
//
//public class Question_TypePDFExporter {
//    private List<QuestionType> questionTypeList;
//
//    public Question_TypePDFExporter(List<QuestionType> questionTypeList) {
//        this.questionTypeList = questionTypeList;
//    }
//    private void writeTableHeader(PdfPTable table){
//        PdfPCell cell = new PdfPCell();
//        cell.setPadding(5);
//
//        Font font = FontFactory.getFont(FontFactory.HELVETICA);
//
//        cell.setPhrase(new Phrase("Question_Type ID", font));
//
//        table.addCell(cell);
//
//        cell.setPhrase(new Phrase("Question_Type Name", font));
//
//        table.addCell(cell);
//
//    }
//    private void writeTableData(PdfPTable table){
//        for(QuestionType questionType : questionTypeList){
//            table.addCell(String.valueOf(questionType.getId()));
//            table.addCell(String.valueOf(questionType.getType()));
//
//        }
//
//    }
//    public void export(HttpServletResponse response) throws IOException {
//        Document document = new Document(PageSize.A4);
//        PdfWriter.getInstance(document,response.getOutputStream());
//
//        document.open();
//
//        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
//        font.setSize(18);
//
//        Paragraph title = new Paragraph("List Of Question_Type",font);
//        title.setAlignment(Paragraph.ALIGN_CENTER);
//        document.add(title);
//
//        PdfPTable table = new PdfPTable(2);
//        table.setWidthPercentage(100);
//        table.setSpacingBefore(15);
//        table.setWidths(new float[] {1.5f, 3.5f});
//
//        writeTableHeader(table);
//        writeTableData(table);
//
//        document.add(table);
//        document.close();
//
//    }
//}
package com.ai.e_learning.dto;

import com.ai.e_learning.model.Course;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

public class PDFExporter {
    private List<Course> courseList;
    private long studentCount;

    public PDFExporter(List<Course> courseList, long studentCount) {
        this.courseList = courseList;
        this.studentCount = studentCount;
    }

    private void writeCourseCount(Document document) throws DocumentException {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setSize(12);

        Paragraph courseCount = new Paragraph("Total Number of Courses: " + courseList.size(), font);
        courseCount.setAlignment(Paragraph.ALIGN_LEFT);
        document.add(courseCount);

        Paragraph studentCountParagraph = new Paragraph("Total Number of Students: " + studentCount, font);
        studentCountParagraph.setAlignment(Paragraph.ALIGN_LEFT);
        document.add(studentCountParagraph);
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


