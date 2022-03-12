import { Request as JSONRequest } from './request';

class Chain extends JSONRequest {
  constructor() {
    super({ bakend: process.env.BAKEND, blockchain: process.env.BLOCKCHAIN })
  }
}

export let chain = new Chain();