package com.PrepEdgeAi.PrepEdge.provider;


import com.PrepEdgeAi.PrepEdge.Entity.InterviewQuestion;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class GPTProvider implements AIProvider {

    private final RestTemplate restTemplate;
    private final ObjectMapper mapper;
    private final String apiKey;
    private final String model;

    public GPTProvider(RestTemplate restTemplate, ObjectMapper mapper,
                       @Value("${openai.api.key}") String apiKey,
                       @Value("${openai.model}") String model) {
        this.restTemplate = restTemplate;
        this.mapper = mapper;
        this.apiKey = apiKey;
        this.model = model;
    }

    @Override
    public String getName() {
        return "GPT";
    }

    @Override
    public List<InterviewQuestion> generateQuestions(String topic) throws Exception {
        log.info("Attempting to generate questions for topic '{}' with GPT model: {}", topic, model);
        Map<String, Object> response = callGPT(topic);
        List<InterviewQuestion> parsed = parseResponse(response, topic);
        if (!parsed.isEmpty()) {
            log.info("Successfully generated {} questions for topic '{}' using GPT model {}", parsed.size(), topic, model);
            return parsed;
        }
        return Collections.emptyList();
    }

    private String buildPrompt(String topic) {
        return """
                Generate 10 compact Q&A snippets for the role/topic "%s".
                Each item must be a JSON object with fields: "question", "answer", "difficulty" (Easy|Medium|Hard).
                Keep answers to 2–4 sentences.
                """.formatted(topic);
    }

    private Map<String, Object> callGPT(String topic) {
        String url = "[https://api.openai.com/v1/chat/completions](https://api.openai.com/v1/chat/completions)";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> systemMessage = Map.of(
                "role", "system",
                "content", "You are an interview coach. You must return ONLY a valid JSON array of objects, with no extra text, prose, or markdown fences."
        );
        Map<String, Object> userMessage = Map.of(
                "role", "user",
                "content", buildPrompt(topic)
        );

        Map<String, Object> body = Map.of(
                "model", this.model,
                "messages", List.of(systemMessage, userMessage),
                "response_format", Map.of("type", "json_object") // Ensures JSON output
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        return restTemplate.postForObject(url, request, Map.class);
    }

    @SuppressWarnings("unchecked")
    private List<InterviewQuestion> parseResponse(Map<String, Object> response, String topic) throws IOException {
        if (response == null) return Collections.emptyList();

        String rawJson = extractTextFromResponse(response);
        String cleaned = rawJson.trim();

        if (cleaned.isEmpty()) return Collections.emptyList();

        // GPT's JSON mode might return an object with a key containing the array.
        // We need to find the array within the returned JSON. A robust parser would handle this,
        // but for simplicity, we'll assume a common structure. Let's assume it's an array directly for now.
        // A more complex response might be `{"questions": [...]}`. We'll try to handle both.

        List<Map<String, Object>> items;
        if (cleaned.startsWith("[")) {
            items = mapper.readValue(cleaned, new TypeReference<>() {});
        } else {
            Map<String, Object> root = mapper.readValue(cleaned, new TypeReference<>() {});
            // Find the first value that is a list
            items = (List<Map<String, Object>>) root.values().stream()
                    .filter(v -> v instanceof List).findFirst()
                    .orElse(Collections.emptyList());
        }

        List<InterviewQuestion> out = new ArrayList<>();
        for (Map<String, Object> item : items) {
            String q = String.valueOf(item.getOrDefault("question", "")).trim();
            String a = String.valueOf(item.getOrDefault("answer", "")).trim();
            String d = String.valueOf(item.getOrDefault("difficulty", "Medium")).trim();
            if (!q.isEmpty() && !a.isEmpty()) {
                out.add(new InterviewQuestion(null, topic, q, a, d));
            }
        }
        return out;
    }

    @SuppressWarnings("unchecked")
    private String extractTextFromResponse(Map<String, Object> response) {
        try {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            return message.get("content").toString();
        } catch (Exception e) {
            log.error("Failed to parse GPT response structure: {}", response, e);
            return "";
        }
    }
}