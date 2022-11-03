import { useReducer, Dispatch } from "react";

export enum USE_UNDO_REDUCER_TYPES {
  undo = "UNDO",
  redo = "REDO",
}
export type UndoRedoAction = {
  type: USE_UNDO_REDUCER_TYPES;
};
export type HistoryType<T> = {
  past: T[];
  present: T;
  future: T[];
};

const isTypedAction = (action: any): action is UndoRedoAction => {
  return (
    "type" in action &&
    (action.type === USE_UNDO_REDUCER_TYPES.redo ||
      action.type === USE_UNDO_REDUCER_TYPES.undo)
  );
};
const useUndoReducer = <A, T>(
  reducer: (prevState: T, action: A) => T,
  initialState: T
) => {
  const undoState: HistoryType<T> = {
    past: [],
    present: initialState,
    future: [],
  };

  const undoReducer = (state: typeof undoState, action: A | UndoRedoAction) => {
    if (isTypedAction(action)) {
      if (action.type === USE_UNDO_REDUCER_TYPES.undo) {
        const [newPresent, ...past] = state.past;
        return {
          past,
          present: newPresent,
          future: [state.present, ...state.future],
        };
      }
      if (action.type === USE_UNDO_REDUCER_TYPES.redo) {
        const [newPresent, ...future] = state.future;
        return {
          past: [state.present, ...state.past],
          present: newPresent,
          future,
        };
      }

      throw "shouldn't be here";
    } else {
      const newPresent = reducer(state.present, action);

      return {
        past: [state.present, ...state.past],
        present: newPresent,
        future: [],
      };
    }
  };

  const [state, dispatch] = useReducer(undoReducer, undoState);
  return [state.present, dispatch, state] as [
    T,
    Dispatch<A | UndoRedoAction>,
    HistoryType<T>
  ];
};

export default useUndoReducer;
