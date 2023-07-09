import { genericConverter } from '../utils';
import { appRequest } from './fetch-client';

export async function loadConstructionById(constructionId: string | number) {
  return appRequest('get')(`constructions/${constructionId}`)
    .then((res) => {
      return genericConverter<Construction>(res.data);
    })
    .catch(console.log);
}

export async function loadDailyEntries(query: string) {
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
