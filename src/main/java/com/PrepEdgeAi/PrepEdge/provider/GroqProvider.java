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

/**
 * AI Provider implementation for Groq.
 * Groq's API is OpenAI-compatible, so this follows a similar structure to GPTProvider.
 */
@Component
@Slf4j
public class GroqProvider implements AIProvider {

    private final RestTemplate restTemplate;
    private final ObjectMapper mapper;
    private final String apiKey;
    private final String apiUrl;
    private final String model;

    public GroqProvider(RestTemplate restTemplate, ObjectMapper mapper,
                        @Value("${groq.api.key}") String apiKey,
                        @Value("${groq.api.url}") String apiUrl,
                        @Value("${groq.model}") String model) {
        this.restTemplate = restTemplate;
        this.mapper = mapper;
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.model = model;
    }

    @Override
    public boolean classifyTopic(String topic) {
        if (topic == null || topic.isBlank()) return false;
        log.info("Classifying topic '{}' using Groq", topic);
        
        try {
            String prompt = "Classify this topic: '" + topic + "'. Is it related to programming or tech interviews? Answer with ONLY 'Yes' or 'No'.";
            Map<String, Object> response = callGroqWithPrompt(prompt);
            String text = extractTextFromResponse(response).trim().toLowerCase();
            return text.contains("yes");
        } catch (Exception e) {
            log.error("Groq classification failed for topic '{}': {}", topic, e.getMessage());
            return false;
        }
    }

    private Map<String, Object> callGroqWithPrompt(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> systemMessage = Map.of(
                "role", "system",
                "content", "You are a specialized classifier. You must return only 'Yes' or 'No'."
        );
        Map<String, Object> userMessage = Map.of(
                "role", "user",
                "content", prompt
        );

        Map<String, Object> body = Map.of(
                "model", this.model,
                "messages", List.of(systemMessage, userMessage),
                "temperature", 0.0
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        return restTemplate.postForObject(apiUrl, request, Map.class);
    }

    @Override
    public String getName() {
        return "Groq";
    }

    @Override
    public List<InterviewQuestion> generateQuestions(String topic) throws Exception {
        log.info("Attempting to generate questions for topic '{}' with Groq model: {}", topic, model);
        Map<String, Object> response = callGroq(topic);
        List<InterviewQuestion> parsed = parseResponse(response, topic);
        if (!parsed.isEmpty()) {
            log.info("Successfully generated {} questions for topic '{}' using Groq model {}", parsed.size(), topic, model);
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

    private Map<String, Object> callGroq(String topic) {
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
                "temperature", 0.7
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        return restTemplate.postForObject(apiUrl, request, Map.class);
    }

    @SuppressWarnings("unchecked")
    private List<InterviewQuestion> parseResponse(Map<String, Object> response, String topic) throws IOException {
        if (response == null) return Collections.emptyList();

        String rawJson = extractTextFromResponse(response);
        String cleaned = rawJson.trim()
                .replaceAll("^```json\\s*", "")
                .replaceAll("^```\\s*", "")
                .replaceAll("\\s*```$", "")
                .trim();

        if (cleaned.isEmpty()) return Collections.emptyList();

        List<Map<String, Object>> items;
        if (cleaned.startsWith("[")) {
            items = mapper.readValue(cleaned, new TypeReference<>() {});
        } else {
            Map<String, Object> root = mapper.readValue(cleaned, new TypeReference<>() {});
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
            log.error("Failed to parse Groq response structure: {}", response, e);
            return "";
        }
    }
}
