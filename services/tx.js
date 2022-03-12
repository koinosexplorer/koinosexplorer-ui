import { Request as JSONRequest } from './request';

class Tx extends JSONRequest {
  constructor() {
    super({ bakend: process.env.BAKEND, blockchain: process.env.BLOCKCHAIN })
  }
  getTxLatest() {
    return this.getPrepared('/v1/tx/latest')
  }
  getTxById(id) {
    return this.getPrepared(`/v1/tx/${id}`)
  }
  getTxByAddress(id) {
    return this.getPrepared(`/v1/tx/address/${id}`)
  }
}

export let tx = new Tx();