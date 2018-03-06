import {Injectable}        from "@angular/core";
import {EndpointRegistry}  from "./EndpointRegistry";
import {EndpointCaller}    from "./Impl/EndpointCaller";
import {EndpointValidator} from "./Impl/EndpointValidator";
import {Observable}        from "rxjs/Rx";
import {EndpointEvents}    from "./EndpointEvents";

export interface EndpointArgument {
    name: string;
    type: string;
    required: boolean;
}

export interface EndpointDocumentation {
    method: 'get' | 'post' | 'put' | 'delete';
    name: string;
    arguments: EndpointArgument[];
}

@Injectable()
export class Endpoint {

    customBaseUri: string        = '';
    path: string                 = '';
    validator: EndpointValidator = new EndpointValidator();

    metadata: any = {};

    events = new EndpointEvents();

    documentation:EndpointDocumentation[];



    constructor(public endpointCaller: EndpointCaller) {
        EndpointRegistry.register(this);
    }

    public request(method: string, requestData: any = {}) {
        return this.validator
                   .validateRequest(requestData)
                   .catch((err, caught) => this.onValidationFailure('request', err, caught))
                   .concat(this.onRequestValidationSuccess())
                   .concat(
                       this.continueWithRequest(method, requestData)
                           .catch((err, caught) => this.onApiRequestFailure(err, caught))
                   )
                   .map(response => this.onRequestSuccess(response))
                   .map(response => this.transformResponse(response))
                   .flatMap(transformedResponse =>
                       this.validator.validateResponse(transformedResponse)
                           .catch((err, caught) => this.onValidationFailure('response', err, caught))
                   )
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

    private onRequestSuccess(transformed: any) {
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

    private onValidationFailure(location: 'request' | 'response', err: Error, caught) {
        this.events.onValidationFailure.emit({location, content: err});
        this.events.onFailure.emit(err);
        return Observable.throw(err);
    }

    public transformResponse(response) {
        return response;
    }

    getAbsoluteUrl() {
        return (this.customBaseUri.length > 0 ? this.customBaseUri : this.endpointCaller.config.baseUri) + this.path;
    }


}
