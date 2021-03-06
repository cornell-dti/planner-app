import React, { ReactElement, useState } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Group } from 'common/types/store-types';
import SamwiseIcon from '../UI/SamwiseIcon';
import SettingsButton from '../TitleBar/Settings/SettingsButton';
import GroupIcon from './GroupIcon';
import styles from './index.module.scss';
import AddGroupTags from './AddGroupTags';

type Props = {
  readonly groups: readonly Group[];
  /** When selectedGroup is undefined, it means that we selected personal view */
  readonly changeView: (selectedGroup: string | undefined) => void;
};

const SideBar = ({ groups, changeView }: Props): ReactElement => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState('personal');

  const handleIconClick = (groupID?: string): void => {
    setSelected(groupID ?? 'personal');
    changeView(groupID);
  };

  return (
    <div className={styles.SideBar}>
      <div className={styles.ViewSwitchButtonDiv}>
        <button
          type="button"
          onClick={() => handleIconClick()}
          className={styles.PersonalViewButton}
        >
          <SamwiseIcon iconName="personal-view" className={styles.PersonalViewButtonIcon} />
        </button>
      </div>
      <div className={styles.GroupManager}>
        <p className={styles.GroupManagerText}>My Groups</p>
        <div className={styles.GroupIcons}>
          {groups.map((g) => (
            <GroupIcon
              key={g.id}
              classCode={g.classCode}
              handleClick={() => handleIconClick(g.id)}
              selected={selected === g.id}
            />
          ))}
        </div>
        <div className={styles.AddButton}>
          <button
            type="button"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
            className={styles.AddGroup}
          >
            <FontAwesomeIcon className={styles.PlusIcon} icon={faPlus} />
          </button>
          {!showDropdown && <p className={styles.GroupManagerText}>New Group</p>}
          <AddGroupTags show={showDropdown} setShow={setShowDropdown} />
        </div>
        <div className={styles.ExpandToFill} />
        <div className={styles.Links}>
          <SettingsButton buttonClassname={styles.SettingsButton} />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
