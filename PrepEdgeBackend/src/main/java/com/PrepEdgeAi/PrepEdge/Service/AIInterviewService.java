package com.PrepEdgeAi.PrepEdge.Service;

import com.PrepEdgeAi.PrepEdge.Entity.InterviewQuestion;
import com.PrepEdgeAi.PrepEdge.Repository.InterviewQuestionRepository;
import com.PrepEdgeAi.PrepEdge.Keyword.KeywordPacks;
import com.PrepEdgeAi.PrepEdge.provider.AIProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.Map;
@Service
@RequiredArgsConstructor
@Slf4j
public class AIInterviewService {

    private final InterviewQuestionRepository repository;
    private final List<AIProvider> aiProviders; // Spring will inject all beans that implement AIProvider

    private static final Set<String> VALID_KEYWORDS = KeywordPacks.getAllKeywords();

    /**
     * Generate interview questions for one or more topics (comma-separated).
     */
    public List<InterviewQuestion> generateQuestions(String topicString) {
        if (topicString == null || topicString.isBlank()) {
            throw new IllegalArgumentException("Topic cannot be empty.");
        }

        // 1. Parse and limit topics
        String[] rawTopics = topicString.split(",");
        List<String> topics = new ArrayList<>();
        for (String t : rawTopics) {
            String trimmed = t.trim();
            if (!trimmed.isEmpty()) {
                topics.add(trimmed);
            }
            if (topics.size() >= 3) break; // Hard limit of 3 topics
        }

        if (topics.isEmpty()) {
            throw new IllegalArgumentException("No valid topics provided.");
        }

        log.info("Processing {} topics: {}", topics.size(), topics);

        // 2. Process each topic
        List<InterviewQuestion> allQuestions = new ArrayList<>();
        
        for (String topic : topics) {
            try {
                final String safeTopic = normalize(topic);
                
                // Validate topic
                if (!isProgrammingTopicAI(safeTopic)) {
                    log.warn("Topic '{}' rejected as non-tech. Skipping.", safeTopic);
                    continue; // Skip invalid topics
                }

                log.info("Generating questions for topic: {}", safeTopic);
                boolean generated = false;

                for (AIProvider provider : aiProviders) {
                    try {
                        List<InterviewQuestion> questions = provider.generateQuestions(safeTopic);
                        if (questions != null && !questions.isEmpty()) {
                            allQuestions.addAll(questions);
                            repository.saveAll(questions);
                            generated = true;
                            break; // Stop after first successful provider for this topic
                        }
                    } catch (Exception e) {
                        log.warn("Provider '{}' failed for topic '{}'. Trying next. Error: {}",
                                provider.getName(), safeTopic, e.getMessage());
                    }
                }

                // Fallback for this specific topic if all providers fail
                if (!generated) {
                    log.warn("All AI providers failed for topic '{}'. Using fallback.", safeTopic);
                    List<InterviewQuestion> fallback = buildTopicAwareFallback(safeTopic);
                    allQuestions.addAll(fallback);
                    repository.saveAll(fallback);
                }

            } catch (Exception e) {
                log.error("Internal error processing topic '{}': {}", topic, e.getMessage());
            }
        }

        if (allQuestions.isEmpty()) {
            throw new IllegalArgumentException("Could not generate questions for the provided topics.");
        }

        return allQuestions;
    }

    /**
     * AI-based classification of topic.
     * Uses the primary AI provider for classification.
     */
    private boolean isProgrammingTopicAI(String topic) {
        if (topic == null || topic.isBlank()) return false;
        if (aiProviders.isEmpty()) {
            log.warn("No AI providers available for classification. Falling back to static keyword check.");
            return VALID_KEYWORDS.contains(topic.toLowerCase().trim());
        }

        // Try using the first available provider (which will be Groq)
        AIProvider provider = aiProviders.get(0);
        try {
            boolean isValid = provider.classifyTopic(topic);
            if (!isValid) {
                // Double check with keyword pack for robustness
                return VALID_KEYWORDS.contains(topic.toLowerCase().trim());
            }
            return true;
        } catch (Exception e) {
            log.warn("AI topic classification failed for '{}' using {}: {}. Falling back to static keyword check.",
                    topic, provider.getName(), e.getMessage());
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
     * Returns all currently supported keywords/topics.
     */
    public Set<String> getAllSupportedTopics() {
        return VALID_KEYWORDS;
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