package com.interview.challenge.player;

import com.interview.challenge.player.stats.PlayerStats;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Embedded;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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


    @Override
    public String toString() {
        return "Player{id=" + id + ", name='" + name + "', icon='" + icon + "', stats=" + stats + "}";
    }
}