// Controls for the app, select algorithm and tool, along with other things
import { useState } from 'react';
import './Controls.css';

export type Algorithm = 'dijkstra' | 'bfs' | 'dfs' | 'aStar';

interface ControlsProps { // props for the controls component
  onVisualize: (algorithm: Algorithm) => void;
  onClearPath: () => void;
  onClearBoard: () => void;
  onGenerateMaze: () => void;
  isVisualizing: boolean;
  selectedTool: 'wall' | 'start' | 'end' | 'weight';
  onToolChange: (tool: 'wall' | 'start' | 'end' | 'weight') => void;
}

function Controls({
  onVisualize,
  onClearPath,
  onClearBoard,
  onGenerateMaze,
  isVisualizing,
  selectedTool,
  onToolChange,
}: ControlsProps) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>('dijkstra');

  const handleVisualize = () => {
    onVisualize(selectedAlgorithm);
  };

  return ( // main controls component
    <div className="controls">
      <div className="controls-section">
        <label htmlFor="algorithm-select" className="controls-label">
          Algorithm:
        </label>
        <select
          id="algorithm-select"
          className="controls-select"
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value as Algorithm)}
          disabled={isVisualizing}
        >
          <option value="dijkstra">Dijkstra's Algorithm</option>
          <option value="aStar">A* Search</option>
          <option value="bfs">Breadth-First Search (BFS)</option>
          <option value="dfs">Depth-First Search (DFS)</option>
        </select>
      </div>

      <div className="controls-section">
        <label htmlFor="tool-select" className="controls-label">
          Tool:
        </label>
        <select
          id="tool-select"
          className="controls-select"
          value={selectedTool}
          onChange={(e) => onToolChange(e.target.value as 'wall' | 'start' | 'end' | 'weight')}
          disabled={isVisualizing}
        >
          <option value="wall">Place Walls</option>
          <option value="start">Place Start</option>
          <option value="end">Place End</option>
          <option value="weight">Set Weight</option>
        </select>
      </div>

      <div className="controls-section">
        <button
          className="controls-button controls-button-primary"
          onClick={handleVisualize}
          disabled={isVisualizing}
        >
          {isVisualizing ? 'Visualizing...' : 'Visualize'}
        </button>
        <button
          className="controls-button"
          onClick={onClearPath}
          disabled={isVisualizing}
        >
          Clear Path
        </button>
        <button
          className="controls-button"
          onClick={onClearBoard}
          disabled={isVisualizing}
        >
          Clear Board
        </button>
        <button
          className="controls-button"
          onClick={onGenerateMaze}
          disabled={isVisualizing}
        >
          Generate Maze
        </button>
      </div>

      <div className="controls-info">
        <span className="controls-legend-item">
          <span className="legend-color legend-start"></span>
          Start
        </span>
        <span className="controls-legend-item">
          <span className="legend-color legend-end"></span>
          End
        </span>
        <span className="controls-legend-item">
          <span className="legend-color legend-wall"></span>
          Wall
        </span>
        <span className="controls-legend-item">
          <span className="legend-color legend-visited"></span>
          Visited
        </span>
        <span className="controls-legend-item">
          <span className="legend-color legend-path"></span>
          Path
        </span>
        <span className="controls-legend-item">
          <span className="legend-color legend-weight"></span>
          Weighted (Dijkstra and A* only)
        </span>
      </div>
    </div>
  );
}

export default Controls;

