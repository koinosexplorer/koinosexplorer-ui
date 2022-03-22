import { Request as JSONRequest } from './request';

class Tokens extends JSONRequest {
  constructor() {
    super({ bakend: process.env.BAKEND, blockchain: process.env.BLOCKCHAIN })
  }
  getToken(tokenId, page = 0, page_size = 30) {
    return this.getPrepared(`/v1/token/${tokenId}`, { page, page_size })
  }
  getHolders(tokenId, page = 0, page_size = 30) {
    return this.getPrepared(`/v1/token/holders/${tokenId}`, { page, page_size })
  }
  getTransfersByAddress(addressId, page = 0, page_size = 30) {
    return this.getPrepared(`/v1/token/transactions/${addressId}`, { page, page_size })
  }
}

export let tokens = new Tokens();