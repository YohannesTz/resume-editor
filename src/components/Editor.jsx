
import React from "react";
import { importJSON } from '../utils/fileUtils';

const Editor = ({ data, dispatch, zoom, margins, lineHeight, letterSpacing, baseFontSize, fontFamily, titleColor, bodyColor }) => {
    const dragItem = React.useRef(null);

    function handleDragStart(e, index) {
        dragItem.current = index;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target);
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e, index) {
        const dragIndex = dragItem.current;
        const dropIndex = index;
        if (dragIndex === dropIndex) return;
        dispatch({ type: 'REORDER_EXPERIENCE', payload: { dragIndex, dropIndex } });
        dragItem.current = null;
    }
    const [activeTab, setActiveTab] = React.useState('Data');


    function updateField(path, value) {
        dispatch({ type: 'UPDATE_FIELD', payload: { path, value } });
    }

    function setSkillsFromString(s) {
        dispatch({ type: 'SET_SKILLS_FROM_STRING', payload: s });
    }

    function updateExperience(index, updater) {
        dispatch({ type: 'UPDATE_EXPERIENCE', payload: { index, updater } });
    }

    function addExperience() {
        dispatch({ type: 'ADD_EXPERIENCE' });
    }

    function deleteExperience(index) {
        dispatch({ type: 'DELETE_EXPERIENCE', payload: { index } });
    }

    function moveExperience(index, direction) {
        dispatch({ type: 'MOVE_EXPERIENCE', payload: { index, direction } });
    }

    return (
        <form>
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
                <button type="button" onClick={() => setActiveTab('Data')} style={{ flex: 1, padding: '10px', border: 'none', background: activeTab === 'Data' ? '#e5e7eb' : 'none', cursor: 'pointer' }}>Data</button>
                <button type="button" onClick={() => setActiveTab('Style')} style={{ flex: 1, padding: '10px', border: 'none', background: activeTab === 'Style' ? '#e5e7eb' : 'none', cursor: 'pointer' }}>Style</button>
            </div>

            {activeTab === 'Data' && (
                <div>
                    <label className="btn ghost" style={{
                        cursor: "pointer",
                        display: 'block',
                        width: '100%',
                        padding: '20px 0',
                        textAlign: 'center',
                        marginBottom: '12px'
                    }}>
                        Import JSON
                        <input
                            type="file"
                            accept=".json,application/json"
                            style={{ display: "none" }}
                            onChange={e => {
                                if (e.target.files && e.target.files[0]) importJSON(e.target.files[0], dispatch);
                            }}
                        />
                    </label>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                        <button
                            className="btn"
                            style={{ flex: 1, display: 'block', padding: '20px 0' }}
                            onClick={async () => {
                                const resp = await fetch('demoData.json');
                                const json = await resp.json();
                                const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'demoData.json';
                                a.click();
                                setTimeout(() => URL.revokeObjectURL(url), 1000);
                            }}
                        >
                            Download Sample JSON
                        </button>

                        <button
                            className="btn"
                            style={{ flex: 1, display: 'block', padding: '20px 0' }}
                            onClick={async () => {
                                const resp = await fetch('defaultData.json');
                                const json = await resp.json();
                                dispatch({ type: 'SET_DATA', payload: json });
                            }}
                        >
                            Load Sample JSON
                        </button>
                    </div>


                    <label>Name</label>
                    <input value={data.name || ""} onChange={e => updateField("name", e.target.value)} />

                    <label>Location</label>
                    <input value={data.location || ""} onChange={e => updateField("location", e.target.value)} />

                    <label>Email</label>
                    <input value={data.email || ""} onChange={e => updateField("email", e.target.value)} />

                    <label>Phone</label>
                    <input value={data.phone || ""} onChange={e => updateField("phone", e.target.value)} />

                    <label>Skills (comma separated)</label>
                    <input value={(data.skills || []).join(", ")} onChange={e => setSkillsFromString(e.target.value)} />

                    <div className="section" style={{ marginTop: 12 }}>
                        <h3 style={{ fontSize: 13, margin: "16px 0 8px", color: "#6b7280", letterSpacing: "0.03em" }}>Experience</h3>                        {(data.experience || []).map((job, idx) => (
                            <div
                                key={idx}
                                style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: 10, marginBottom: 10, cursor: 'grab' }}
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, idx)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, idx)}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                    <strong style={{ fontSize: 13 }}>Position #{idx + 1}</strong>
                                    <div>
                                        <button className="btn ghost" onClick={() => moveExperience(idx, -1)} style={{ marginRight: 6 }}>↑</button>
                                        <button className="btn ghost" onClick={() => moveExperience(idx, 1)} style={{ marginRight: 6 }}>↓</button>
                                        <button className="btn ghost" onClick={() => deleteExperience(idx)}>Delete</button>
                                    </div>
                                </div>
                                <label>Title</label>
                                <input value={job.title || ""} onChange={e => updateExperience(idx, j => ({ ...j, title: e.target.value }))} />
                                <label>Company</label>
                                <input value={job.company || ""} onChange={e => updateExperience(idx, j => ({ ...j, company: e.target.value }))} />
                                <label>Date</label>
                                <input value={job.date || ""} onChange={e => updateExperience(idx, j => ({ ...j, date: e.target.value }))} />
                                <label>Location</label>
                                <input value={job.location || ""} onChange={e => updateExperience(idx, j => ({ ...j, location: e.target.value }))} />
                                <label>Bullet points — one per line</label>
                                <textarea rows={5} value={(job.points || []).join("\n")} onChange={e => {
                                    const arr = e.target.value.split("\n").map(s => s.trim()).filter(Boolean);
                                    updateExperience(idx, j => ({ ...j, points: arr }))
                                }} />
                            </div>
                        ))}
                        <button className="btn" onClick={addExperience}>Add Experience</button>
                    </div>                </div>
            )}

            {activeTab === 'Style' && (
                <div>
                    <div className="section" style={{ marginBottom: 20 }}>
                        <h3 style={{ fontSize: 14, margin: "8px 0 8px", color: "#6b7280" }}>Document Settings</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <button type="button" className="btn ghost" onClick={() => dispatch({ type: 'SET_ZOOM', payload: Math.max(zoom - 0.1, 0.5) })}>-</button>
                            <span style={{ minWidth: 40, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
                            <button type="button" className="btn ghost" onClick={() => dispatch({ type: 'SET_ZOOM', payload: Math.min(zoom + 0.1, 2) })}>+</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 8 }}>
                            <div>
                                <label style={{ fontSize: 12 }}>Margin Top</label>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <input type="range" style={{ width: '100%' }} value={margins.top} min={0} max={100} onChange={e => dispatch({ type: 'SET_MARGINS', payload: { ...margins, top: Number(e.target.value) } })} />
                                    <input type="number" style={{ width: 60 }} value={margins.top} min={0} max={100} onChange={e => dispatch({ type: 'SET_MARGINS', payload: { ...margins, top: Number(e.target.value) } })} />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: 12 }}>Margin Right</label>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <input type="range" style={{ width: '100%' }} value={margins.right} min={0} max={100} onChange={e => dispatch({ type: 'SET_MARGINS', payload: { ...margins, right: Number(e.target.value) } })} />
                                    <input type="number" style={{ width: 60 }} value={margins.right} min={0} max={100} onChange={e => dispatch({ type: 'SET_MARGINS', payload: { ...margins, right: Number(e.target.value) } })} />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: 12 }}>Margin Bottom</label>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <input type="range" style={{ width: '100%' }} value={margins.bottom} min={0} max={100} onChange={e => dispatch({ type: 'SET_MARGINS', payload: { ...margins, bottom: Number(e.target.value) } })} />
                                    <input type="number" style={{ width: 60 }} value={margins.bottom} min={0} max={100} onChange={e => dispatch({ type: 'SET_MARGINS', payload: { ...margins, bottom: Number(e.target.value) } })} />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: 12 }}>Margin Left</label>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <input type="range" style={{ width: '100%' }} value={margins.left} min={0} max={100} onChange={e => dispatch({ type: 'SET_MARGINS', payload: { ...margins, left: Number(e.target.value) } })} />
                                    <input type="number" style={{ width: 60 }} value={margins.left} min={0} max={100} onChange={e => dispatch({ type: 'SET_MARGINS', payload: { ...margins, left: Number(e.target.value) } })} />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                            <div><label style={{ fontSize: 12 }}>Font Family</label><input style={{ width: 180 }} value={fontFamily} onChange={e => dispatch({ type: 'SET_FONT_FAMILY', payload: e.target.value })} placeholder="e.g. Inter, Arial" /></div>
                            <div><label style={{ fontSize: 12 }}>Font Size (px)</label><input type="number" style={{ width: 60 }} value={baseFontSize} min={6} max={40} onChange={e => dispatch({ type: 'SET_BASE_FONT_SIZE', payload: Number(e.target.value) })} /></div>
                            <div><label style={{ fontSize: 12 }}>Line Height</label><input type="number" step="0.05" style={{ width: 80 }} value={lineHeight} min={1} max={2} onChange={e => dispatch({ type: 'SET_LINE_HEIGHT', payload: Number(e.target.value) })} /></div>
                            <div><label style={{ fontSize: 12 }}>Letter Spacing (px)</label><input type="number" step="0.1" style={{ width: 60 }} value={letterSpacing} min={-1} max={10} onChange={e => dispatch({ type: 'SET_LETTER_SPACING', payload: Number(e.target.value) })} /></div>
                        </div>

                        {/* New font selection section */}
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                            <div>
                                <label style={{ fontSize: 12 }}>System Font</label>
                                <select value={fontFamily} onChange={e => dispatch({ type: 'SET_FONT_FAMILY', payload: e.target.value })}>
                                    <option value="Inter, system-ui, -apple-system, 'Segoe UI', Roboto">Inter (Default)</option>
                                    <option value="Arial, sans-serif">Arial</option>
                                    <option value="Verdana, sans-serif">Verdana</option>
                                    <option value="Georgia, serif">Georgia</option>
                                    <option value="Times New Roman, serif">Times New Roman</option>
                                    <option value="Courier New, monospace">Courier New</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: 12 }}>Upload Custom Font</label>
                                <input type="file" accept=".ttf,.otf,.woff,.woff2" onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const fontName = file.name.split('.')[0];
                                        const font = new FontFace(fontName, `url(${URL.createObjectURL(file)})`);
                                        await font.load();
                                        document.fonts.add(font);
                                        dispatch({ type: 'SET_FONT_FAMILY', payload: fontName });
                                    }
                                }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                            <div>
                                <label style={{ fontSize: 12 }}>Title Color</label>
                                <input type="color" value={titleColor} onChange={e => dispatch({ type: 'SET_TITLE_COLOR', payload: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ fontSize: 12 }}>Body Color</label>
                                <input type="color" value={bodyColor} onChange={e => dispatch({ type: 'SET_BODY_COLOR', payload: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}

export default React.memo(Editor);
