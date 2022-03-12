import axios from 'axios';
import { get as _get } from 'lodash';

export class Request {
  constructor({ bakend = '', blockchain = '' }) {
    this._bakend = bakend;
    this._blockchain = blockchain;
  }
  
  sendBlockchain(typed, data) {
    return this.__manualBlockchain({
      method: "POST",
      url: this._blockchain,
      headers: { 'content-type': 'application/json'},
      data:{
        id: 1,
        jsonrpc: "2.0",
        method: typed,
        params: data,
      }
    }, true)
  }
  
  async __manualBlockchain(req, time_out = true) {
    // axios config
    let id_time_out;
    return new Promise((resolve, reject) => {
      if(time_out) {
        id_time_out = setTimeout(() => {
          reject(new Error('ECONNABORTED'))
        }, 10000)
      }
      axios(req).then(response => {
        if(time_out) { clearTimeout(id_time_out) }
        /* Successful */
        let result = _get(response, 'data.result', null)
        if(result != null) {
          resolve(result);
        }
        /* Error */
        let error = _get(response, 'data.error', null)
        if(error != null) {
          reject(error);
        }
      }).catch((err) => {
        reject(err)
      })

    })
  }


  getPrepared(extenderURL, query, headers = {}, params = {}) {
    return this.__manualBakend({
      method: "GET",
      url: this.urlTxtResolver(extenderURL, query),
      headers: Object.assign({ 'Content-Type': 'application/json'}, headers),
      params: params
    })
  }
  

  async __manualBakend(req, timeOUT = true) {
    let id_timeOUT;
    return new Promise((resolve, reject) => {
      if(timeOUT) {
        id_timeOUT = setTimeout(() => {
          reject(new Error('ECONNABORTED'))
        }, 20000)
      }
      axios(req).then(response => {
        if(timeOUT) { clearTimeout(id_timeOUT) }
        return resolve(response.data)
      }).catch((err) => {
        if(timeOUT) { clearTimeout(id_timeOUT) }
        reject(err)
      })
    })
  }

  urlTxtResolver (extenderURL, query) {
    let resQuery = '';
    const endpointUrl = this._simplexUrl(extenderURL);
    if (
      query &&
      query !== null &&
      ((typeof(query) === 'object' && Object.keys(query).length > 0) || Array.isArray(query))
      ) {
      resQuery += endpointUrl.indexOf('?') >= 0 ? '&' : '?';
      resQuery += this.loopQuerier(query);
      resQuery = resQuery.substr(0, resQuery.length - 1); // Deleting last '&'
    }
    return `${ endpointUrl + resQuery }`;
  }

  loopQuerier(query) {
    let resQuery = '';
    if ( Array.isArray(query) && query.length) {
      for (let i = 0; i < query.length; i++) {
        const indQuery = query[i];
        resQuery += this.loopQuerier(indQuery);
      }
    } else if (typeof query === 'object' && Object.keys(query).length) {
      for (const key in query) {
        if (query.hasOwnProperty(key)) {
          resQuery += 
            Array.isArray((query[key])) ||
            (query[key] !== null && typeof(query[key]) === 'object') ? // Is array or is object?
              this.loopQuerier(query[key]) : // Recycle if is iterable, if is object ignore actual key
              (key !== '_code' ? `${key}=${query[key]}&` : '');
        }
      }
    }
    return resQuery;
  }

  _simplexUrl(endpoint){
    return `${this._bakend ? this._bakend : ''}${endpoint && typeof endpoint == 'string' ? (
      endpoint[0] === '/' && this._bakend && this._bakend[this._bakend.length - 1] === '/' ? endpoint.substr(1) : 
        (endpoint[0] !== '/' && this._bakend && this._bakend[this._bakend.length - 1] !== '/' ? `/${endpoint}` : endpoint)
    ) : ''}`
  }


}