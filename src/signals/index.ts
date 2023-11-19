import { signal } from '@preact/signals-react';

export const dailyEntriesSignal = signal<DailyEntry[]>([]);

export const eventDateRangeSignal = signal<EventDateRange>({});
