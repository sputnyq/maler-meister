import { signal } from '@preact/signals-react';

import { INITIAL_DAILY_ENTRY } from '../constants';

export const dailyEntriesSignal = signal<DailyEntry[]>([]);

export const eventDateRangeSignal = signal<EventDateRange>({});

export const dailyEntrySignal = signal<DailyEntry>(INITIAL_DAILY_ENTRY);

export const workEntryStubSignal = signal<WorkEntryStub>({} as WorkEntryStub);
