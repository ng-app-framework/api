import {EventEmitter} from "@angular/core";

export interface IEndpointEvent {
    status: number;
    body: any;
}

export interface IValidationEvent {
    location: 'request' | 'response';
    content?: any;
}

export class EndpointEvents {

    onApiSuccess        = new EventEmitter<IEndpointEvent>();
    onApiFailure        = new EventEmitter<IEndpointEvent>();
    onValidationSuccess = new EventEmitter<IValidationEvent>();
    onValidationFailure = new EventEmitter<IValidationEvent>();

    onSuccess = new EventEmitter<IEndpointEvent>();
    onFailure = new EventEmitter<any>();

}
