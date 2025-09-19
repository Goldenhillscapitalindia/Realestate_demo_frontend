import LinkBlock from "./LinkBlock";

export type BlockType = 'text' | 'card' | 'table' | 'tree' | 'chart' | 'slides' | 'suggested_questions'| 'calendar'|'link'|'image'|'video';

export type ChartType =
  | 'bar'
  | 'pie'
  | 'line'
  | 'scatter'
  | 'bubble'
  | 'heatmap'
  | 'area'
  | 'stackedBar'; // Notice: 'tree' and 'calendar' removed

export interface BaseBlock {
  type: BlockType;
  row: number;
  column: number;
  total_columns: number;
}

// ------------------ Basic Blocks ------------------

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
}
export interface LinkBlock extends BaseBlock{
  type:'link'
  text:string 
  url:string
}
export interface CardBlock extends BaseBlock {
  type: 'card';
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  headers: string[];
  rows: string[][];
}

export interface SuggestedQuestionsBlock extends BaseBlock {
  type: 'suggested_questions';
  questions: string[];
}

// ------------------ Chart Blocks ------------------

interface BaseChartBlock extends BaseBlock {
  type: 'chart';
  title: string;
  chartType: ChartType;
}

export interface PieChartBlock extends BaseChartBlock {
  chartType: 'pie';
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  };
}

export interface BarChartBlock extends BaseChartBlock {
  chartType: 'bar';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
}

export interface StackedBarChartBlock extends BaseChartBlock {
  chartType: 'stackedBar';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
}

export interface LineChartBlock extends BaseChartBlock {
  chartType: 'line';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      fillColor?: string;
    }[];
  };
}

export interface AreaChartBlock extends BaseChartBlock {
  chartType: 'area';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      fillColor?: string;
    }[];
  };
}

export interface ScatterChartBlock extends BaseChartBlock {
  chartType: 'scatter';
  data: { x: number; y: number }[];
}

export interface BubbleChartBlock extends BaseChartBlock {
  chartType: 'bubble';
  data: { x: number; y: number; r: number }[];
}

export interface HeatmapChartBlock extends BaseChartBlock {
  chartType: 'heatmap';
  data: number[][];
}

// ------------------ Tree Block (not chart anymore) ------------------

export interface TreeChartBlock extends BaseBlock {
  type: 'tree';
  title: string;
  data: {
    name: string;
    children?: TreeChartBlock['data'][];
  };
}

export interface CalendarChartBlock extends BaseBlock {
  type: 'calendar';
  title: string;
  data: {
    date: string;
    label: string;
  }[];
}

// Image block
export interface ImageBlock extends BaseBlock {
  type: "image";
  title: string;
  description: string;
  url: string;
  alt: string;
}

// Video block
export interface VideoBlock extends BaseBlock {
  type: "video";
  title: string;
  description: string;
  url: string;
  thumbnail: string;
}

// ------------------ Slides Block ------------------

export interface Slide {
  title: string;
  content: string;
  image?: string | null;
}

export interface SlidesBlock extends BaseBlock {
  type: 'slides';
  title: string;
  slides: Slide[];
}

// ------------------ Union Types ------------------

export type ChartBlock =
  | PieChartBlock
  | BarChartBlock
  | StackedBarChartBlock
  | LineChartBlock
  | AreaChartBlock
  | ScatterChartBlock
  | BubbleChartBlock
  | HeatmapChartBlock;

export type DynamicBlock =
  | TextBlock
  | CardBlock
  | TableBlock
  | TreeChartBlock
  | SlidesBlock
  | SuggestedQuestionsBlock
  | ChartBlock
  |LinkBlock
  |ImageBlock
  |VideoBlock
  | CalendarChartBlock;
