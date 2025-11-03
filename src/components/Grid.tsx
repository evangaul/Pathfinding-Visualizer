// Grid component
import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import './Grid.css';

export interface Node { // Interface for a single node on the grid
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean; // End node
  isWall: boolean; // Wall node
  isVisited: boolean; // Visited node by the algorithm
  isPath: boolean; // Path node
  weight: number; // weight of  node
}

interface GridProps { // Props for the grid component
  rows?: number; 
  cols?: number;
  tool?: 'wall' | 'start' | 'end' | 'weight'; 
  isVisualizing?: boolean;
}

export interface GridRef { // Interface for the grid ref
  clearPath: () => void;
  clearBoard: () => void;
  getGrid: () => Node[][]; // Get the grid
  setGrid: (grid: Node[][]) => void; // Set the grid
  getStartNode: () => Node | null; // get start
  getEndNode: () => Node | null; // get end
}

const Grid = forwardRef<GridRef, GridProps>(({ rows = 30, cols = 50, tool = 'wall', isVisualizing = false }, ref) => {
  const [isDragging, setIsDragging] = useState(false); // Tracks if  is dragging
  const [isAddingWall, setIsAddingWall] = useState(false); // Tracks if adding a wall

  // Initialize the grid
  const [grid, setGrid] = useState<Node[][]>(() => {
    const initialGrid: Node[][] = [];
    const midRow = Math.floor(rows / 2);
    const startCol = Math.floor(cols * 0.2);
    const endCol = Math.floor(cols * 0.8);
    for (let i = 0; i < rows; i++) { // loop through rows
      const row: Node[] = []; // initialize row
      for (let j = 0; j < cols; j++) { // loop through cols
        const isStart = i === midRow && j === startCol; // check if current cell is start
        const isEnd = i === midRow && j === endCol; // check if current cell is end
        row.push({ // push cell to row
          row: i,
          col: j,
          isStart,
          isEnd,
          isWall: false,
          isVisited: false,
          isPath: false,
          weight: 1, // Default weight of 1
        });
      }
      initialGrid.push(row);
    }
    return initialGrid;
  });

  // Handle cell actions
  const handleCellAction = (row: number, col: number, isDrag: boolean = false) => {
    if (isVisualizing) return; // no edits during visualization, return
    
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => r.map((n) => ({ ...n }))); // create new grid
      const node = newGrid[row][col]; // get node

      if (tool === 'wall') {
        // Dont allow placing walls on start or end
        if (node.isStart || node.isEnd) return prevGrid;
        
        // If dragging use the initial drag state (add or remove)
        if (isDrag && isDragging) {
          newGrid[row][col] = { ...node, isWall: isAddingWall };
          return newGrid;
        }
        
        // Otherwise toggle on click
        newGrid[row][col] = { ...node, isWall: !node.isWall };
        return newGrid;
      }

      if (tool === 'start') {
        // Don't allow placing start on end
        if (node.isEnd) {
          return prevGrid;
        }
        
        // Clear previous start node
        for (let r = 0; r < newGrid.length; r++) { // loop through rows
          for (let c = 0; c < newGrid[r].length; c++) { // loop through cols
            if (newGrid[r][c].isStart) { 
              newGrid[r][c] = { ...newGrid[r][c], isStart: false };
            }
          }
        }
        
        // Set new start node
        newGrid[row][col] = {
          ...node, // copy node
          isStart: true,
          isEnd: false,
          isWall: false,
          isVisited: false,
          isPath: false,
        };
        return newGrid;
      }

      if (tool === 'end') {
        // Dont allow placing end on start
        if (node.isStart) {
          return prevGrid;
        }
        
        // Clear previous end node
        for (let r = 0; r < newGrid.length; r++) {
          for (let c = 0; c < newGrid[r].length; c++) {
            if (newGrid[r][c].isEnd) {
              newGrid[r][c] = { ...newGrid[r][c], isEnd: false };
            }
          }
        }
        
        // Set new end node
        newGrid[row][col] = {
          ...node,
          isStart: false,
          isEnd: true,
          isWall: false,
          isVisited: false,
          isPath: false,
        };
        return newGrid;
      }

      if (tool === 'weight') {
        // Don't allow setting weights on start, end, or walls
        if (node.isStart || node.isEnd || node.isWall) return prevGrid;
        
        // Set weight (cycle through common weights: 1, 5, 10, 15, or toggle back to 1)
        const weights = [1, 5, 10, 15];
        const currentWeight = node.weight || 1;
        const currentIdx = weights.indexOf(currentWeight);
        const nextWeight = currentIdx === -1 || currentIdx === weights.length - 1 
          ? 1 
          : weights[currentIdx + 1];
        
        newGrid[row][col] = { ...node, weight: nextWeight };
        return newGrid;
      }

      return prevGrid;
    });
  };
  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    handleCellAction(row, col, false); 
  };

  const handleCellMouseDown = (row: number, col: number) => {
    if (isVisualizing || tool !== 'wall') { // no edits during visualization or not wall tool, return
      handleCellClick(row, col);
      return;
    }

    const node = grid[row][col];
    if (node.isStart || node.isEnd) return; // no edits on start or end, return

    // Start dragging, need to remember if adding or removing
    setIsDragging(true);
    setIsAddingWall(!node.isWall);
    
    // Set the initial cell
    handleCellAction(row, col, false);
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (isDragging && tool === 'wall') { // if dragging and wall tool, add wall
      handleCellAction(row, col, true);
    }
  };
  const handleMouseUp = () => { // stop dragging
    setIsDragging(false);
  };
  const handleMouseLeave = () => { // stop dragging
    setIsDragging(false);
  };

  // Make sure there is always exactly one start and one end present!
  useEffect(() => {
    setGrid((prev) => {
      let hasStart = false; // check if start is present
      let hasEnd = false; // check if end is present
      for (const r of prev) { // loop through nodes
        for (const n of r) {
          if (n.isStart) hasStart = true; // set start and end to true
          if (n.isEnd) hasEnd = true;
        }
      }
      if (hasStart && hasEnd) return prev;

      const midRow = Math.floor(rows / 2); // middle row
      const startCol = Math.floor(cols * 0.2); // start column
      const endCol = Math.floor(cols * 0.8); // end column

      const next = prev.map((r, ri) => // map through nodes
        r.map((n, ci) => {
          let newIsStart = n.isStart; // new start
          let newIsEnd = n.isEnd; // new end
          if (!hasStart && ri === midRow && ci === startCol) {
            newIsStart = true; // set start to true
          }
          if (!hasEnd && ri === midRow && ci === endCol) {
            newIsEnd = true; // set end true
          }
          return { ...n, isStart: newIsStart, isEnd: newIsEnd, isWall: false, weight: n.weight || 1 }; // return new node
        })
      );
      return next;
    });
  }, [rows, cols]);

  const clearPath = () => { // clear path
    setGrid((prevGrid) => // map through nodes
      prevGrid.map((row) =>
        row.map((node) => ({
          ...node,
          isVisited: false,
          isPath: false,
        }))
      )
    );
  };

  const clearBoard = () => { // clear board
    setGrid((prevGrid) =>
      prevGrid.map((row) =>
        row.map((node) => ({ // set walls, visited, and path nodes to false, reset weight to 1
          ...node,
          isWall: false,
          isVisited: false,
          isPath: false,
          weight: 1,
        }))
      )
    );
  };

  const getStartNode = (): Node | null => { // get start node, just loop through until found
    for (const row of grid) { 
      for (const node of row) {
        if (node.isStart) return node;
      }
    }
    return null;
  };

  const getEndNode = (): Node | null => { // same for end node 
    for (const row of grid) {
      for (const node of row) {
        if (node.isEnd) return node;
      }
    }
    return null;
  };

  useImperativeHandle(ref, () => ({ // imperative handle to pass functions to parent
    clearPath,
    clearBoard,
    getGrid: () => grid,
    setGrid,
    getStartNode,
    getEndNode,
  }));

  const getCellClassName = (node: Node): string => { //get cell class name
    const classes = ['cell'];
    // Start and end should always show regardless of other states
    if (node.isStart) { // if start, add start class
      classes.push('cell-start');
      return classes.join(' ');
    }
    if (node.isEnd) { // if end add end class
      classes.push('cell-end');
      return classes.join(' ');
    }
    // Only apply these classes if not start/end
    if (node.isWall) classes.push('cell-wall');
    if (node.isVisited) classes.push('cell-visited');
    if (node.isPath) classes.push('cell-path');
    return classes.join(' ');
  };

  // Add global mouse up handler so stop dragging when mouse is released outside grid
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) { // if dragging, add event listener
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => { // remove event listener
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging]);

  return ( // main grid component
    <div className="grid-container">
      <div  // grid container
        className="grid" 
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        onMouseLeave={handleMouseLeave}
      >
        {grid.map((row, rowIdx) => // map through rows
          row.map((node, colIdx) => ( // map through cols
            <div
              key={`${rowIdx}-${colIdx}`}
              className={getCellClassName(node)} // get cell class name
              data-weight={node.weight}
              onClick={() => handleCellClick(rowIdx, colIdx)}
              onMouseDown={(e) => {
                e.preventDefault();
                handleCellMouseDown(rowIdx, colIdx);
              }}
              onMouseEnter={() => handleCellMouseEnter(rowIdx, colIdx)} //add wall while dragging :)
              onMouseUp={handleMouseUp} // stop dragging
              onDragStart={(e) => e.preventDefault()} // prevent default drag behavior
              title={node.weight > 1 ? `Weight: ${node.weight}` : undefined}
            >
              {!node.isStart && !node.isEnd && !node.isWall && node.weight > 1 && (
                <span className="cell-weight">{node.weight}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
});

Grid.displayName = 'Grid';

export default Grid;

