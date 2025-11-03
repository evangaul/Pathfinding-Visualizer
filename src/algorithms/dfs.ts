// Depth-First Search algorithm
import type { Node } from '../components/Grid'

export interface DFSResult { // result of dfs algo
  visitedOrder: Array<{ row: number; col: number }>
  path: Array<{ row: number; col: number }>
}

const keyOf = (r: number, c: number) => `${r},${c}` // key of node

export function dfs( // dfs algorithm
  grid: Node[][],
  start: { row: number; col: number },
  end: { row: number; col: number }
): DFSResult {
  const numRows = grid.length
  const numCols = grid[0]?.length ?? 0 

  const stack: Array<{ row: number; col: number }> = []
  const visited = new Set<string>() // visited set for dfs
  const prev = new Map<string, string | null>() // previous map for dfs

  // Start DFS
  const startKey = keyOf(start.row, start.col)
  stack.push({ row: start.row, col: start.col }) // add start node to stack
  visited.add(startKey)
  prev.set(startKey, null) // add start key to previous map

  const visitedOrder: Array<{ row: number; col: number }> = [] // visited order for dfs

  const neighbors = (r: number, c: number) => { // get neighbors
    const dirs = [
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
        out.push({ row: nr, col: nc }) // add neighbor to output array
      }
    }
    return out
  }

  while (stack.length > 0) { 
    const { row, col } = stack.pop()! // pop last node from stack
    const k = keyOf(row, col)

    // Skip walls
    if (grid[row][col].isWall) continue

    visitedOrder.push({ row, col })

    // Stop if we reached the end
    if (row === end.row && col === end.col) break

    // Explore neighbors, DFS goes deep so we add to stack
    // I am reversing the neighbors to explore in a more predictable order?
    const neighborsList = neighbors(row, col).reverse()
    for (const nb of neighborsList) { 
      const nk = keyOf(nb.row, nb.col)

      if (visited.has(nk)) continue // if visited then skip
      if (grid[nb.row][nb.col].isWall) continue // if wall then skip

      visited.add(nk)
      prev.set(nk, k)
      stack.push({ row: nb.row, col: nb.col }) // add neighbor to stack
    }
  }

  // Reconstruct path
  const path: Array<{ row: number; col: number }> = []
  let curKey: string | null = keyOf(end.row, end.col)
  if (!prev.has(curKey)) {
    return { visitedOrder, path: [] } // if no path then return empty path
  }
  while (curKey) {
    const [rStr, cStr] = curKey.split(',') // split current key into row and column
    const r = Number(rStr)
    const c = Number(cStr)
    path.push({ row: r, col: c }) // add to path
    curKey = prev.get(curKey) ?? null // get previous key
  }
  path.reverse() // reverse back

  // Verify path is valid
  if (path.length === 0 || path[0].row !== start.row || path[0].col !== start.col) {
    return { visitedOrder, path: [] } // if no path then return empty path
  }

  return { visitedOrder, path }
}

