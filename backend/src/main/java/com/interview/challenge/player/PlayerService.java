package com.interview.challenge.player;

import com.interview.challenge.player.stats.PlayerStats;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;

    @Autowired // Injects PlayerRepository
    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public Optional<Player> getPlayerById(Long id) {
        return playerRepository.findById(id);
    }

    public List<Player> findAll() {
        return playerRepository.findAll();
    }

    public Player createPlayer(Player player) {
        // add validation here, to see if name already exists
        return playerRepository.save(player);
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
    public Player updatePlayerStats(Long playerId, PlayerStats updatedStats) {
        return playerRepository.findById(playerId).map(player -> {
            player.setStats(updatedStats);
            return playerRepository.save(player);
        }).orElseThrow(() -> new IllegalArgumentException("Player not found with id: " + playerId));
    }

    /**
     * Resets all game statistics for a specific player to their initial values.
     *
     * @param playerId The ID of the player whose stats are to be reset.
     * @return The player entity with reset statistics.
     */
    @Transactional
    public Player resetPlayerStats(Long playerId) {
        return playerRepository.findById(playerId).map(player -> {
            // Create a new, fresh PlayerStats object with default values
            player.setStats(new PlayerStats());
            return playerRepository.save(player);
        }).orElseThrow(() -> new IllegalArgumentException("Player not found with id: " + playerId));
    }
}