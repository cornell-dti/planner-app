import { firestore } from 'firebase/app';
import { RepeatingPattern } from '../store/store-types';

export type FirestoreCommon = {
  readonly owner: string;
  readonly order: number;
};

export type FirestoreTag = FirestoreCommon & {
  readonly name: string;
  readonly color: string;
  readonly classId: string | null;
};

export type FirestoreCommonTask = FirestoreCommon & {
  readonly name: string;
  readonly tag: string;
  readonly date: Date | firestore.Timestamp;
  readonly complete: boolean;
  readonly inFocus: boolean;
  readonly children: readonly string[];
};

export type FirestoreSubTask = FirestoreCommon & {
  readonly name: string;
  readonly complete: boolean;
  readonly inFocus: boolean;
};

export type ForkedTaskMetaData = {
  readonly forkId: string | null; // null means one of the repetition is deleted
  readonly replaceDate: Date | firestore.Timestamp;
};

export type FirestoreMasterTask = FirestoreCommonTask & {
  readonly type: 'MASTER_TEMPLATE';
  // in master task, we only use the time component of the date
  readonly repeats: {
    readonly startDate: Date | firestore.Timestamp;
    readonly endDate: Date | firestore.Timestamp | null;
    readonly pattern: RepeatingPattern;
  };
  // fork id can only points to a one time task
  readonly forks: readonly ForkedTaskMetaData[];
};

export type FirestoreOneTimeTask = FirestoreCommonTask & { readonly type: 'ONE_TIME' }

// all these tasks stay in 'samwise-tasks'
// FirestoreLegacyTask should eventually be converted to FirestoreOneTimeTask.
export type FirestoreTask = FirestoreMasterTask | FirestoreOneTimeTask;
