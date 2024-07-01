package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.LessonDto;
import com.ai.e_learning.model.*;
import com.ai.e_learning.model.Module;
import com.ai.e_learning.repository.CourseRepository;
import com.ai.e_learning.repository.LessonRepository;
import com.ai.e_learning.repository.ModuleRepository;
import com.ai.e_learning.service.LessonService;
import com.ai.e_learning.util.EntityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class LessonServiceImpl implements LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ModuleRepository moduleRepository;

    @Override
    public Lesson createLesson(LessonDto lessonDto) {
        Lesson lesson = new Lesson();
        lesson.setTitle(lessonDto.getTitle());

        // Fetch course by ID
        Course course = EntityUtil.getEntityById(courseRepository, lessonDto.getCourseId(), "Course");
        lesson.setCourse(course);

        // Create and save modules
        Set<Module> modules = lessonDto.getModules().stream().map(moduleDto -> {
            Module module = new Module();
            module.setName(moduleDto.getName());
            module.setDone(false);
            module.setFile(moduleDto.getFile());
            return moduleRepository.save(module); // Save each module
        }).collect(Collectors.toSet());

        // Set modules to the lesson
        lesson.setModules(modules);

        // Save the lesson
        return lessonRepository.save(lesson);
    }


    @Override
    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }

    @Override
    public Lesson getLessonById(Long id) {
        return lessonRepository.findById(id).orElseThrow(() -> new RuntimeException("Lesson not found"));
    }

    @Override
    public Lesson updateLesson(Long id, LessonDto lessonDto) {
        Lesson lesson = getLessonById(id);
        lesson.setTitle(lessonDto.getTitle());
        lesson.setCourse(lessonDto.getCourse());
//        lesson.setModules(lessonDto.getModules());
        return lessonRepository.save(lesson);
    }

    @Override
    public void deleteLesson(Long id) {
        lessonRepository.deleteById(id);
    }
}
