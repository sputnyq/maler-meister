export const constructionById = (id: number | string) => `constructions/${id}`;
export const constructions = (query: string) => `constructions/?${query}`;

export const appJobById = (id: number | string) => `jobs/${id}`;
export const appJobs = (query: string) => `jobs/?${query}`;

export const bgbServiceById = (id: number | string) => `bgb-services/${id}`;
export const bgbServices = (query: string) => `bgb-services/?${query}`;

export const printSettingById = (id: number | string) => `print-settings/${id}`;
export const printSettings = (query: string) => `print-settings/?${query}`;

export const offerById = (id: number | string) => `offers/${id}`;
export const offers = (query: string) => `offers/?${query}`;

export const invoiceById = (id: number | string) => `invoices/${id}`;
export const invoices = (query: string) => `invoices/?${query}`;

export const shiftById = (id: number | string) => `shifts/${id}`;
export const shifts = (query: string) => `shifts/?${query}`;

export const dailyEntries = (query: string) => `daily-entries/?${query}`;
export const dailyEntryById = (id: number | string | undefined = '') => `daily-entries/${id}`;
export const users = (query: string) => `users/?${query}`;
