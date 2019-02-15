// @flow strict

import React from 'react';
import type { Node } from 'react';
import type {
  PartialMainTask, PartialSubTask, SubTask, Task,
} from '../../../store/store-types';
import type { FloatingPosition } from './task-editors-types';
import { editTask as editTaskAction, removeTask as removeTaskAction } from '../../../store/actions';
import TaskEditor from './TaskEditor';
import type { EditTaskAction, RemoveTaskAction } from '../../../store/action-types';
import styles from './FloatingTaskEditor.css';
import { TaskEditorFlexiblePadding as flexiblePaddingClass } from './TaskEditor.css';
import { replaceSubTask, EMPTY_TASK_DIFF, taskDiffIsEmpty } from '../../../util/task-util';
import windowSizeConnect from '../Responsive/WindowSizeConsumer';
import type { WindowSize } from '../Responsive/window-size-context';
import type { TaskDiff } from '../../../util/task-util';
import { dispatchConnect } from '../../../store/react-redux-util';
import type { PropsWithoutWindowSize } from '../Responsive/WindowSizeConsumer';

type Props = {|
  +position: FloatingPosition;
  +initialTask: Task;
  +trigger: (opened: boolean, opener: () => void) => Node;
  +windowSize: WindowSize;
  +editTask: (task: Task, diff: TaskDiff) => EditTaskAction;
  +removeTask: (taskId: number) => RemoveTaskAction;
|};

type State = {|
  +task: Task;
  +diff: TaskDiff;
  +open: boolean;
|};

/**
 * FloatingTaskEditor is a component used to edit a task on the fly.
 * It is triggered from a click on a specified element.
 */
class FloatingTaskEditor extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { task: props.initialTask, diff: EMPTY_TASK_DIFF, open: false };
  }

  componentDidMount() {
    this.updateFloatingEditorPosition();
  }

  componentWillReceiveProps(nextProps: Props) {
    // This methods ensure that the stuff inside the editor is always the latest from store.
    // Since we implement task in an immutable data structure, a shallow equality comparison is
    // enough.
    const { initialTask } = this.props;
    if (initialTask !== nextProps.initialTask) {
      const nextInitialTask = nextProps.initialTask;
      this.setState({ task: nextInitialTask, diff: EMPTY_TASK_DIFF });
    }
  }

  componentDidUpdate() {
    this.updateFloatingEditorPosition();
  }

  /**
   * Update the position of itself.
   */
  updateFloatingEditorPosition = () => {
    const editorPosDiv = this.editorElement;
    if (editorPosDiv == null) {
      return;
    }
    const taskElement = editorPosDiv.previousElementSibling?.previousElementSibling;
    if (taskElement === null || !(taskElement instanceof HTMLDivElement)) {
      throw new Error('Task element must be a div!');
    }
    editorPosDiv.style.position = 'fixed';
    const taskElementBoundingRect = taskElement.getBoundingClientRect();
    if (!(taskElementBoundingRect instanceof DOMRect)) {
      throw new Error('Bad taskElementBoundingRect!');
    }
    const { windowSize } = this.props;
    const myWidth = editorPosDiv.offsetWidth;
    const myHeight = editorPosDiv.offsetHeight;
    const windowWidth = windowSize.width;
    const windowHeight = windowSize.height;
    if (windowWidth <= 768) {
      editorPosDiv.style.top = `${(windowHeight - myHeight) / 2}px`;
      editorPosDiv.style.left = `${(windowWidth - myWidth) / 2}px`;
      return;
    }
    const { y, left, right } = taskElementBoundingRect;
    const topPos = (y + myHeight) > windowHeight ? windowHeight - myHeight : y;
    editorPosDiv.style.top = `${topPos}px`;
    const { position } = this.props;
    if (position === 'right') {
      editorPosDiv.style.left = `${right}px`;
    } else if (position === 'left') {
      editorPosDiv.style.left = `${left - editorPosDiv.offsetWidth}px`;
    } else {
      throw new Error('Bad floating position!');
    }
  };

  openPopup = () => this.setState({ open: true });

  closePopup = (): void => this.setState({ open: false, diff: EMPTY_TASK_DIFF });

  /**
   * Check whether a task has a good format.
   *
   * @param {Task} task the task to check.
   * @return {boolean} whether the task has a good format.
   */
  taskIsGood = (task: Task): boolean => task.name.trim().length > 0;

  /**
   * Filter the task without all the empty subtasks.
   *
   * @param {Task} task the task to filter.
   * @return {Task} the filtered task.
   */
  filterEmptySubTasks = (task: Task): Task => ({
    ...task, subtasks: task.subtasks.filter(t => t.name.trim().length > 0),
  });

  /**
   * Handle the saveEditedTask event.
   */
  saveEditedTask = (): void => {
    const { editTask } = this.props;
    const { task, diff } = this.state;
    if (!this.taskIsGood(task)) {
      return;
    }
    if (taskDiffIsEmpty(diff)) {
      return;
    }
    editTask(this.filterEmptySubTasks(task), diff);
    this.closePopup();
  };

  /**
   * Edit main task.
   *
   * @param {PartialMainTask} partialMainTask partial main task.
   * @param {boolean} doSave whether to save.
   */
  editMainTask = (partialMainTask: PartialMainTask, doSave: boolean) => {
    this.setState(
      ({ task, diff }: State) => ({
        task: { ...task, ...partialMainTask },
        diff: { ...diff, mainTaskDiff: { ...diff.mainTaskDiff, ...partialMainTask } },
      }),
      doSave ? this.saveEditedTask : undefined,
    );
  };

  /**
   * Edit subtask.
   *
   * @param {number} subtaskId id of the subtask.
   * @param {PartialSubTask} partialSubTask partial subtask.
   * @param {boolean} doSave whether to save.
   */
  editSubTask = (subtaskId: number, partialSubTask: PartialSubTask, doSave: boolean) => {
    this.setState(({ task, diff }: State) => {
      const newTask = {
        ...task,
        subtasks: replaceSubTask(task.subtasks, subtaskId, s => ({ ...s, ...partialSubTask })),
      };
      let foundInPreviousEdits = false;
      const subtasksCreations = replaceSubTask(diff.subtasksCreations, subtaskId, (s) => {
        if (s.id === subtaskId) {
          foundInPreviousEdits = true;
        }
        return { ...s, ...partialSubTask };
      });
      const subtasksEdits = [];
      for (let i = 0; i < diff.subtasksEdits.length; i += 1) {
        const pair = diff.subtasksEdits[i];
        const [id, edit] = pair;
        if (id === subtaskId) {
          foundInPreviousEdits = true;
          subtasksEdits.push([i, { ...edit, ...partialSubTask }]);
        } else {
          subtasksEdits.push([id, edit]);
        }
      }
      if (!foundInPreviousEdits) {
        subtasksEdits.push([subtaskId, partialSubTask]);
      }
      return {
        task: newTask,
        diff: { ...diff, subtasksCreations, subtasksEdits },
      };
    }, doSave ? this.saveEditedTask : undefined);
  };

  /**
   * Add subtask.
   *
   * @param {SubTask} subTask subtask to add.
   */
  addSubTask = (subTask: SubTask) => {
    this.setState((state: State) => ({
      task: {
        ...state.task,
        subtasks: [...state.task.subtasks, subTask],
      },
      diff: {
        ...state.diff,
        subtasksCreations: [...state.diff.subtasksCreations, subTask],
      },
    }));
  };

  /**
   * Handle remove task.
   */
  removeTask = () => {
    const { removeTask } = this.props;
    const { task: { id } } = this.state;
    removeTask(id);
  };

  /**
   * Remove subtask with given id.
   *
   * @param {number} subtaskId id of the subtask to remove.
   */
  removeSubTask = (subtaskId: number) => {
    this.setState((state: State) => ({
      task: {
        ...state.task,
        subtasks: state.task.subtasks.filter(s => s.id !== subtaskId),
      },
      diff: {
        ...state.diff,
        subtasksDeletions: [...state.diff.subtasksDeletions, subtaskId],
      },
    }));
  };

  /**
   * The element of the actual editor.
   * This is only used when the editor is embedded inside the DOM instead of mount to body.
   */
  editorElement: ?HTMLElement;

  /**
   * Render the manual submit button component.
   *
   * @return {Node} the manual submit button component.
   */
  renderSubmitComponent = (): Node => (
    <div className={styles.FloatingTaskEditorSubmitButtonRow}>
      <span className={flexiblePaddingClass} />
      <div
        role="presentation"
        className={styles.FloatingTaskEditorSaveButton}
        onClick={this.saveEditedTask}
      >
        <span className={styles.FloatingTaskEditorSaveButtonText}>Save</span>
      </div>
    </div>
  );

  /**
   * Render the editor node.
   *
   * @return {Node} the rendered node.
   */
  renderEditorNode = (): Node => {
    const { task } = this.state;
    const taskEditorProps = {
      ...task,
      editMainTask: this.editMainTask,
      editSubTask: this.editSubTask,
      addSubTask: this.addSubTask,
      removeTask: this.removeTask,
      removeSubTask: this.removeSubTask,
      className: styles.FloatingTaskEditor,
      onSave: this.saveEditedTask,
      refFunction: (e) => { this.editorElement = e; },
    };
    return (
      <TaskEditor {...taskEditorProps}>{this.renderSubmitComponent()}</TaskEditor>
    );
  };

  render(): Node {
    const { trigger } = this.props;
    const { open } = this.state;
    return (
      <React.Fragment>
        {trigger(open, this.openPopup)}
        {open && (
          <div
            className={styles.BackgroundBlocker}
            role="presentation"
            onClick={this.saveEditedTask}
          />
        )}
        {open && this.renderEditorNode()}
      </React.Fragment>
    );
  }
}

const actionCreators = { editTask: editTaskAction, removeTask: removeTaskAction };
const Connected = dispatchConnect<PropsWithoutWindowSize<Props>, typeof actionCreators>(
  actionCreators,
)(windowSizeConnect<Props>(FloatingTaskEditor));
export default Connected;
