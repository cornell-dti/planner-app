import React, { ReactElement, useState } from 'react';
import { removeTaskWithPotentialPrompt } from 'util/task-util';
import { Task } from 'common/lib/types/store-types';
import TaskEditor from './TaskEditor';
import { CalendarPosition } from './editors-types';

type Props = {
  readonly original: Task;
  readonly filtered: Task;
  readonly calendarPosition: CalendarPosition;
  readonly className?: string; // additional class names applied to the editor.
};

/**
 * The task editor used to edit task inline, activated on focus.
 */
export default function InlineTaskEditor(
  { original, filtered, className, calendarPosition }: Props,
): ReactElement {
  const [disabled, setDisabled] = useState(true);
  const { id } = original;
  const { id: _, metadata, children, ...mainTask } = filtered;
  const icalUID = original.metadata.type === 'ONE_TIME' ? original.metadata.icalUID : '';
  const taskAppearedDate = metadata.date instanceof Date ? metadata.date.toDateString() : null;
  // To un-mount the editor when finished editing.
  const onFocus = (): void => setDisabled(false);
  const onBlur = (): void => setDisabled(true);
  const actions = {
    removeTask: () => removeTaskWithPotentialPrompt(original, null),
    onSaveClicked: onBlur,
  };
  return (
    <TaskEditor
      id={id}
      type={metadata.type}
      icalUID={icalUID}
      taskAppearedDate={taskAppearedDate}
      className={className}
      mainTask={{ ...mainTask, date: metadata.date }}
      subTasks={children}
      actions={actions}
      displayGrabber
      calendarPosition={calendarPosition}
      newSubTaskAutoFocused={!original.inFocus}
      active={disabled}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}

InlineTaskEditor.defaultProps = { className: undefined };
