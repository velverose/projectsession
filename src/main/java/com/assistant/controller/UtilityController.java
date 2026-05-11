package com.assistant.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/utils")
public class UtilityController {

    @GetMapping("/time")
    public ResponseEntity<Map<String, String>> getCurrentTime() {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        Map<String, String> response = new HashMap<>();
        response.put("time", now.format(formatter));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/calculator")
    public ResponseEntity<Map<String, Object>> calculate(
            @RequestParam double a,
            @RequestParam double b,
            @RequestParam String operation) {
        
        double result = 0;
        String error = null;

        switch (operation) {
            case "add":
                result = a + b;
                break;
            case "subtract":
                result = a - b;
                break;
            case "multiply":
                result = a * b;
                break;
            case "divide":
                if (b == 0) {
                    error = "Division by zero";
                } else {
                    result = a / b;
                }
                break;
            default:
                error = "Unknown operation. Use add, subtract, multiply, or divide.";
        }

        Map<String, Object> response = new HashMap<>();
        if (error != null) {
            response.put("error", error);
            return ResponseEntity.badRequest().body(response);
        }
        
        response.put("result", result);
        return ResponseEntity.ok(response);
    }
}
