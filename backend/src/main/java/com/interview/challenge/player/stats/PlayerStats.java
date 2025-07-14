package com.interview.challenge.player.stats;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.util.ArrayList;
import java.util.List;
import io.swagger.v3.oas.annotations.media.Schema;

@Embeddable // marking this class as embeddable within another entity
@Schema(
        description = "Detailed game statistics for a player",
        requiredProperties = {
                "playerScore",
                "computerScore",
                "playerHistory",
                "computerHistory",
                "totalRounds",
        }
)
public class PlayerStats {
    // getters and setters
    @Min(value = 0, message = "Score cannot be negative")
    @Schema(description = "The player's current score (points for wins)", example = "1")
    private int playerScore = 0;

    @Min(value = 0, message = "Score cannot be negative")
    @Schema(description = "The computer's current score (points from player's losses)", example = "1")
    private int computerScore = 0;

    @ElementCollection(targetClass = GameChoice.class)
    @Enumerated(EnumType.STRING)
    @Schema(description = "History of player's choices (e.g., 'rock', 'paper')", example = "[\"scissors\", \"scissors\"]")
    private List<GameChoice> playerHistory = new ArrayList<>();

    @ElementCollection(targetClass = GameChoice.class)
    @Enumerated(EnumType.STRING)
    @Schema(description = "History of computer's choices against this player", example = "[\"paper\", \"rock\"]")
    private List<GameChoice> computerHistory = new ArrayList<>();

    @Min(value = 0, message = "Total nr. of rounds cannot be negative")
    @Schema(description = "Total number of rounds played by this player", example = "2")
    private int totalRounds = 0;

    // default constructor (required by JPA)
    public PlayerStats() {}

    // getters and setters
    public int getPlayerScore() {
        return playerScore;
    }
    public void setPlayerScore(int playerScore) {
        this.playerScore = playerScore;
    }

    public int getComputerScore() {
        return computerScore;
    }
    public void setComputerScore(int computerScore) {
        this.computerScore = computerScore;
    }

    public List<GameChoice> getPlayerHistory() {
        return playerHistory;
    }
    public void setPlayerHistory(List<GameChoice> playerHistory) {
        this.playerHistory = trimToLastFive(playerHistory);
    }

    public List<GameChoice> getComputerHistory() {
        return computerHistory;
    }
    public void setComputerHistory(List<GameChoice> computerHistory) {
        this.computerHistory = trimToLastFive(computerHistory);
    }

    public int getTotalRounds() {
        return totalRounds;
    }
    public void setTotalRounds(int totalRounds) {
        this.totalRounds = totalRounds;
    }

    private List<GameChoice> trimToLastFive(List<GameChoice> history) {
        if (history == null || history.isEmpty()) return new ArrayList<>();
        int size = history.size();
        return new ArrayList<>(history.subList(Math.max(size - 5, 0), size));
    }
}