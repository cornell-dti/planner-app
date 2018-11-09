// @flow strict

import type { Node } from 'react';
import * as React from 'react';
import { Icon, Input } from 'semantic-ui-react';
import Calendar from 'react-calendar';
import type { State as StoreState, TagColorConfig } from '../../store/store-types';
import styles from './FloatingTaskEditor.css';
import ClassPicker from '../ClassPicker/ClassPicker';
import CheckBox from '../UI/CheckBox';
import { simpleConnect } from '../../store/react-redux-util';
import type { SimpleMainTask } from './floating-task-editor-types';

type OwnProps = {|
  ...SimpleMainTask;
  +focused: boolean;
  +editTask: (task: SimpleMainTask, color?: string) => void;
  +onFocusChange: (focused: boolean) => void;
|};

type SubscribedProps = {| tagColorPicker: TagColorConfig; |};

type Props = {|
  ...OwnProps;
  ...SubscribedProps;
|};

type State = {|
  doesShowTagEditor: boolean;
  doesShowCalendarEditor: boolean;
|};

const mapStateToProps = ({ tagColorPicker }: StoreState): SubscribedProps => ({ tagColorPicker });

/**
 * InternalMainTaskFloatingEditor is intended for internal use for FloatingTaskEditor only.
 */
class InternalMainTaskFloatingEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { doesShowTagEditor: false, doesShowCalendarEditor: false };
  }

  /*
   * --------------------------------------------------------------------------------
   * Part 1: Focus Methods
   * --------------------------------------------------------------------------------
   */

  /**
   * Handle a potential cancel focus request when the user press some key, which
   * may be ENTER, in which case we want to shift focus to the next input element.
   *
   * @param {KeyboardEvent} event the keyboard event to check.
   */
  cancelFocus(event: KeyboardEvent) {
    const inputTarget = event.target;
    if (inputTarget instanceof HTMLInputElement) {
      const { onFocusChange } = this.props;
      if (event.key !== 'Enter') {
        onFocusChange(true);
      } else {
        inputTarget.blur();
        onFocusChange(false);
      }
    }
  }

  /*
   * --------------------------------------------------------------------------------
   * Part 2: Toggle Methods
   * --------------------------------------------------------------------------------
   */

  /**
   * Toggle the editor for the tag of the task.
   */
  toggleTagEditor() {
    this.setState((state: State) => ({
      ...state, doesShowTagEditor: !state.doesShowTagEditor, doesShowCalendarEditor: false,
    }));
  }

  /**
   * Toggle the editor of the deadline of the task.
   */
  toggleDateEditor() {
    this.setState((state: State) => ({
      ...state, doesShowTagEditor: false, doesShowCalendarEditor: !state.doesShowCalendarEditor,
    }));
  }

  /*
   * --------------------------------------------------------------------------------
   * Part 3: Editor Methods
   * --------------------------------------------------------------------------------
   */

  editTaskName(event: SyntheticEvent<HTMLInputElement>) {
    event.preventDefault();
    const name = event.currentTarget.value;
    const {
      focused, editTask, onFocusChange, tagColorPicker, ...task
    } = this.props;
    editTask({ ...task, name });
  }

  /**
   * Toggle the completion status of the task.
   */
  editComplete() {
    const {
      focused, editTask, onFocusChange, tagColorPicker, ...task
    } = this.props;
    editTask({ ...task, complete: !task.complete });
  }

  /**
   * Change the in-focus status of the task.
   */
  editInFocus() {
    const {
      focused, editTask, onFocusChange, tagColorPicker, ...task
    } = this.props;
    editTask({ ...task, complete: !task.inFocus });
  }

  /**
   * Edit the tag of the task.
   *
   * @param {string} tag the new tag.
   */
  editTaskTag(tag: string) {
    const {
      focused, editTask, onFocusChange, tagColorPicker, ...task
    } = this.props;
    editTask({ ...task, tag }, tagColorPicker[tag]);
    this.setState((state: State) => ({ ...state, doesShowTagEditor: false }));
  }

  /**
   * Edit the new date of the task.
   *
   * @param {string} dateString the new date in string.
   */
  editTaskDate(dateString: string) {
    const {
      focused, editTask, onFocusChange, tagColorPicker, ...task
    } = this.props;
    editTask({ ...task, date: new Date(dateString) });
    this.setState((state: State) => ({ ...state, doesShowCalendarEditor: false }));
  }

  /*
   * --------------------------------------------------------------------------------
   * Part 4: Render Methods
   * --------------------------------------------------------------------------------
   */

  /**
   * Return the rendered header element.
   */
  renderHeader(): Node {
    const { tag, date, tagColorPicker } = this.props;
    const {
      doesShowTagEditor, doesShowCalendarEditor,
    } = this.state;
    const headerClassNames = `${styles.FloatingTaskEditorFlexibleContainer} ${styles.FloatingTaskEditorHeader}`;
    const tagPickerElementOpt = doesShowTagEditor && (
      <div className={styles.FloatingTaskEditorTagEditor}>
        <ClassPicker onTagChange={t => this.editTaskTag(t)} />
      </div>
    );
    const calendarElementOpt = doesShowCalendarEditor && (
      <Calendar
        value={date}
        className={styles.FloatingTaskEditorCalendar}
        minDate={new Date()}
        onChange={e => this.editTaskDate(e)}
      />
    );
    return (
      <div className={headerClassNames}>
        <span className={styles.FloatingTaskEditorTag}>
          <label
            htmlFor="floating-task-tag-editor-checkbox"
            className={styles.FloatingTaskEditorTagLabel}
            style={{ backgroundColor: tagColorPicker[tag] }}
          >
            <input id="floating-task-tag-editor-checkbox" type="checkbox" />
            {tag}
          </label>
        </span>
        <span className={styles.FloatingTaskEditorFlexiblePadding} />
        <Icon
          name="tag"
          className={styles.FloatingTaskEditorIconButton}
          onClick={() => this.toggleTagEditor()}
        />
        <Icon
          name="calendar"
          className={styles.FloatingTaskEditorIconButton}
          onClick={() => this.toggleDateEditor()}
        />
        {tagPickerElementOpt}
        {calendarElementOpt}
      </div>
    );
  }

  /**
   * Return the rendered main task text editor element.
   */
  renderMainTaskEdit(): Node {
    const { name, complete, focused } = this.props;
    return (
      <div className={styles.FloatingTaskEditorFlexibleContainer}>
        <CheckBox
          className={styles.FloatingTaskEditorCheckBox}
          checked={complete}
          onChange={() => this.editComplete()}
        />
        <Input
          className={styles.FloatingTaskEditorFlexibleInput}
          placeholder="Main Task"
          value={name}
          autoFocus={focused}
          onKeyDown={event => this.cancelFocus(event)}
          onChange={event => this.editTaskName(event)}
        />
      </div>
    );
  }

  render(): Node {
    return (
      <div>
        {this.renderHeader()}
        {this.renderMainTaskEdit()}
      </div>
    );
  }
}

const ConnectedInternalMainTaskFloatingEditor = simpleConnect<Props, OwnProps, SubscribedProps>(
  mapStateToProps,
)(InternalMainTaskFloatingEditor);
export default ConnectedInternalMainTaskFloatingEditor;
