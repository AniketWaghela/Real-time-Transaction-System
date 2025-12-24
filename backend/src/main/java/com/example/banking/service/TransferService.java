package com.example.banking.service;

import com.example.banking.exception.InsufficientFundsException;
import com.example.banking.model.AuditLog;
import com.example.banking.model.User;
import com.example.banking.repository.AuditLogRepository;
import com.example.banking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class TransferService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void transferFunds(Long senderId, Long receiverId, BigDecimal amount) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (sender.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException("Insufficient funds for user " + senderId);
        }

        sender.setBalance(sender.getBalance().subtract(amount));
        receiver.setBalance(receiver.getBalance().add(amount));

        userRepository.save(sender);
        userRepository.save(receiver);

        AuditLog log = new AuditLog();
        log.setSenderId(senderId);
        log.setReceiverId(receiverId);
        log.setAmount(amount);
        log.setStatus("SUCCESS");
        log.setTimestamp(LocalDateTime.now());

        AuditLog savedLog = auditLogRepository.save(log);

        // Real-time Updates
        sendUpdate(sender, savedLog);
        sendUpdate(receiver, savedLog);
    }

    private void sendUpdate(User user, AuditLog log) {
        Map<String, Object> update = new HashMap<>();
        update.put("balance", user.getBalance());
        update.put("transaction", log);
        messagingTemplate.convertAndSend("/topic/updates/" + user.getId(), update);
    }
}
