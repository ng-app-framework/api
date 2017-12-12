import {Observable} from "rxjs/Observable";
import {HttpRequest, HttpResponse} from "@angular/common/http";

export abstract class Requestable {

    abstract request(request: HttpRequest<any>): Observable<HttpResponse<any> | any>;
}
