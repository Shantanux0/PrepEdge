package com.PrepEdgeAi.PrepEdge.Controller;


import com.PrepEdgeAi.PrepEdge.Entity.InterviewQuestion;
import com.PrepEdgeAi.PrepEdge.Service.AIInterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/interview-questions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InterviewController {

    private final AIInterviewService aiService;

//    @PostMapping
//    public List<InterviewQuestion> getQuestions(@RequestParam String topic) {
//        return aiService.generateQuestions(topic);
//    }
    @PostMapping("/api/interview/generate")
    public List<InterviewQuestion> generateQuestions(@RequestBody Map<String, Object> request) {
        String topic = (String) request.get("topic");
        List<String> companies = (List<String>) request.get("companies");
        return aiService.generateQuestions(topic, companies);
    }

    @GetMapping("/api/interview/topics")
    public java.util.Set<String> getAllTopics() {
        return aiService.getAllSupportedTopics();
    }

}
