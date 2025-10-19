export function exportJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importJSON(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      callback(parsed);
    } catch {
      alert('Invalid JSON');
    }
  };
  reader.readAsText(file);
}



export async function loadDefaultData(dispatch) {
    dispatch({ type: 'SET_IS_LOADING', payload: true });
    dispatch({ type: 'SET_LOAD_ERROR', payload: null });
    try {
        const resp = await fetch('/defaultData.json', { cache: 'no-store' });
        if (!resp.ok) {
            dispatch({ type: 'SET_IS_LOADING', payload: false });
            dispatch({ type: 'SET_DATA', payload: null });
            return;
        }
        const json = await resp.json();
        dispatch({ type: 'SET_DATA', payload: json });
    } catch {
        dispatch({ type: 'SET_LOAD_ERROR', payload: 'Failed to load defaultData.json' });
    } finally {
        dispatch({ type: 'SET_IS_LOADING', payload: false });
    }
}