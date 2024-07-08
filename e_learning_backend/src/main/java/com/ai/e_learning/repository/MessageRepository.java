package com.ai.e_learning.repository;

import com.ai.e_learning.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatRoomIdAndSoftDeletedFalse(Long chatRoomId);
 //   List<Message> findByChatRoomId(Long chatRoomId);

    List<Message> findByChatRoomIdAndSenderId(Long chatRoomId, Long senderId);

    @Query("SELECT m FROM Message m WHERE m.chatRoom.id = :chatRoomId AND m.sender.id = :senderId")
    List<Message> findChatHistoryForUser(@Param("chatRoomId") Long chatRoomId, @Param("senderId") Long senderId);
}
