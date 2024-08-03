package com.ai.e_learning.repository;

import com.ai.e_learning.model.ChatRoom;
import com.ai.e_learning.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByName(String name);

    @Query("SELECT DISTINCT p FROM ChatRoom c JOIN c.participants p WHERE c IN (SELECT c FROM ChatRoom c JOIN c.participants p WHERE p.id = :userId)")
    List<User> findUsersByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM ChatRoom c WHERE :instructor MEMBER OF c.participants AND :student MEMBER OF c.participants")
    Optional<ChatRoom> findByParticipants(@Param("instructor") User instructor, @Param("student") User student);
}
