import { formatNumber, genericConverter } from '../../../utilities';

import { eachDayOfInterval, formatISO } from 'date-fns';

export function downloadAsCsv(args: { dailyEntries: DailyEntry[]; filename: string; dateRange: AppDateRange }) {
  const {
    dailyEntries,
    filename,
    dateRange: { start, end },
  } = args;

  if (start && end) {
    const formatter = new Intl.DateTimeFormat('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const days = eachDayOfInterval({ start: new Date(start), end: new Date(end) });

    const mime = 'data:text/csv;charset=utf-8,';

    const headerRow = ['Wochentag', 'Datum', 'Name', 'Art', 'Anfang', 'Pause', 'Ende', 'Arbeitszeit (Std.)'];

    const allRows = [headerRow.join(';')];

    days.forEach((day) => {
      const de = dailyEntries.find((c) => c.date === formatISO(day, { representation: 'date' }));
      let row = '';

      if (de) {
        de.work_entries = (de.work_entries as any).data.map((e: any) => genericConverter<WorkEntry>(e));

        const we = de.work_entries?.[0] as WorkEntry | undefined;

        row = [
          formatter.format(new Date(de.date)).replace(',', ';'),
          de.username.toUpperCase(),
          de.type,
          we?.start ?? '',
          we?.break ?? '',
          we?.end ?? '',
          formatNumber(de.sum),
        ].join(';');
      } else {
        row = formatter.format(day).replace(',', ';');
      }

      allRows.push(row);
    });

    const csvContent = allRows.join('\r\n');

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement('a');
    link.setAttribute('href', mime + encodedUri);
    link.setAttribute('download', filename + '.csv');

    link.click();
  }
}
