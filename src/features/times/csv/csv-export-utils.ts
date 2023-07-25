export function downloadAsCsv(data: DailyEntry[], fileName: string) {
  const mime = 'data:text/csv;charset=utf-8,';
  let csvContent = 'Datum;Name;Art;Stunden\r\n';

  data.forEach((de) => {
    const row = [
      new Intl.DateTimeFormat('de-DE', { dateStyle: 'full' }).format(new Date(de.date)),
      de.username.toUpperCase(),
      de.type,
      de.sum.toLocaleString('de'),
    ].join(';');
    csvContent += row + '\r\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', mime + encodedUri);
  link.setAttribute('download', fileName + '.csv');

  link.click();
}
