package com.git.myworkspace.opendata.covid;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
//import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.json.XML;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;

@Service
public class CovidService {
	
	private final String SERVICE_KEY="86nk%2BhuE1Dlj1MpCqXND3DK9g8JXv%2FmYKUfrGrjBl51b0%2BQ%2FloCFpC0629bkhVaI5U1Ddjpkr4HwTQyix7EM3w%3D%3D";
	
	private CovidSidoRepository repo;
	
	@Autowired
	public CovidService(CovidSidoRepository repo) {
		this.repo = repo;
	}
	
//	@Scheduled(fixedRate = 1000 * 60 * 60 * 1)
	@Scheduled(cron = "0 0 12 * * *")
//	@Scheduled(cron = "0 * * * * *")
	@CacheEvict(value = "covid-current", allEntries = true)
	public void requestCovid() throws IOException {
		String[] gubuns = { "서울" };
		for (String gubun : gubuns) {
			requestCovidSidoDay(gubun);
//			System.out.println(gubuns);
		}
	}

	@SuppressWarnings("deprecation")
	public void requestCovidSidoDay(String gubun) throws IOException{
		System.out.println(new Date().toLocaleString());
		
		StringBuilder builder = new StringBuilder();
		builder.append("http://openapi.data.go.kr/openapi");
		builder.append("/service");
		builder.append("/rest");
		builder.append("/Covid19");
		builder.append("/getCovid19SidoInfStateJson");
		builder.append("?pageNo=1&numOfRows=10");
//		builder.append("?pageNo=1&numOfRows=100");
		builder.append("&startCreateDt=20211111");
//		builder.append("&endCreateDt="+ gubun);
		builder.append("&endCreateDt=20211114");
		builder.append("&serviceKey=" + SERVICE_KEY);
//		http://openapi.data.go.kr/openapi
//			/service
//			/rest
//			/Covid19
//			/getCovid19SidoInfStateJson
//			?pageNo=1
//			&numOfRows=10
//			&serviceKey=
		
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

//		System.out.println(builder.toString());

		URL url = new URL(builder.toString());
		
		HttpURLConnection con = (HttpURLConnection) url.openConnection();

		byte[] result = con.getInputStream().readAllBytes();
		
//		System.out.println("result: "+ result);

		String data = new String(result, "UTF-8");

//		System.out.println(data);

		String json = XML.toJSONObject(data).toString(2);

		System.out.println("json: "+json +"==== json end");

		CovidSidoDayResponse response = new Gson().fromJson(json, CovidSidoDayResponse.class);
		
//		System.out.println(response);

		List<CovidSidoDay> list = new ArrayList<CovidSidoDay>();
		for(CovidSidoDayResponse.Item item:response
				.getResponse()
				.getBody().getItems().getItem()) {
			CovidSidoDay record = CovidSidoDay
					.builder()
					.stdDay(item.getStdDay())
					.gubun(item.getGubun())
					.defCnt(item.getDefCnt()
							.isEmpty() ? null : Integer
							.valueOf(item.getDefCnt()))
					.overFlowCnt(item.getOverFlowCnt()
							.isEmpty() ? null : Integer
							.valueOf(item.getOverFlowCnt()))
					.localOccCnt(item.getLocalOccCnt()
							.isEmpty() ? null : Integer
									.valueOf(item.getLocalOccCnt()))
//					21-12-06	json 데이터 형식 변경으로 추정 
//					.isolIngCnt(item.getIsolIngCnt()
//							.isEmpty() ? null : Integer.valueOf(item.getIsolIngCnt()))
					.isolClearCnt(item.getIsolClearCnt()
							.isEmpty() ? null : Integer.valueOf(item.getIsolClearCnt()))
					.deathCnt(item.getDeathCnt()
							.isEmpty() ? null : Integer.valueOf(item.getDeathCnt()))
					.incDec(item.getIncDec()
							.isEmpty() ? null : Integer.valueOf(item.getIncDec()))
					.build();
			
			list.add(record);

		}

repo.saveAll(list);

	}
}
