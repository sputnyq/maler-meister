export const constructionById = (id: number | string) => `constructions/${id}`;

export const appJobById = (id: number | string) => `jobs/${id}`;
export const appJobs = (query: string) => `jobs/?${query}`;

export const bgbServiceById = (id: number | string) => `bgb-services/${id}`;
export const bgbServices = (query: string) => `bgb-services/?${query}`;

export const printSettingById = (id: number | string) => `print-settings/${id}`;
export const printSettings = (query: string) => `print-settings/?${query}`;
