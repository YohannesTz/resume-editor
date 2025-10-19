import React from 'react';
import { usePagination } from '../hooks/usePagination';

const Preview = React.forwardRef(({
	data,
	margins = { top: 28, right: 20, bottom: 28, left: 20 },
	lineHeight = 1.3,
	letterSpacing = 0,
	baseFontSize = 12,
	fontFamily = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto',
}, ref) => {
	const { pages, MeasureContainer } = usePagination(data, margins);

	const pageStyle = {
		width: '210mm',
		minHeight: '297mm',
		boxSizing: 'border-box',
		paddingTop: margins.top,
		paddingRight: margins.right,
		paddingBottom: margins.bottom,
		paddingLeft: margins.left,
		background: 'white',
		marginBottom: 32,
		marginTop: 32,
		fontFamily,
		fontSize: baseFontSize,
		lineHeight,
		letterSpacing,
		transition: 'all 0.2s',
	};

	return (
		<>
			<MeasureContainer />
			<div ref={ref}> {/* Added this div and ref */}
				{pages.map((page, i) => (
					<React.Fragment key={i}>
						<article className="preview-container" style={pageStyle}>
							{page.map(block => block.render)}
						</article>
						{i < pages.length - 1 && <div style={{ height: 1, background: '#ccc', width: '210mm', margin: '32px auto' }} />}
					</React.Fragment>
				))}
			</div>
		</>
	);
}); // Wrapped with React.forwardRef

export default React.memo(Preview);