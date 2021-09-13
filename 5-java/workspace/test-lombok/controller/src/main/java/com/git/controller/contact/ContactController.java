package com.git.controller.contact;

import java.util.Collection;
import java.util.Date;
import java.util.concurrent.ConcurrentSkipListMap;
import java.util.concurrent.atomic.AtomicLong;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
	public ConcurrentSkipListMap<Long, Contact> contacts = new ConcurrentSkipListMap<Long, Contact>();
	// id�� ������ ����� ����
	public AtomicLong maxId = new AtomicLong();

	// contact �����ȸ
	// GET /contacts
	@GetMapping(value = "/contacts")
	public Collection<Contact> getContacts() {
		return contacts.descendingMap().values();
	}

	// contact 1�� �߰�
	// POST /contacts {"memo":"�׽�Ʈ�Դϴ�"}
	@PostMapping(value = "/contacts")
	public Contact postContact(@RequestBody Contact contact, HttpServletResponse res) {
		// ������ ���� ����
		// �޸��� ������ ����ó����
		if(contact.getPhoneNumber() == null || contact.getPhoneNumber().isEmpty()) {
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
//								.memo(todo.getMemo().replaceAll("<(/)?([a-zA-Z]*)(\\s[a-zA-Z]*=[^>]*)?(\\s)*(/)?>", ""))
								.phoneNumber(contact.getPhoneNumber())
								.eMail(contact.getEMail())
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

}
