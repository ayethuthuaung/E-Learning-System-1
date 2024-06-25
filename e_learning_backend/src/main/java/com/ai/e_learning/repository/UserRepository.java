package com.ai.e_learning.repository;


import com.ai.e_learning.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByStaffId(String staffId);

    User findUserByStaffId(String staff_id);
    User findUserByEmail(String email);

}
