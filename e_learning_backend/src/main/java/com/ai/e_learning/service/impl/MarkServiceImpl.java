package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.MarksDto;
import com.ai.e_learning.model.Marks;
import com.ai.e_learning.repository.MarksRepository;
import com.ai.e_learning.service.MarkService;
import com.ai.e_learning.util.DtoUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MarkServiceImpl implements MarkService {

    private final MarksRepository marksRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<MarksDto> getAllMarks() {
        List<Marks> marksList = marksRepository.findAll();
        return marksList.stream()
                .map(marks -> DtoUtil.map(marks, MarksDto.class, modelMapper))
                .collect(Collectors.toList());
    }

    @Override
    public MarksDto getMarkById(Long id) {
        Marks marks = marksRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Mark not found for ID: " + id));
        return DtoUtil.map(marks, MarksDto.class, modelMapper);
    }

    @Override
    public MarksDto createMark(MarksDto marksDto) {
        Marks marks = DtoUtil.map(marksDto, Marks.class, modelMapper);
        Marks savedMark = marksRepository.save(marks);
        return DtoUtil.map(savedMark, MarksDto.class, modelMapper);
    }

    @Override
    public MarksDto updateMark(Long id, MarksDto marksDto) {
        Marks existingMark = marksRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Mark not found for ID: " + id));
        existingMark.setMark(marksDto.getMark()); // Update mark value
        Marks updatedMark = marksRepository.save(existingMark);
        return DtoUtil.map(updatedMark, MarksDto.class, modelMapper);
    }

    @Override
    public void deleteMark(Long id) {
        marksRepository.deleteById(id);
    }
}

