import React, { ReactElement } from 'react';
import styles from './App.module.scss';
import AllComplete from './components/Popup/AllComplete';
import Onboard from './components/TitleBar/Onboarding/Onboard';
import { TaskCreatorContextProvider, TaskCreator } from './components/TaskCreator';
import TaskView from './components/TaskView';
import TitleBar from './components/TitleBar';

/**
 * The top level Personal Samwise view component.
 */
const PersonalView = (): ReactElement => (
  <>
    <Onboard />
    <TitleBar />
    <TaskCreatorContextProvider>
      <TaskCreator view="personal" />
    </TaskCreatorContextProvider>
    <TaskView className={styles.TaskView} />
    <AllComplete />
  </>
);

export default PersonalView;
