package com.git.myworkspace.opendata.covid;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Component("covidController")
@RestController
@RequestMapping(value = "/opendata/covid")
public class CovidController {
	private CovidSidoRepository repo;
	private final String cachName = "covid-current";
	
	@Autowired
	private CovidController(CovidSidoRepository repo) {
		this.repo = repo;
	}

//	@Cacheable(value = cachName, key="'all'")
	@GetMapping(value = "/sido/current")
	public List<CovidSidoDay> getCovidSidoCurrent() {
		List<Order> orders = new ArrayList<Order>();
		orders.add(new Order(Sort.Direction.DESC, "stdDay"));
		orders.add(new Order(Sort.Direction.ASC, "gubun"));
	
	return repo.findAll(PageRequest.of(0, 25, Sort.by(orders))).toList();
	}
	
//	select * from covid_sido_day csd 
//	order by std_day desc, gubun asc
//	limit 25;	
	
//	@Cacheable(value = cachName, key="#gubun")
	@GetMapping(value="/sido/current/{gubun}")
	public List<CovidSidoDay> getCovidSidoCurrent(@PathVariable String gubun) {
		Pageable page = PageRequest.of(0, 14, Sort.by("stdDay").descending());
		return repo.findByGubun(page, gubun);
	}

	

}
