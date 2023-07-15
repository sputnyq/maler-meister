import { buildQuery, genericConverter } from '../utilities';
import { constructionById } from './endpoints';
import { appRequest } from './fetch-client';

export async function loadConstructionById(constructionId: string | number) {
  return appRequest('get')(constructionById(constructionId))
    .then((res) => {
      return genericConverter<Construction>(res.data);
    })
    .catch(console.log);
}

export async function loadConstructions(queryObj: object) {
  const query = buildQuery(queryObj);

  const response = await appRequest('get')(`constructions?${query}`);

  const constructions = (response.data as any[]).map((e) => genericConverter<Construction>(e));

  const meta = response.meta as ApiMeta;

  return {
    constructions,
    meta,
  };
}

export async function loadWorkEntries(queryObj: object) {
  const query = buildQuery(queryObj);
  const response = await appRequest('get')(`work-entries?${query}`);

  const workEntries = response.data.map((e: any) => genericConverter<WorkEntry[]>(e));

  const meta = response.meta as ApiMeta;
  return {
    dailyEntries: workEntries,
    meta,
  };
}

export async function loadDailyEntries(queryObj: object) {
  const query = buildQuery(queryObj);
  const response = await appRequest('get')(`daily-entries?${query}`);

  const dailyEntries = response.data.map((e: any) => genericConverter<DailyEntry[]>(e));

  const meta = response.meta as ApiMeta;
  return {
    dailyEntries,
    meta,
  };
}

export async function loadJobs(queryObj: object) {
  const query = buildQuery(queryObj);
  const response = await appRequest('get')(`jobs?${query}`);

  const jobs = response.data.map((e: any) => genericConverter<AppJob[]>(e));

  const meta = response.meta as ApiMeta;
  return {
    jobs,
    meta,
  };
}
