// A* algorithm
import type { Node } from '../components/Grid'

export interface AStarResult { // result of astar algor
  visitedOrder: Array<{ row: number; col: number }>
  path: Array<{ row: number; col: number }>
}

const keyOf = (r: number, c: number) => `${r},${c}`

// Manhattan distance heuristic
const heuristic = (r1: number, c1: number, r2: number, c2: number): number => {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2)
}

export function aStar( // astar algorithm
  grid: Node[][],
  start: { row: number; col: number },
  end: { row: number; col: number }
): AStarResult {
  const numRows = grid.length 
  const numCols = grid[0]?.length ?? 0

  const openSet: Array<{ row: number; col: number; f: number; g: number }> = [] // open set for astar
  const gScore = new Map<string, number>() // g score!
  const fScore = new Map<string, number>() // f score 
  const prev = new Map<string, string | null>() // previous map
  const visited = new Set<string>() // visited set

  // Initialize scores
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const k = keyOf(r, c)
      gScore.set(k, Infinity) // set g score to infinity
      fScore.set(k, Infinity) // set f score to infinity
      prev.set(k, null) // set previous to null
    }
  }

  const startKey = keyOf(start.row, start.col)
  const endKey = keyOf(end.row, end.col)
  
  gScore.set(startKey, 0) // set g score to 0
  fScore.set(startKey, heuristic(start.row, start.col, end.row, end.col)) // set f score to heuristic
  
  openSet.push({ // add start node to open set
    row: start.row,
    col: start.col,
    f: fScore.get(startKey)!,
    g: 0
  })

  const visitedOrder: Array<{ row: number; col: number }> = [] // visited order

  const neighbors = (r: number, c: number) => { // get neighbors
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]
    const out: Array<{ row: number; col: number }> = [] // output arrayy
    for (const [dr, dc] of dirs) {
      const nr = r + dr
      const nc = c + dc
      if (nr >= 0 && nr < numRows && nc >= 0 && nc < numCols) {
        out.push({ row: nr, col: nc })
      }
    }
    return out
  }

  while (openSet.length > 0) {
    // Find node with lowest f score
    let minIdx = 0
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[minIdx].f) { // if current f score is less than min f score then set min index to current index
        minIdx = i
      }
    }

    const current = openSet.splice(minIdx, 1)[0] // get current node
    const currentKey = keyOf(current.row, current.col)

    if (visited.has(currentKey)) continue // if visited then skip
    visited.add(currentKey)

    // Skip walls:
    if (grid[current.row][current.col].isWall) continue

    visitedOrder.push({ row: current.row, col: current.col }) // add current node to visited order

    // If we reached the end, reconstruct path
    if (current.row === end.row && current.col === end.col) {
      break 
    }

    // Explore neighbors
    for (const neighbor of neighbors(current.row, current.col)) {
      const neighborKey = keyOf(neighbor.row, neighbor.col)
      if (visited.has(neighborKey)) continue // if visited skip
      if (grid[neighbor.row][neighbor.col].isWall) continue // if wall then skip

      // Tentative g score (distance from start through current)
      // Use node weight, it will default to 1
      const nodeWeight = grid[neighbor.row][neighbor.col].weight ?? 1 
      const tentativeG = (gScore.get(currentKey) ?? Infinity) + nodeWeight

      if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) { // if tentative g score is less than current g score then set tentative g score to current g score
        prev.set(neighborKey, currentKey)
        gScore.set(neighborKey, tentativeG)
        const h = heuristic(neighbor.row, neighbor.col, end.row, end.col)
        const f = tentativeG + h // f score is tentative g score plus heuristic
        fScore.set(neighborKey, f) // set f score to f

        // Add to open set if not already there
        const inOpenSet = openSet.some(n => n.row === neighbor.row && n.col === neighbor.col)
        if (!inOpenSet) {
          openSet.push({
            row: neighbor.row,
            col: neighbor.col,
            f,
            g: tentativeG
          })
        } else {
          // Update existing node in open set
          const existingIdx = openSet.findIndex(n => n.row === neighbor.row && n.col === neighbor.col)
          if (existingIdx !== -1) { // if existing index is not -1 then update existing node in open set
            openSet[existingIdx] = {
              row: neighbor.row,
              col: neighbor.col,
              f,
              g: tentativeG
            }
          }
        }
      }
    }
  }

  // Reconstruct path
  const path: Array<{ row: number; col: number }> = []
  let curKey: string | null = endKey
  if (!prev.has(curKey)) {
    return { visitedOrder, path: [] } // if no path then return empty path
  }
  while (curKey) {
    const [rStr, cStr] = curKey.split(',') // split cur key into row and column
    const r = Number(rStr)
    const c = Number(cStr)
    path.push({ row: r, col: c })
    curKey = prev.get(curKey) ?? null // get previous key
  }
  path.reverse()

  if (path.length === 0 || path[0].row !== start.row || path[0].col !== start.col) {
    return { visitedOrder, path: [] } // if no path then return empty path
  }

  return { visitedOrder, path }
}

