import { DEFAULT_HOURS } from '../../../constants';

import { differenceInMinutes, formatDuration, intervalToDuration } from 'date-fns';
import { de } from 'date-fns/locale';

export function toDailyEntry(args: {
  date: string;
  type: DailyEntryType;
  tenant: string;
  username: string;
  sum: number;
  work_entries?: number[];
}): DailyEntry {
  const { date, type, tenant, username, sum, work_entries } = args;

  return {
    date,
    type,
    tenant,
    username,
    overload: sum - DEFAULT_HOURS,
    work_entries,
    sum,
  };
}

export function calculateWorkingMinutes(workEntryStub: WorkEntryStub) {
  const { end, start, breakEnd, breakStart } = workEntryStub;
  const allMin = differenceInMinutes(end, start);
  const breakExist = Boolean(breakStart) && Boolean(breakEnd);
  let breakMin = 0;
  if (breakExist) {
    breakMin = differenceInMinutes(breakEnd, breakStart);
  }
  return allMin - breakMin;
}

export function toWorkEntry(args: {
  workEntryStub: WorkEntryStub;
  date: string;
  tenant: string;
  username: string;
}): WorkEntry {
  const { date, tenant, username, workEntryStub } = args;

  const { job, jobId, constructionId, start, end, breakEnd, breakStart } = workEntryStub;

  const timeFormat = new Intl.DateTimeFormat('de-DE', { hour: 'numeric', minute: '2-digit' });

  const breakExist = Boolean(breakStart) && Boolean(breakEnd);

  const workMin = calculateWorkingMinutes(workEntryStub);

  return {
    date,
    username,
    tenant,
    constructionId,
    job,
    jobId,
    start: timeFormat.format(start),
    end: timeFormat.format(end),
    breakStart: breakExist ? timeFormat.format(breakStart) : undefined,
    breakEnd: breakExist ? timeFormat.format(breakEnd) : undefined,
    hours: workMin / 60,
    break: breakExist ? interval2String({ start: breakStart, end: breakEnd }) : undefined,
  };
}

export function interval2String(args: { start: Date; end: Date }) {
  const { start, end } = args;

  const dur = intervalToDuration({ start, end });

  return formatDuration(dur, { locale: de });
}

function checkPrimaryFields(currentWE: WorkEntryStub) {
  if (!currentWE.constructionId) {
    throw new Error('Bitte Baustelle auswählen');
  }
  if (!currentWE.job) {
    throw new Error('Bitte Tätigkeit auswählen');
  }
}

export function checkWorkEntry(currentWE: WorkEntryStub) {
  checkPrimaryFields(currentWE);

  if (!currentWE.start || !currentWE.end) {
    throw new Error('Bitte erfasse deine Anwesenheit');
  }
  const allMin = differenceInMinutes(currentWE.end, currentWE.start);
  console.log(allMin);
  if (allMin <= 6 * 60) {
    return true;
  }

  if (!currentWE.breakStart || !currentWE.breakEnd) {
    throw new Error('Bitte erfasse deine Pause');
  }
  // vor der Pause
  const beforeBreak = intervalToDuration({ start: currentWE.start, end: currentWE.breakStart });
  if (Number(beforeBreak.hours) >= 6 && Number(beforeBreak.minutes) >= 1) {
    throw new Error('Du hast vor deiner Pause mehr als 6 Stunden gearbeitet, das ist nicht zulässig!');
  }
  // nach der Pause
  const afterBreak = intervalToDuration({ start: currentWE.breakEnd, end: currentWE.end });
  if (Number(afterBreak.hours) >= 6 && Number(afterBreak.minutes) >= 1) {
    throw new Error('Du hast nach deiner Pause mehr als 6 Stunden gearbeitet, das ist nicht zulässig!');
  }
  // max Stunden
  const breakMin = differenceInMinutes(currentWE.breakEnd, currentWE.breakStart);
  const workMin = allMin - breakMin;
  if (workMin > 599) {
    throw new Error('10 und mehr Arbeitstunden sind nicht zulässig');
  }
  // min Pause
  if (workMin >= 6 * 60 && breakMin < 30) {
    throw new Error('Deine Pause muss mindestens 30 Min. dauern');
  }
  if (workMin >= 9 * 60 && breakMin < 45) {
    throw new Error('Deine Pause muss mindestens 45 Min. dauern');
  }
  return true;
}
