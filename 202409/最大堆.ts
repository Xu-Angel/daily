class MaxHeap {
  private heap: number[]

  constructor() {
    this.heap = []
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2)
  }

  private getLeftChildIndex(index: number): number {
    return 2 * index + 1
  }

  private getRightChildIndex(index: number): number {
    return 2 * index + 2
  }

  private swap(i: number, j: number) {
    ;[this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
  }

  private heapifyUp(index: number) {
    let currentIndex = index
    while (currentIndex > 0) {
      const parentIndex = this.getParentIndex(currentIndex)
      if (this.heap[currentIndex] > this.heap[parentIndex]) {
        this.swap(currentIndex, parentIndex)
        currentIndex = parentIndex
      } else {
        break
      }
    }
  }

  private heapifyDown(index: number) {
    let largest = index
    const leftChildIndex = this.getLeftChildIndex(index)
    const rightChildIndex = this.getRightChildIndex(index)

    if (leftChildIndex < this.heap.length && this.heap[leftChildIndex] > this.heap[largest]) {
      largest = leftChildIndex
    }

    if (rightChildIndex < this.heap.length && this.heap[rightChildIndex] > this.heap[largest]) {
      largest = rightChildIndex
    }

    if (largest !== index) {
      this.swap(index, largest)
      this.heapifyDown(largest)
    }
  }

  insert(value: number) {
    this.heap.push(value)
    this.heapifyUp(this.heap.length - 1)
  }

  extractMax(): number | undefined {
    if (this.heap.length === 0) {
      return undefined
    }

    const max = this.heap[0]
    this.heap[0] = this.heap[this.heap.length - 1]
    this.heap.pop()
    this.heapifyDown(0)

    return max
  }

  peekMax(): number | undefined {
    if (this.heap.length === 0) {
      return undefined
    }
    return this.heap[0]
  }
}
