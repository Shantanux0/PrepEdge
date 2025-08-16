package com.PrepEdgeAi.PrepEdge.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String topic;

    @Column(length = 2000)
    private String question;

    @Column(length = 4000)
    private String answer;

    private String difficulty; // easy, medium, hard
}
