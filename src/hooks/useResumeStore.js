
import { useReducer } from 'react';
import { produce } from 'immer';

const initialState = {
  data: null,
  isLoadingData: true,
  loadError: null,
  zoom: 1,
  pan: { x: 0, y: 0 }, // New state for pan
  margins: { top: 40, right: 40, bottom: 40, left: 40 },
  lineHeight: 1.3,
  letterSpacing: 0,
  baseFontSize: 12,
  fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto',
};

function resumeReducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_IS_LOADING':
      return { ...state, isLoadingData: action.payload };
    case 'SET_LOAD_ERROR':
      return { ...state, loadError: action.payload };
    case 'SET_ZOOM':
      return { ...state, zoom: action.payload };
    case 'SET_MARGINS':
      return { ...state, margins: action.payload };
    case 'SET_LINE_HEIGHT':
      return { ...state, lineHeight: action.payload };
    case 'SET_LETTER_SPACING':
      return { ...state, letterSpacing: action.payload };
    case 'SET_BASE_FONT_SIZE':
      return { ...state, baseFontSize: action.payload };
    case 'SET_FONT_FAMILY':
      return { ...state, fontFamily: action.payload };
    case 'UPDATE_FIELD':
      return produce(state, draft => {
        const parts = action.payload.path.split('.');
        let current = draft.data;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = action.payload.value;
      });
    case 'SET_SKILLS_FROM_STRING':
        return produce(state, draft => {
            draft.data.skills = action.payload.split(',').map(s => s.trim()).filter(Boolean);
        });
    case 'UPDATE_EXPERIENCE':
        return produce(state, draft => {
            draft.data.experience[action.payload.index] = action.payload.updater(draft.data.experience[action.payload.index]);
        });
    case 'ADD_EXPERIENCE':
        return produce(state, draft => {
            if (!draft.data.experience) {
                draft.data.experience = [];
            }
            draft.data.experience.push({ title: "", company: "", date: "", location: "", points: [] });
        });
    case 'DELETE_EXPERIENCE':
        return produce(state, draft => {
            draft.data.experience.splice(action.payload.index, 1);
        });
    case 'MOVE_EXPERIENCE':
        return produce(state, draft => {
            const { index, direction } = action.payload;
            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= draft.data.experience.length) return;
            const [item] = draft.data.experience.splice(index, 1);
            draft.data.experience.splice(newIndex, 0, item);
        });
    case 'REORDER_EXPERIENCE':
        return produce(state, draft => {
            const { dragIndex, dropIndex } = action.payload;
            const [item] = draft.data.experience.splice(dragIndex, 1);
            draft.data.experience.splice(dropIndex, 0, item);
        });
    default:
      return state;
  }
}

export function useResumeStore() {
  const [state, dispatch] = useReducer(produce(resumeReducer), initialState);
  return { state, dispatch };
}
