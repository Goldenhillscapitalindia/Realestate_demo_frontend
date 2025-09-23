import React, { useEffect, useState } from "react";
import { Box, CardContent } from "@mui/material";
import { motion } from "framer-motion";

import GENAITextBlock from "./GENAITextBlock";
import GENAICardBlock from "./GENAICardBlock";
import GENAIChartBlock from "./GENAIChartBlock";
import GENAICalendar from "./GENAICalendar";
import GENAITree from "./GENAITree";
import GENAILinkBlock from "./GENAILinkBlock";
import GENAITableBlock from "./GENAITableBlock";
import GENAIImageCard from "./GENAIImageCard";
import GENAIVideoCard from "./GENAIVideoCard";
import SuggestedQuestions from "./SuggestedQuestions";

import {
  Block,
  BlockType,
  TextBlock,
  TableBlock,
  CardBlock,
  LinkBlock,
  ChartBlock,
  ImageBlock,
  VideoBlock,
  CalendarBlock,
  TreeBlock,
  SuggestedQuestionsBlock,
} from "../Components/Utils/ComponentsUtils";

const BLOCK_RENDERERS: Record<
  BlockType,
  (block: any, setQuestion?: (q: string) => void, handleSubmit?: (q?: string) => void) => JSX.Element
> = {
  text: (block: TextBlock) => <GENAITextBlock content={block.content} />,
  table: (block: TableBlock) => <GENAITableBlock headers={block.headers} rows={block.rows} />,
  card: (block: CardBlock) => <GENAICardBlock {...block} />,
  link: (block: LinkBlock) => <GENAILinkBlock text={block.text} url={block.url} />,
  chart: (block: ChartBlock) => <GENAIChartBlock chartType={block.chartType} title={block.title} data={block.data} />,
  image: (block: ImageBlock) => <GENAIImageCard {...block} />,
  video: (block: VideoBlock) => <GENAIVideoCard {...block} />,
  calendar: (block: CalendarBlock) => <GENAICalendar {...block} />,
  tree: (block: TreeBlock) => <GENAITree {...block} />,
  suggested_questions: (block: SuggestedQuestionsBlock, setQuestion, handleSubmit) => (
    <SuggestedQuestions
      questions={block.questions || []}
      onSelect={(selected) => {
        // caller will pass setQuestion and handleSubmit from parent if needed
        if (handleSubmit) handleSubmit(selected);
        if (setQuestion) setQuestion(selected);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    />
  ),
};

const GENAIRenderer: React.FC<{
  blocks: Block[];
  setQuestion?: (q: string) => void;
  handleSubmit?: (q?: string) => void;
}> = ({ blocks, setQuestion, handleSubmit }) => {
  const [visibleBlocks, setVisibleBlocks] = useState<Block[]>([]);

  // reveal blocks one by one (keeps your existing effect)
  useEffect(() => {
    setVisibleBlocks([]); // reset when blocks change
    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= blocks.length) {
        clearInterval(interval);
        return;
      }
      const nextBlock = blocks[idx];
      if (nextBlock) {
        setVisibleBlocks((prev) => [...prev, nextBlock]);
      }
      idx++;
    }, 1000);

    return () => clearInterval(interval);
  }, [blocks]);

  // separate suggested_questions block (we render it full-width after layout)
  const suggestedBlock = visibleBlocks.find((b) => b.type === "suggested_questions") as
    | SuggestedQuestionsBlock
    | undefined;

  // all other blocks (with rows)
  const layoutBlocks = visibleBlocks.filter((b) => b.type !== "suggested_questions");

  // group blocks by row (use numeric row; default 0 if missing)
  const grouped: Record<number, Block[]> = {};
  layoutBlocks.forEach((block) => {
    const row = Number(block?.row ?? 0);
    if (!grouped[row]) grouped[row] = [];
    grouped[row].push(block);
  });

  const sortedRows = Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b));

  return (
    <CardContent sx={{ paddingBottom: 0 }}>
      {sortedRows.map(([rowKey, rowBlocksRaw]) => {
        // sort blocks in the row by column (default column=1)
        const rowBlocks = [...rowBlocksRaw].sort((a, b) => (a.column ?? 1) - (b.column ?? 1));

        // determine the number of logical columns for this row (use the max total_columns found)
        const rowTotalColumns = Math.max(...rowBlocks.map((b) => b.total_columns ?? 1), 1);

        // compute base span (12-grid)
        const baseSpan = Math.floor(12 / rowTotalColumns) || 1;

        return (
          <Box
            key={`row-${rowKey}`}
            sx={{
              mb: 2,
              // responsive: stacked on xs, 12-col grid on sm+
              display: "grid",
              gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(12, 1fr)" },
              gap: 2,
            }}
          >
            {rowBlocks.map((block, idx) => {
              const Renderer = BLOCK_RENDERERS[block.type];
              if (!Renderer) return null;

              const col = Math.max(1, Number(block.column ?? 1)); // 1-indexed
              // compute start & end grid lines (1..13)
              const start = (col - 1) * baseSpan + 1;
              // for the last logical column, expand to the end to consume any remainder
              const end = col === rowTotalColumns ? 13 : start + baseSpan;

              // allow single-column stacking on xs but place at grid position on sm+
              const gridColumnValue = { xs: "1 / -1", sm: `${start} / ${end}` };

              return (
                <Box
                  key={`${rowKey}-${block.type}-${col}-${idx}`}
                  sx={{
                    gridColumn: gridColumnValue,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3, ease: "easeOut" }}
                    style={{ flexGrow: 1, display: "flex" }}
                  >
                    {Renderer(block as any, setQuestion, handleSubmit)}
                  </motion.div>
                </Box>
              );
            })}
          </Box>
        );
      })}

      {/* suggested questions (render after the layout; full width) */}
      {suggestedBlock && (
        <Box sx={{ mt: 2 }}>
          {BLOCK_RENDERERS["suggested_questions"](suggestedBlock, setQuestion, handleSubmit)}
        </Box>
      )}
    </CardContent>
  );
};

export default GENAIRenderer;
