package com.ai.e_learning.service;

import com.ai.e_learning.dto.MarksDto;

import java.util.List;

public interface MarkService {

    MarksDto createMark(MarksDto marksDto);

    List<MarksDto> getAllMarks();

    MarksDto getMarkById(Long id);


    MarksDto updateMark(Long id, MarksDto marksDto);

    void deleteMark(Long id);
}
