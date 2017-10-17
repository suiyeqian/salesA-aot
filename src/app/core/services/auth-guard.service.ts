import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import * as CryptoJS from 'crypto-js';
import { AuthorizeService } from './authorize.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private apiUrl = 'http://10.17.2.177:8886';
  private requestUrl = this.apiUrl + '/servegateway/rest/bduser/weixin/staff/sso';
  // private apiUrl = window.location.origin;
  // private requestUrl = '/servegateway/rest/bduser/weixin/staff/sso';
  private redirectUri = encodeURIComponent(this.apiUrl + '/bdsa/').toLowerCase();
  private redirectUrl = this.apiUrl + '/servegateway/wxgateway/oauth2/authorize?appId=69&redirectUri=' + this.redirectUri;
  headerObj = {
    'X-Requested-SystemCode' : 'neo_bdsa',
    'X-Requested-APICode': 'staff_weixin_sso',
    'X-Requested-Timestamp': Math.floor(new Date().getTime() / 1000),
    'X-Requested-Nonce': Math.floor(new Date().getTime() / 1000),
    'X-Requested-Version': '1.0'
  };
  private headers = new Headers(this.headerObj);
  // private options = new RequestOptions({ headers: this.headers});

  constructor(
    private http: Http,
    private router: Router,
    private oauth: AuthorizeService
  ) {
  }

  canActivate() {
    let reg = new RegExp('(^|&)code=([^&]*)(&|$)');
    let r = window.location.search.substr(1).match(reg);
    if (r) {
      // let sortable = [];
      // for (let p of Object.keys(this.headerObj)) {
      //   let nvp = this.headerObj[p];
      //   sortable.push([ p + ' ' + nvp, [p, nvp]]);
      // }
      // sortable.push(['X-Requested-Token' + ' ' + r[2], ['X-Requested-Token', r[2]]]);
      // sortable.push(['appId' + ' ' + '69', ['appId', '69']]);
      // sortable.sort(function(a, b) {
      //     if (a[0] < b[0]) { return -1; }
      //     if (a[0] > b[0]) { return 1; }
      //     return 0;
      // });
      // let sorted = [];
      // for (let s of sortable) { sorted.push(s[1]); }
      // let form = '';
      // for (let p of sorted){
      //   let value = p[1];
      //   if (value == null) { value = ''; }
      //   if (form !== '') { form += '&'; }
      //   form += this.oauth.percentEncode(p[0]) + '=' + this.oauth.percentEncode(value);
      // }
      let obj = Object.assign({}, this.headerObj, {'X-Requested-Token': r[2], 'appId': '69'});
      let form = this.oauth.normalizeParameters(obj);
      let result = 'POST' + '&' + this.oauth.percentEncode(this.requestUrl) + '&' + form;
      // let result = 'POST' + '&' + this.oauth.percentEncode(this.requestUrl) + '&' + encodeURIComponent(form);
      let signature = CryptoJS.HmacSHA1(result, result).toString(CryptoJS.enc.Base64);
      this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
      this.headers.append('X-Requested-Token', r[2]);
      this.headers.append('X-Requested-Authorization', signature);
      return this.getTicket().then(res => {
          if (res.success) {
            console.log(res.data);
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('user', JSON.stringify(res.data));
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('weiXinDeviceId', res.data.weiXinDeviceId);
            this.router.navigate(['/pages/track']);
            return true;
          } else {
            localStorage.clear();
            return false;
          }
       });
    } else {
      if (localStorage.getItem('accessToken')) {
        return true;
      } else {
        let user = {name: '马倩', number: 'xn087432'};
        localStorage.setItem('accessToken', 'Y5IWVYSM7aH2W38ywRaatfLi10Lw7FRZOdNFFHLhz2Q5kIFGYudol3ujTdXBX3BRrLqZFa9jA1TEEDlMGSSc');
        localStorage.setItem('weiXinDeviceId', 'e05c746809aaf4fd3e053456eeaf14d3');
        localStorage.setItem('refreshToken', 'RrDRK6XijUGfzbYwUP57rHteHJyCajztpJXpkmQZF6fWBr2FHrgVi4zfxrUmx6J8hYIIlvd5bnBURBpSzs9e');
        localStorage.setItem('user', JSON.stringify(user));
        return true;
        // localStorage.clear();
        // window.location.href = this.redirectUrl;
      }
    }
  }
  //
  // percentEncode(s) {
  //     if (s == null) {
  //         return '';
  //     }
  //     if (s instanceof Array) {
  //         let e = '';
  //         for (let i of s) {
  //           if (e !== '') { e += '&'; }
  //           e += this.percentEncode(i);
  //         }
  //         return e;
  //     }
  //     s = encodeURIComponent(s);
  //     s = s.replace(/\!/g, '%21');
  //     s = s.replace(/\*/g, '%2A');
  //     s = s.replace(/\'/g, '%27');
  //     s = s.replace(/\(/g, '%28');
  //     s = s.replace(/\)/g, '%29');
  //     return s;
  // }

  // canActivateChild() {
  //   return this.canActivate();
  // }

  getTicket(): Promise<any> {
    return this.http.post(this.requestUrl, 'appId=69', { headers: this.headers })
           .toPromise()
           .then(response => {
             return response.json();
           })
           .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.log(error.json().message || error);
    return Promise.reject(error.json().message || error);
  }
}
