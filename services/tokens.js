import { Request as JSONRequest } from './request';

class Tokens extends JSONRequest {
  constructor() {
    super({ bakend: process.env.BAKEND, blockchain: process.env.BLOCKCHAIN })
  }
  
}

export let tokens = new Tokens();