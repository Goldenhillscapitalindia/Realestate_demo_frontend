  import React, { useEffect, useState } from "react";
  import { Grid, Card,Box,CardContent } from "@mui/material";
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

  const BLOCK_RENDERERS: Record<BlockType, (block: any, setQuestion?: (q: string) => void, handleSubmit?: () => void) => JSX.Element> = {
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
      if (setQuestion && handleSubmit) {
        handleSubmit(selected); // this will clear previous response and submit new one
        setQuestion(selected);  // update input
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }}
  />
),


  };

  const GENAIRenderer: React.FC<{
    blocks: Block[];
    setQuestion?: (q: string) => void;
    handleSubmit?: () => void;
  }> = ({ blocks, setQuestion, handleSubmit }) => {
    const [visibleBlocks, setVisibleBlocks] = useState<Block[]>([]);

    useEffect(() => {
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

    const sortedVisibleBlocks = [...visibleBlocks]
      .filter((block) => block.type !== "suggested_questions")
      .sort((a, b) => {
        const rowA = a?.row ?? 0;
        const rowB = b?.row ?? 0;
        if (rowA !== rowB) return rowA - rowB;
        const colA = a?.column ?? 0;
        const colB = b?.column ?? 0;
        return colA - colB;
      });

    const suggestedBlock = visibleBlocks.find((block) => block.type === "suggested_questions") as SuggestedQuestionsBlock | undefined;

    const grouped: Record<number, Block[]> = {};
    sortedVisibleBlocks.forEach((block) => {
      const row = block.row ?? 0;
      if (!grouped[row]) grouped[row] = [];
      grouped[row].push(block);
    });
const sortedRows = Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b));

return (
  <CardContent sx={{ paddingBottom: 0 }}>
    {sortedRows.map(([rowKey, rowBlocks]) => (
      <Grid container spacing={2} key={`row-${rowKey}`} sx={{ mb: 2 }}>
        {rowBlocks.map((block, idx) => {
          const Renderer = BLOCK_RENDERERS[block.type];
          if (!Renderer) return null;

          const totalCols = block.total_columns || 1;
          const gridSize = Math.floor(12 / totalCols);

          return (
            <Grid
              item
              xs={12}
              sm={gridSize * 1} // adjust multiplier if needed
              md={gridSize * 1}
              lg={gridSize * 1}
              key={idx}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3, ease: "easeOut" }}
                style={{ flexGrow: 1, display: "flex" }}
              >
                {Renderer(block, setQuestion, handleSubmit)}
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    ))}
  </CardContent>
);

  };

  export default GENAIRenderer;
