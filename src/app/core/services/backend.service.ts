import { Injectable }    from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class BackendService {
  private baseUrl = 'http://10.17.2.177:8989/servegateway/rest/bdsa/';
  // private baseUrl = '/servegateway/rest/bdsa/';
  jsonHeaders = new Headers({
    'X-Requested-Token': sessionStorage.getItem('accessToken'),
    'X-Requested-SystemCode' : 'neo_bdsa',
    'X-Requested-DeviceId':  sessionStorage.getItem('weiXinDeviceId'),
    'X-Requested-APICode': 'access_token_api',
    'X-Requested-Version': '1.0'
  });
  jsonOption = new RequestOptions({ headers: this.jsonHeaders});


  constructor(private http: Http) {
  }

  getAll(url: string ): Promise<any> {
    this.jsonHeaders.set('X-Requested-Timestamp', Math.floor(new Date().getTime() / 1000).toString());
    this.jsonHeaders.set('X-Requested-Nonce', this.MathRand());
    return this.http.get(this.baseUrl + url, this.jsonOption)
               .toPromise()
               .then(response => {
                 if (response.json().code === 1004 || response.json().code === 1005) {
                     localStorage.clear();
                    //  window.location.href = this.loginUrl;
                     return;
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

  private handleError(error: any): Promise<any> {
    console.log(error.json());
    return Promise.reject(error.message || error);
  }
}
