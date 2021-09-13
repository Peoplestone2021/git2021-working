package contact;

import java.util.concurrent.ConcurrentSkipListMap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contact {
	private long id;
	private String name;
	private String phoneNumber;
	private String eMail;
	private long createdTime;
	public ConcurrentSkipListMap<Long, Contact> getName() {
		// TODO Auto-generated method stub
		return null;
	}
	public static Object builder() {
		// TODO Auto-generated method stub
		return null;
	}
}
