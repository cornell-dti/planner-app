import React, { KeyboardEvent, ReactElement, SyntheticEvent, useEffect, useRef } from 'react';
import styles from './index.module.css';

type Props = {
  readonly onChange: (change: string) => void;
  readonly needToBeFocused: boolean;
  readonly afterFocusedCallback: () => void;
  readonly onPressEnter: () => void;
};

export default function NewSubTaskEditor(
  {
    onChange, needToBeFocused, afterFocusedCallback, onPressEnter,
  }: Props,
): ReactElement {
  const onInputChange = (event: SyntheticEvent<HTMLInputElement>): void => {
    event.stopPropagation();
    const newSubTaskValue: string = event.currentTarget.value.trim();
    if (newSubTaskValue.length > 0) {
      onChange(newSubTaskValue);
    }
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      onPressEnter();
    }
  };

  const editorRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (needToBeFocused) {
      const currentElement = editorRef.current;
      if (currentElement != null) {
        currentElement.focus();
        afterFocusedCallback();
      }
    }
  });

  return (
    <div className={styles.TaskEditorFlexibleContainer}>
      <input
        type="text"
        data-lpignore="true"
        ref={editorRef}
        className={styles.TaskEditorFlexibleInput}
        placeholder="Add a Subtask"
        value=""
        onChange={onInputChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}