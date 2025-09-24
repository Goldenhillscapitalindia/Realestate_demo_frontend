export type BlockType =
  | "text"
  | "table"
  | "card"
  | "chart"
  | "heatmap";   // ✅ new



export interface HeatmapBlock extends BaseBlock {
  type: "heatmap";
  title: string;
  data: number[][];
}

export interface BaseBlock {
  type: BlockType;
  total_columns?: number;
  row?: number;
  column?: number;
}

// Text block
export interface TextBlock extends BaseBlock {
  type: "text";
  content: string;
}

// Table block
export interface TableBlock extends BaseBlock {
  type: "table";
  headers: string[];
  rows: string[][];
}

// Card block
export interface CardBlock extends BaseBlock {
  type: "card";
  title: string;
  subtitle: string;
  description: string;
  icon?: string;
}

// General Chart block fallback (for unknown or other chartTypes)
export interface ChartBlock extends BaseBlock {
  type: "chart";
  chartType: string;
  title: string;
  data: any;
}



export type Block =
  | TextBlock
  | TableBlock
  | CardBlock
  | ChartBlock
  | HeatmapBlock;
