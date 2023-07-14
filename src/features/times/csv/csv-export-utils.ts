export function downloadAsCsv(data: DailyEntry[], fileName: string) {
  let csvContent = 'data:text/csv;charset=utf-8,';

  const header = 'Wochentag,Datum,Name,Tätigkeit,Stunden\r\n';
  csvContent += header;

  data.forEach((de) => {
    const row = [
      new Intl.DateTimeFormat('de-DE', { dateStyle: 'full' }).format(new Date(de.date)),
      de.username.toUpperCase(),
      de.type,
      de.sum,
    ].join(',');
    csvContent += row + '\r\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', fileName + '.csv');

  link.click();
}
