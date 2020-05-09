import { Map } from 'immutable';
import {
  Course,
  Settings,
  SubTask,
  Task,
  Tag,
  BannerMessageStatus,
  Group,
  PendingGroupInvite,
} from './store-types';

export type PatchTags = {
  readonly type: 'PATCH_TAGS';
  readonly created: Tag[];
  readonly edited: Tag[];
  readonly deleted: string[];
};

export type TaskWithChildrenId = Omit<Task, 'children'> & {
  readonly children: readonly string[];
};

export type PatchTasks = {
  readonly type: 'PATCH_TASKS';
  readonly created: TaskWithChildrenId[];
  readonly edited: TaskWithChildrenId[];
  readonly deleted: string[];
};

export type PatchSubTasks = {
  readonly type: 'PATCH_SUBTASKS';
  readonly created: SubTask[];
  readonly edited: SubTask[];
  readonly deleted: string[];
};

export type PatchSettings = {
  readonly type: 'PATCH_SETTINGS';
  readonly settings: Settings;
};

export type PatchBannerMessageStatus = {
  readonly type: 'PATCH_BANNER_MESSAGES';
  readonly change: BannerMessageStatus;
};

export type PatchCourses = {
  readonly type: 'PATCH_COURSES';
  readonly courses: Map<string, Course[]>;
};

export type PatchGroups = {
  readonly type: 'PATCH_GROUPS';
  readonly groups: Map<string, Group>;
}
export type PatchPendingInvite = {
  readonly type: 'PATCH_PENDING_GROUP_INVITE';
  readonly created: PendingGroupInvite[];
  readonly deleted: string[];
};

export type Action =
  | PatchTags
  | PatchTasks
  | PatchSubTasks
  | PatchSettings
  | PatchBannerMessageStatus
  | PatchCourses
  | PatchGroups
  | PatchPendingInvite;
