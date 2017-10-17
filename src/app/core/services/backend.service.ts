import { Injectable }    from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthorizeService } from './authorize.service';
import * as CryptoJS from 'crypto-js';
import { Router, RouterState, RouterStateSnapshot } from '@angular/router';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class BackendService {
  private apiUrl = 'http://10.17.2.177:8886';
  private baseUrl = this.apiUrl + '/servegateway/rest/bdsa/';
  // private apiUrl = window.location.origin;
  // private baseUrl = '/servegateway/rest/bdsa/';
  private refreshUrl = this.apiUrl + '/servegateway/rest/bduser/weixin/user/access_token';

  jsonHeaders = new Headers({
    'X-Requested-Token': localStorage.getItem('accessToken'),
    'X-Requested-SystemCode' : 'neo_bdsa',
    'X-Requested-DeviceId':  localStorage.getItem('weiXinDeviceId'),
    'X-Requested-APICode': 'access_token_api',
    'X-Requested-Version': '1.0'
  });
  jsonOption = new RequestOptions({ headers: this.jsonHeaders});

  constructor(
    private http: Http,
    private router: Router,
    private oauth: AuthorizeService) {
  }

  getAll(url: string ): Promise<any> {
    // console.log(Math.floor(new Date().getTime() / 1000).toString(), this.MathRand());
    this.jsonHeaders.set('X-Requested-Timestamp', Math.floor(new Date().getTime() / 1000).toString());
    this.jsonHeaders.set('X-Requested-Nonce', this.MathRand());
    return this.http.get(this.baseUrl + url, this.jsonOption)
               .toPromise()
               .then(response => {
                 if (response.json().code === 50013) {
                     localStorage.clear();
                     this.getNewToken();
                 }
                 return response.json();
               })
               .catch(this.handleError);
  }

  MathRand() {
    let Num = '';
    for (let i = 0; i < 6; i++) {
      Num += Math.floor(Math.random() * 10);
    }
    return Num;
  }

  getNewToken() {
    const state: RouterState = this.router.routerState;
    const snapshot: RouterStateSnapshot = state.snapshot;
    let url = snapshot.url;

    let headersObj = {
      'X-Requested-SystemCode' : 'neo_bdsa',
      'X-Requested-APICode': 'app_api',
      'X-Requested-Timestamp': Math.floor(new Date().getTime() / 1000),
      'X-Requested-Nonce': this.MathRand(),
      'X-Requested-Version': '1.0'
    };
    let headers = new Headers(headersObj);
    let refreshToken = localStorage.getItem('refreshToken');
    let obj = Object.assign({}, headersObj, {'refreshToken': refreshToken});
    let form = this.oauth.normalizeParameters(obj);
    let result = 'POST' + '&' + this.oauth.percentEncode(this.refreshUrl) + '&' + form;
    let signature = CryptoJS.HmacSHA1(result, result).toString(CryptoJS.enc.Base64);
    headers.append('X-Requested-Authorization', signature);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let body = 'refreshToken=' + refreshToken;
    this.http.post(this.refreshUrl, body, { headers: headers })
           .toPromise()
           .then(response => {
             if (response.json().code === 50012) {
               localStorage.clear();
             } else {
               localStorage.setItem('accessToken', response.json().data.accessToken);
               localStorage.setItem('refreshToken', response.json().data.refreshToken);
               localStorage.setItem('weiXinDeviceId', response.json().data.weiXinDeviceId);
               localStorage.setItem('user', JSON.stringify(response.json().data));
             }
             window.location.reload();
           })
           .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.log(error.json().message || error);
    return Promise.reject(error.json().message || error);
  }
}
