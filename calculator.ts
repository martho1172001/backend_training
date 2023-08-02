interface CalculatorInterface {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
  multiply(a: number, b: number): number;
  divide(a: number, b: number): number;
  modulus(a: number, b: number): number;
  factorial(a: number): number;
  power(a: number, b: number): number;
  percentage(a: Number, b: number): Number;
}

export class Calculator implements CalculatorInterface {
  result: number;
  add(a: number, b: number): number {
    this.result = a + b;
    console.log(`${a} + ${b} = ${this.result}`);
    return this.result
  }
  subtract(a: number, b: number): number {
    this.result = a - b;
    console.log(`${a} - ${b} = ${this.result}`);
    return this.result
  }
  multiply(a: number, b: number): number {
    this.result = a * b;
    console.log(`${a} * ${b} = ${this.result}`);
    return this.result
  }
  divide(a: number, b: number): number {
    if(b==0){
      console.log("division by zero is not possible");
      return -1;
    }
    this.result = a / b;
    console.log(`${a} / ${b} = ${this.result}`);
    return this.result
  }
  modulus(a: number, b: number): number {
    if(b==0){
      console.log("modulus by zero is not possible");
      return -1;
    }
    this.result = a % b;
    console.log(`${a} % ${b} = ${this.result}`);
    return this.result
  }
  factorial(a: number): number {
    let fact = 1;
    for (let i = 1; i <= a; i++) {
      fact = fact * i;
    }
    this.result = fact;
    console.log(`${a}! = ${this.result}`);
    return this.result
  }
  power(a: number, b: number): number {
    this.result = Math.pow(a, b);
    console.log(`${a} raised to ${b} = ${this.result}`);
    return this.result
  }
  percentage(a: number, b: number = 100): number {
    this.result = a * b / 100;
    console.log(`${a} percentage of ${b} = ${this.result}`);
    return this.result
  }

}

