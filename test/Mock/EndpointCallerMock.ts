import {Observable}     from "rxjs/Rx";
import {HttpResponse}   from "@angular/common/http";
import {EndpointConfig} from "../../src/lib/Service/Impl/EndpointConfig";
import {Callable}       from "../../src/lib/Service/Interface/Callable";

export class EndpointCallerMock implements Callable {
    config: EndpointConfig = {baseUri: ''};
    mockResponse           = {};

    public call(absoluteUrl: string, method: string, requestData: any = {}): Observable<HttpResponse<any> | any> {
        return Observable.of(this.mockResponse);
    }
}
