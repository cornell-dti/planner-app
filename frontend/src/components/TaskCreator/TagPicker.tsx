import React, { ReactElement, KeyboardEvent } from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { NONE_TAG, NONE_TAG_ID } from 'common/util/tag-util';
import { State, Tag } from 'common/types/store-types';
import TagListPicker from '../Util/TagListPicker/TagListPicker';
import styles from './Picker.module.scss';
import SamwiseIcon from '../UI/SamwiseIcon';

type OwnProps = {
  readonly tag: string;
  readonly opened: boolean;
  readonly onTagChange: (tag: string) => void;
  readonly onPickerOpened: () => void;
};
type Props = OwnProps & {
  // subscribed from redux store.
  readonly getTag: (id: string) => Tag;
};

function TagPicker({ tag, opened, onTagChange, onPickerOpened, getTag }: Props): ReactElement {
  // Controllers
  const clickPicker = (): void => {
    onPickerOpened();
  };
  const pressedPicker = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') onPickerOpened();
  };
  const reset = (): void => onTagChange(NONE_TAG_ID);
  // Nodes
  const displayedNode = (isDefault: boolean): ReactElement => {
    const { name, color, classId } = getTag(tag);
    const style = isDefault ? { background: NONE_TAG.color } : { background: color };
    const internal = isDefault ? (
      <>
        <span className={styles.TagDisplay}>
          <SamwiseIcon iconName="tag-light" className={styles.CenterIcon} />
          &nbsp;add class&nbsp;&nbsp;
        </span>
      </>
    ) : (
      <>
        <span className={styles.TagDisplay}>{classId != null ? name.split(':')[0] : name}</span>
        <button type="button" className={styles.ResetButton} onClick={reset}>
          &times;
        </button>
      </>
    );
    return (
      <button
        type="button"
        onClick={clickPicker}
        onKeyPress={pressedPicker}
        className={clsx(styles.TagButton, styles.Label)}
        style={style}
      >
        {internal}
      </button>
    );
  };
  return (
    <div className={styles.Main}>
      {displayedNode(tag === NONE_TAG_ID)}
      {opened && (
        <div className={styles.NewTaskClassPick}>
          <TagListPicker onTagChange={onTagChange} />
        </div>
      )}
    </div>
  );
}

const Connected = connect(({ tags }: State) => ({
  getTag: (id: string) => tags.get(id) ?? NONE_TAG,
}))(TagPicker);
export default Connected;
