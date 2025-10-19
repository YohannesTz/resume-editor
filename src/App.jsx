import React, { useEffect, useRef, useState, useCallback } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { useResumeStore } from './hooks/useResumeStore';
import { useResizablePanel } from './hooks/useResizablePanel';
import { useReactToPrint } from 'react-to-print';
import { exportJSON, importJSON, loadDefaultData } from './utils/fileUtils';

function App() {
	const { state, dispatch } = useResumeStore();
	const { data, isLoadingData, zoom, pan, margins, lineHeight, letterSpacing, baseFontSize, fontFamily } = state;
	const previewRef = useRef();
	const handlePrint = useReactToPrint({
		contentRef: previewRef,
	});

	const { width: leftPanelWidth, isDragging, handleMouseDown: handleResizeMouseDown } = useResizablePanel(650, 250, window.innerWidth - 400);

	const [isPanning, setIsPanning] = useState(false);
	const [startPan, setStartPan] = useState({ x: 0, y: 0 });

	const handleWheel = useCallback((e) => {
		if (e.ctrlKey) {
			e.preventDefault();
			const scaleAmount = 0.1;
			const newZoom = e.deltaY > 0 ? Math.max(0.5, zoom - scaleAmount) : Math.min(2, zoom + scaleAmount);
			dispatch({ type: 'SET_ZOOM', payload: newZoom });
		}
	}, [zoom, dispatch]);

	const handlePanMouseDown = useCallback((e) => {
		if (e.ctrlKey) {
			e.preventDefault();
			setIsPanning(true);
			setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
		}
	}, [pan]);

	const handlePanMouseMove = useCallback((e) => {
		if (isPanning) {
			dispatch({ type: 'SET_PAN', payload: { x: e.clientX - startPan.x, y: e.clientY - startPan.y } });
		}
	}, [isPanning, startPan, dispatch]);

	const handlePanMouseUp = useCallback(() => {
		setIsPanning(false);
	}, []);

	useEffect(() => {
		window.addEventListener('wheel', handleWheel, { passive: false });
		window.addEventListener('mousedown', handlePanMouseDown);
		window.addEventListener('mousemove', handlePanMouseMove);
		window.addEventListener('mouseup', handlePanMouseUp);

		return () => {
			window.removeEventListener('wheel', handleWheel);
			window.removeEventListener('mousedown', handlePanMouseDown);
			window.removeEventListener('mousemove', handlePanMouseMove);
			window.removeEventListener('mouseup', handlePanMouseUp);
		};
	}, [handleWheel, handlePanMouseDown, handlePanMouseMove, handlePanMouseUp]);

	useEffect(() => {
		loadDefaultData(dispatch);
	}, [dispatch]);

	return (
		<main className="app" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', height: '100vh', overflow: 'hidden', width: '100vw' }}>			<aside
			className="controls"
			style={{ width: `${leftPanelWidth}px`, minWidth: 250, maxWidth: 600, height: '100vh', overflow: 'auto', flexShrink: 0 }}
		>
			<h2 style={{ margin: 0 }}>Resume Editor</h2>
			<p style={{ color: "#6b7280", fontSize: 13 }}>Edit fields below — preview updates live.</p>

			{isLoadingData && (
				<div style={{ fontSize: 14, color: '#6b7280' }}>Loading defaultData.json…</div>
			)}
			{!isLoadingData && !data && (
				<div style={{ padding: '20px', textAlign: 'center' }}>
					<p style={{ fontSize: 14, color: '#6b7280' }}>No data loaded. Load a JSON file to begin.</p>
					<label className="btn" style={{ cursor: "pointer", display: 'block', width: '100%', padding: '20px 0' }}>
						Import Resume Data
						<input type="file" accept=".json,application/json" style={{ display: "none" }} onChange={e => {
							if (e.target.files && e.target.files[0]) importJSON(e.target.files[0], (newData) => dispatch({ type: 'SET_DATA', payload: newData }));
						}} />
					</label>
				</div>
			)}
			{data && (
				<Editor
					data={data}
					dispatch={dispatch}
					zoom={zoom}
					margins={margins}
					lineHeight={lineHeight}
					letterSpacing={letterSpacing}
					baseFontSize={baseFontSize}
					fontFamily={fontFamily}
				/>
			)}

			{data && (
				<div style={{ marginTop: 12 }}>
					<button className="btn" onClick={() => exportJSON(data)}>Export JSON</button>
				</div>
			)}

			{data && (
				<div style={{ marginTop: 12 }}>
					<button className="btn" onClick={() => handlePrint()}>Print / Download PDF</button>
				</div>
			)}

		</aside>
			<div
				className="resize-handle"
				onMouseDown={handleResizeMouseDown}
				style={{
					cursor: 'col-resize',
					width: '4px',
					minWidth: '4px',
					backgroundColor: isDragging ? '#3b82f6' : '#e5e7eb',
					transition: isDragging ? 'none' : 'background-color 0.2s',
					height: '100vh',
					zIndex: 2
				}}
				title="Drag to resize panels"
				role="separator"
				aria-label="Resize panels"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
					}
				}}
			/>
			<section
				className="preview-wrapper"
				style={{
					flex: 1,
					overflow: 'auto',
					background: '#f3f4f6',
					minWidth: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'flex-start',
					position: 'relative',
				}}
			>
				<div ref={previewRef} style={{ width: 'auto', transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`, transformOrigin: 'top center' }}>
					{data ? (
						<Preview
							ref={previewRef} // Pass the ref here
							data={data}
							margins={margins}
							lineHeight={lineHeight}
							letterSpacing={letterSpacing}
							baseFontSize={baseFontSize}
							fontFamily={fontFamily}
						/>
					) : (
						<div style={{ color: '#6b7280', textAlign: 'center', marginTop: 60 }}>
							No preview — load a JSON to start.
						</div>
					)}
				</div>
			</section>

		</main>
	);
}

export default App;