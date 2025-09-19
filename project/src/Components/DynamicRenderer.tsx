import React from 'react';
import ChartBlock from './ChartBlock';
import CardBlock from './CardBlock';
import TableBlock from './TableBlock';  
import TextBlock from './TextBlock';
import LinkBlock from './LinkBlock';
import { DynamicBlock } from './types';
import SuggestedQuestionsBlock from './SuggestedQuestionsBlock';
import SlidesBlock from './SlidesBlock';
import TreeChart from './TreeChart';
import CalendarChart from './CalendarChart';
import ImageBlock from './ImageBlock';
import VideoBlock from './VideoBlock';

interface Props {
  response: DynamicBlock[];
  onSuggestedQuestionClick?: (question: string) => void;
}


const renderBlock = (item: DynamicBlock, onSuggestedQuestionClick?: (q: string) => void) => {
  switch (item.type) {
    case 'text':
      return <TextBlock {...item} />;
    case 'card':
      return <CardBlock {...item} />;
    case 'table':
      return <TableBlock {...item} />;
    case 'chart':
      return <ChartBlock {...item} />;
    case 'link':
      return <LinkBlock {...item} />;
    case 'suggested_questions':
      return <SuggestedQuestionsBlock {...item} onQuestionClick={onSuggestedQuestionClick} />;
    case 'slides':
      return <SlidesBlock {...item} />;
    case 'tree':
      return <TreeChart {...item}/>;
    case 'calendar':
    return <CalendarChart {...item} />;
    case 'image':
      return <ImageBlock {...item}/>;
    case 'video':
    return <VideoBlock {...item}/>;


    default:
      return <div className="text-red-500">Unknown type: {item}</div>;
  }
};
const DynamicRenderer: React.FC<Props> = ({ response, onSuggestedQuestionClick }) => {
  const groupedByRow = response.reduce((acc: Record<number, DynamicBlock[]>, item) => {
    acc[item.row] = acc[item.row] || [];
    acc[item.row].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(groupedByRow).map(([row, items]) => {
        const totalCols = items[0]?.total_columns || 1;
        const columnClass = `grid grid-cols-${Math.min(Math.max(totalCols, 1), 6)} gap-4`;

        // Split suggested_questions from others
        const normalItems = items.filter((b) => b.type !== "suggested_questions");
        const suggestionItems = items.filter((b) => b.type === "suggested_questions");

        // Sort normal items by column
        const sortedNormal = [...normalItems].sort((a, b) => a.column - b.column);

        return (
          <div key={row} className={columnClass}>
            {/* Render normal blocks */}
            {sortedNormal.map((item, i) => (
              <div
                key={i}
                className="col-span-1"
                style={{ gridColumn: `${item.column} / span 1` }}
              >
                {renderBlock(item, onSuggestedQuestionClick)}
              </div>
            ))}

            {/* Render suggested questions last */}
            {suggestionItems.map((item, i) => (
              <div
                key={`suggestion-${i}`}
                className="col-span-full" // Make it span the entire row
              >
                {renderBlock(item, onSuggestedQuestionClick)}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default DynamicRenderer;
