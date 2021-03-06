import React, { ReactElement } from 'react';
import { SubTask, Task, TaskMetadata } from 'common/types/store-types';
import { subTasksEqual } from 'common/util/task-util';
import styles from './FutureViewTask.module.scss';
import CheckBox from '../../UI/CheckBox';
import { editTaskWithDiff, EditType, forkTaskWithDiff } from '../../../firebase/actions';
import SamwiseIcon from '../../UI/SamwiseIcon';

type Props = {
  readonly subTask: SubTask | null;
  readonly taskData: Task<TaskMetadata>;
  readonly mainTaskCompleted: boolean;
  readonly replaceDateForFork: Date | null;
};

/**
 * The component used to render one subtask in future view day.
 */
function FutureViewSubTask({
  subTask,
  taskData,
  mainTaskCompleted,
  replaceDateForFork,
}: Props): ReactElement | null {
  const getTaskEditType = (): EditType => {
    switch (taskData.metadata.type) {
      case 'ONE_TIME':
        return 'EDITING_ONE_TIME_TASK';
      case 'MASTER_TEMPLATE':
        return 'EDITING_MASTER_TEMPLATE';
      case 'GROUP':
        return 'EDITING_ONE_TIME_TASK';
      default:
        throw new Error('Invalid task type!');
    }
  };

  const applyUpdate = (updatedChildren: SubTask[]): void => {
    const mainTaskEdits = {
      children: updatedChildren,
    };
    if (getTaskEditType() === 'EDITING_ONE_TIME_TASK') {
      editTaskWithDiff(taskData.id, getTaskEditType(), { mainTaskEdits });
    } else if (replaceDateForFork != null) {
      forkTaskWithDiff(taskData.id, replaceDateForFork, { mainTaskEdits });
    }
  };

  if (subTask == null) {
    return null;
  }
  const onCompleteChange = (): void => {
    const updatedChildren = taskData.children.map(({ complete, ...rest }) =>
      subTasksEqual({ complete, ...rest }, subTask)
        ? { complete: !complete, ...rest }
        : { complete, ...rest }
    );
    applyUpdate(updatedChildren);
  };

  const onFocusChange = (): void => {
    const updatedChildren = taskData.children.map(({ inFocus, ...rest }) =>
      subTasksEqual({ inFocus, ...rest }, subTask)
        ? { inFocus: !inFocus, ...rest }
        : { inFocus, ...rest }
    );
    applyUpdate(updatedChildren);
  };

  const onRemove = (): void => {
    const updatedChildren = taskData.children.filter(
      (currSubTask) => !subTasksEqual(currSubTask, subTask)
    );
    applyUpdate(updatedChildren);
  };

  return (
    <div className={styles.SubTask}>
      <CheckBox
        className={styles.SubTaskCheckBox}
        checked={mainTaskCompleted || subTask.complete}
        disabled={mainTaskCompleted}
        inverted
        onChange={onCompleteChange}
      />
      <span
        className={styles.TaskText}
        style={mainTaskCompleted || subTask.complete ? { textDecoration: 'line-through' } : {}}
      >
        {subTask.name}
      </span>
      <SamwiseIcon
        iconName={subTask.inFocus ? 'pin-dark-filled' : 'pin-dark-outline'}
        onClick={onFocusChange}
        className={styles.TaskIcon}
      />
      <SamwiseIcon iconName="x-dark" className={styles.TaskIcon} onClick={onRemove} />
    </div>
  );
}

const Memoized = React.memo(FutureViewSubTask);
export default Memoized;
