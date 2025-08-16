package com.PrepEdgeAi.PrepEdge.provider;


import com.PrepEdgeAi.PrepEdge.Entity.InterviewQuestion;

import java.util.List;

/**
 * Interface for AI providers that can generate interview questions.
 */
public interface AIProvider {

    /**
     * Generates a list of interview questions for a given topic.
     *
     * @param topic The programming topic.
     * @return A list of InterviewQuestion objects.
     * @throws Exception if the provider fails to generate questions.
     */
    List<InterviewQuestion> generateQuestions(String topic) throws Exception;

    /**
     * Gets the name of the provider for logging purposes.
     *
     * @return The provider's name (e.g., "Gemini", "GPT").
     */
    String getName();
}