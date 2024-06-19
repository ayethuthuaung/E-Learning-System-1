package com.ai.e_learning.service;

import com.ai.e_learning.dto.ExamDTO;
import com.ai.e_learning.model.Exam;
import com.ai.e_learning.repository.ExamRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ModelMapper modelMapper;

    public ExamDTO addExam(ExamDTO examDTO) {
        Exam exam = convertToEntity(examDTO);
        Exam savedExam = examRepository.save(exam);
        return convertToDto(savedExam);
    }

    public ExamDTO updateExam(ExamDTO examDTO) {
        Exam exam = convertToEntity(examDTO);
        Exam updatedExam = examRepository.save(exam);
        return convertToDto(updatedExam);
    }

    public List<ExamDTO> getExams() {
        return examRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ExamDTO getExam(Long examId) {
        return examRepository.findById(examId)
                .map(this::convertToDto)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found"));
    }

    public void softDeleteExam(Long examId) {
        examRepository.findById(examId)
                .ifPresent(exam -> {
                    exam.setDeleted(true);
                    examRepository.save(exam);
                });
    }

    private Exam convertToEntity(ExamDTO examDTO) {
        return modelMapper.map(examDTO, Exam.class);
    }

    private ExamDTO convertToDto(Exam exam) {
        return modelMapper.map(exam, ExamDTO.class);
    }
}
