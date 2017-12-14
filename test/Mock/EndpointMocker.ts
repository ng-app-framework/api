import {MockedResponse} from "./HttpSpy";
import {Endpoint} from "../../src/lib/Service";
import {HttpRequest} from "@angular/common/http";

export abstract class EndpointMocker {


    constructor(public endpoint: Endpoint) {

    }

    mock() {
        this.endpoint.metadata.mockResponse = (request, subject) => this.respond(request, subject);
    }

    respond(request: HttpRequest<any>, subject) {
        let body = JSON.parse(request.body);
        if (this.isValidRequest(body, request.params)) {
            subject.next(this.getSuccess(body, request.params));
            subject.complete();
            return;
        }
        subject.error(this.getFailure(body, request.params));
    }

    protected abstract isValidRequest(body: any, params: { get: (string) => string }): boolean;

    protected abstract getSuccess(body: any, params: { get: (string) => string }): MockedResponse;

    protected abstract getFailure(body: any, params: { get: (string) => string }): MockedResponse;
}
