package com.ai.e_learning.service.impl;

import com.ai.e_learning.model.AnswerOption;
import com.ai.e_learning.model.Question;
import com.ai.e_learning.model.StudentAnswer;
import com.ai.e_learning.repository.AnswerOptionRepository;
import com.ai.e_learning.repository.QuestionRepository;
import com.ai.e_learning.repository.StudentAnswerRepository;
import com.ai.e_learning.service.StudentAnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentAnswerServiceImpl implements StudentAnswerService {

    @Autowired
    private StudentAnswerRepository studentAnswerRepository;

    @Autowired
    private AnswerOptionRepository answerOptionRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public StudentAnswer saveStudentAnswer(Long questionId, Long answerOptionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        AnswerOption answerOption = answerOptionRepository.findById(answerOptionId)
                .orElseThrow(() -> new RuntimeException("AnswerOption not found"));
        System.out.println("AnswerOption"+answerOption.getId());
        StudentAnswer studentAnswer = new StudentAnswer();
        studentAnswer.setQuestion(question);
        studentAnswer.setAnswerOption(answerOption);
        studentAnswer.setSelectedOptionId(answerOption.getId()); // Set selected option ID

        return studentAnswerRepository.save(studentAnswer);
    }

    @Override
    public List<StudentAnswer> getAllStudentAnswers() {
        return studentAnswerRepository.findAll();
    }

    @Override
    public StudentAnswer getStudentAnswerById(Long id) {
        return studentAnswerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("StudentAnswer not found"));
    }

    @Override
    public void deleteStudentAnswer(Long id) {
        studentAnswerRepository.deleteById(id);
    }
    @Override
    public Long getSelectedOptionId(Long studentAnswerId) {
        StudentAnswer studentAnswer = studentAnswerRepository.findById(studentAnswerId)
                .orElseThrow(() -> new RuntimeException("StudentAnswer not found"));
        return studentAnswer.getSelectedOptionId();
    }
}
