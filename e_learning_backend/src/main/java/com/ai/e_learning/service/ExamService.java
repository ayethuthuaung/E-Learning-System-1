package com.ai.e_learning.service;

import com.ai.e_learning.dto.*;
import com.ai.e_learning.model.AnswerOption;
import com.ai.e_learning.model.Exam;
import com.ai.e_learning.model.Question;
import com.ai.e_learning.repository.AnswerOptionRepository;
import com.ai.e_learning.repository.ExamRepository;
import com.ai.e_learning.repository.QuestionRepository;
import com.ai.e_learning.util.DtoUtil;
import com.ai.e_learning.util.EntityUtil;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;


public interface ExamService {
    boolean createExam(ExamCreationDto examCreationDto);

 ExamDto addExam(ExamDto examDTO) ;
    ExamDto updateExam(ExamDto examDTO) ;

     List<ExamDto> getExams() ;

     ExamDto getExam(Long examId);

     void softDeleteExam(Long examId);

     ExamDto getExamById(Long examId) ;
    //for exam with questions lists
     ExamDto getExamWithQuestions(Long examId);


    List<ExamListDto> getExamByLessonId(Long lessonId);
}
