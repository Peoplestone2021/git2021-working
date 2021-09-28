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
// REST ������� ������ �� �ִ� �������̽� �����ϴ� ���α׷�

//@Controller
//@ResponseBody

@RestController
public class ContactController {
	
	private ContactRepository repo;
	
	// HashMap ������ �� ��: get(key) -> O(1)
	// ConcurrentSkipListMap Ű �������� ������ �Ǿ�����: get(key) -> O(long)
//	private SortedMap<Long, Contact> contacts=
//			Collections.synchronizedSortedMap(new TreeMap<Long, Contact>(Collections.reverseOrder()));
	// id�� ������ ����� ����
//	public AtomicLong maxId = new AtomicLong();
	// contact �����ȸ
	// GET /contacts
	@Autowired
	public ContactController(ContactRepository repo) {
		this.repo=repo;
	}
	
	@GetMapping(value = "/contacts")
	public List<Contact> getContacts() throws InterruptedException {
		return repo.findAll(Sort.by("id").descending());
	}

	// contact 1�� �߰�
	// POST /contacts {"memo":"�׽�Ʈ�Դϴ�"}
	
	@GetMapping("/contacts/paging")
	public Page<Contact> getContactsPaging(@RequestParam int page, @RequestParam int size){
		return repo.findAll(PageRequest.of(page,  size, Sort.by("id").descending()));
	}
	
	@PostMapping(value = "/contacts")
	public Contact postContact(@RequestBody Contact contact, HttpServletResponse res) throws InterruptedException {
		// ������ ���� ����
		// �޸��� ������ ����ó����
		
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
//			// Ŭ���̾�Ʈ���� �޸��� ���� �����ų� ������ ���� ����
//			// Ŭ���̾�Ʈ ����, 4xx
//			// ��û���� �߸����� ���� - Bad Request (400)
//			// res.setStatus(400);
//			
//			// Dispatcher Servlet�� ������ ���䰴ü�� status�ڵ带 �־���
//			res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
//			return null;
//		}
		
		// id���� ����
//		Long currentId = maxId.incrementAndGet();
		
		// �Է¹��� �����ͷ� todo��ü�� ����
		// id���� �����Ͻô� �������� ������ ������ ó����
		// html�±װ� ������ ��������(script���� ������ �߻���)
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
		// todo ��ϰ�ü �߰�
//		contacts.put(currentId, contactItem);
		Contact contactSaved = repo.save(contactItem);
		
		// ���ҽ� ������
		// res.setStatus(201);
		res.setStatus(HttpServletResponse.SC_CREATED);
		
		// �߰��� ��ü�� ��ȯ
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