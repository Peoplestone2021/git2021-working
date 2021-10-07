package com.git.myworkspace.opendata.covid;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Index;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(indexes = @Index(name = "idx_covid_sido_day_1", columnList = "GUBUN"))
@IdClass(CovidSidoDayId.class)
public class CovidSidoDay {
	@Id
	private String stdDay;
	@Id
	private String gubun;
	
	// 확진자 수
	private String defCnt;
	// 해외 유입 확진자 
	private Integer overFlowCnt;
	// 국내 발생 확진자
	private Integer localOccCnt;
	// 격리중인 확진자
	private Integer isolIngCnt;
	// 격리 해제 확진자 
	private Integer isolClearCnt;
	// 사망자 수
	private Integer deathCnt;
	// 전일대비 증감 수
	private Integer incDec;

}
