import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import * as CryptoJS from 'crypto-js';
import { AuthorizeService } from './authorize.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private apiUrl = window.location.origin;
  private requestUrl = this.apiUrl + '/servegateway/rest/bduser/weixin/staff/sso';
  private redirectUri = encodeURIComponent(this.apiUrl + '/bdsa/index/' + this.generateUUID()).toLowerCase();
  private appId = 1;
  private redirectUrl = this.apiUrl + '/servegateway/wxgateway/oauth2/authorize?appId=' + this.appId + '&redirectUri=' + this.redirectUri;
  headerObj = {
    'X-Requested-SystemCode' : 'neo_bdsa',
    'X-Requested-APICode': 'staff_weixin_sso',
    'X-Requested-Timestamp': Math.floor(new Date().getTime() / 1000),
    'X-Requested-Nonce': Math.floor(new Date().getTime() / 1000),
    'X-Requested-Version': '1.0'
  };
  private headers = new Headers(this.headerObj);

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
      let obj = Object.assign({}, this.headerObj, {'X-Requested-Token': r[2], 'appId': this.appId});
      let form = this.oauth.normalizeParameters(obj);
      let result = 'POST' + '&' + this.oauth.percentEncode(this.requestUrl) + '&' + form;
      let signature = CryptoJS.HmacSHA1(result, result).toString(CryptoJS.enc.Base64);
      this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
      this.headers.append('X-Requested-Token', r[2]);
      this.headers.append('X-Requested-Authorization', signature);
      return this.getTicket().then(res => {
          if (res.success) {
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
      // localStorage.clear();
      if (localStorage.getItem('accessToken')) {
        return true;
      } else {
        // let user = {name: '', number: ''};
        // localStorage.setItem('accessToken', 'J2KtnNMUhrZfkmkKMHSHicoHy8M7hsVjITeX6uVd0sFlOLdYl421bwiQdpfHIoIN7ZzavgJZAHFDe7epfhDG');
        // localStorage.setItem('weiXinDeviceId', 'e05c746809aaf4fd3e053456eeaf14d3');
        // localStorage.setItem('refreshToken', 'tE97DVGSZPMJWkDcnRPpLZLNcLsn4IbYcT5DyMwSEPbrx9cHvBGUjSEW7VbB4tMTWuHvBnUEBGmEG0P6TuwI');
        // localStorage.setItem('user', JSON.stringify(user));
        // return true;
        localStorage.clear();
        window.location.href = this.redirectUrl;
      }
    }
  }

  // canActivateChild() {
  //   return this.canActivate();
  // }

  getTicket(): Promise<any> {
    return this.http.post(this.requestUrl, 'appId=' + this.appId, { headers: this.headers })
           .toPromise()
           .then(response => {
             return response.json();
           })
           .catch(this.handleError);
  }

  generateUUID(): string {
   let d = new Date().getTime();
   let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
     let r = (d + Math.random() * 16) % 16 || 0;
     d = Math.floor(d / 16);
     return (c === 'x' ? r : (r && 0x3 || 0x8)).toString(16);
   });
   return uuid.replace(/-/g, '');
  }

  private handleError(error: any): Promise<any> {
    console.log(error.json().message || error);
    return Promise.reject(error.json().message || error);
  }
}
