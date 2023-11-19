import { signal } from '@preact/signals-react';

import { formatISO } from 'date-fns';

export const initilDailyEntry = {
  date: formatISO(new Date(), { representation: 'date' }),
  type: 'Arbeit',
} as DailyEntry;

export const dailyEntrySignal = signal<DailyEntry>(initilDailyEntry);

export const setDailyEntrySignalValue = (args: { prop: keyof DailyEntry; value: any }) => {
  dailyEntrySignal.value = { ...dailyEntrySignal.value, [args.prop]: args.value };
};

export const workEntrySignal = signal<WorkEntryStub>({} as WorkEntryStub);

export const setWorkEntryValue = (args: { prop: keyof WorkEntryStub; value: any }) => {
  workEntrySignal.value = { ...workEntrySignal.value, [args.prop]: args.value };
};
