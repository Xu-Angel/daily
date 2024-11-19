// # 问题描述

// 给定一个数字，我们按照如下规则把它翻译为字符串：0 翻译成 “a” ，1 翻译成 “b”，……，11 翻译成 “l”，……，25 翻译成 “z”。一个数字可能有多个翻译。请编程实现一个函数，用来计算一个数字有多少种不同的翻译方法。

// ## 输入格式

// 一个 `int` 型的数字，`0 <= num <= 2` 的 31 次方

// ## 输出格式

// 也是一个 `int` 型数字，代表字符串的总共可能性

// **输入样例**

// 输入: 12258

// **输出样例**

// 输出: 5

// 解释: 12258 有 5 种不同的翻译，分别是 "bccfi", "bwfi", "bczi", "mcfi" 和 "mzi"

/**
 * 数据结构方面，我们可以使用动态规划来解决这个问题。
算法步骤如下：
首先将数字转换为字符串，方便处理每一位数字。
定义一个数组 dp 来存储每个位置的翻译方法数。
从左到右遍历字符串：
如果当前位置的数字单独翻译，那么当前位置的翻译方法数等于前一个位置的翻译方法数。
如果当前位置和前一个位置组成的两位数在 0 - 25 之间，那么当前位置的翻译方法数等于前一个位置的翻译方法数加上前两个位置的翻译方法数。

 * @param {*} num 
 * @returns 
 */
function solution(num) {
  // 将数字转换为字符串
  const str = num.toString()
  // 定义 dp 数组来存储每个位置的翻译方法数
  const dp = new Array(str.length).fill(0)
  dp[0] = 1

  for (let i = 1; i < str.length; i++) {
    // 单独翻译当前数字
    dp[i] = dp[i - 1]
    // 检查当前数字和前一个数字组成的两位数是否在 0 - 25 之间
    const twoDigits = parseInt(str.substr(i - 1, 2))
    if (twoDigits >= 10 && twoDigits <= 25) {
      // 如果可以组合翻译，加上前两个位置的翻译方法数
      if (i - 2 >= 0) {
        dp[i] += dp[i - 2]
      } else {
        dp[i]++
      }
    }
    console.log(dp, 'in')
  }
  console.log(dp, 'out')
  // 返回最后一个位置的翻译方法数
  return dp[str.length - 1]
}

function main() {
  // You can add more test cases here
  console.log(solution(12258) === 5)
  // console.log(solution(1400112) === 6)
  // console.log(solution(2110101) === 10)
}

main()
