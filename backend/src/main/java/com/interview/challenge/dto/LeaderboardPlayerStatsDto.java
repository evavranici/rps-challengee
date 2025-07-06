package com.interview.challenge.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Data Transfer Object for Leaderboard Player Stats displayed on the Leaderboard.")
public class LeaderboardPlayerStatsDto {
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

    // getters and setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getIcon() {
        return icon;
    }
    public void setIcon(String icon) {
        this.icon = icon;
    }

    public double getWinPercentage() {
        return winPercentage;
    }
    public void setWinPercentage(double winPercentage) {
        this.winPercentage = winPercentage;
    }

    public int getGamesPlayed() {
        return gamesPlayed;
    }
    public void setGamesPlayed(int gamesPlayed) {
        this.gamesPlayed = gamesPlayed;
    }

    public double getScore() {
        return score;
    }
    public void setScore(double score) {
        this.score = score;
    }
}