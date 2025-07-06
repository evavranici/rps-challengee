package com.interview.challenge.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Schema(description = "Summary of a player's basic information")
public class PlayerSimplifiedDto {
    // getters and setters
    @Schema(description = "Unique identifier of the player")
    private Long id;

    @Schema(description = "Name of the player/pilot")
    private String name;

    @Schema(description = "Icon representing the player")
    private String icon;

    // constructor
    public PlayerSimplifiedDto(Long id, String name, String icon) {
        this.id = id;
        this.name = name;
        this.icon = icon;
    }

    @Override
    public String toString() {
        return "PlayerSimplifiedDTO{" +
            "id='" + id + '\'' +
            ", name='" + name + '\'' +
            ", icon='" + icon + '\'' +
            '}';
    }
}