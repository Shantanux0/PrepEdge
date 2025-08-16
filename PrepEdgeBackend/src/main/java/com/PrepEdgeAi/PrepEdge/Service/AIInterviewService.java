package com.PrepEdgeAi.PrepEdge.Service;

import com.PrepEdgeAi.PrepEdge.Entity.InterviewQuestion;
import com.PrepEdgeAi.PrepEdge.Keyword.KeywordPacks;
import com.PrepEdgeAi.PrepEdge.Repository.InterviewQuestionRepository;
import com.PrepEdgeAi.PrepEdge.provider.AIProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIInterviewService {

    private final InterviewQuestionRepository repository;
    private final List<AIProvider> aiProviders; // Spring will inject all beans that implement AIProvider
    private final RestTemplate restTemplate; // Still needed for topic classification

    @Value("${gemini.api.key}")
    private String geminiApiKey; // Keep for the classifier

    private static final Set<String> VALID_KEYWORDS = KeywordPacks.getAllKeywords();

    /**
     * Generate interview questions for a given topic by trying providers in order.
     */
    public List<InterviewQuestion> generateQuestions(String topic) {
        final String safeTopic = normalize(topic);

        if (!isProgrammingTopicAI(safeTopic)) {
            throw new IllegalArgumentException("Topic is not recognized as programming-related.");
        }

        log.info("Generating questions for topic: {}", safeTopic);

        for (AIProvider provider : aiProviders) {
            try {
                List<InterviewQuestion> questions = provider.generateQuestions(safeTopic);
                if (questions != null && !questions.isEmpty()) {
                    repository.saveAll(questions);
                    return questions;
                }
            } catch (Exception e) {
                log.warn("Provider '{}' failed for topic '{}'. Trying next provider. Error: {}",
                        provider.getName(), safeTopic, e.getMessage());
            }
        }

        // Fallback if all AI providers fail
        log.error("All AI providers failed. Returning topic-aware fallback for: {}", safeTopic);
        List<InterviewQuestion> fallback = buildTopicAwareFallback(safeTopic);
        repository.saveAll(fallback);
        return fallback;
    }

    /**
     * AI-based classification of topic.
     * NOTE: The classification logic still uses Gemini directly for simplicity.
     * This could also be refactored to use the provider pattern if desired.
     */
    @SuppressWarnings("unchecked")
    private boolean isProgrammingTopicAI(String topic) {
        if (topic == null || topic.isBlank()) return false;
        String prompt = "Classify this topic: '" + topic + "'. Is it related to programming or not? Answer with 'Yes' or 'No'.";
        try {
            // Corrected URL syntax
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;
            Map<String, Object> body = Map.of("contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))));
            Map<String, Object> aiResponse = restTemplate.postForObject(url, body, Map.class);

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) aiResponse.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String text = parts.get(0).get("text").toString().trim().toLowerCase();

            return text.contains("yes");
        } catch (Exception e) {
            log.warn("AI topic classification failed for '{}': {}. Falling back to static keyword check.", topic, e.getMessage());
            return VALID_KEYWORDS.contains(topic.toLowerCase().trim());
        }
    }

    /**
     * Normalize input strings.
     */
    private String normalize(String s) {
        return s == null ? "" : s.trim();
    }


    /**
     * Builds a list of topic-aware fallback questions if all AI providers fail.
     * These questions are generic templates filled with the specific topic.
     */
    private List<InterviewQuestion> buildTopicAwareFallback(String topic) {
        String t = topic == null || topic.isBlank() ? "your topic" : topic;
        List<InterviewQuestion> list = new ArrayList<>();

        list.add(q(t, "What is %s and where is it used?".formatted(t),
                "Give a concise definition and two core use cases. Mention when you’d choose %s over alternatives.".formatted(t),
                "Easy"));

        list.add(q(t, "List the core concepts or building blocks of %s.".formatted(t),
                "Outline 4–6 key components with one‑line explanations so an interviewer sees breadth quickly.",
                "Easy"));

        list.add(q(t, "How do you structure a small project in %s?".formatted(t),
                "Describe a sensible folder/module layout, dependency management, configuration handling, and environment setup.",
                "Medium"));

        list.add(q(t, "How do you handle errors and logging in %s?".formatted(t),
                "Explain error types, when to fail fast, logging levels, correlation IDs, and basic monitoring.",
                "Medium"));

        list.add(q(t, "What are common pitfalls in %s and how do you avoid them?".formatted(t),
                "Name 3–5 pitfalls and a mitigation for each so you show practical experience.",
                "Medium"));

        list.add(q(t, "How would you improve performance in %s?".formatted(t),
                "Cover profiling, caching, I/O strategy, and data‑structure choices that matter most.",
                "Hard"));

        list.add(q(t, "What are key security considerations for %s?".formatted(t),
                "Discuss input validation, authentication/authorization, secrets management, and common vulnerabilities.",
                "Hard"));

        list.add(q(t, "How do you test %s effectively?".formatted(t),
                "Clarify unit vs integration tests, mocking/fakes, minimal test data, and CI basics.",
                "Easy"));

        list.add(q(t, "Design a production‑ready %s service.".formatted(t),
                "Talk through scalability, observability, configuration, zero‑downtime deploys, and rollback strategy.",
                "Hard"));

        list.add(q(t, "What recent trends or tools matter in the %s ecosystem?".formatted(t),
                "Mention two current tools or practices and why they’re useful in real projects.",
                "Medium"));

        return list;
    }

    /**
     * Helper method to create an InterviewQuestion entity.
     */
    private InterviewQuestion q(String topic, String question, String answer, String difficulty) {
        return new InterviewQuestion(null, topic, question, answer, difficulty);
    }
}