package com.interview.challenge.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Schema(description = "Data Transfer Object for Leaderboard Player Stats displayed on the Leaderboard.")
public class LeaderboardPlayerStatsDto {
    // getters and setters
    @Schema(description = "Unique identifier of the player", example = "1")
    private Long id;

    @Schema(description = "Name of the player", example = "Woman Pilot")
    private String name;

    @Schema(description = "Emoji icon representing the player", example = "✈️")
    private String icon;

    @Schema(description = "Win percentage of the player", example = "77.0")
    private double winPercentage;

    @Schema(description = "Total number of games played by the player", example = "33")
    private int gamesPlayed;

    @Schema(description = "Calculated score based on Wilson Score Interval, used for ranking", example = "0.2117")
    private double score;

    // constructor
    public LeaderboardPlayerStatsDto(Long id, String name, String icon, double winPercentage, int gamesPlayed, double score) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.winPercentage = winPercentage;
        this.gamesPlayed = gamesPlayed;
        this.score = score;
    }

}