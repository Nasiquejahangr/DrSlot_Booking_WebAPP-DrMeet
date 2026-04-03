// Central export point for all APIs
// Import all APIs from their respective folders

export * as userApi from './userApi/index.js';
export * as doctorApi from './doctorApi/index.js';
export { API_BASE_URL, ENDPOINTS, getFullUrl } from './config.js';
