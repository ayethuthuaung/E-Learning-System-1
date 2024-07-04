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
    public StudentAnswer saveStudentAnswer(Long questionId, Long studentOptionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        AnswerOption answerOption = answerOptionRepository.findById(studentOptionId)
                .orElseThrow(() -> new RuntimeException("AnswerOption not found"));

        StudentAnswer studentAnswer = new StudentAnswer();
        studentAnswer.setQuestion(question);
        studentAnswer.setAnswerOption(answerOption);

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
}
