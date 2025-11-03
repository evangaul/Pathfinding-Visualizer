import { useRef, useState } from 'react'
import Grid, { type GridRef } from './components/Grid'
import Controls, { type Algorithm } from './components/Controls'
import { dijkstra } from './algorithms/dijkstra'
import { aStar } from './algorithms/astar'
import { bfs } from './algorithms/bfs'
import { dfs } from './algorithms/dfs'
import { generateMaze } from './utils/mazeGenerator'
import './App.css'

function App() {
  const gridRef = useRef<GridRef>(null) 
  const [isVisualizing, setIsVisualizing] = useState(false) // Tracks if the visualization is running
  const [tool, setTool] = useState<'wall' | 'start' | 'end' | 'weight'>('wall') // Tracks the tool selected

  // All visualization here:
  const handleVisualize = (algorithm: Algorithm) => {
    if (!gridRef.current) return // no grid ref, return
    
    // Clear previous visualization but keep walls 
    gridRef.current.clearPath()
    
    setIsVisualizing(true)

    // Use setTimeout to so clearPath state update completes
    setTimeout(() => {
      if (!gridRef.current) return

      // Get grid, start and end nodes
      const grid = gridRef.current.getGrid()
      const start = gridRef.current.getStartNode()
      const end = gridRef.current.getEndNode()
      if (!start || !end) { // no start or end, return
        setIsVisualizing(false)
        return
      }

      // Initialize visited order and path
      let visitedOrder: Array<{ row: number; col: number }> = []
      let path: Array<{ row: number; col: number }> = []

      // Algorithms:
      if (algorithm === 'dijkstra') {
        const result = dijkstra(grid, { row: start.row, col: start.col }, { row: end.row, col: end.col })
        visitedOrder = result.visitedOrder
        path = result.path
      } else if (algorithm === 'aStar') {
        const result = aStar(grid, { row: start.row, col: start.col }, { row: end.row, col: end.col })
        visitedOrder = result.visitedOrder
        path = result.path
      } else if (algorithm === 'bfs') {
        const result = bfs(grid, { row: start.row, col: start.col }, { row: end.row, col: end.col })
        visitedOrder = result.visitedOrder
        path = result.path
      } else if (algorithm === 'dfs') {
        const result = dfs(grid, { row: start.row, col: start.col }, { row: end.row, col: end.col })
        visitedOrder = result.visitedOrder
        path = result.path
      }

      // 0.5ms per step, pretty fast... maybe slower?
      const baseDelay = 0.5
      // Create a fresh copy with all visited/path states cleared, do this so I can animate the visited and path nodes separately
      const gridCopy = grid.map(row => row.map(n => ({ ...n, isVisited: false, isPath: false })))

      // Animate visited nodes
      visitedOrder.forEach((pos, idx) => {  
        setTimeout(() => { 
          const node = gridCopy[pos.row][pos.col]
          if (!node.isStart && !node.isEnd) node.isVisited = true
          gridRef.current?.setGrid(gridCopy.map(row => row.map(n => ({ ...n }))))
        }, idx * baseDelay)
      })

      const totalVisitedTime = visitedOrder.length * baseDelay

      // Animate path
      path.forEach((pos, idx) => {
        setTimeout(() => {
          const node = gridCopy[pos.row][pos.col]
          if (!node.isStart && !node.isEnd) node.isPath = true
          gridRef.current?.setGrid(gridCopy.map(row => row.map(n => ({ ...n }))))
          if (idx === path.length - 1) setIsVisualizing(false)
        }, totalVisitedTime + idx * baseDelay)
      })

      if (path.length === 0) { // no path, return
        setTimeout(() => setIsVisualizing(false), totalVisitedTime)
      }
    }, 0)
  }

  const handleClearPath = () => { // clear path
    gridRef.current?.clearPath()
  }

  const handleClearBoard = () => { // clear board 
    gridRef.current?.clearBoard()
  }

  const handleGenerateMaze = () => { // generate maze
    if (!gridRef.current) return
    
    const start = gridRef.current.getStartNode()
    const end = gridRef.current.getEndNode()
    
    if (!start || !end) return
    
    // Clear existing walls but keep start/end
    gridRef.current.clearBoard()
    
    // Generate maze using recursive backtracking
    setTimeout(() => {
      if (!gridRef.current) return
      
      const currentGrid = gridRef.current.getGrid()
      const mazeGrid = generateMaze(
        currentGrid,
        { row: start.row, col: start.col },
        { row: end.row, col: end.col }
      )
      
      // Preserve start and end positions
      mazeGrid[start.row][start.col] = {
        ...mazeGrid[start.row][start.col],
        isStart: true,
        isEnd: false,
        isWall: false,
      }
      mazeGrid[end.row][end.col] = {
        ...mazeGrid[end.row][end.col],
        isStart: false,
        isEnd: true,
        isWall: false,
      }
      
      gridRef.current.setGrid(mazeGrid)
    }, 0)
  }

  return ( // main app component!!
    <div className="app">
      <header className="app-header">
        <h1>Pathfinding Visualizer</h1>
      </header>
      <Controls
        onVisualize={handleVisualize}
        onClearPath={handleClearPath}
        onClearBoard={handleClearBoard}
        onGenerateMaze={handleGenerateMaze}
        isVisualizing={isVisualizing}
        selectedTool={tool}
        onToolChange={setTool}
      />
      <main className="app-main">
        <Grid ref={gridRef} rows={30} cols={50} tool={tool} isVisualizing={isVisualizing} />
      </main>
    </div>
  )
}

export default App
