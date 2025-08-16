package com.PrepEdgeAi.PrepEdge.ExceptionHandler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        // Custom message for invalid topic
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Failed to fetch questions. Please enter a programming or interview-related topic.");
    }


}
