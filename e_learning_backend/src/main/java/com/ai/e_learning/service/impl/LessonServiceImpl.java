package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.CourseModuleDto;
import com.ai.e_learning.dto.LessonDto;
import com.ai.e_learning.exception.EntityNotFoundException;
import com.ai.e_learning.model.*;
import com.ai.e_learning.model.CourseModule;
import com.ai.e_learning.repository.CourseRepository;
import com.ai.e_learning.repository.LessonRepository;
import com.ai.e_learning.repository.CourseModuleRepository;
import com.ai.e_learning.service.LessonService;
import com.ai.e_learning.util.DtoUtil;
import com.ai.e_learning.util.EntityUtil;
import com.ai.e_learning.util.GoogleDriveJSONConnector;
import com.ai.e_learning.util.Helper;
import com.google.api.client.http.FileContent;
import com.google.api.services.drive.Drive;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseModuleRepository courseModuleRepository;

    private final Helper helper;
    private final ModelMapper modelMapper;

    @Override
    public LessonDto createLesson(LessonDto lessonDto) throws IOException, GeneralSecurityException {
        Lesson lesson = new Lesson();
        lesson.setTitle(lessonDto.getTitle());

        // Fetch course by ID
        Course course = EntityUtil.getEntityById(courseRepository, lessonDto.getCourseId(), "Course");
        lesson.setCourse(course);

        // Create and save modules
        Set<CourseModule> courseModules = lessonDto.getModules().stream().map(moduleDto -> {
            CourseModule courseModule = new CourseModule();
            courseModule.setName(moduleDto.getName());

            // Directly handle the file input stream from MultipartFile
            String fileId;
            GoogleDriveJSONConnector driveConnector = new GoogleDriveJSONConnector();

            try  {
                fileId = driveConnector.uploadImageToDrive2( moduleDto.getFileInput(),"Module");
            } catch (IOException | GeneralSecurityException e) {
                throw new RuntimeException("Failed to upload file to Google Drive", e);
            }

            courseModule.setFile(fileId);
            return courseModuleRepository.save(courseModule); // Save each module
        }).collect(Collectors.toSet());

        // Set modules to the lesson
        lesson.setCourseModules(courseModules);
        Lesson savedLesson = EntityUtil.saveEntity(lessonRepository, lesson, "Lesson");

        // Save the lesson
        return DtoUtil.map(savedLesson, LessonDto.class, modelMapper);
    }


    @Override
    public List<LessonDto> getAllLessons() throws GeneralSecurityException, IOException {
        List<Lesson> lessons = EntityUtil.getAllEntities(lessonRepository);
        if (lessons==null){
            throw new EntityNotFoundException("No Lesson Found.");
        }

        List<LessonDto> lessonDtos = new ArrayList<>();

        for(Lesson lesson: lessons){
            LessonDto lessonDto = new LessonDto();
            lessonDto.setTitle(lesson.getTitle());
            Set<CourseModule> courseModules = lesson.getCourseModules();
            List<CourseModuleDto> courseModuleDtos = new ArrayList<>();
            for(CourseModule courseModule: courseModules){
                CourseModuleDto courseModuleDto = new CourseModuleDto();
                courseModuleDto.setName(courseModule.getName());
                GoogleDriveJSONConnector driveConnector = new GoogleDriveJSONConnector();
//                String fileId = driveConnector.getFileIdByName(courseModule.getFile());
//                String thumbnailLink = "https://drive.google.com/uc?export=view&id=" + courseModule.getFile();

                courseModuleDto.setFile(courseModule.getFile());

                courseModuleDtos.add(courseModuleDto);
            }
            lessonDto.setModules(courseModuleDtos);
            lessonDtos.add(lessonDto);
        }

        return lessonDtos;
    }

    @Override
    public LessonDto getLessonById(Long id) {
        Lesson lesson = EntityUtil.getEntityById(lessonRepository,id,"Lesson");
        return DtoUtil.map(lesson,LessonDto.class,modelMapper);
    }

    @Override
    public LessonDto updateLesson(Long id, LessonDto lessonDto) {
        Lesson lesson = EntityUtil.getEntityById(lessonRepository,id,"Lesson");
        lesson.setTitle(lessonDto.getTitle());
        lesson.setCourse(lessonDto.getCourse());
//        lesson.setModules(lessonDto.getModules());
        Lesson savedLesson = EntityUtil.saveEntity(lessonRepository,lesson,"Lesson");

        // Save the lesson
        return DtoUtil.map(savedLesson,LessonDto.class,modelMapper);
    }

    @Override
    public void deleteLesson(Long id) {
        EntityUtil.deleteEntity(lessonRepository,id,"Lesson");
    }

    @Override
    public List<LessonDto> getLessonsByCourseId(Long courseId) {
        List<Lesson> lessons = lessonRepository.findByCourseId(courseId);
        if (lessons == null) {
            throw new EntityNotFoundException("No Lessons Found for Course ID: " + courseId);
        }

        return lessons.stream()
                .map(lesson -> {
                    LessonDto lessonDto = new LessonDto();
                    lessonDto.setId(lesson.getId());
                    lessonDto.setTitle(lesson.getTitle());
                    GoogleDriveJSONConnector driveConnector = new GoogleDriveJSONConnector();
                    Set<CourseModule> courseModules = lesson.getCourseModules();
                    List<CourseModuleDto> courseModuleDtos = courseModules.stream()
                            .map(module -> {
                                CourseModuleDto moduleDto = new CourseModuleDto();
                                moduleDto.setId(module.getId());
                                moduleDto.setName(module.getName());
                                moduleDto.setFile(module.getFile());
                                try {
                                    moduleDto.setFileType(driveConnector.getFileType(moduleDto.getFile()));
                                } catch (GeneralSecurityException | IOException e) {
                                    throw new RuntimeException(e);
                                }
                                System.out.println("File Type:"+ moduleDto.getFileType());
                                return moduleDto;
                            }).collect(Collectors.toList());

                    lessonDto.setModules(courseModuleDtos);
                    return lessonDto;
                }).collect(Collectors.toList());
    }


}
