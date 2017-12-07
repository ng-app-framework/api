import {EndpointCaller, EndpointConfig} from "../../src/app/Service/Impl";
import {HttpSpy, MockedResponse} from "./HttpSpy";
import {HttpRequest} from "@angular/common/http";

export class EndpointCallerShunt extends EndpointCaller {


    mockResponse: MockedResponse | any = {};

    constructor(config?: EndpointConfig) {
        super(<any>new HttpSpy(), config);
        this.config.baseUri = 'http://www.local.dev/';
    }

    protected createRequestObject(path: string, method: string, requestData: any): HttpRequest<any> {
        return Object.assign(
            super.createRequestObject(path, method, requestData),
            {mockResponse: this.mockResponse}
        );
    }

    tryGettingObjectFromResponse(response): any {
        return this.getObjectFromResponse(response);
    }
}
