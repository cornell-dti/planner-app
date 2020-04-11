type Event = {
  readonly uid: string;
  readonly date: Date;
  readonly name: string;
};

export default function icalParse(text: string): readonly Event[] {
  const lines = text.split('\n');
  let eventState = false;
  let uid = '';
  let date = new Date();
  let name = '';
  const events: Event[] = [];
  lines.forEach((line: string) => {
    if (line === 'BEGIN:VEVENT') {
      eventState = true;
      uid = '';
      date = new Date();
      name = '';
    }
    if (line === 'END:VEVENT') {
      eventState = false;
      events.push({
        uid,
        date,
        name,
      });
    }
    if (eventState) {
      const tokens = line.split(/:(.+)/);
      const [head, tail] = tokens;
      switch (head) {
        case 'UID':
          uid = tail;
          break;
        case 'DTEND':
          date = new Date(convertDate(tail));
          break;
        case 'DTEND;VALUE=DATE':
          date = turnToLastMinute(new Date(convertDate(`${tail}Z`)));
          break;
        case 'SUMMARY':
          name = tail;
          break;
        default:
          break;
      }
    }
  });
  return events;
}

function turnToLastMinute(date: Date): Date {
  return new Date(date.getTime() + ((23 * 60 + 59) * 60 * 1000));
}

function convertDate(date: string): string {
  return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 11)}:`
    + `${date.slice(11, 13)}:${date.slice(13, date.length)}`;
}
