import { genericConverter } from '../utils';
import { appRequest } from './fetch-client';

export async function loadConstructionById(constructionId: string | number) {
  return appRequest('get')(`constructions/${constructionId}`)
    .then((res) => {
      return genericConverter<Construction>(res.data);
    })
    .catch(console.log);
}
