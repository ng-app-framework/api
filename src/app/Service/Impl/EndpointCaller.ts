import {Injectable, Optional, EventEmitter} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {RequestBuilder} from "../RequestBuilder";
import {Requestable} from "../Interface/Requestable";
import {Value} from "@ng-app-framework/core";
import {Callable} from "../Interface/Callable";
import {HttpRequest, HttpResponse} from "@angular/common/http";

@Injectable()
export class EndpointConfig {
    baseUri: string = '';
}

@Injectable()
export class EndpointCaller implements Callable {

    lastRequest: any                = null;
    lastResponse: HttpResponse<any> = null;

    onApiStart  = new EventEmitter<any>();
    onApiFinish = new EventEmitter<any>();

    constructor(public http: Requestable, @Optional() public config: EndpointConfig = {baseUri: ''}) {
    }

    public call(absoluteUrl: string, method: string, requestData: any = {}): Observable<HttpResponse<any> | any> {
        return this.execute(this.createRequestObject(absoluteUrl, method, requestData));
    }

    protected createRequestObject(path: string, method: string, requestData: any): HttpRequest<any> {
        return new HttpRequest<any>('GET', path).clone(
            this.lastRequest = RequestBuilder.getRequestArgs(
                method, path, requestData
            )
        );
    }

    protected execute(request: HttpRequest<any>): Observable<HttpResponse<any>> {
        this.onApiStart.emit();
        return this.http.request(request)
            .finally(() => {
                this.onApiFinish.emit();
            })
            .flatMap((response: HttpResponse<any>) => this.map(response));
    }

    protected map(response: HttpResponse<any>): Observable<any> {
        this.lastResponse = response;
        let body          = this.transformResponse(this.getObjectFromResponse(response));
        return Observable.from([body]);
    }

    protected getObjectFromResponse(response: HttpResponse<any>): any {
        if (Value.hasKey(response || {}, 'body') && Value.isProvided(response.body)) {
            return response.body
        }
        return {};
    }

    protected transformResponse(response: any): any {
        return response;
    }
}
