package com.interview.challenge.player;

import com.interview.challenge.player.stats.PlayerStats;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Embedded;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity // marking as a JPA entity for database mapping
@Schema(description = "Represents a player in the RPS game")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique ID of the player", example = "1")
    private Long id;

    @Schema(description = "The player's chosen name", example = "Eva")
    private String name;

    @Schema(description = "An emoji or icon representing the player", example = "🧑🏻‍✈️")
    private String icon;

    @Embedded // embedding the PlayerStats object directly into the Player table
    @Schema(description = "Detailed statistics for the player's game performance")
    private PlayerStats stats = new PlayerStats();

    public Player() {} // constructor

    public Player(String name, String icon) {
        this.name = name;
        this.icon = icon;
        this.stats = new PlayerStats();
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

    public PlayerStats getStats() {
        return stats;
    }
    public void setStats(PlayerStats stats) {
        this.stats = stats;
    }

    @Override
    public String toString() {
        return "Player{id=" + id + ", name='" + name + "', icon='" + icon + "', stats=" + stats + "}";
    }
}