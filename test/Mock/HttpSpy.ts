import {Observable} from "rxjs/Rx";
import {Requestable} from "../../src/lib/Service/Interface/Requestable";
import {HttpRequest, HttpResponse} from "@angular/common/http";

export interface TestRequest {
    url: string;
    method: string;
    mockResponse: MockedResponse;
    params: { get: (string) => string };
}

export interface MockedResponse {
    ok: boolean;
    status?: number;
    body: any;
}

export class HttpSpy implements Requestable {

    onRequest = (request: TestRequest) => {

    };

    public request(request: HttpRequest<any>): Observable<HttpResponse<any> | any> {
        let testRequest = <any>request;
        this.onRequest(<any>request);
        return Observable.from([testRequest.mockResponse])
            .map(value => {
                let url            = new URL(testRequest.url);
                testRequest.params = new URLSearchParams(url.search);
                if (!value.ok) {
                    throw value;
                }
                return value;
            });
    }
}
