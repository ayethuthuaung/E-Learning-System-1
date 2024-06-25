package com.ai.e_learning.repository;

import com.ai.e_learning.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByName(String name);

    @Query("SELECT c FROM ChatRoom c JOIN c.participants p WHERE p.id = :userId")
    List<ChatRoom> findByUserId(@Param("userId") Long userId);
}
