package com.example.commerce.order;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;

import org.hibernate.annotations.Formula;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
//엔터티 모델
@Entity
public class CommerceOrder {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id; // 자동증가값
	private String name; // 주문자명
	private String address; // 주소
	private String date; // 주문일자
	private int totalAmount; // 총 주문금액
	// 하위 레코드 개수
	@Formula("(SELECT COUNT(1) FROM commerce_order_detail d WHERE d.commerce_order_id = id)")
	private int detailCnt;
	// 하위 레코드 중 첫번째 레코드의 정보
	@Formula("(SELECT d.product_name FROM commerce_order_detail d WHERE d.commerce_order_id = id LIMIT 1)")
	private String firstProductName;
	// 주문 제품 정보 목록
	// Entity Relationship 어노테이션을 넣으면 같이 조회됨
	// 기본적으로 FetchType.Lazy
	@OneToMany
	@JoinColumn(name = "commerceOrderId")
	private List<CommerceOrderDetail> details;
	private String status; // 상태
	private long createdTime; // 생성시간

}
