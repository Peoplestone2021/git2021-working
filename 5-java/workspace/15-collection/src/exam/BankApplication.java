package exam;

import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class BankApplication {

	// Map 여러가지 형태의 Map 가능한 타입(Inteface)
	// = HashMap
	// = HashTable
	// = TreeMap
	//
	// 대입하는 자료구조에 따라서 같은 메서드를 호출하더라도
	// 내부적인 처리방식이 다름

	// 계좌목록 Map 객체
	// Map<키타입, 값타입> 변수명 = new HashMap<키타입, 값타입>();
	private static Map<String, Account> accounts = new HashMap<String, Account>();

	private static Scanner scanner = new Scanner(System.in);

	public static void main(String[] args) {
		boolean run = true;
		while (run) {
			System.out.println("----------------------------------------------------------");
			System.out.println("1.계좌생성 | 2.계좌목록 | 3.예금 | 4.출금 | 5.종료");
			System.out.println("----------------------------------------------------------");
			System.out.print("선택> ");

			int selectNo = scanner.nextInt();

			if (selectNo == 1) {
				createAccount();
			} else if (selectNo == 2) {
				accountList();
			} else if (selectNo == 3) {
				deposit();
			} else if (selectNo == 4) {
				withdraw();
			} else if (selectNo == 5) {
				run = false;
			}
		}
		System.out.println("프로그램 종료");
	}

	// 계좌생성하기(계좌추가하기)
	private static void createAccount() {
		System.out.println("--------------");
		System.out.println("계좌생성");
		System.out.println("--------------");

		System.out.print("#계좌 양식: ***-***(예시: 000-000)");
		System.out.println("--------------");
		System.out.print("계좌번호: ");

		String ano = scanner.next();

		System.out.print("계좌주: ");
		String owner = scanner.next();

		System.out.print("초기입금액: ");
		int balance = scanner.nextInt();

		Account newAccount = new Account(ano, owner, balance);
		accounts.put(ano, newAccount);
//		Account aNewAccount = account
		Account account = accounts.get(ano);
		if (account != null) {
			System.out.println("결과: 계좌가 생성되었습니다.");
			return;
		}
	}

	// 계좌목록보기

	private static void accountList() {
		System.out.println("--------------");
		System.out.println("계좌목록");
		System.out.println("--------------");
		for (String ano : accounts.keySet()) {
			String owner = accounts.get(ano).getOwner();
			int balance = accounts.get(ano).getBalance();

			System.out.println(ano + ": " + owner + ", " + balance);
		}
	}

	// 예금하기(필드값수정)
	private static void deposit() {
		System.out.println("--------------");
		System.out.println("예금");
		System.out.println("--------------");
		System.out.print("#계좌 양식: ***-***(예시: 000-000)");
		System.out.println("--------------");
		System.out.print("계좌번호: ");
		String ano = scanner.next();
		System.out.print("예금액: ");
		int money = scanner.nextInt();
		Account account = accounts.get(ano);
		if (account == null) {
			System.out.println("결과: 계좌가 없습니다.");
			return;
		}

		account.setBalance(account.getBalance() + money);
		System.out.println("결과: 예금이 성공되었습니다.");
	}

	// 출금하기(필드값수정)
	private static void withdraw() {
		System.out.println("--------------");
		System.out.println("출금");
		System.out.println("--------------");
		System.out.print("#계좌 양식: ***-***(예시: 000-000)");
		System.out.println("--------------");
		System.out.print("계좌번호: ");
		String ano = scanner.next();
		System.out.print("출금액: ");
		int money = scanner.nextInt();
		Account account = accounts.get(ano);
		if (account == null) {
			System.out.println("결과: 계좌가 없습니다.");
			return;
		}

		account.setBalance(account.getBalance() - money);
		System.out.println("결과: 출금이 성공되었습니다.");
	}
}