# Miles Tree Map

![Component Preview](https://raw.githubusercontent.com/dmiles77/miles-tree-map/8e40721f4e19bdad27fd55e70d1f679cd79a7e6b/Animation.gif)

A powerful and customizable TreeMap visualization component for React, featuring infinite drill-down capabilities, smooth animations, and extensive customization options. This component is not just a chart, it's a responsive layout that can render custom components within each node, providing a dynamic and interactive user experience.
basically render any thing you want based on the data structure.

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

Here's an example of how to use the TreeMap component in a React application:

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
In this example, the worldMap object represents the hierarchical data structure to be visualized. The TreeMap component renders this data, providing an interactive and responsive layout.

Note: The TreeNode interface defines the structure of each node in the tree, including properties like id, name, value, children, and customData.


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
| `tooltipComponentRender` | `(ICustomTooltipProps) => JSX.Element` | `undefined` | Custom tooltip component |

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

To render custom content within each node, you can provide a renderComponent prop to the TreeMap component. This prop should be a function that returns a JSX element.

```tsx
import React from "react";
import { TreeMap, TreeNode, CustomNodeProps } from "miles-tree-map";

const CustomNode: React.FC<CustomNodeProps> = ({ node, width, height, backgroundColor }) => (
  <div style={{ width, height, backgroundColor, padding: '5px', boxSizing: 'border-box' }}>
    <strong>{node.name}</strong>
    {node.customData && <p>{node.customData.description}</p>}
  </div>
);

const data: TreeNode = {
  id: "root",
  name: "Root",
  children: [
    {
      id: "child1",
      name: "Child 1",
      value: 10,
      customData: { description: "This is child 1" }
    },
    {
      id: "child2",
      name: "Child 2",
      value: 20,
      customData: { description: "This is child 2" }
    }
  ]
};

const App: React.FC = () => (
  <TreeMap data={data} renderComponent={CustomNode} />
);

export default App;

```

### Custom Tooltip Component

For a customized tooltip, you can provide a renderTooltip prop to the TreeMap component. This prop should be a function that returns a JSX element representing the tooltip.

```tsx
interface ICustomTooltipProps {
  node: TreeNode;
  position?: XYPosition;
}
```

```tsx
      <TreeMap
        data={data}
        tooltipComponentRender={(customTooltipProps: ICustomTooltipProps) => {
          const { node, position } = customTooltipProps;
          console.log(node, position);
          return (
            <>
            <strong>{node.name} 1111</strong> <br />
            {node.customData && (
              <pre style={{ margin: "0", whiteSpace: "pre-wrap" }}>
                {JSON.stringify(node.customData, null, 2)}
              </pre>
              )}
            </>
          );
        }}
      />
```

Here, CustomTooltip is a component that receives TooltipData and styles, rendering the node's customData within a styled tooltip. The renderTooltip prop is set to a function that returns this CustomTooltip component.

## 🛠️ Underlying Libraries

The miles-tree-map component leverages several libraries to provide its functionality:

React: A JavaScript library for building user interfaces, enabling the creation of reusable UI components.

D3.js: A powerful library for producing dynamic, interactive data visualizations in web browsers. Specifically, miles-tree-map utilizes the d3-hierarchy module, which offers tools for visualizing hierarchical data structures, such as treemaps. 

TypeScript: A statically typed superset of JavaScript that compiles to plain JavaScript, providing optional static typing and class-based object-oriented programming.

By combining these technologies, miles-tree-map offers a robust and flexible solution for rendering interactive and customizable treemap visualizations in React applications.


## 📊 Data Structure

```tsx
interface TreeNode {
  id: string;
  name: string;
  value?: number;
  children?: TreeNode[];
  customData?: Record<string, unknown>;
}
```

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

For more information and access to the source code, visit the [GitHub repository](https://github.com/dmiles77/miles-tree-map)

Note: Ensure that your project meets the peer dependency requirements for React and TypeScript to utilize miles-tree-map effectively.

## Support

Found a bug or want to add a feature? let me know please: danielmiles89@gmail.com

## 📜 License

MIT License © 2025 [dmiles77](https://github.com/dmiles77)

Have fun!!


