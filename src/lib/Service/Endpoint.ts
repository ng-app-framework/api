import {Injectable} from "@angular/core";
import {EndpointValidator} from "./Impl/EndpointValidator";
import {Observable} from "rxjs/Rx";
import {EndpointEvents} from "./EndpointEvents";
import {EndpointCaller} from "./Impl/index";

@Injectable()
export class Endpoint {

    path: string                 = '';
    validator: EndpointValidator = new EndpointValidator();

    metadata: any = {};

    events = new EndpointEvents();

    constructor(public endpointCaller: EndpointCaller) {
    }

    public request(method: string, requestData: any = {}) {
        return this.validator
            .validateRequest(requestData)
            .catch((err, caught) => this.onValidationFailure('request', err, caught))
            .concat(this.onRequestValidationSuccess())
            .concat(this.continueWithRequest(method, requestData))
            .catch((err, caught) => this.onApiRequestFailure(err, caught))
            .map(response => this.onApiRequestSuccess(response))
            .map(response => this.transformResponse(response))
            .flatMap(transformedResponse => this.validator.validateResponse(transformedResponse))
            .catch((err, caught) => this.onValidationFailure('response', err, caught))
            .map(transformedResponse => this.onResponseSuccess(transformedResponse));
    }

    private continueWithRequest(method: string, requestData: any) {
        return this.endpointCaller.call(this.getAbsoluteUrl(), method, Object.assign(requestData, this.metadata));
    }

    private onResponseSuccess(transformedResponse) {
        this.events.onValidationSuccess.emit({location: 'response'});
        this.events.onSuccess.emit(transformedResponse);
        return transformedResponse;
    }

    private onApiRequestSuccess(transformed: any) {
        this.events.onApiSuccess.emit(transformed);
        return transformed;
    }

    private onApiRequestFailure(err, caught) {
        this.events.onApiFailure.emit(err);
        return Observable.throw(err);
    }

    private onRequestValidationSuccess() {
        return new Observable((observer) => {
            this.events.onValidationSuccess.emit({location: 'request'});
            observer.complete();
        });
    }

    private onValidationFailure(location: 'request' | 'response', err, caught) {
        this.events.onValidationFailure.emit({location, content: err});
        this.events.onFailure.emit(err);
        return Observable.throw(err);
    }

    public transformResponse(response) {
        return response;
    }

    getAbsoluteUrl() {
        return this.endpointCaller.config.baseUri + this.path;
    }


}