/* eslint-disable no-await-in-loop */
import fetch, { Response } from 'node-fetch';
import OrderManager from 'common/firebase/order-manager';
import { QuerySnapshot, DocumentSnapshot } from 'common/firebase/database';
import icalParse from './ical-parser';
import db from './db';

process.env.TZ = 'America/New_York';

export function parseICal(link: string, user: string): void {
  fetch(link)
    .then((response: Response) => response.text())
    .then(async (data: string) => {
      const eventArray = icalParse(data);
      const today = new Date();
      const om = new OrderManager(db, () => user);
      for (let i = 0; i < eventArray.length; i += 1) {
        const ev = eventArray[i];
        const taskName = ev.name;
        // the unique id i will use is a concat of the user and event uid,
        // because uids are not unique between users.
        const uid = ev.uid + user;
        const endObject = new Date(ev.date);
        if (endObject == null) {
          // eslint-disable-next-line no-continue
          continue;
        }
        const endDate = new Date(endObject.getTime());
        const taskID: string = db.tasksCollection().doc().id;
        const order: number = await om.allocateNewOrder('tasks');
        if (endDate > today) {
          await db
            .tasksCollection()
            .where('icalUID', '==', uid)
            .get()
            .then(async (querySnapshot: QuerySnapshot) => {
              if (querySnapshot.size === 0) {
                await db
                  .tasksCollection()
                  .doc(taskID)
                  .set({
                    children: [],
                    complete: false,
                    date: endDate,
                    inFocus: false,
                    name: taskName,
                    order,
                    owner: [user],
                    tag: 'THE_GLORIOUS_NONE_TAG',
                    type: 'ONE_TIME',
                    icalUID: uid,
                  });
              } else {
                querySnapshot.forEach((doc: DocumentSnapshot) => {
                  db.tasksCollection().doc(doc.id).update({
                    name: taskName,
                    date: endDate,
                  });
                });
              }
            });
        }
      }
    });
}

export default async function getICalLink(): Promise<void> {
  await db
    .settingsCollection()
    .where('canvasCalendar', '>', '')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const link = doc.data()?.canvasCalendar;
        if (link == null) return;
        try {
          parseICal(link, doc.id);
        } catch {
          // eslint-disable-next-line no-console
          console.error(`Failed to use this calendar link: ${link}`);
        }
      });
    });
}
