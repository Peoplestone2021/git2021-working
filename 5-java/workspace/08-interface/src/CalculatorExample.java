
public class CalculatorExample {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
//		Calculator c = new Calculator();
		Calculator c = new CalculatorImpV1();

		System.out.println(c.plus(5, 10));
		System.out.println(c.minus(5, 10));
		System.out.println(c.areaCircle(5));

		Calculator c2 = new CalculatorImpV2();

		System.out.println("= V2 =");
		System.out.println(c2.plus(5, 10));
		System.out.println(c2.minus(5, 10));
		System.out.println(c2.areaCircle(5));

		c.plus(5, 10);
	}

}
