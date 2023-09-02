import { StrapiQueryObject, buildQuery, genericConverter } from '../utilities';
import { appJobs, bgbServices, constructionById, constructions, dailyEntries, invoices, offers } from './endpoints';
import { appRequest } from './fetch-client';

export async function loadConstructionById(constructionId: string | number) {
  return appRequest('get')(constructionById(constructionId))
    .then((res) => {
      return genericConverter<Construction>(res.data);
    })
    .catch((e) => {
      console.log(e);
      return undefined;
    });
}

export async function fetchBgbServices(queryObj: StrapiQueryObject) {
  const query = buildQuery(queryObj);

  const response = await appRequest('get')(bgbServices(query));
  const services = (response.data as any[]).map((e) => genericConverter<BgbService>(e));

  return { services };
}

export async function loadConstructions(queryObj: StrapiQueryObject) {
  const query = buildQuery(queryObj);

  const response = await appRequest('get')(constructions(query));

  const converted = (response.data as any[]).map((e) => genericConverter<Construction>(e));

  const meta = response.meta as ApiMeta;

  return {
    constructions: converted,
    meta,
  };
}

export async function loadWorkEntries(queryObj: StrapiQueryObject) {
  const query = buildQuery(queryObj);
  const response = await appRequest('get')(`work-entries?${query}`);

  const workEntries = response.data.map((e: any) => genericConverter<WorkEntry[]>(e));

  const meta = response.meta as ApiMeta;
  return {
    dailyEntries: workEntries,
    meta,
  };
}

export async function loadInvoices(queryObj: StrapiQueryObject) {
  const query = buildQuery(queryObj);
  const response = await appRequest('get')(invoices(query));

  const appInvoices = response.data.map((e: any) => genericConverter<AppInvoice[]>(e)) as AppInvoice[];

  const meta = response.meta as ApiMeta;
  return {
    appInvoices,
    meta,
  };
}
export async function loadOffers(queryObj: StrapiQueryObject) {
  const query = buildQuery(queryObj);
  const response = await appRequest('get')(offers(query));

  const appOffers = response.data.map((e: any) => genericConverter<AppOffer[]>(e)) as AppOffer[];

  const meta = response.meta as ApiMeta;
  return {
    appOffers,
    meta,
  };
}

export async function loadDailyEntries(queryObj: StrapiQueryObject) {
  const query = buildQuery(queryObj);
  const response = await appRequest('get')(dailyEntries(query));

  const converted = response.data.map((e: any) => genericConverter<DailyEntry[]>(e)) as DailyEntry[];

  const meta = response.meta as ApiMeta;
  return {
    dailyEntries: converted,
    meta,
  };
}

export async function loadJobs(queryObj: StrapiQueryObject) {
  const query = buildQuery(queryObj);
  const response = await appRequest('get')(appJobs(query));

  const jobs = response.data.map((e: any) => genericConverter<AppJob[]>(e));

  const meta = response.meta as ApiMeta;
  return {
    jobs,
    meta,
  };
}
