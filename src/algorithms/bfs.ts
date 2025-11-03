// Breadth-First Search algorithm
import type { Node } from '../components/Grid'

export interface BFSResult { // result of bfs algo
  visitedOrder: Array<{ row: number; col: number }>
  path: Array<{ row: number; col: number }>
}

const keyOf = (r: number, c: number) => `${r},${c}`

export function bfs( // bfs algo
  grid: Node[][],
  start: { row: number; col: number },
  end: { row: number; col: number }
): BFSResult {
  const numRows = grid.length
  const numCols = grid[0]?.length ?? 0

  const queue: Array<{ row: number; col: number }> = [] // queue for bfs
  const visited = new Set<string>() // visited set for bfs
  const prev = new Map<string, string | null>() // previous map for bfs

  // Start BFS
  const startKey = keyOf(start.row, start.col)
  queue.push({ row: start.row, col: start.col }) // add start node to queue
  visited.add(startKey)
  prev.set(startKey, null) // add start key to previous map

  const visitedOrder: Array<{ row: number; col: number }> = [] // visited order for bfs

  const neighbors = (r: number, c: number) => { // get neighbors
    const dirs = [ // directions you can go
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]
    const out: Array<{ row: number; col: number }> = [] // output array
    for (const [dr, dc] of dirs) { 
      const nr = r + dr
      const nc = c + dc
      if (nr >= 0 && nr < numRows && nc >= 0 && nc < numCols) { // if new row and col are in bounds then add to output array
        out.push({ row: nr, col: nc })
      }
    }
    return out
  }

  while (queue.length > 0) { 
    const { row, col } = queue.shift()!
    const k = keyOf(row, col)

    // Skip walls
    if (grid[row][col].isWall) continue

    visitedOrder.push({ row, col })

    // Stop if we reached the end
    if (row === end.row && col === end.col) break

    // Explore neighbors
    for (const nb of neighbors(row, col)) {
      const nk = keyOf(nb.row, nb.col)

      if (visited.has(nk)) continue // if visited then skip
      if (grid[nb.row][nb.col].isWall) continue // if wall then skip

      visited.add(nk)
      prev.set(nk, k)
      queue.push({ row: nb.row, col: nb.col })
    }
  }

  // Reconstruct path
  const path: Array<{ row: number; col: number }> = [] // path for bfs
  let curKey: string | null = keyOf(end.row, end.col) // current key
  if (!prev.has(curKey)) {
    return { visitedOrder, path: [] } // if no path then ret empty path
  }
  while (curKey) { 
    const [rStr, cStr] = curKey.split(',') // split current key into row and column
    const r = Number(rStr)
    const c = Number(cStr)
    path.push({ row: r, col: c }) 
    curKey = prev.get(curKey) ?? null
  }
  path.reverse() 

  // Verify path is valid
  if (path.length === 0 || path[0].row !== start.row || path[0].col !== start.col) {
    return { visitedOrder, path: [] }
  }

  return { visitedOrder, path }
}

