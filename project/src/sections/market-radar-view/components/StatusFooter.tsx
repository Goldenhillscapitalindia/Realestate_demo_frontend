import React from "react";

type StatusFooterProps = {
  loading: boolean;
  error: string | null;
};

const StatusFooter: React.FC<StatusFooterProps> = ({ loading, error }) => (
  <div className="text-xs text-black">
    {loading ? "Loading latest pulse..." : "Updated moments ago"} {error ? `- ${error}` : null}
  </div>
);

export default StatusFooter;
