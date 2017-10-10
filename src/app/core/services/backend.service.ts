import { Injectable }    from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class BackendService {
  private baseUrl = 'http://10.17.2.177:9886/bdsa/';
  // private baseUrl = '/bdsa/';
  jsonHeaders = new Headers({
    'Content-Type': 'application/json',
    // 'X-Requested-SystemCode' : 'neo_mdms',
    // 'X-Requested-Ticket': localStorage.getItem('mdms_ticket')
  });
  jsonOption = new RequestOptions({ headers: this.jsonHeaders});


  constructor(private http: Http) {
  }

  getAll(url: string ): Promise<any> {
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

  private handleError(error: any): Promise<any> {
    console.log(error.json());
    return Promise.reject(error.message || error);
  }
}
