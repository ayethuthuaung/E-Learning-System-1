package com.ai.e_learning.service;

import com.ai.e_learning.dto.StudentAnswerDto;
import com.ai.e_learning.model.StudentAnswer;

import java.util.List;
import java.util.Map;

public interface StudentAnswerService {
    public List<Map<String, Object>> saveStudentAnswers(List<StudentAnswerDto> studentAnswerDTOList);

}
