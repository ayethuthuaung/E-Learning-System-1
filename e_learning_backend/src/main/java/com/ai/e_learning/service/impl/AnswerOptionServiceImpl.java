package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.AnswerOptionDto;
import com.ai.e_learning.model.AnswerOption;
import com.ai.e_learning.model.Question;
import com.ai.e_learning.repository.AnswerOptionRepository;
import com.ai.e_learning.repository.QuestionRepository;
import com.ai.e_learning.service.AnswerOptionService;
import com.ai.e_learning.util.DtoUtil;
import com.ai.e_learning.util.EntityUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AnswerOptionServiceImpl implements AnswerOptionService {

    @Autowired
    private  AnswerOptionRepository answerOptionRepository;

    @Autowired
    private  QuestionRepository questionRepository;

    @Autowired
    private  ModelMapper modelMapper;

    @Override
    public AnswerOptionDto addAnswerOption(AnswerOptionDto answerOptionDTO) {
        Question question = EntityUtil.getEntityById(questionRepository, answerOptionDTO.getQuestionId(), "Question");
        AnswerOption answerOption = DtoUtil.map(answerOptionDTO, AnswerOption.class, modelMapper);
        answerOption.setQuestion(question);
        AnswerOption savedAnswerOption = EntityUtil.saveEntity(answerOptionRepository, answerOption, "AnswerOption");
        return DtoUtil.map(savedAnswerOption, AnswerOptionDto.class, modelMapper);
    }

    @Override
    public AnswerOptionDto updateAnswerOption(AnswerOptionDto answerOptionDTO) {
        AnswerOption existingAnswerOption = EntityUtil.getEntityById(answerOptionRepository, answerOptionDTO.getId(), "AnswerOption");
        Question question = EntityUtil.getEntityById(questionRepository, answerOptionDTO.getQuestionId(), "Question");

        existingAnswerOption.setAnswer(answerOptionDTO.getAnswer());
      //  existingAnswerOption.setAnswered(answerOptionDTO.isAnswered());
        existingAnswerOption.setQuestion(question);

        AnswerOption updatedAnswerOption = EntityUtil.saveEntity(answerOptionRepository, existingAnswerOption, "AnswerOption");
        return DtoUtil.map(updatedAnswerOption, AnswerOptionDto.class, modelMapper);
    }

    @Override
    public Set<AnswerOptionDto> getAnswerOptions() {
        List<AnswerOption> answerOptionList = EntityUtil.getAllEntities(answerOptionRepository);
        return answerOptionList == null ? new HashSet<>() : new HashSet<>(DtoUtil.mapList(answerOptionList, AnswerOptionDto.class, modelMapper));
    }

    @Override
    public AnswerOptionDto getAnswerOption(Long answerOptionId) {
        AnswerOption answerOption = EntityUtil.getEntityById(answerOptionRepository, answerOptionId, "AnswerOption");
        return DtoUtil.map(answerOption, AnswerOptionDto.class, modelMapper);
    }

    @Override
    public void deleteAnswerOption(Long answerOptionId) {
        EntityUtil.deleteEntity(answerOptionRepository, answerOptionId, "AnswerOption");
    }
}
