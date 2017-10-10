import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class UserService implements CanActivate, CanActivateChild {
  // private baseUrl = 'http://10.17.2.26:8190/' + 'mdms/';
  // private loginUrl = 'http://10.17.2.26:8188/bdportal'+'/resources/mdms/login.html';
  // 耀毅
  private baseUrl = 'http://10.14.1.155:8188/' + 'mdms/';
  private loginUrl = 'http://10.14.1.155:8082/bdportal' + '/resources/mdms/login.html';
  private headers = new Headers({
    'Content-Type': 'application/json',
    'X-Requested-SystemCode' : 'neo_mdms'});
  private options = new RequestOptions({ headers: this.headers});

  constructor(
    private http: Http,
    private router: Router) { }

  canActivate() {
    // localStorage.setItem('mdms_ticket', '9dacbc106e174a719cc9f7a441b374fb');
    // return true;
    let reg = new RegExp('(^|&)ticket=([^&]*)(&|$)');
    let r = window.location.search.substr(1).match(reg);
    if (r) {
      this.headers.set('X-Requested-Ticket', r[2]);
      return this.getTicket().then(res => {
          if (res.success) {
            localStorage.setItem('mdms_ticket', res.data.ticket);
            this.router.navigate(['/pages/serviceView']);
            return true;
          } else {
            if (res.code === 1004 || res.code === 1005) {
                localStorage.clear();
                window.location.href = this.loginUrl;
            }
            return false;
          }
       });
    } else {
      if (localStorage.getItem('mdms_ticket')) {
        return true;
      } else {
        localStorage.clear();
        window.location.href = this.loginUrl;
      }
    }
  }

  canActivateChild() {
    return this.canActivate();
  }

  getTicket(): Promise<any> {
    return this.http.post(this.baseUrl + 'access_ticket', null, this.options)
           .toPromise()
           .then(response => response.json())
           .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    if (error.json().message === '登录已过期！请重新登录!') {
      localStorage.clear();
      // window.location.href = 'http://10.17.2.26:8188/bdportal/resources/mdms/login.html';
      // 耀毅
      window.location.href = 'http://10.14.1.155:8082/bdportal/resources/mdms/login.html';
    }
    return Promise.reject(error.json().message || error);
  }
}
