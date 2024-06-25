package com.ai.e_learning.service;

import com.ai.e_learning.model.StudentAnswer;

import java.util.List;

public interface StudentAnswerService {
    public StudentAnswer saveStudentAnswer(Long questionId, Long studentOptionId);
    public List<StudentAnswer> getAllStudentAnswers();
    public StudentAnswer getStudentAnswerById(Long id);
    public void deleteStudentAnswer(Long id);
}
