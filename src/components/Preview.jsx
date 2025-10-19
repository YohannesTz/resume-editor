import React from 'react';
import { usePagination } from '../hooks/usePagination';

const Preview = React.forwardRef(({
  data,
  margins = { top: 28, right: 20, bottom: 28, left: 20 },
  lineHeight = 1.3,
  letterSpacing = 0,
  baseFontSize = 12,
  fontFamily = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto',
  titleColor, // Receive titleColor
  bodyColor,  // Receive bodyColor
}, ref) => {
  const { pages, MeasureContainer } = usePagination(data, margins, titleColor, bodyColor);

  const pageStyle = {
    width: '210mm',
    minHeight: '297mm',
    boxSizing: 'border-box',
    paddingTop: margins.top,
    paddingRight: margins.right,
    paddingBottom: margins.bottom,
    paddingLeft: margins.left,
    background: 'white',
    fontFamily,
    fontSize: baseFontSize,
    lineHeight,
    letterSpacing,
    transition: 'all 0.2s',
    color: bodyColor, // Apply bodyColor to the main text
  };

  return (
    <>
      <MeasureContainer />
      <div ref={ref}> {/* Added this div and ref */}
        {pages.map((page, i) => (
          <article
            key={i}
            className="preview-container"
            style={{
              ...pageStyle,
              pageBreakAfter: i < pages.length - 1 ? 'always' : 'auto',
              marginBottom: i < pages.length - 1 ? '32px' : '0', // Add margin between pages in preview
            }}
          >
            {page.map(block => block.render)}
          </article>
        ))}
      </div>
    </>
  );
}); // Wrapped with React.forwardRef

export default React.memo(Preview);