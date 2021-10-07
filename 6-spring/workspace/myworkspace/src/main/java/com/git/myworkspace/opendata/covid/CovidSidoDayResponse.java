package com.git.myworkspace.opendata.covid;

import java.util.List;

import lombok.Data;

@Data
public class CovidSidoDayResponse {
	private Response response;

	@Data
	public class Response{
		private Header header;
		private Body body;
	}
	
	@Data
	public class Header {
		private String resultCode;
		private String resultMsg;
	}
	
	@Data
	public class Body {
		private Items items;
	}
	
	@Data
	public class Items {
		private List<Item> item;
	}

	@Data
	public class Item {
		private String stdDay;
		private String gubun;

//		확진자 수
		private String defCnt;
		// 해외 유입 확진자 
		private String overFlowCnt;
		// 국내 발생 확진자
		private String localOccCnt;
		// 격리중인 확진자
		private String isolIngCnt;
		// 격리 해제 확진자 
		private String isolClearCnt;
		// 사망자 수
		private String deathCnt;
		// 전일대비 증감 수
		private String incDec;
		
	}

}
