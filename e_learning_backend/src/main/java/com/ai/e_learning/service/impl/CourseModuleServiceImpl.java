package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.CourseModuleDto;
import com.ai.e_learning.model.CourseModule;
import com.ai.e_learning.repository.CourseModuleRepository;
import com.ai.e_learning.service.CourseModuleService;
import com.ai.e_learning.util.DtoUtil;
import com.ai.e_learning.util.EntityUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CourseModuleServiceImpl implements CourseModuleService {

    private final CourseModuleRepository courseModuleRepository;
    private final ModelMapper modelMapper;

    @Override
    public CourseModuleDto getModuleById(Long id) {
        CourseModule courseModule = EntityUtil.getEntityById(courseModuleRepository,id,"CourseModule");
        CourseModuleDto courseModuleDto = DtoUtil.map(courseModule,CourseModuleDto.class,modelMapper);
        courseModuleDto.setFile(courseModule.getFile());
        return courseModuleDto;
    }
}
