package com.ai.e_learning.repository;


import com.ai.e_learning.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByStaffId(String staffId);

    User findUserByStaffId(String staff_id);
    User findUserByEmail(String email);
    @Query(value = "SELECT u.* FROM user u JOIN course c ON u.id = c.user_id JOIN lesson l ON c.id = l.course_id JOIN exam e ON l.id = e.lesson_id WHERE e.id = :examId", nativeQuery = true)
    User findExamOwnerByExamId(@Param("examId") Long examId);
}
