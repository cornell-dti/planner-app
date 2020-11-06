import { useReducer } from 'react';
import { shallowEqual, shallowArrayEqual } from 'common/util/general-util';
import { MainTask, PartialMainTask, SubTask } from 'common/types/store-types';
import { getNewSubTaskId } from '../../../../firebase/id-provider';

type Action =
  | { readonly type: 'EDIT_MAIN_TASK'; readonly change: PartialMainTask }
  | { readonly type: 'RESET'; readonly mainTask: MainTask; readonly subTasks: readonly SubTask[] };

export type Diff = {
  readonly mainTaskEdits: PartialMainTask;
};

type FullTask = { readonly mainTask: MainTask; readonly subTasks: readonly SubTask[] };

type State = FullTask & { readonly prevFullTask: FullTask; readonly diff: Diff };

type TaskDiffActions = FullTask & {
  readonly diff: Diff;
  readonly dispatchEditMainTask: (change: PartialMainTask) => void;
  readonly reset: () => void;
};

const emptyDiff: Diff = {
  mainTaskEdits: {},
};

/**
 * @param diff diff to check.
 * @returns whether the given diff is empty.
 */
export function diffIsEmpty(diff: Diff): boolean {
  // since things are immutable, we can use referential equality!
  return diff === emptyDiff;
}

/**
 * Lazy initializer for the initial state of task editor.
 *
 * @param mainTask the main task for initial state.
 * @param subTasks an array of subtask for initial state.
 * @returns the initial state.
 */
function initializer([mainTask, subTasks]: [MainTask, readonly SubTask[]]): State {
  return { mainTask, subTasks, prevFullTask: { mainTask, subTasks }, diff: emptyDiff };
}

/**
 * The reducer that applies the editing changes specified in action.
 *
 * @param state the previous state.
 * @param action the edit action.
 * @returns the new state after editing.
 */
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'EDIT_MAIN_TASK': {
      const { mainTask, diff, ...restState } = state;
      const { change } = action;
      const newDiff = { ...diff, mainTaskEdits: { ...diff.mainTaskEdits, ...change } };
      return { ...restState, mainTask: { ...mainTask, ...change }, diff: newDiff };
    }
    case 'RESET': {
      const { mainTask, subTasks } = action;
      return initializer([mainTask, subTasks]);
    }
    default:
      throw new Error('Bad Type!');
  }
}

export default function useTaskDiffReducer(
  initMainTask: MainTask,
  initSubTasks: readonly SubTask[],
  active: boolean,
  onChange: () => void
): TaskDiffActions {
  const [state, dispatch] = useReducer(reducer, [initMainTask, initSubTasks], initializer);
  const { mainTask, subTasks, prevFullTask, diff } = state;
  if (
    !active &&
    (!shallowEqual(prevFullTask.mainTask, initMainTask) ||
      !shallowArrayEqual(prevFullTask.subTasks, initSubTasks))
  ) {
    dispatch({ type: 'RESET', mainTask: initMainTask, subTasks: initSubTasks });
  }
  return {
    mainTask,
    subTasks,
    diff,
    dispatchEditMainTask: (change: PartialMainTask): void => {
      dispatch({ type: 'EDIT_MAIN_TASK', change });
      onChange();
    },
    reset: (): void => {
      dispatch({ type: 'RESET', mainTask: initMainTask, subTasks: initSubTasks });
      onChange();
    },
  };
}
