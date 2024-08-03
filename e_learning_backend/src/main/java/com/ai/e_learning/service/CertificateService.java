package com.ai.e_learning.service;

import com.ai.e_learning.dto.CertificateDto;
import org.springframework.stereotype.Service;

@Service
public interface CertificateService {
    CertificateDto saveCertificate(CertificateDto certificateDto);
    CertificateDto getCertificateById(Long id);
    CertificateDto getCertificateByUserId(Long userId);

    CertificateDto getCertificateByUserIdAndCourseId(Long userId, Long courseId);

    boolean checkUserCertificate(Long userId, Long courseId);
}
