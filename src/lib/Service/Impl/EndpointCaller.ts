import {HttpRequest, HttpResponse}          from "@angular/common/http";
import {EventEmitter, Injectable, Optional, Inject, forwardRef} from "@angular/core";
import {Value}                              from "@ng-app-framework/core";
import {Observable}                         from "rxjs/Rx";
import {Callable}                           from "../Interface/Callable";
import {Requestable}                        from "../Interface/Requestable";
import {RequestBuilder}                     from "../RequestBuilder";
import {EndpointConfig}                     from "./EndpointConfig";

@Injectable()
export class EndpointCaller implements Callable {

    lastRequest: any                = null;
    lastResponse: HttpResponse<any> = null;

    onApiStart  = new EventEmitter<any>();
    onApiFinish = new EventEmitter<any>();

    constructor(@Inject(forwardRef(() => Requestable)) public http: Requestable,
        @Inject(forwardRef(() => EndpointConfig)) @Optional() public config: EndpointConfig = {baseUri: ''}) {
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
            .last()
            .flatMap((response: HttpResponse<any>) => this.map(response));
    }

    protected map(response: HttpResponse<any>): Observable<any> {
        this.lastResponse = response;
        return Observable.from([this.transformResponse(this.getObjectFromResponse(response))]);
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
