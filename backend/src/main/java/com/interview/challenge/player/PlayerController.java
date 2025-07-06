package com.interview.challenge.player;

import com.interview.challenge.dto.LeaderboardPlayerStatsDto;
import com.interview.challenge.dto.PlayerSimplifiedDto;
import com.interview.challenge.player.stats.PlayerStats;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/players")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Player Management", description = "Endpoints for creating and retrieving players")
public class PlayerController {

    private final PlayerService playerService;

    @Autowired
    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @Operation(summary = "Get player by ID", description = "Retrieves a single player's details by their ID.")
    @ApiResponse(responseCode = "200", description = "Player found")
    @ApiResponse(responseCode = "404", description = "Player not found")
    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayerById(@Parameter(description = "ID of the player to retrieve", required = true) @PathVariable Long id) {
        return playerService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Reset player's score",
            description = "Resets the wins and games played for a specific player to zero. " +
                    "Acting as a 'new' player for ranking purposes.")
    @ApiResponse(responseCode = "200", description = "Player score reset successfully")
    @ApiResponse(responseCode = "404", description = "Player not found")
    @PutMapping("/{id}/reset-stats") // Use PUT as it's an update
    public ResponseEntity<Player> resetPlayerStats(@Parameter(description = "ID of the player to reset score for", required = true) @PathVariable Long id) {
        try {
            Player resetPlayer = playerService.resetPlayerStats(id);
            return ResponseEntity.ok(resetPlayer);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Get all registered players",
            description = "Retrieves a list of all existing players in the game.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list of players",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = PlayerSimplifiedDto.class))) // Use Player.class for list
    @GetMapping
    public ResponseEntity<List<PlayerSimplifiedDto>> getAllPlayers() {
        List<PlayerSimplifiedDto> players = playerService.getAllPlayers();
        return ResponseEntity.ok(players);
    }

    @Operation(summary = "Create a new player",
            description = "Registers a new player in the game with a unique name and an optional icon.")
    @ApiResponse(responseCode = "201", description = "Player created successfully",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Player.class)))
    @ApiResponse(responseCode = "400", description = "Invalid player data provided",
            content = @Content(mediaType = "text/plain")) // Example for plain text error
    @PostMapping
    public ResponseEntity<Player> createPlayer(@RequestBody Player player) {
        if (player.getName() == null || player.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        if (playerService.getPlayerByName(player.getName()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }

        Player createdPlayer = playerService.createPlayer(player);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPlayer);
    }

    @PutMapping("/{id}/stats")
    public ResponseEntity<Player> updatePlayerStats(
            @PathVariable Long id,
            @RequestBody PlayerStats updatedStats) {
        try {
            Player updatedPlayer = playerService.updatePlayerStats(id, updatedStats);
            return ResponseEntity.ok(updatedPlayer);
        } catch (IllegalArgumentException e) {
            // Log the error for debugging
            System.err.println("Error updating player stats for ID: " + id + " - " + e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            // Catch any other unexpected errors
            System.err.println("An unexpected error occurred while updating player stats for ID: " + id + " - " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/leaderboard-stats")
    public List<LeaderboardPlayerStatsDto> getDashboardStats() {
        List<Player> players = playerService.findAll();
        List<LeaderboardPlayerStatsDto> stats = players.stream()
                .map(player -> {
                    int wins = player.getStats().getPlayerWins();
                    int gamesPlayed = player.getStats().getTotalRounds();

                    double winPercentage = (gamesPlayed > 0) ? ((double) wins / gamesPlayed) * 100.0 : 0.0;
                    // Round win percentage for display
                    winPercentage = Math.round(winPercentage * 100.0) / 100.0;

                    // Calculate Wilson Score Interval (lower bound) for ranking
                    // z-score for 95% confidence is approximately 1.96
                    double z = 1.96;
                    double wilsonScore = calculateWilsonScore(wins, gamesPlayed, z);

                    return new LeaderboardPlayerStatsDto(player.getId(), player.getName(), player.getIcon(),
                            winPercentage, gamesPlayed, wilsonScore);
                })
                // Sort by Wilson Score in descending order, then by name for ties
                .sorted(Comparator.comparing(LeaderboardPlayerStatsDto::getScore).reversed()
                        .thenComparing(LeaderboardPlayerStatsDto::getName))
                .collect(Collectors.toList());

        return stats;
    }

    private double calculateWilsonScore(int wins, int totalGames, double z) {
        if (totalGames == 0) {
            return 0.0; // If no games, score is 0.0
        }

        double p_hat = (double) wins / totalGames;
        double z_sq = z * z;

        double numerator = p_hat + (z_sq / (2 * totalGames)) -
                z * Math.sqrt((p_hat * (1 - p_hat) / totalGames) + (z_sq / (4 * totalGames * totalGames)));
        double denominator = 1 + (z_sq / totalGames);

        return numerator / denominator;
    }
}