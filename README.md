# Miles Tree Map

A powerful and customizable TreeMap visualization component for React, featuring infinite drill-down capabilities, smooth animations, and extensive customization options.

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
import { TreeMap, TreeNode } from "miles-tree-map";

const worldMap = {
  "id": "world",
  "name": "World",
  "customData": { "description": "The entire world population and landmass" },
  "children": [
    {
      "id": "asia",
      "name": "Asia",
      "customData": { "population": "4.7 billion", "area": "44.58 million km²" },
      "children": [
        {
          "id": "china",
          "name": "China",
          "customData": { "population": "1.4 billion", "capital": "Beijing" },
          "children": [
            {
              "id": "beijing",
              "name": "Beijing",
              "value": 20,
              "customData": { "population": "21.9 million", "area": "16,410.54 km²" }
            },
            {
              "id": "shanghai",
              "name": "Shanghai",
              "value": 15,
              "customData": { "population": "24.9 million", "area": "6,340.5 km²" }
            }
          ]
        },
        {
          "id": "india",
          "name": "India",
          "customData": { "population": "1.4 billion", "capital": "New Delhi" },
          "children": [
            {
              "id": "delhi",
              "name": "Delhi",
              "value": 15,
              "customData": { "population": "32.2 million", "area": "1,484 km²" }
            },
            {
              "id": "mumbai",
              "name": "Mumbai",
              "value": 10,
              "customData": { "population": "24.9 million", "area": "603.4 km²" }
            }
          ]
        }
      ]
    },
    {
      "id": "africa",
      "name": "Africa",
      "customData": { "population": "1.3 billion", "area": "30.37 million km²" },
      "children": [
        {
          "id": "nigeria",
          "name": "Nigeria",
          "customData": { "population": "223 million", "capital": "Abuja" },
          "children": [
            {
              "id": "lagos",
              "name": "Lagos",
              "value": 7,
              "customData": { "population": "16.6 million", "area": "1,171 km²" }
            },
            {
              "id": "kano",
              "name": "Kano",
              "value": 3,
              "customData": { "population": "4.1 million", "area": "499 km²" }
            }
          ]
        },
        {
          "id": "egypt",
          "name": "Egypt",
          "customData": { "population": "112 million", "capital": "Cairo" },
          "children": [
            {
              "id": "cairo",
              "name": "Cairo",
              "value": 5,
              "customData": { "population": "21.3 million", "area": "3,085 km²" }
            },
            {
              "id": "alexandria",
              "name": "Alexandria",
              "value": 3,
              "customData": { "population": "5.4 million", "area": "2,679 km²" }
            }
          ]
        }
      ]
    },
    {
      "id": "europe",
      "name": "Europe",
      "customData": { "population": "748 million", "area": "10.18 million km²" },
      "children": [
        {
          "id": "germany",
          "name": "Germany",
          "customData": { "population": "84.5 million", "capital": "Berlin" },
          "children": [
            {
              "id": "berlin",
              "name": "Berlin",
              "value": 4,
              "customData": { "population": "3.8 million", "area": "891.7 km²" }
            },
            {
              "id": "munich",
              "name": "Munich",
              "value": 2,
              "customData": { "population": "1.5 million", "area": "310.4 km²" }
            }
          ]
        },
        {
          "id": "france",
          "name": "France",
          "customData": { "population": "66.5 million", "capital": "Paris" },
          "children": [
            {
              "id": "paris",
              "name": "Paris",
              "value": 3,
              "customData": { "population": "2.1 million", "area": "105.4 km²" }
            },
            {
              "id": "marseille",
              "name": "Marseille",
              "value": 1,
              "customData": { "population": "870,000", "area": "240.6 km²" }
            }
          ]
        }
      ]
    },
    {
      "id": "pacific_ocean",
      "name": "Pacific Ocean",
      "value": 12,
      "customData": { "area": "165.2 million km²", "description": "Largest and deepest ocean" }
    }
  ]
};

const Example: react.FC = () => {
    const data: TreeNode = worldMap;
    return (
        <div style={{width: '100vw', height: '100vh'}}>
            <TreeMap data={data} />
        </div>
    )
}

```


## 🔧 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TreeNode` | Required | Hierarchical data structure for the tree map |
| `renderComponent` | `(props: ICustomNodeProps) => JSX.Element` | `undefined` | Custom component for node rendering |
| `colorRange` | `string[]` | `['#ff6b6b', '#4ecdc4']` | Colors used for node visualization |
| `colorRangeBehavior` | `ColorRangeBehavior` | `'oneColor'` | Color distribution strategy |
| `onNodeClick` | `(node: TreeNode) => void` | `undefined` | Callback for node click events |
| `animationDuration` | `number` | `300` | Duration of transitions in ms |
| `breadcrumbEnabled` | `boolean` | `true` | Show navigation breadcrumbs |
| `backButtonEnabled` | `boolean` | `true` | Show back button in nodes |
| `padding` | `number` | `1` | Spacing between nodes |
| `borderRadius` | `number` | `2` | Node corner radius |
| `minDisplayValue` | `number` | `0` | Minimum value for node display |
| `tooltipEnabled` | `boolean` | `true` | Enable hover tooltips |
| `customTooltipPosition` | `TooltipPosition` | `'mouseRight'` | Tooltip positioning |
| `renderTooltip` | `(data: TooltipData, style: CSSProperties) => JSX.Element` | `undefined` | Custom tooltip component |

## 🎨 Color Range Behaviors

The `colorRangeBehavior` prop supports these options:
- `oneColor`: Single color for all nodes
- `gradient`: Smooth transition between colors based on value
- `discrete`: Distinct colors from the range
- `transparent`: No background color
- `borderOnly`: Only node borders
- `patternFill`: Striped pattern using the color range
- `heatmap`: Value-based color intensity

## 📍 Tooltip Positions

Available `customTooltipPosition` options:
- Mouse-following: `mouseRight`, `mouseLeft`, `mouseTop`, `mouseBottom`

## 🎯 Custom Components

### Custom Node Component
tsx
interface ICustomNodeProps {
node: TreeNode;
width: number;
height: number;
backgroundColor: string;
handleBack: (index: number) => void;
history: Array<{ node: TreeNode; position: Position }>;
}
const CustomNode: React.FC<ICustomNodeProps> = (props) => {
// Your custom node implementation here you can use props from the TreeMap Node
};


### Custom Tooltip Component

tsx
interface TooltipData {
node: TreeNode;
mousePosition: { x: number; y: number };
containerBounds: DOMRect;
nodePosition: Position;
}
const CustomTooltip: React.FC<{ data: TooltipData; style: React.CSSProperties }> = (props) => {
// Your custom tooltip implementation
};


## 📊 Data Structure

typescript
interface TreeNode {
id: string;
name: string;
value?: number;
children?: TreeNode[];
customData?: Record<string, unknown>;
}


## 🌟 Features

- Infinite drill-down navigation
- Smooth animations and transitions
- Breadcrumb navigation
- Customizable tooltips
- Multiple color schemes
- Responsive layout
- Custom node rendering
- Back navigation
- Flexible positioning system
- Rich customization options

## 📜 License

MIT License © 2025 [dmiles77](https://github.com/dmiles77)


