package com.ai.e_learning.service;

import com.ai.e_learning.dto.QuestionTypeDTO;
import com.ai.e_learning.model.QuestionType;
import com.ai.e_learning.repository.Question_TypeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class Question_TypeService {

    @Autowired
    private Question_TypeRepository questionTypeRepository;

    @Autowired
    private ModelMapper modelMapper;

    public QuestionTypeDTO addQuestionType(QuestionTypeDTO questionTypeDTO) {
        QuestionType questionType = convertToEntity(questionTypeDTO);
        QuestionType savedQuestionType = questionTypeRepository.save(questionType);
        return convertToDto(savedQuestionType);
    }

    public QuestionTypeDTO updateQuestionType(QuestionTypeDTO questionTypeDTO) {
        QuestionType questionType = convertToEntity(questionTypeDTO);
        QuestionType updatedQuestionType = questionTypeRepository.save(questionType);
        return convertToDto(updatedQuestionType);
    }

    public List<QuestionTypeDTO> getQuestionTypes() {
        return questionTypeRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public QuestionTypeDTO getQuestionType(Long questionTypeId) {
        return questionTypeRepository.findById(questionTypeId)
                .map(this::convertToDto)
                .orElseThrow(() -> new EntityNotFoundException("QuestionType not found"));
    }

    public void softDeleteQuestionType(Long questionTypeId) {
        questionTypeRepository.findById(questionTypeId)
                .ifPresent(questionType -> {
                    questionType.setDeleted(true);
                    questionTypeRepository.save(questionType);
                });
    }

    private QuestionType convertToEntity(QuestionTypeDTO questionTypeDTO) {
        return modelMapper.map(questionTypeDTO, QuestionType.class);
    }

    private QuestionTypeDTO convertToDto(QuestionType questionType) {
        return modelMapper.map(questionType, QuestionTypeDTO.class);
    }
}
