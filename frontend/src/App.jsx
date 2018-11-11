import React from 'react';
import styles from './App.css';
import TagColorConfigEditor from './components/TagColorConfigEditor/TagColorConfigEditor';
import NewTaskComponent from './components/NewTask/NewTaskComponent';
import TaskView from './components/TaskView/TaskView';
import TitleBar from './components/TitleBar/TitleBar';

export default function App() {
  return (
    <div className={styles.App}>
      <TitleBar />
      <NewTaskComponent />
      <TaskView />
    </div>
  );
}
