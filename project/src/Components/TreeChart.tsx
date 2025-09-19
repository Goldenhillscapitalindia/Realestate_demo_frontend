import React, { useRef, useEffect, useState } from 'react';
import {Tree} from 'react-d3-tree';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface TreeChartProps {
  data: TreeNode;
  title: string;
}

const TreeChart: React.FC<TreeChartProps> = ({ data, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });

  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      if (offsetWidth && offsetHeight) {
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    }
  }, []);

  if (!data || !data.name) {
    return <div className="text-red-500">Invalid tree data provided.</div>;
  }

  return (
    <div
      ref={containerRef}
      className="p-4 bg-white rounded-xl shadow text-black"
      style={{ height: 500 }}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <Tree
        data={data}
        orientation="vertical"
        translate={{
          x: dimensions.width / 2,
          y: 60,
        }}
        zoomable
      />
    </div>
  );
};

export default TreeChart;
