package com.ai.e_learning.repository;

import com.ai.e_learning.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    Certificate findByUserId(Long userId);

    Certificate findCertificateByUserIdAndCourseId(Long userId, Long courseId);

    List<Certificate> findByUserIdAndCourseId(Long userId, Long courseId);

}
