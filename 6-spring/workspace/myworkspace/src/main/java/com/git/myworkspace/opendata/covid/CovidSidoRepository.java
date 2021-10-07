package com.git.myworkspace.opendata.covid;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.git.myworkspace.opendata.air.AirSigunguHour;

@Repository
public interface CovidSidoRepository extends JpaRepository<CovidSidoDay, Long> {

	List<CovidSidoDay> findByGubun(Pageable page, String gubun);
}
