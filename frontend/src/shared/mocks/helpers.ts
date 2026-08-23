const MOCK_DELAY = 300

export function delay<T>(data: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), MOCK_DELAY))
}

let idCounter = 100

export function nextId(prefix: string): string {
  return `${prefix}_${++idCounter}`
}
