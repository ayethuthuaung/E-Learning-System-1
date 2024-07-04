package com.ai.e_learning.repository;

import com.ai.e_learning.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModuleRepository extends JpaRepository<Module, Long> {
}
