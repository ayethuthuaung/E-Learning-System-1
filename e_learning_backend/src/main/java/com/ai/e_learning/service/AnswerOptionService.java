package com.ai.e_learning.service;

import com.ai.e_learning.dto.AnswerOptionDto;
import java.util.Set;

public interface AnswerOptionService {
    AnswerOptionDto addAnswerOption(AnswerOptionDto answerOptionDTO);

    AnswerOptionDto updateAnswerOption(AnswerOptionDto answerOptionDTO);

    Set<AnswerOptionDto> getAnswerOptions();

    AnswerOptionDto getAnswerOption(Long answerOptionId);

    void deleteAnswerOption(Long answerOptionId);
}
