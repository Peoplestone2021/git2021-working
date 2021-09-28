package com.git.myworkspace.contact;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.git.myworkspace.lib.TextProcesser;
//import com.git.myworkspace.contact.Contact;

// REST API
// REST 방식으로 접근할 수 있는 인터페이스 제공하는 프로그램

//@Controller
//@ResponseBody

@RestController
public class ContactController {
	
	private ContactRepository repo;
	
	// HashMap 정렬이 안 됨: get(key) -> O(1)
	// ConcurrentSkipListMap 키 기준으로 정렬이 되었있음: get(key) -> O(long)
//	private SortedMap<Long, Contact> contacts=
//			Collections.synchronizedSortedMap(new TreeMap<Long, Contact>(Collections.reverseOrder()));
	// id값 생성에 사용할 변수
//	public AtomicLong maxId = new AtomicLong();
	// contact 목록조회
	// GET /contacts
	@Autowired
	public ContactController(ContactRepository repo) {
		this.repo=repo;
	}
	
	@GetMapping(value = "/contacts")
	public List<Contact> getContacts() throws InterruptedException {
		return repo.findAll(Sort.by("id").descending());
	}

	// contact 1건 추가
	// POST /contacts {"memo":"테스트입니다"}
	
	@GetMapping("/contacts/paging")
	public Page<Contact> getContactsPaging(@RequestParam int page, @RequestParam int size){
		return repo.findAll(PageRequest.of(page,  size, Sort.by("id").descending()));
	}
	
	@PostMapping(value = "/contacts")
	public Contact postContact(@RequestBody Contact contact, HttpServletResponse res) throws InterruptedException {
		// 데이터 검증 로직
		// 메모값이 없으면 에러처리함
		
//		Thread.sleep(2000);
		
		if(TextProcesser.isEmpyText(contact.getName())) {
			res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return null;
		}
		if(TextProcesser.isEmpyText(contact.getPhoneNumber())) {
			res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return null;
		}
		if(TextProcesser.isEmpyText(contact.getEmail())) {
			res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return null;
		}
		
//		if(contact.getName() == null || contact.getName().isEmpty()) {
//			// 클라이언트에서 메모값이 없이 보내거나 빈값으로 보낸 것임
//			// 클라이언트 오류, 4xx
//			// 요청값을 잘못보낸 것임 - Bad Request (400)
//			// res.setStatus(400);
//			
//			// Dispatcher Servlet이 생성한 응답객체에 status코드를 넣어줌
//			res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
//			return null;
//		}
		
		// id값을 생성
//		Long currentId = maxId.incrementAndGet();
		
		// 입력받은 데이터로 todo객체를 생성
		// id값과 생성일시는 서버에서 생성한 것으로 처리함
		// html태그가 있으면 날려버림(script에서 문제가 발생함)
		Contact contactItem = Contact.builder()
//								.id(contact.getId())
								.name(contact.getName())
								.phoneNumber(contact.getPhoneNumber())
								.email(contact.getEmail())
								.memo(TextProcesser.getPlainText(contact.getMemo())
//										.replaceAll("<(/)?([a-zA-Z]*)(\\s[a-zA-Z]*=[^>]*)?(\\s)*(/)?>", "")
										)
								.createdTime(new Date().getTime())
							.build();
		// todo 목록객체 추가
//		contacts.put(currentId, contactItem);
		Contact contactSaved = repo.save(contactItem);
		
		// 리소스 생성됨
		// res.setStatus(201);
		res.setStatus(HttpServletResponse.SC_CREATED);
		
		// 추가된 객체를 반환
//		return contactItem;
		return contactSaved;
	}
	
	@DeleteMapping(value="/contacts/{id}")
	public boolean removeContact(@PathVariable long id, HttpServletResponse res) throws InterruptedException {
//		Contact contact=contacts.get(Long.valueOf(id));
		Thread.sleep(5000);
		
		Optional<Contact> contact = repo.findById(id);
		if(contact.isEmpty()) {
			res.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return false;
		}
		
//		contacts.remove(Long.valueOf(id));
		repo.deleteById(id);

		return true;
	}
	

	
	@PutMapping(value="/contacts/{id}")
	public Contact modifyContact(@PathVariable long id, @RequestBody Contact contact, HttpServletResponse res) throws InterruptedException {
	
//		Contact findItem=contacts.get(Long.valueOf(id));
		Optional<Contact> contactItem = repo.findById(id);
		if(contactItem.isEmpty()) {
			res.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		if(TextProcesser.isEmpyText(contact.getName())) {
			res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return null;
		}
		if(TextProcesser.isEmpyText(contact.getPhoneNumber())) {
			res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return null;
		}
		if(TextProcesser.isEmpyText(contact.getEmail())) {
			res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return null;
		}
//		if(contact.getName()==null
//				||contact.getName().isEmpty()
//				||contact.getPhoneNumber()==null
//				||contact.getPhoneNumber().isEmpty()
//				||contact.getEMail()==null
//				||contact.getEMail().isEmpty()
//				) {
//			res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
//			return null;
//		}
		Contact contactToSave = contactItem.get();
		
		contactToSave.setName(contact.getName());
		contactToSave.setPhoneNumber(contact.getPhoneNumber());
		contactToSave.setEmail(contact.getEmail());
		contactToSave.setMemo(TextProcesser.getPlainText(contact.getMemo()));
		
		Contact contactSaved = repo.save(contactToSave);

		return contactSaved;
	}
}