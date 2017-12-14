import {Observable} from "rxjs/Rx";
import {AsynchronousDefinition} from "@ng-app-framework/validation";

export class EndpointValidator {


    constructor(public input?: AsynchronousDefinition,
                public output?: AsynchronousDefinition) {
    }

    validateRequest(request: any) {
        if (this.input) {
            return this.input.validate$(request);
        }
        return new Observable(observer => observer.complete());
    }

    validateResponse(response: any) {
        if (this.output) {
            return this.output.validate$(response).concat(Observable.from([response]));
        }
        return Observable.from([response]);
    }
}
