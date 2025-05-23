package com.RealCar.Service.RealCar.Service.repository;

import com.RealCar.Service.RealCar.Service.Service.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}
