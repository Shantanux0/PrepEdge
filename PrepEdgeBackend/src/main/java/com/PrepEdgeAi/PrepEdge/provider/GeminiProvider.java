package com.PrepEdgeAi.PrepEdge.provider;


import com.PrepEdgeAi.PrepEdge.Entity.InterviewQuestion;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class GeminiProvider implements AIProvider {

    private final RestTemplate restTemplate;
    private final ObjectMapper mapper;
    private final String apiKey;

    private static final List<String> MODEL_ORDER = List.of("gemini-1.5-flash", "gemini-1.5-flash-8b");

    public GeminiProvider(RestTemplate restTemplate, ObjectMapper mapper, @Value("${gemini.api.key}") String apiKey) {
        this.restTemplate = restTemplate;
        this.mapper = mapper;
        this.apiKey = apiKey;
    }

    @Override
    public String getName() {
        return "Gemini";
    }

    @Override
    public List<InterviewQuestion> generateQuestions(String topic) throws Exception {
        String prompt = buildPrompt(topic);

        for (String model : MODEL_ORDER) {
            try {
                log.info("Attempting to generate questions for topic '{}' with Gemini model: {}", topic, model);
                Map<String, Object> response = callGemini(model, prompt);
                List<InterviewQuestion> parsed = parseResponse(response, topic);
                if (!parsed.isEmpty()) {
                    log.info("Successfully generated {} questions for topic '{}' using Gemini model {}", parsed.size(), topic, model);
                    return parsed;
                }
                log.warn("Empty AI response from Gemini model {} for topic {}", model, topic);
            } catch (Exception e) {
                log.warn("Gemini model {} failed for topic '{}'. Error: {}", model, topic, e.getMessage());
                // Propagate the exception to let the orchestrator know this provider failed
                if (model.equals(MODEL_ORDER.get(MODEL_ORDER.size() - 1))) {
                    throw e;
                }
            }
        }
        // Should not be reached if at least one model is present, but as a safeguard:
        return Collections.emptyList();
    }

    private String buildPrompt(String topic) {
        return """
               You are an interview coach. Generate 10 compact Q&A snippets for the role/topic "%s".
               Each item must be a JSON object with fields: "question", "answer", "difficulty" (Easy|Medium|Hard).
               Keep answers to 2–4 sentences. Return ONLY a JSON array, no prose, no markdown fences.
               """.formatted(topic);
    }

    private Map<String, Object> callGemini(String model, String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey;
        Map<String, Object> body = Map.of("contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))));
        return restTemplate.postForObject(url, body, Map.class);
    }

    @SuppressWarnings("unchecked")
    private List<InterviewQuestion> parseResponse(Map<String, Object> response, String topic) throws IOException {
        if (response == null) return Collections.emptyList();

        String rawText = extractTextFromResponse(response).trim();
        String cleaned = rawText
                .replaceAll("^```json\\s*", "")
                .replaceAll("^```\\s*", "")
                .replaceAll("\\s*```$", "")
                .trim();

        if (cleaned.isEmpty()) return Collections.emptyList();

        List<Map<String, Object>> items = mapper.readValue(cleaned, new TypeReference<>() {});
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
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            return parts.get(0).get("text").toString();
        } catch (Exception e) {
            log.error("Failed to parse Gemini response structure: {}", response, e);
            return "";
        }
    }
}