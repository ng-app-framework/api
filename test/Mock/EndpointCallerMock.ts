import {Observable} from "rxjs/Rx";
import {Callable} from "../../src/lib/Service/Interface";
import {EndpointConfig} from "../../src/lib/Service/Impl";
import {HttpResponse} from "@angular/common/http";

export class EndpointCallerMock implements Callable {
    config: EndpointConfig = {baseUri: ''};
    mockResponse           = {};

    public call(absoluteUrl: string, method: string, requestData: any = {}): Observable<HttpResponse<any> | any> {
        return Observable.of(this.mockResponse);
    }
}
