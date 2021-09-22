package com.git.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletResponse;

import com.git.controller.contact.Contact;
import com.git.controller.contact.ContactController;
import com.git.controller.todo.Todo;

@SpringBootTest
public class TestContactController {
	
	@Test
	void addContact() {
		ContactController controller=new ContactController();
//		contactExample = 
		Contact expected=Contact.builder()
				.name("홍길동")
				.phoneNumber("1111-1111")
				.eMail("aaa@aaa.com")
				.memo("아무 내용")
				.build();
		
		controller.postContact(expected, new MockHttpServletResponse());
		
		List<Contact> contacts = controller.getContacts();
		Contact actual=contacts.get(0);
		
		assertEquals(2, actual.getId()); 
		assertEquals(expected.getName(), actual.getName()); 
	}
	
	@Test
	void removeContact() {
		ContactController controller = new ContactController();
		
		Contact testItem = Contact.builder().name("홍길동")
				.phoneNumber("1111-1111")
				.eMail("aaa@aaa.com")
				.memo("아무 내용")
				.build();
		
		controller.postContact(testItem, new MockHttpServletResponse());
		
		List<Contact> beforeContacts = controller.getContacts();
		assertEquals(1, beforeContacts.size());
		
		controller.removeContact(1, new MockHttpServletResponse());
		
		List<Contact> afterContacts = controller.getContacts();
		assertEquals(0, afterContacts);
	}
	
	@Test
	void modifyContact() {
		ContactController controller = new ContactController();
		
		Contact testItem = Contact.builder().name("홍길동")
				.phoneNumber("1111-1111")
				.eMail("aaa@aaa.com")
				.memo("아무 내용")
				.build();
		
		controller.postContact(testItem, new MockHttpServletResponse());
		
		String expectedResult="modify test memo";
		Contact modifyData = Contact.builder().memo(expectedResult).build();
		
		HttpServletResponse res = new MockHttpServletResponse();

		controller.modifyContact(1, modifyData, res);
		
		List<Contact> contacts=controller.getContacts();
		assertEquals(expectedResult, contacts.get(0).getMemo());
		
		Contact resultContactId = controller.modifyContact(2, modifyData, res);
		
		assertNull(resultContactId);
		assertEquals(HttpServletResponse.SC_NOT_FOUND, res.getStatus());
		
		Contact resultContactMemoNull = controller.modifyContact(1, new Contact(), res);
		
		assertNull(resultContactMemoNull);
		assertEquals(HttpServletResponse.SC_BAD_REQUEST, res.getStatus());
		
		Contact resultContactMemoEmpty = controller.modifyContact(1, Contact.builder()
				.memo("")
				.build(), res);
		
		assertNull(resultContactMemoEmpty);
		assertEquals(HttpServletResponse.SC_BAD_REQUEST, res.getStatus());
	}

}
