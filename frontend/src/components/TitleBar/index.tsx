import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { useTime } from 'hooks/time-hook';
import { date2FullDateString } from 'common/lib/util/datetime-util';
import Banner from './Banner';
import styles from './index.module.css';
import SettingsButton from './Settings/SettingsButton';
import { State, Theme } from 'common/lib/types/store-types';

/**
 * The title bar.
 *
 * @type {function(): Node}
 */
export function TitleBar (props : { theme: Theme }): ReactElement {
  const time = useTime();
  const date = new Date(time);
  const dateString = date2FullDateString(date);
  const timeString = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  });
  const darkModeStyles = props.theme === 'dark' ? {
    background: 'black',
    color: 'white'
  } : null;
  return (
    <header className={styles.Main} style={darkModeStyles}>
      <Banner />
      <span title="time" className={styles.Time}>{timeString}</span>
      <span title="date" className={styles.Date}>{dateString}</span>
      <span className={styles.Links}><SettingsButton /></span>
    </header>
  );
};


const Connected = connect(
  ({ settings: { theme } }: State): {theme: Theme} => {
    return { theme };
  },
)(TitleBar);
export default Connected;
