package com.git.myworkspace.opendata.covid;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.json.XML;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;

@Service
public class CovidService {
	
	private final String SERVICE_KEY="86nk%2BhuE1Dlj1MpCqXND3DK9g8JXv%2FmYKUfrGrjBl51b0%2BQ%2FloCFpC0629bkhVaI5U1Ddjpkr4HwTQyix7EM3w%3D%3D&pageNo=1&numOfRows=10&startCreateDt=20200410&endCreateDt=20200410";
	
	private CovidSidoRepository repo;
	
	@Autowired
	public CovidService(CovidSidoRepository repo) {
		this.repo = repo;
	}
	
	@Scheduled(fixedRate = 1000 * 60 * 60 * 1)
	public void requestCovid() throws IOException {
		String[] days = { "2021년 10월 01일 00시" };
		for (String day : days) {
			requestCovidSidoDay(day);
		}
	}

	@SuppressWarnings("deprecation")
	public void requestCovidSidoDay(String term) throws IOException{
		System.out.println(new Date().toLocaleString());
		
		StringBuilder builder = new StringBuilder();
		builder.append("http://openapi.data.go.kr/openapi");
		builder.append("/service");
		builder.append("/rest");
		builder.append("/Covid19");
		builder.append("/getCovid19SidoInfStateJson");
		builder.append("?pageNo=1&numOfRows=100");
//		builder.append("&startCreateDt=20200410");
//		builder.append("&endCreateDt=20200410");
		builder.append("&serviceKey=" + SERVICE_KEY);
		builder.append("&pageNo=1&numOfRows=10");

		
//		http://openapi.data.go.kr/openapi
//		/service
//		/rest
//		/Covid19
//		/getCovid19SidoInfStateJson
//		?pageNo=1&numOfRows=10
//		&startCreateDt=20200410
//		&endCreateDt=20200410
//		&serviceKey=86nk%2BhuE1Dlj1MpCqXND3DK9g8JXv%2FmYKUfrGrjBl51b0%2BQ%2FloCFpC0629bkhVaI5U1Ddjpkr4HwTQyix7EM3w%3D%3D
//		&pageNo=1
//		&numOfRows=10
//		&startCreateDt=20200410
//		&endCreateDt=20200410

		System.out.println(builder.toString());

		URL url = new URL(builder.toString());
		
		HttpURLConnection con = (HttpURLConnection) url.openConnection();

		byte[] result = con.getInputStream().readAllBytes();

		String data = new String(result, "UTF-8");

		System.out.println(data);

		String json = XML.toJSONObject(data).toString(2);

		System.out.println(json);

		CovidSidoDayResponse response = new Gson().fromJson(json, CovidSidoDayResponse.class);
		
		System.out.println(response);

		List<CovidSidoDay> list = new ArrayList<CovidSidoDay>();
		for(CovidSidoDayResponse.Item item:response
				.getResponse()
				.getBody().getItems().getItem()) {
			CovidSidoDay record = CovidSidoDay
					.builder()
					.stdDay(item.getStdDay())
					.gubun(item.getGubun())
					.defCnt(item.getDefCnt())
					.overFlowCnt(item.getOverFlowCnt())
					.localOccCnt(item.getLocalOccCnt())
					.isolIngCnt(item.getIsolIngCnt())
					.isolClearCnt(item.getIsolClearCnt())
					.deathCnt(item.getDeathCnt())
					.incDec(item.getIncDec())
					.build();
			
			list.add(record);

		}

repo.saveAll(list);

	}
}
