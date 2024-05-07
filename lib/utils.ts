import axios from 'axios';

// TODO: Change this to actual online API
export const apiIngco = axios.create({
  baseURL: process.env.API_URL,
});
