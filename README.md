# Miles Tree Map

![Miles Tree Map]()
*A fully responsive Tree Map visualization with infinite drill-down, built for React.*

## 📦 Installation

You can install the package via NPM:

```sh
npm install miles-tree-map
```

Or with Yarn:

```sh
yarn add miles-tree-map
```

## 🚀 Usage

```tsx
import React from "react";
import { MilesTreeMap } from "miles-tree-map";

const data = {
  name: "Root",
  value: 100,
  children: [
    { 
      name: "A", 
      value: 40, 
      children: [
        { name: "A1", value: 20 },
        { name: "A2", value: 20, children: [
          { name: "A2-1", value: 10 },
          { name: "A2-2", value: 10 }
        ] }
      ]
    },
    { 
      name: "B", 
      value: 60, 
      children: [
        { name: "B1", value: 30, children: [
          { name: "B1-1", value: 15 },
          { name: "B1-2", value: 15 }
        ] },
        { name: "B2", value: 30 }
      ] 
    }
  ]
};

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <h1>Miles Tree Map</h1>
      <MilesTreeMap data={data} />
    </div>
  );
}

export default App;
```

## 🔧 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TreeNode` | Required | The hierarchical data structure defining the tree map. Each node must have a `name`, `value`, and optional `children`. |
| `renderComponent` | `(node: TreeNode) => JSX.Element` | `null` | A custom component to be displayed inside each rectangle. If not provided, a default display with the node's name and value is used. |
| `colorRange` | `[string, string]` | `['#f00', '#0f0']` | Defines the color gradient applied to nodes based on their value, from the minimum to maximum values in the current view. |
| `onNodeClick` | `(node: TreeNode) => void` | `null` | A callback function that gets triggered when a node is clicked. Useful for additional interactions. |
| `animationDuration` | `number` | `300` | The duration (in milliseconds) of animations when drilling down or zooming out. |
| `breadcrumbEnabled` | `boolean` | `true` | If `true`, a breadcrumb navigation bar is shown at the top, displaying the current path. |
| `backButtonEnabled` | `boolean` | `true` | If `true`, a back button is displayed, allowing users to navigate back to the previous level. |
| `padding` | `number` | `5` | The padding (in pixels) between rectangles within the tree map layout. |
| `borderRadius` | `number` | `5` | The corner radius (in pixels) applied to each rectangle for a smoother appearance. |
| `minDisplayValue` | `number` | `0` | Nodes with a value below this threshold will not be rendered to prevent clutter. |
| `tooltipEnabled` | `boolean` | `true` | If `true`, tooltips displaying the full node name and value appear on hover. |

## 📜 License

MIT License © 2024 [dmiles77](https://github.com/dmiles77)
