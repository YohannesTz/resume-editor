import React, { useEffect, useRef } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { useResumeStore } from './hooks/useResumeStore';
import { useResizablePanel } from './hooks/useResizablePanel';
import { exportJSON, importJSON, downloadPDF, loadDefaultData } from './utils/fileUtils';

function App() {
  const { state, dispatch } = useResumeStore();
  const { data, isLoadingData, zoom, margins, lineHeight, letterSpacing, baseFontSize, fontFamily } = state;
  const previewRef = useRef();
  const { width: leftPanelWidth, isDragging, handleMouseDown } = useResizablePanel(650, 250, window.innerWidth - 400);

  useEffect(() => {
    loadDefaultData(dispatch);
  }, [dispatch]);

  return (
    <div className="app" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', height: '100vh', overflow: 'hidden', width: '100vw' }}>
      <div
        className="controls"
        style={{ width: `${leftPanelWidth}px`, minWidth: 250, maxWidth: 600, height: '100vh', overflow: 'auto', flexShrink: 0 }}
      >
        <h2 style={{ margin: 0 }}>Resume Editor</h2>
        <p style={{ color: "#6b7280", fontSize: 13 }}>Edit fields below — preview updates live.</p>

        {isLoadingData && (
          <div style={{ fontSize: 14, color: '#6b7280' }}>Loading defaultData.json…</div>
        )}
        {!isLoadingData && !data && (
          <div>
            <p style={{ fontSize: 14, color: '#6b7280' }}>No data loaded. Load a JSON file to begin.</p>
            <label className="btn" style={{ cursor: "pointer" }}>
              Load JSON
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
            <label className="btn ghost" style={{ cursor: "pointer" }}>
              Import JSON
              <input type="file" accept=".json,application/json" style={{ display: "none" }} onChange={e => {
                if (e.target.files && e.target.files[0]) importJSON(e.target.files[0], (newData) => dispatch({ type: 'SET_DATA', payload: newData }));
              }} />
            </label>
          </div>
        )}

        {data && (
          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={() => downloadPDF(previewRef)}>Download PDF</button>
          </div>
        )}

        <p className="footer-note">You can host this on Netlify. Follow instructions in README.</p>
      </div>
      <div
        className="resize-handle"
        onMouseDown={handleMouseDown}
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
      <div
        className="preview-wrapper"
        style={{
          flex: 1,
          overflow: 'auto',
          background: '#ececec',
          minWidth: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          position: 'relative',
        }}
      >
        <div className="preview" ref={previewRef} style={{ width: 'auto' }}>
          {data ? (
            <Preview
              data={data}
              zoom={zoom}
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
      </div>

    </div>
  );
}

export default App;