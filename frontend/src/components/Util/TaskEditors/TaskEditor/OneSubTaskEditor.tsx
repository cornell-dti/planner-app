import React, { KeyboardEvent, ReactElement, SyntheticEvent, useEffect, useRef } from 'react';
import { MainTask, SubTask } from 'common/types/store-types';
import CheckBox from '../../../UI/CheckBox';
import SamwiseIcon from '../../../UI/SamwiseIcon';
import styles from './index.module.scss';

type Props = {
  readonly subTask: SubTask; // the subtask to edit
  readonly allCurrentSubTasks: readonly SubTask[];
  readonly mainTaskComplete: boolean; // whether the main task is completed
  readonly needToBeFocused: boolean; // whether it needs to be focused.
  readonly editTaskCallback: (change: Partial<MainTask>) => void;
  readonly onPressEnter: (id: 'main-task' | number) => void;
  readonly memberName?: string; // only supplied if task is a group task
};

const className = [styles.TaskEditorFlexibleContainer, styles.TaskEditorSubtaskCheckBox].join(' ');
const deleteIconClass = [styles.TaskEditorIcon, styles.TaskEditorIconLeftPad].join(' ');

function OneSubTaskEditor({
  subTask,
  allCurrentSubTasks,
  mainTaskComplete,
  needToBeFocused,
  editTaskCallback,
  onPressEnter,
  memberName,
}: Props): ReactElement {
  const subTasksEqual = (firstSubTask: SubTask, secondSubTask: SubTask): boolean =>
    JSON.stringify(firstSubTask) === JSON.stringify(secondSubTask);

  const editThisSubTask = (update: Partial<SubTask>): void => {
    const updatedSubTasks = allCurrentSubTasks.map((curr) => {
      return subTasksEqual(curr, subTask) ? { ...curr, ...update } : curr;
    });
    editTaskCallback({
      children: updatedSubTasks,
    });
  };

  const removeThisSubTask = (): void => {
    const updatedSubTasks = allCurrentSubTasks.filter((curr) => !subTasksEqual(curr, subTask));
    editTaskCallback({
      children: updatedSubTasks,
    });
  };

  const onCompleteChange = (): void => {
    const complete = !subTask.complete;
    editThisSubTask({ complete });
  };
  const onInFocusChange = (): void => {
    const inFocus = !subTask.inFocus;
    editThisSubTask({ inFocus });
  };
  const onRemove = (): void => removeThisSubTask();

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key !== 'Enter') {
      return;
    }
    onPressEnter(subTask.order);
  };

  const onInputChange = (event: SyntheticEvent<HTMLInputElement>): void => {
    event.stopPropagation();
    const newValue = event.currentTarget.value;
    editThisSubTask({ name: newValue });
  };
  const onBlur = (event: SyntheticEvent<HTMLInputElement>): void => {
    event.stopPropagation();
  };

  const editorRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (needToBeFocused) {
      const currentElement = editorRef.current;
      if (currentElement != null) {
        currentElement.focus();
      }
    }
  });

  return (
    <div className={className}>
      <CheckBox
        className={styles.TaskEditorCheckBox}
        checked={mainTaskComplete || subTask.complete}
        disabled={mainTaskComplete}
        onChange={onCompleteChange}
      />
      <input
        type="text"
        data-lpignore="true"
        className={
          subTask.complete || mainTaskComplete
            ? styles.TaskEditorStrikethrough
            : styles.TaskEditorFlexibleInput
        }
        placeholder="Your Subtask"
        value={subTask.name}
        ref={editorRef}
        onKeyDown={onKeyDown}
        onChange={onInputChange}
        onBlur={onBlur}
        onMouseLeave={onBlur}
        style={{ width: 'calc(100% - 70px)' }}
      />
      {memberName ? null : (
        <SamwiseIcon
          iconName={subTask.inFocus ? 'pin-light-filled' : 'pin-light-outline'}
          className={styles.TaskEditorIcon}
          onClick={onInFocusChange}
        />
      )}
      <SamwiseIcon iconName="x-light" onClick={onRemove} className={deleteIconClass} />
    </div>
  );
}

const Memoized = React.memo(
  OneSubTaskEditor,
  (prev, curr) =>
    prev.subTask === curr.subTask &&
    prev.needToBeFocused === curr.needToBeFocused &&
    prev.mainTaskComplete === curr.mainTaskComplete
);
export default Memoized;
