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
// REST ������� ������ �� �ִ� �������̽� �����ϴ� ���α׷�

//@Controller
//@ResponseBody
@RestController
public class ContactController {
	// HashMap ������ �� ��: get(key) -> O(1)
	// ConcurrentSkipListMap Ű �������� ������ �Ǿ�����: get(key) -> O(long)
	private SortedMap<Long, Contact> contacts=
			Collections.synchronizedSortedMap(new TreeMap<Long, Contact>(Collections.reverseOrder()));
	
	// id�� ������ ����� ����
	public AtomicLong maxId = new AtomicLong();

	// contact �����ȸ
	// GET /contacts
	@GetMapping(value = "/contacts")
	public List<Contact> getContacts() {
		return new ArrayList<Contact>(contacts.values());
	}

	// contact 1�� �߰�
	// POST /contacts {"memo":"�׽�Ʈ�Դϴ�"}
	@PostMapping(value = "/contacts")
	public Contact postContact(@RequestBody Contact contact, HttpServletResponse res) {
		// ������ ���� ����
		// �޸��� ������ ����ó����
		if(contact.getName() == null || contact.getName().isEmpty()) {
			// Ŭ���̾�Ʈ���� �޸��� ���� �����ų� ������ ���� ����
			// Ŭ���̾�Ʈ ����, 4xx
			// ��û���� �߸����� ���� - Bad Request (400)
			// res.setStatus(400);
			
			// Dispatcher Servlet�� ������ ���䰴ü�� status�ڵ带 �־���
			res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return null;
		}
		
		// id���� ����
		Long currentId = maxId.incrementAndGet();
		
		// �Է¹��� �����ͷ� todo��ü�� ����
		// id���� �����Ͻô� �������� ������ ������ ó����
		// html�±װ� ������ ��������(script���� ������ �߻���)
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
		// todo ��ϰ�ü �߰�
		contacts.put(currentId, contactItem);
		
		// ���ҽ� ������
		// res.setStatus(201);
		res.setStatus(HttpServletResponse.SC_CREATED);
		
		// �߰��� ��ü�� ��ȯ
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