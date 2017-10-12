import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  private baseUrl = 'http://10.17.2.110:8989/servegateway' + '/rest/bduser/weixin/staff/sso';
  private redirectUrl =
  'http://10.17.2.110:8989/servegateway/wxgateway/oauth2/authorize?appId=69&redirectUri=http%3a%2f%2f10.17.2.177%3a8886%2fbdsa%2f';
  headerObj = {
    'X-Requested-SystemCode' : 'neo_bdsa',
    'X-Requested-APICode': 'staff_weixin_sso',
    'X-Requested-Timestamp': Math.floor(new Date().getTime() / 1000),
    'X-Requested-Nonce': Math.floor(new Date().getTime() / 1000),
    'X-Requested-Version': '1.0'
  };
  private headers = new Headers(this.headerObj);
  private options = new RequestOptions({ headers: this.headers});

  constructor(
    private http: Http,
    private router: Router) { }

  canActivate() {
    let reg = new RegExp('(^|&)code=([^&]*)(&|$)');
    let r = window.location.search.substr(1).match(reg);
    if (r) {
      this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
      this.headers.set('X-Requested-Token', r[2]);
      return this.getTicket().then(res => {
          if (res.success) {
            sessionStorage.setItem('accessToken', res.data.accessToken);
            this.router.navigate(['/pages/track']);
            return true;
          } else {
            if (res.code === 1004 || res.code === 1005) {
                sessionStorage.clear();
            }
            return false;
          }
       });
    } else {
      if (sessionStorage.getItem('accessToken')) {
        return true;
      } else {
        let sortable = [];
        for (let p of Object.keys(this.headerObj)) {
          let nvp = this.headerObj[p];
          sortable.push([ p + ' ' + nvp, [p, nvp]]);
        }
        sortable.push(['X-Requested-Token' + ' ' + 'eMiS7KAlEpe_BrazGS6Sduv5CjmXQTxpMTGOdwRtwVA',
                       ['X-Requested-Token', 'eMiS7KAlEpe_BrazGS6Sduv5CjmXQTxpMTGOdwRtwVA']
                     ]);
        sortable.push(['appId' + ' ' + '69', ['appId', '69']]);
        sortable.sort(function(a, b) {
            if (a[0] < b[0]) { return  -1; }
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
        let result = 'POST' + '&' + this.percentEncode(this.baseUrl) + '&' + encodeURIComponent(form);
        let signature = CryptoJS.HmacSHA1(result, result).toString(CryptoJS.enc.Base64);
        console.log(signature);
        return true;
        // sessionStorage.clear();
        // window.location.href = this.redirectUrl;
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
    return this.http.post(this.baseUrl, 'appId=69', this.options)
           .toPromise()
           .then(response => response.json())
           .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.json().message || error);
  }
}
