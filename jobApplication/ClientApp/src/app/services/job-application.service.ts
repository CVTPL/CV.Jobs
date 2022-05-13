import { Injectable, Inject} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  
  public baseURL = environment.base_url;
  constructor(private http: HttpClient) {
  }
  public saveApplyJobClient(data) {

    //console.log(data);
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

    //this.http.post(this.baseURL+"api/JobApplicationAction",data).toPromise();
    return this.http.post(this.baseURL + "api/JobApplicationAction", data).pipe
      (map(response => {
        return response;
      }
      ));
  }
}
