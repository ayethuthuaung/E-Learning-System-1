package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.CertificateDto;
import com.ai.e_learning.model.Certificate;
import com.ai.e_learning.repository.CertificateRepository;
import com.ai.e_learning.repository.CourseRepository;
import com.ai.e_learning.repository.UserRepository;
import com.ai.e_learning.service.CertificateService;
import com.ai.e_learning.util.DtoUtil;
import com.ai.e_learning.util.EntityUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CertificateServiceImpl implements CertificateService {
    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ModelMapper modelMapper;
    @Override
    public void saveCertificate(CertificateDto certificateDto) {
        Certificate certificate = new Certificate();
        certificate.setUser(certificateDto.getUser());
        certificate.setCourse(certificateDto.getCourse());
        Certificate savedCertificate = EntityUtil.saveEntity(certificateRepository, certificate, "Certificate");

        DtoUtil.map(savedCertificate, CertificateDto.class, modelMapper);
    }

    @Override
    public CertificateDto getCertificateById(Long id) {
        Certificate certificate = EntityUtil.getEntityById(certificateRepository,id,"Certificate");
        return DtoUtil.map(certificate, CertificateDto.class, modelMapper);
    }

    @Override
    public CertificateDto getCertificateByUserId(Long userId) {
        Certificate certificate = certificateRepository.findByUserId(userId);
        return DtoUtil.map(certificate, CertificateDto.class, modelMapper);
    }

    @Override
    public CertificateDto getCertificateByUserIdAndCourseId(Long userId, Long courseId) {
        Certificate certificate = certificateRepository.findCertificateByUserIdAndCourseId(userId, courseId);
        return DtoUtil.map(certificate, CertificateDto.class, modelMapper);    }

    @Override
    public boolean checkUserCertificate(Long userId, Long courseId) {
        return !certificateRepository.findByUserIdAndCourseId(userId, courseId).isEmpty();
    }
}
