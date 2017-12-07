import {Observable} from "rxjs/Observable";
import {Callable} from "../../src/app/Service/Interface";
import {EndpointConfig} from "../../src/app/Service/Impl";
import {HttpResponse} from "@angular/common/http";

export class EndpointCallerMock implements Callable {
    config: EndpointConfig = {baseUri: ''};
    mockResponse           = {};

    public call(absoluteUrl: string, method: string, requestData: any = {}): Observable<HttpResponse<any> | any> {
        return Observable.of(this.mockResponse);
    }
}
