import {Requestable}                                          from "./Interface/Requestable";
import {Observable}                                           from "rxjs/Rx";
import {Injectable}                                           from "@angular/core";
import {HttpClient, HttpRequest, HttpResponse} from "@angular/common/http";

@Injectable()
export class HttpProxy implements Requestable {

    constructor(public http: HttpClient) {

    }

    public request(request: HttpRequest<any>): Observable<HttpResponse<any> | any> {
        return this.http.request<any>(request.method, request.url, {
            body   : request.body,
            headers: request.headers,
            observe: 'response',
            params : request.params
        });
    }
}
