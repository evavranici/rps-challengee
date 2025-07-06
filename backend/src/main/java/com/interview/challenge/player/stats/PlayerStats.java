package com.interview.challenge.player.stats;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Convert;
import com.interview.challenge.shared.GameChoiceConverter;

import java.util.ArrayList;
import java.util.List;
import io.swagger.v3.oas.annotations.media.Schema;

@Embeddable // marking this class as embeddable within another entity
@Schema(description = "Detailed game statistics for a player")
public class PlayerStats {
    // getters and setters
    @Schema(description = "The player's current score (points for wins)", example = "1")
    private int playerScore = 0;

    @Schema(description = "The computer's current score (points from player's losses)", example = "1")
    private int computerScore = 0;

    @Schema(description = "Number of rounds the player has won", example = "1")
    private int playerWins = 0;

    @Schema(description = "Number of rounds the computer has won against this player", example = "1")
    private int computerWins = 0;

    @Schema(description = "History of player's choices (e.g., 'rock', 'paper')", example = "[\"scissors\", \"scissors\"]")
    @Convert(converter = GameChoiceConverter.class) // Custom converter for List<GameChoice>
    private List<String> playerHistory = new ArrayList<>(); // Store as String for simplicity or create enum/converter

    @Schema(description = "History of computer's choices against this player", example = "[\"paper\", \"rock\"]")
    @Convert(converter = GameChoiceConverter.class)
    private List<String> computerHistory = new ArrayList<>();

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

    public int getPlayerWins() {
        return playerWins;
    }
    public void setPlayerWins(int playerWins) {
        this.playerWins = playerWins;
    }

    public int getComputerWins() {
        return computerWins;
    }
    public void setComputerWins(int computerWins) {
        this.computerWins = computerWins;
    }

    public List<String> getPlayerHistory() {
        return playerHistory;
    }
    public void setPlayerHistory(List<String> playerHistory) {
        this.playerHistory = playerHistory;
    }

    public List<String> getComputerHistory() {
        return computerHistory;
    }
    public void setComputerHistory(List<String> computerHistory) {
        this.computerHistory = computerHistory;
    }

    public int getTotalRounds() {
        return totalRounds;
    }
    public void setTotalRounds(int totalRounds) {
        this.totalRounds = totalRounds;
    }
}