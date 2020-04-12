import { Set } from 'immutable';
import { Task, SubTask } from '../types/store-types';
import {
  getFilteredCompletedInFocusTask,
  getFilteredNotCompletedInFocusTask,
  computeTaskProgress,
  TasksProgressProps,
} from './task-util';

// unimportant common attributes.
const order = 0;
const name = 'name';
type MainTaskTestCommon = {
  readonly id: string;
  readonly order: number;
  readonly name: string;
  readonly tag: string;
  readonly metadata: {
    readonly type: 'ONE_TIME';
    readonly icalUID?: string;
    readonly date: Date;
  };
};
const testTaskCommon: MainTaskTestCommon = {
  id: 'random-id',
  order,
  name,
  tag: 'TAG',
  metadata: {
    type: 'ONE_TIME',
    date: new Date(),
  },
};

const s1: SubTask = { id: 's1', order, name, complete: true, inFocus: true };
const s2: SubTask = { id: 's2', order, name, complete: true, inFocus: false };
const s3: SubTask = { id: 's3', order, name, complete: false, inFocus: true };
const s4: SubTask = { id: 's4', order, name, complete: false, inFocus: false };
const exampleTasks: Task[] = [
  { ...testTaskCommon, inFocus: true, complete: true, children: [s1, s2, s3, s4] },
  { ...testTaskCommon, inFocus: true, complete: false, children: [s1, s2, s3, s4] },
  { ...testTaskCommon, inFocus: false, complete: true, children: [s1, s2, s3, s4] },
  { ...testTaskCommon, inFocus: false, complete: false, children: [s1, s2, s3, s4] },
  { ...testTaskCommon, inFocus: true, complete: true, children: [] },
  { ...testTaskCommon, inFocus: true, complete: false, children: [] },
  { ...testTaskCommon, inFocus: false, complete: true, children: [] },
  { ...testTaskCommon, inFocus: false, complete: false, children: [] },
];
const exampleSubTasks: SubTask[] = [s1, s2, s3, s4];

type FilterResult = Task | null;
it('getFilteredCompletedInFocusTask works', () => {
  const expectedResults: FilterResult[] = [
    { ...testTaskCommon, inFocus: true, complete: true, children: exampleSubTasks },
    { ...testTaskCommon, inFocus: true, complete: false, children: [s1, s2] },
    { ...testTaskCommon, inFocus: false, complete: true, children: [s1, s3] },
    { ...testTaskCommon, inFocus: false, complete: false, children: [s1] },
    { ...testTaskCommon, inFocus: true, complete: true, children: [] },
    null,
    null,
    null,
  ];
  exampleTasks.forEach((t, i) => {
    expect(getFilteredCompletedInFocusTask(t)).toEqual(expectedResults[i]);
  });
});

it('getFilteredNotCompletedInFocusTask works', () => {
  const expectedResults: FilterResult[] = [
    null,
    { ...testTaskCommon, inFocus: true, complete: false, children: [s3, s4] },
    null,
    { ...testTaskCommon, inFocus: false, complete: false, children: [s3] },
    null,
    { ...testTaskCommon, inFocus: true, complete: false, children: [] },
    null,
    null,
  ];
  exampleTasks.forEach((t, i) => {
    expect(getFilteredNotCompletedInFocusTask(t)).toEqual(expectedResults[i]);
  });
});

it('getFiltered(Completed|NotCompleted)InFocusTask are complementary', () => {
  exampleTasks.forEach((task) => {
    const completedResult = getFilteredCompletedInFocusTask(task);
    const uncompletedResult = getFilteredNotCompletedInFocusTask(task);
    const allSubTasks: SubTask[] = [];
    if (completedResult) {
      allSubTasks.push(...completedResult.children);
    }
    if (uncompletedResult) {
      allSubTasks.push(...uncompletedResult.children);
    }
    // ensure disjoint union property
    const subTaskIdSet = allSubTasks.reduce(
      (acc: Set<string>, s: SubTask) => acc.add(s.id),
      Set.of(),
    );
    if (subTaskIdSet.size !== allSubTasks.length) {
      const { complete, inFocus, children } = task;
      let errorMessage = 'The subtasks in completed and uncompleted are not disjoint union.';
      errorMessage += ` Task: { complete: ${complete}, inFocus: ${inFocus}, chilren: ${children} }.`;
      errorMessage += ` Id Set: ${subTaskIdSet.toJS()}.`;
      errorMessage += ` SubTasks: ${allSubTasks.map((s) => s.id)}`;
      throw new Error(errorMessage);
    }
    // ensure allSubTasks are all in focus.
    allSubTasks.forEach((subTask) => expect(task.inFocus || subTask.inFocus).toBe(true));
  });
});

it('computeTaskProgress works', () => {
  const expectedResults: TasksProgressProps[] = [
    { completedTasksCount: 5, allTasksCount: 5 },
    { completedTasksCount: 2, allTasksCount: 5 },
    { completedTasksCount: 2, allTasksCount: 2 },
    { completedTasksCount: 1, allTasksCount: 2 },
    { completedTasksCount: 1, allTasksCount: 1 },
    { completedTasksCount: 0, allTasksCount: 1 },
    { completedTasksCount: 0, allTasksCount: 0 },
    { completedTasksCount: 0, allTasksCount: 0 },
  ];
  const expectedTotal = expectedResults.reduce(
    (acc, curr) => ({
      completedTasksCount: acc.completedTasksCount + curr.completedTasksCount,
      allTasksCount: acc.allTasksCount + curr.allTasksCount,
    }),
    { completedTasksCount: 0, allTasksCount: 0 },
  );
  exampleTasks.forEach((t, i) => {
    expect(computeTaskProgress([t])).toEqual(expectedResults[i]);
  });
  expect(computeTaskProgress(exampleTasks)).toEqual(expectedTotal);
});
