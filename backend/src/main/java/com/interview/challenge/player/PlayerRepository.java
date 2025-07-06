package com.interview.challenge.player;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository // as a Spring Data JPA repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    // Spring Data JPA automatically provides methods like save(), findById(), findAll(), delete()

    Optional<Player> findByName(String name);
}