package com.example.banking.controller;

import com.example.banking.model.AuditLog;
import com.example.banking.repository.AuditLogRepository;
import com.example.banking.service.TransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow React app
public class TransferController {

    @Autowired
    private TransferService transferService;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody Map<String, Object> payload) {
        Long senderId = Long.valueOf(payload.get("senderId").toString());
        Long receiverId = Long.valueOf(payload.get("receiverId").toString());
        BigDecimal amount = new BigDecimal(payload.get("amount").toString());

        transferService.transferFunds(senderId, receiverId, amount);
        return ResponseEntity.ok("Transfer successful");
    }

    @GetMapping("/history/{userId}")
    public List<AuditLog> getHistory(@PathVariable Long userId) {
        // For simplicity, we get history involving userId as either sender or receiver
        // We added a method in repository for this.
        // Assuming we want to show all transactions related to this user?
        return auditLogRepository.findBySenderIdOrReceiverIdOrderByTimestampDesc(userId, userId);
    }
}
