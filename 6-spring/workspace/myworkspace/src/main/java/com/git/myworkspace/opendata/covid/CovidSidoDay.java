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
