package com.ai.e_learning.service;

import com.ai.e_learning.dto.AnswerOptionDTO;
import java.util.Set;

public interface AnswerOptionService {
    AnswerOptionDTO addAnswerOption(AnswerOptionDTO answerOptionDTO);

    AnswerOptionDTO updateAnswerOption(AnswerOptionDTO answerOptionDTO);

    Set<AnswerOptionDTO> getAnswerOptions();

    AnswerOptionDTO getAnswerOption(Long answerOptionId);

    void deleteAnswerOption(Long answerOptionId);
}
