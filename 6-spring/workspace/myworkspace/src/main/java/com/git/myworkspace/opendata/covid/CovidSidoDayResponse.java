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
		
		// Ȯ����
		private String defCnt;
		// �ؿ� ���� Ȯ���� 
		private String overFlowCnt;
		// ���� �߻� Ȯ����
		private String localOccCnt;
		// �ݸ����� Ȯ����
		private String isolIngCnt;
		// �ݸ� ���� Ȯ���� 
		private String isolClearCnt;
		// ����� ��
		private String deathCnt;
		// ���ϴ�� ���� ��
		private String incDec;
		
	}

}
