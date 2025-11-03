import type { Node } from '../components/Grid'

export interface DijkstraResult { // result of dijkstra algo
  visitedOrder: Array<{ row: number; col: number }>
  path: Array<{ row: number; col: number }>
}

const keyOf = (r: number, c: number) => `${r},${c}` // key of node

export function dijkstra(
  grid: Node[][],
  start: { row: number; col: number },
  end: { row: number; col: number }
): DijkstraResult {
  const numRows = grid.length
  const numCols = grid[0]?.length ?? 0

  const dist = new Map<string, number>()
  const prev = new Map<string, string | null>()
  const visited = new Set<string>()

  // Initialize distances
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const k = keyOf(r, c)
      dist.set(k, Infinity)
      prev.set(k, null)
    }
  }

  const startKey = keyOf(start.row, start.col)
  dist.set(startKey, 0)

  // Simple priority queue using array, should be fine for the grid size?
  type PQItem = { row: number; col: number; d: number }
  const pq: PQItem[] = [{ row: start.row, col: start.col, d: 0 }]

  const visitedOrder: Array<{ row: number; col: number }> = []

  const neighbors = (r: number, c: number) => { // get neighbors
    const dirs = [ // directions to check for neighbors
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]
    const out: Array<{ row: number; col: number }> = [] // output array
    for (const [dr, dc] of dirs) {
      const nr = r + dr // new row
      const nc = c + dc // new col
      if (nr >= 0 && nr < numRows && nc >= 0 && nc < numCols) {
        out.push({ row: nr, col: nc }) // add neighbor to output array
      }
    }
    return out
  }

  while (pq.length > 0) {
    // Get min
    let minIdx = 0
    for (let i = 1; i < pq.length; i++) {
      if (pq[i].d < pq[minIdx].d) minIdx = i // if current distance is less than min distance thenset min index to current index
    }
    const { row, col, d } = pq.splice(minIdx, 1)[0] // get min item
    const k = keyOf(row, col)
    if (visited.has(k)) continue // if already visited then skip
    visited.add(k) // add to visited set

    // Skip walls
    if (grid[row][col].isWall) continue // if wall then skip

    visitedOrder.push({ row, col }) // add to visited order

    // Stop if we reached the end
    if (row === end.row && col === end.col) break

    for (const nb of neighbors(row, col)) {
      const nk = keyOf(nb.row, nb.col)
      if (visited.has(nk)) continue // if already visited then skip
      if (grid[nb.row][nb.col].isWall) continue // if wall then skip
      // Use node weight, default is 1 if not set
      const nodeWeight = grid[nb.row][nb.col].weight ?? 1
      const alt = d + nodeWeight // new distance
      if (alt < (dist.get(nk) ?? Infinity)) { // if new distance is less than current distance then set new distance
        dist.set(nk, alt)
        prev.set(nk, k)
        pq.push({ row: nb.row, col: nb.col, d: alt })
      }
    }
  }

  // Reconstruct path
  const path: Array<{ row: number; col: number }> = []
  let curKey: string | null = keyOf(end.row, end.col)
  if (!prev.has(curKey)) {
    return { visitedOrder, path } // if no path then return empty path
  }
  while (curKey) {
    const [rStr, cStr] = curKey.split(',') // split current key into row and column
    const r = Number(rStr)
    const c = Number(cStr)
    path.push({ row: r, col: c })
    curKey = prev.get(curKey) ?? null
  }
  path.reverse()

  if (path.length === 0 || path[0].row !== start.row || path[0].col !== start.col) {
    return { visitedOrder, path: [] } // if no path then return empty path
  }

  return { visitedOrder, path } // return visited order and path
}


