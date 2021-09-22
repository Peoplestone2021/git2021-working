package com.git.controller.contact;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.concurrent.atomic.AtomicLong;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

// REST API
// REST 방식으로 접근할 수 있는 인터페이스 제공하는 프로그램

//@Controller
//@ResponseBody
@RestController
public class ContactController {
	// HashMap 정렬이 안 됨: get(key) -> O(1)
	// ConcurrentSkipListMap 키 기준으로 정렬이 되었있음: get(key) -> O(long)
	private SortedMap<Long, Contact> contacts=
			Collections.synchronizedSortedMap(new TreeMap<Long, Contact>(Collections.reverseOrder()));
	
	// id값 생성에 사용할 변수
	public AtomicLong maxId = new AtomicLong();

	// contact 목록조회
	// GET /contacts
	@GetMapping(value = "/contacts")
	public List<Contact> getContacts() {
		return new ArrayList<Contact>(contacts.values());
	}

	// contact 1건 추가
	// POST /contacts {"memo":"테스트입니다"}
	@PostMapping(value = "/contacts")
	public Contact postContact(@RequestBody Contact contact, HttpServletResponse res) {
		// 데이터 검증 로직
		// 메모값이 없으면 에러처리함
		if(contact.getName() == null || contact.getName().isEmpty()) {
			// 클라이언트에서 메모값이 없이 보내거나 빈값으로 보낸 것임
			// 클라이언트 오류, 4xx
			// 요청값을 잘못보낸 것임 - Bad Request (400)
			// res.setStatus(400);
			
			// Dispatcher Servlet이 생성한 응답객체에 status코드를 넣어줌
			res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return null;
		}
		
		// id값을 생성
		Long currentId = maxId.incrementAndGet();
		
		// 입력받은 데이터로 todo객체를 생성
		// id값과 생성일시는 서버에서 생성한 것으로 처리함
		// html태그가 있으면 날려버림(script에서 문제가 발생함)
		Contact contactItem = Contact.builder()
								.id(currentId)
								.name(contact.getName())
								.phoneNumber(contact.getPhoneNumber())
								.eMail(contact.getEMail())
								.memo(contact.getMemo()
//										.replaceAll("<(/)?([a-zA-Z]*)(\\s[a-zA-Z]*=[^>]*)?(\\s)*(/)?>", "")
										)
								.createdTime(new Date().getTime())
							.build();
		// todo 목록객체 추가
		contacts.put(currentId, contactItem);
		
		// 리소스 생성됨
		// res.setStatus(201);
		res.setStatus(HttpServletResponse.SC_CREATED);
		
		// 추가된 객체를 반환
		return contactItem;
	}
	
	@DeleteMapping(value="/contacts/{id}")
	public boolean removeContact(@PathVariable long id, HttpServletResponse res) {
		Contact contact=contacts.get(Long.valueOf(id));
		
		if(contact==null) {
			res.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return false;
		}
		
		contacts.remove(Long.valueOf(id));
		return true;
	}
	
	@PutMapping(value="/contacts/{id}")
	public Contact modifyContact(@PathVariable long id, @RequestBody Contact contact, HttpServletResponse res) {
		Contact findItem=contacts.get(Long.valueOf(id));
		if(findItem==null) {
			res.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		if(contact.getName()==null
				||contact.getName().isEmpty()
				||contact.getPhoneNumber()==null
				||contact.getPhoneNumber().isEmpty()
				||contact.getEMail()==null
				||contact.getEMail().isEmpty()
				) {
			res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return null;
		}
		
		findItem.setName(contact.getName());
		findItem.setPhoneNumber(contact.getPhoneNumber());
		findItem.setEMail(contact.getEMail());
		findItem.setMemo(contact.getMemo());
		
		return findItem;
	}
}