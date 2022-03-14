import { Request as JSONRequest } from './request';

class Tx extends JSONRequest {
  constructor() {
    super({ bakend: process.env.BAKEND, blockchain: process.env.BLOCKCHAIN })
  }
  getTxLatest() {
    return this.getPrepared('/v1/tx/latest', { page_size: 30 })
  }
  getTxById(id) {
    return this.getPrepared(`/v1/tx/${id}`)
  }
  getTxByAddress(id, page = 0, page_size = 30 ) {
    return this.getPrepared(`/v1/tx/address/${id}`, { page, page_size })
  }
}

export let tx = new Tx();