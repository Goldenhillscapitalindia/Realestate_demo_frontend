import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TextBlockProps {
  content: string;
}

const TextBlock: React.FC<TextBlockProps> = ({ content }) => {
  return (
    <div
      className="
        p-4 
        text-base 
        leading-relaxed 
        text-[#0f0e0e] 
        rounded-xl 
        shadow-md 
        border 
        border-white/10 
        bg-[rgba(217,235,235,1)] 
        prose 
        max-w-none
      "
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default TextBlock;
