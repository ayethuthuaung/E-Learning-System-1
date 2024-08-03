package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.CertificateDto;
import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/certificate")
public class CertificateController {

    private final CertificateService certificateService;

    @PostMapping(value = "/", produces = "application/json")
    public ResponseEntity<CertificateDto> saveCertificate(@RequestBody CertificateDto certificateDto) {
        try {
            CertificateDto certificateDto1 = certificateService.saveCertificate(certificateDto);
            if (certificateDto1 != null) {
                return ResponseEntity.ok(certificateDto1);
            }else
                  return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

    }

    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<CertificateDto> getCertificateById(@PathVariable Long id) {
        CertificateDto certificateDto = certificateService.getCertificateById(id);
        if (certificateDto != null) {
            return ResponseEntity.ok(certificateDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(value = "/user/{id}", produces = "application/json")
    public ResponseEntity<CertificateDto> getCertificateByUserId(@PathVariable Long id) {
        CertificateDto certificateDto = certificateService.getCertificateByUserId(id);
        if (certificateDto != null) {
            return ResponseEntity.ok(certificateDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(value = "/user/{userId}/course/{courseId}", produces = "application/json")
    public ResponseEntity<CertificateDto> getCertificateByUserIdAndCourseId(@PathVariable Long userId, @PathVariable Long courseId) {
        CertificateDto certificateDto = certificateService.getCertificateByUserIdAndCourseId(userId,courseId);
        if (certificateDto != null) {
            return ResponseEntity.ok(certificateDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(value = "/checkUserCertificate", produces = "application/json")
    public ResponseEntity<Boolean> checkUserCertificate( @RequestParam("userId") Long userId, @RequestParam("courseId") Long courseId) {
        return ResponseEntity.ok(certificateService.checkUserCertificate(userId,courseId));
    }
}
