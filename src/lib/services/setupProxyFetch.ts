import fetch, { RequestInit } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';

// Replace with your proxy URL
const proxy = process.env.HTTPS_PROXY as string;
const agent = new HttpsProxyAgent(proxy);

const proxyFetch = (url: string | URL, init?: RequestInit) => {
  return fetch(url, {
    ...init,
    agent, // this forces the request through the proxy
  });
};

// Patch global fetch
(globalThis as any).fetch = proxyFetch;
