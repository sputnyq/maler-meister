import { buildQuery, genericConverter } from '../utils';
import { appRequest } from './fetch-client';

export async function loadConstructionById(constructionId: string | number) {
  return appRequest('get')(`constructions/${constructionId}`)
    .then((res) => {
      return genericConverter<Construction>(res.data);
    })
    .catch(console.log);
}

export async function loadConstructions(queryObj: object) {
  const query = buildQuery(queryObj);

  const response = await appRequest('get')(`constructions?${query}`);

  return (response.data as any[]).map((e) => genericConverter<Construction>(e));
}

export async function loadDailyEntries(queryObj: object) {
  const query = buildQuery(queryObj);
  return appRequest('get')(`daily-entries?${query}`)
    .then((res) => {
      const data = res.data.map((e: any) => genericConverter<DailyEntry[]>(e));
      return data;
    })
    .catch((e) => {
      console.log(e);
      return new Array<DailyEntry>();
    });
}
