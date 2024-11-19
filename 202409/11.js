// https://www.marscode.cn/practice/qj49777qql0vw9 病毒感染时间
function solution(row_n, column_m, seats, patient) {
  // 初始化二维数组记录座位状态和感染时间
  let status = new Array(row_n).fill(0).map(() => new Array(column_m).fill(-1))
  status[patient[0]][patient[1]] = 0

  // 定义四个方向
  let directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ]

  // 开始模拟病毒传播
  let time = 0
  while (true) {
    let hasChanged = false
    for (let i = 0; i < row_n; i++) {
      for (let j = 0; j < column_m; j++) {
        if (status[i][j] === time) {
          for (let [dx, dy] of directions) {
            let newX = i + dx
            let newY = j + dy
            if (newX >= 0 && newX < row_n && newY >= 0 && newY < column_m) {
              if (status[newX][newY] === -1) {
                if (seats[i][j] === 0) {
                  // 未戴口罩直接感染
                  status[newX][newY] = time + 1
                  hasChanged = true
                } else if (seats[i][j] === 1) {
                  // 戴口罩特殊处理
                  // 检查周围是否有两个已感染的人
                  let infectedCount = 0
                  for (let [dx2, dy2] of directions) {
                    let checkX = i + dx2
                    let checkY = j + dy2
                    if (checkX >= 0 && checkX < row_n && checkY >= 0 && checkY < column_m && status[checkX][checkY] >= 0) {
                      infectedCount++
                    }
                  }
                  if (infectedCount >= 2) {
                    status[newX][newY] = time + 2
                    hasChanged = true
                  }
                }
              }
            }
          }
        }
      }
    }
    if (!hasChanged) {
      break
    }
    time++
  }
  return time
}

function main() {
  //  You can add more test cases here
  const testSeats1 = [
    [0, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
  ]
  const testSeats2 = [
    [0, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
  ]
  const testSeats3 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]
  const testSeats4 = [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
  ]
  const testSeats5 = [[1]]

  console.log(solution(4, 4, testSeats1, [2, 2]) === 6)
  console.log(solution(4, 4, testSeats2, [2, 5]) === 0)
  console.log(solution(4, 4, testSeats3, [2, 2]) === 4)
  console.log(solution(4, 4, testSeats4, [2, 2]) === 6)
  console.log(solution(1, 1, testSeats5, [0, 0]) === 0)
}

main()
