# Pathfinding Visualizer

An interactive web application for visualizing pathfinding algorithms on a grid. Watch algorithms like Dijkstra, A*, BFS, and DFS find their way through mazes and custom obstacles in real-time.

![Pathfinding Visualizer](https://img.shields.io/badge/React-19.1.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue) ![Vite](https://img.shields.io/badge/Vite-7.1.7-purple)

## 🎯 Features

### Algorithms
- **Dijkstra's Algorithm** - Finds shortest path in weighted graphs
- **A* Search** - Heuristic-guided optimal pathfinding
- **Breadth-First Search (BFS)** - Level-by-level exploration
- **Depth-First Search (DFS)** - Deep exploration strategy

### Interactive Grid
- **Place Walls** - Click or drag to create obstacles
- **Set Weights** - Assign costs to nodes (weights: 1, 5, 10, 15)
  - Note: Weights only affect Dijkstra and A* algorithms
- **Place Start/End Nodes** - Position your start and end points
- **Generate Maze** - Automatically create a perfect maze using recursive backtracking
- **Drag to Draw** - Quickly draw walls by clicking and dragging

### Visualization
- Real-time animation showing algorithm exploration
- Color-coded nodes:
  - 🟢 **Green** - Start node
  - 🔴 **Red** - End node
  - ⬛ **Black** - Walls
  - 🔵 **Blue** - Visited nodes (explored by algorithm)
  - 🟡 **Yellow** - Shortest path found
  - 🟨 **Light Yellow or Orange** - Weighted nodes (with weight numbers displayed)

### Controls
- **Clear Path** - Remove visualization but keep walls
- **Clear Board** - Reset everything (walls, weights, visualization)
- Fast visualization speed (0.5ms per step)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Pathfinding-Visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown (typically `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## How to Use

### Basic Usage

1. **Set up your grid**:
   - Use "Place Walls" tool to create obstacles (click or drag)
   - Use "Set Weight" tool to add costs to nodes (click to cycle: 1 → 5 → 10 → 15)
   - Use "Place Start" and "Place End" to position nodes
   - Or click "Generate Maze" for an automatic maze

2. **Select an algorithm** from the dropdown

3. **Click "Visualize"** to watch the algorithm find a path

4. **Clear and try again**:
   - "Clear Path" - removes visualization, keeps obstacles
   - "Clear Board" - resets everything

### Tips

- **Weights** (1, 5, 10, 15) only affect Dijkstra and A* algorithms
- **BFS and DFS** ignore weights as they're designed for unweighted graphs
- **Generate Maze** creates a perfect maze with exactly one solution path
- **Drag to draw** walls for faster obstacle placement

## 🔬 Algorithms Explained

### Dijkstra's Algorithm
- **Type**: Weighted shortest path
- **Guarantees**: Shortest path in weighted graphs
- **Uses**: Priority queue, distance-based exploration
- **Best for**: Finding optimal paths with varying costs

### A* Search
- **Type**: Weighted heuristic-guided
- **Guarantees**: Shortest path (with admissible heuristic)
- **Uses**: f(n) = g(n) + h(n) where h(n) is Manhattan distance
- **Best for**: Fast optimal pathfinding with heuristic guidance

### Breadth-First Search (BFS)
- **Type**: Unweighted level-by-level
- **Guarantees**: Shortest path in unweighted graphs
- **Uses**: Queue (FIFO)
- **Best for**: Unweighted grids, level-by-level exploration

### Depth-First Search (DFS)
- **Type**: Unweighted deep exploration
- **Guarantees**: Path exists (not necessarily shortest)
- **Uses**: Stack (LIFO)
- **Best for**: Exploring all paths, maze solving

## Project Structure

```
Pathfinding-Visualizer/
├── src/
│   ├── App.tsx              # Main application component
│   ├── main.tsx              # React entry point
│   ├── components/
│   │   ├── Grid.tsx          # Grid component with node management
│   │   ├── Grid.css          # Grid styling
│   │   ├── Controls.tsx      # Control bar component
│   │   └── Controls.css      # Control bar styling
│   ├── algorithms/
│   │   ├── dijkstra.ts       # Dijkstra's algorithm
│   │   ├── astar.ts          # A* search algorithm
│   │   ├── bfs.ts            # Breadth-First Search
│   │   └── dfs.ts            # Depth-First Search
│   └── utils/
│       └── mazeGenerator.ts  # Recursive backtracking maze generator
├── package.json
└── README.md
```

## 🛠️ Technologies

- **React 19.1.1** - UI framework
- **TypeScript 5.9.3** - Type safety
- **Vite 7.1.7** - Build tool and dev server
- **CSS3** - Styling

## Color Legend

- 🟢 **Green** - Start node
- 🔴 **Red** - End node
- ⬛ **Black** - Wall (impassable)
- 🔵 **Blue** - Visited (nodes explored by algorithm)
- 🟡 **Yellow** - Path (final shortest path)
- 🟨 **Yellow/Orange** - Weighted nodes (higher traversal cost)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build


## License


---

**Enjoy visualizing pathfinding algorithms!**
