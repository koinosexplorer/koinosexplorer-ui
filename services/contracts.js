import { Request as JSONRequest } from './request';

class Contracts extends JSONRequest {
  constructor() {
    super({ bakend: process.env.BAKEND, blockchain: process.env.BLOCKCHAIN })
  }
  
}

export let contracts = new Contracts();