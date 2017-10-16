import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  private baseUrl = 'http://10.17.2.110:8989/servegateway';
  private requestUrl = this.baseUrl + '/rest/bduser/weixin/staff/sso';
  private redirectUri = encodeURIComponent('http://10.17.2.177:8886/bdsa/').toLowerCase();
  private redirectUrl = this.baseUrl + '/wxgateway/oauth2/authorize?appId=69&redirectUri=' + this.redirectUri;
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
    private router: Router) { }

  canActivate() {
    sessionStorage.setItem('accessToken', 'PjKxOD9vMzf8lMwq7ukQPtOlz9rfaVrgLsXEnxIA8ty6xGjHlxijrRWi2fO5xxn8pwW2Y5RqQkycfZ2xEu4t');
    sessionStorage.setItem('weiXinDeviceId', '82b66628f9a30ae54fe528f98094c138');
    let reg = new RegExp('(^|&)code=([^&]*)(&|$)');
    let r = window.location.search.substr(1).match(reg);
    if (r) {
      let sortable = [];
      for (let p of Object.keys(this.headerObj)) {
        let nvp = this.headerObj[p];
        sortable.push([ p + ' ' + nvp, [p, nvp]]);
      }
      sortable.push(['X-Requested-Token' + ' ' + r[2], ['X-Requested-Token', r[2]]]);
      sortable.push(['appId' + ' ' + '69', ['appId', '69']]);
      sortable.sort(function(a, b) {
          if (a[0] < b[0]) { return -1; }
          if (a[0] > b[0]) { return 1; }
          return 0;
      });
      let sorted = [];
      for (let s of sortable) { sorted.push(s[1]); }
      let form = '';
      for (let p of sorted){
        let value = p[1];
        if (value == null) { value = ''; }
        if (form !== '') { form += '&'; }
        form += this.percentEncode(p[0]) + '=' + this.percentEncode(value);
      }
      let result = 'POST' + '&' + this.percentEncode(this.requestUrl) + '&' + encodeURIComponent(form);
      let signature = CryptoJS.HmacSHA1(result, result).toString(CryptoJS.enc.Base64);
      this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
      this.headers.append('X-Requested-Token', r[2]);
      this.headers.append('X-Requested-Authorization', signature);
      return this.getTicket().then(res => {
          if (res.success) {
            sessionStorage.setItem('accessToken', res.data.accessToken);
            sessionStorage.setItem('weiXinDeviceId', res.data.weiXinDeviceId);
            sessionStorage.setItem('refreshToken', res.data.refreshToken);
            sessionStorage.setItem('user', JSON.stringify(res.data));
            this.router.navigate(['/pages/track']);
            return true;
          } else {
            sessionStorage.clear();
            return false;
          }
       });
    } else {
      if (sessionStorage.getItem('accessToken')) {
        return true;
      } else {
        // console.log(this.redirectUrl);
        // return true;
        sessionStorage.clear();
        window.location.href = this.redirectUrl;
      }
    }
  }

  percentEncode(s) {
      if (s == null) {
          return '';
      }
      if (s instanceof Array) {
          let e = '';
          for (let i of s) {
            if (e !== '') { e += '&'; }
            e += this.percentEncode(i);
          }
          return e;
      }
      s = encodeURIComponent(s);
      s = s.replace(/\!/g, '%21');
      s = s.replace(/\*/g, '%2A');
      s = s.replace(/\'/g, '%27');
      s = s.replace(/\(/g, '%28');
      s = s.replace(/\)/g, '%29');
      return s;
  }

  canActivateChild() {
    return this.canActivate();
  }

  getTicket(): Promise<any> {
    return this.http.post(this.requestUrl, 'appId=69', { headers: this.headers })
           .toPromise()
           .then(response => {
             alert(response);
             return response.json();
           })
           .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.log(error.json().message || error);
    return Promise.reject(error.json().message || error);
  }
}
