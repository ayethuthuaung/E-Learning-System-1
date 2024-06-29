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

    @Query("SELECT p FROM ChatRoom c JOIN c.participants p WHERE c.id IN (SELECT c.id FROM ChatRoom c JOIN c.participants p WHERE p.id = :userId)")
    List<User> findUsersByUserId(@Param("userId") Long userId);
}
