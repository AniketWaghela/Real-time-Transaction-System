package com.example.banking.repository;

import com.example.banking.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findBySenderIdOrReceiverIdOrderByTimestampDesc(Long senderId, Long receiverId);
}
