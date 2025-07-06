package com.interview.challenge.player;

import com.interview.challenge.dto.PlayerSimplifiedDto;
import com.interview.challenge.player.stats.PlayerStats;
import io.micrometer.core.annotation.Timed;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;

    // Micrometer Counters
    private final Counter playersCreatedCounter;
    private final Counter playerStatsUpdatedCounter;
    private final Counter playerStatsResetCounter;

    @Autowired // Injects ...
    public PlayerService(PlayerRepository playerRepository, MeterRegistry meterRegistry) {
        this.playerRepository = playerRepository;
        this.playersCreatedCounter = meterRegistry.counter("player.created.total", "source", "api");
        this.playerStatsUpdatedCounter = meterRegistry.counter("player.stats.updated.total", "source", "api");
        this.playerStatsResetCounter = meterRegistry.counter("player.stats.reset.total", "source", "api");
    }

    public List<PlayerSimplifiedDto> getAllPlayers() {
        List<Player> players = playerRepository.findAll();

        // Map Player entities to PlayerSummaryDTOs
        return players.stream()
            .map(player -> new PlayerSimplifiedDto(player.getId(), player.getName(), player.getIcon()))
            .collect(Collectors.toList());
    }

    public Optional<Player> getPlayerById(Long id) {
        return playerRepository.findById(id);
    }

    public List<Player> findAll() {
        return playerRepository.findAll();
    }

    public Player createPlayer(Player player) {
        // add validation here, to see if name already exists
        Player createdPlayer = playerRepository.save(player);
        playersCreatedCounter.increment();
        return createdPlayer;
    }

    public void deletePlayer(Long id) {
        playerRepository.deleteById(id);
    }

    public Optional<Player> getPlayerByName(String name) {
        return playerRepository.findByName(name);
    }

    public Optional<Player> findById(Long id) {
        return playerRepository.findById(id);
    }

    /**
     * Updates the detailed game statistics for a specific player.
     *
     * @param playerId The ID of the player whose stats are to be updated.
     * @param updatedStats The PlayerStats object containing the new statistical data.
     * @return The updated Player entity.
     */
    @Transactional // Ensures the entire operation is atomic
    @Timed(value = "player.stats.update.duration", description = "Time taken to update player statistics")
    public Player updatePlayerStats(Long playerId, PlayerStats updatedStats) {
        return playerRepository.findById(playerId).map(player -> {
            player.setStats(updatedStats);
            Player savedPlayer = playerRepository.save(player);
            playerStatsUpdatedCounter.increment();
            return savedPlayer;
        }).orElseThrow(() -> new IllegalArgumentException("Player not found with id: " + playerId));
    }

    /**
     * Resets all game statistics for a specific player to their initial values.
     *
     * @param playerId The ID of the player whose stats are to be reset.
     * @return The player entity with reset statistics.
     */
    @Transactional
    @Timed(value = "player.stats.reset.duration", description = "Time taken to reset player statistics")
    public Player resetPlayerStats(Long playerId) {
        return playerRepository.findById(playerId).map(player -> {
            // Create a new, fresh PlayerStats object with default values
            player.setStats(new PlayerStats());
            Player savedPlayer = playerRepository.save(player);
            playerStatsResetCounter.increment();
            return savedPlayer;
        }).orElseThrow(() -> new IllegalArgumentException("Player not found with id: " + playerId));
    }
}