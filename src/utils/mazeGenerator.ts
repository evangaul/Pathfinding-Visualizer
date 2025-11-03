import type { Node } from '../components/Grid'

/**
 * Recursive Backtracking Maze Generation Algorithm
 * Translated from a previous implementation by me in Python
 * Creates a perfect maze (exactly one path between any two points)
 */
export function generateMaze( 
  grid: Node[][],
  startPos: { row: number; col: number },
  endPos: { row: number; col: number }
): Node[][] {
  const numRows = grid.length
  const numCols = grid[0]?.length ?? 0

  // Start with all cells as walls
  const mazeGrid = grid.map(row =>
    row.map(node => ({
      ...node,
      isWall: !node.isStart && !node.isEnd, // Keep start and end clear
      weight: 1,
    }))
  )

  // Helper to get neighbors that can be carved (2 steps away in each direction)
  const getUnvisitedNeighbors = (
    row: number,
    col: number,
    visited: boolean[][]
  ): Array<{ row: number; col: number }> => {
    const neighbors: Array<{ row: number; col: number }> = []
    const directions = [
      [0, 2], // Right
      [2, 0], // Down
      [0, -2], // Left
      [-2, 0], // Up
    ]

    for (const [dr, dc] of directions) { // loop through directions
      const newRow = row + dr
      const newCol = col + dc

      if ( // if new row and col are in bounds and not visited then add to neighbors
        newRow > 0 && 
        newRow < numRows - 1 &&
        newCol > 0 &&
        newCol < numCols - 1 &&
        !visited[newRow][newCol]
      ) {
        neighbors.push({ row: newRow, col: newCol })
      }
    }

    return neighbors
  }

  // Initialize visited array (only check odd rows/cols for maze cells)
  const visited: boolean[][] = []
  for (let i = 0; i < numRows; i++) {
    visited[i] = new Array(numCols).fill(false)
  }

  // Start from a random odd cell 
  let startRow = Math.floor(Math.random() * Math.floor((numRows - 2) / 2)) * 2 + 1
  let startCol = Math.floor(Math.random() * Math.floor((numCols - 2) / 2)) * 2 + 1

  // Ensure start cell is not on start/end positions
  if ( 
    (startRow === startPos.row && startCol === startPos.col) ||
    (startRow === endPos.row && startCol === endPos.col)
  ) {
    startRow = 1
    startCol = 1
  }

  // Stack for backtracking
  const stack: Array<{ row: number; col: number }> = [{ row: startRow, col: startCol }]
  visited[startRow][startCol] = true
  mazeGrid[startRow][startCol].isWall = false

  // Recursive backtracking
  while (stack.length > 0) {
    const current = stack[stack.length - 1]
    const neighbors = getUnvisitedNeighbors(current.row, current.col, visited)

    if (neighbors.length > 0) {
      // Choose random neighbor
      const next = neighbors[Math.floor(Math.random() * neighbors.length)]

      // Remove wall between current and next
      const wallRow = current.row + Math.floor((next.row - current.row) / 2)
      const wallCol = current.col + Math.floor((next.col - current.col) / 2)

      // Don't create walls on start or end positions
      if (
        !(
          (wallRow === startPos.row && wallCol === startPos.col) ||
          (wallRow === endPos.row && wallCol === endPos.col) ||
          (next.row === startPos.row && next.col === startPos.col) ||
          (next.row === endPos.row && next.col === endPos.col)
        )
      ) {
        mazeGrid[wallRow][wallCol].isWall = false
        mazeGrid[next.row][next.col].isWall = false
        visited[next.row][next.col] = true
        stack.push(next)
      } else {
        // Mark as visited but don't add to stack
        visited[next.row][next.col] = true
        mazeGrid[next.row][next.col].isWall = false
      }
    } else {
      // Backtrack
      stack.pop()
    }
  }

  // Ensure start and end are always accessible (carve paths around them)
  const ensureAccessibility = (pos: { row: number; col: number }) => {
    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]

    for (const [dr, dc] of directions) {
      const newRow = pos.row + dr
      const newCol = pos.col + dc

      if (
        newRow > 0 &&
        newRow < numRows - 1 &&
        newCol > 0 &&
        newCol < numCols - 1
      ) {
        mazeGrid[newRow][newCol].isWall = false
      }
    }
  }

  ensureAccessibility(startPos)
  ensureAccessibility(endPos)

  // Carve a few extra random paths to make it more interesting
  for (let i = 0; i < Math.floor((numRows * numCols) / 50); i++) {
    const row = Math.floor(Math.random() * (numRows - 2)) + 1
    const col = Math.floor(Math.random() * (numCols - 2)) + 1

    if (
      !(row === startPos.row && col === startPos.col) &&
      !(row === endPos.row && col === endPos.col)
    ) {
      mazeGrid[row][col].isWall = false
    }
  }

  return mazeGrid
}

