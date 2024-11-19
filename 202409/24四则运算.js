/**
 * # 问题描述

实现一个基本的计算器来计算一个简单的字符串表达式的值。注意事项如下：

- 输入是一个字符串表达式（可以假设所给定的表达式都是有效的）

- 字符串表达式可以包含的运算符号为：左括号 `(`, 右括号 `)`, 加号 `+`, 减号 `-`

- 可以包含的数字为：非负整数（< 10）

- 字符串中不包含空格

- 处理除法 case 的时候，可以直接省略小数部分结果，只保留整数部分参与后续运算

- 请不要使用内置的库函数 `eval`
 */
/**
 * 处理括号内的运算时，我们可以使用一个栈来辅助。当遇到左括号时，将其入栈。在遇到右括号时，不断从栈中取出运算符和数字进行计算，直到遇到对应的左括号。
具体来说，在遍历表达式的过程中，如果遇到左括号，就开始一个新的计算过程，将当前的计算状态保存起来。当遇到右括号时，就把括号内计算的结果返回，并恢复之前保存的计算状态。
在您当前的代码中，可以在 solution 函数中添加一个辅助栈来实现这个功能。

处理括号内的运算时，我们可以使用一个栈来辅助。当遇到左括号时，将其入栈。在遇到右括号时，不断从栈中取出运算符和数字进行计算，直到遇到对应的左括号。
具体来说，在遍历表达式的过程中，如果遇到左括号，就开始一个新的计算过程，将当前的计算状态保存起来。当遇到右括号时，就把括号内计算的结果返回，并恢复之前保存的计算状态。
在您当前的代码中，可以在 solution 函数中添加一个辅助栈来实现这个功能。
 * @param {*} expression 
 * @returns 
 */
function solution(expression) {
  // 定义两个栈，一个用于存储数字，一个用于存储运算符
  let numStack = []
  let opStack = []

  for (let i = 0; i < expression.length; i++) {
    let char = expression[i]
    if (!isNaN(char)) {
      // 如果是数字
      let num = 0
      while (!isNaN(expression[i]) && i < expression.length) {
        num = num * 10 + parseInt(expression[i])
        i++
      }
      i--
      numStack.push(num)
    } else if (char === '(') {
      // 如果是左括号，直接入栈
      opStack.push(char)
    } else if (char === ')') {
      // 如果是右括号，进行计算直到遇到左括号
      while (opStack[opStack.length - 1] !== '(') {
        calculate(numStack, opStack)
      }
      opStack.pop() // 弹出左括号
    } else if (['+', '-', '*', '/'].includes(char)) {
      // 如果是运算符
      while (opStack.length > 0 && precedence(opStack[opStack.length - 1]) >= precedence(char)) {
        calculate(numStack, opStack)
      }
      opStack.push(char)
    }
  }

  // 处理剩余的运算符
  while (opStack.length > 0) {
    calculate(numStack, opStack)
  }

  return numStack.pop()
}

// 计算函数
function calculate(numStack, opStack) {
  let op = opStack.pop()
  let num2 = numStack.pop()
  let num1 = numStack.pop()

  switch (op) {
    case '+':
      numStack.push(num1 + num2)
      break
    case '-':
      numStack.push(num1 - num2)
      break
    case '*':
      numStack.push(num1 * num2)
      break
    case '/':
      numStack.push(Math.floor(num1 / num2))
      break
  }
}

// 确定运算符优先级的函数
function precedence(op) {
  if (op === '+' || op === '-') {
    return 1
  } else if (op === '*' || op === '/') {
    return 2
  }
  return 0
}

function main() {
  // You can add more test cases here
  console.log(solution('1+1') === 2)
  console.log(solution('3+4*5/(3+2)') === 7)
  console.log(solution('4+2*5-2/1') === 12)
  console.log(solution('(1+(4+5+2)-3)+(6+8)') === 23)
}

main()
