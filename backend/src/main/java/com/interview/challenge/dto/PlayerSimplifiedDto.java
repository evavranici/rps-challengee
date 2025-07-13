package com.interview.challenge.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
//import lombok.Getter;
//import lombok.Setter;

@Schema(
        description = "Summary of a player's basic information",
        requiredProperties = {
                "id",
                "name",
                "icon",
        }
)
public class PlayerSimplifiedDto {
    // getters and setters
    @NotNull(message = "Id cannot be null")
    @Schema(description = "Unique identifier of the player")
    private Long id;

    @NotBlank(message = "Name cannot be blank")
    @Schema(description = "Name of the player")
    private String name;

    @NotBlank(message = "Icon cannot be blank")
    @Schema(description = "Icon representing the player")
    private String icon;

    // constructor
    public PlayerSimplifiedDto(Long id, String name, String icon) {
        this.id = id;
        this.name = name;
        this.icon = icon;
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

    @Override
    public String toString() {
        return "PlayerSimplifiedDTO{" +
            "id='" + id + '\'' +
            ", name='" + name + '\'' +
            ", icon='" + icon + '\'' +
            '}';
    }
}