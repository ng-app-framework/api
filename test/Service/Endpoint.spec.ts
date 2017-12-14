import {EndpointCallerShunt} from "../Mock/EndpointCallerShunt";
import {Endpoint} from "../../src/lib/Service";
import {AsynchronousDefinition, ObjectValidator, StringValidator} from "@ng-app-framework/validation";

describe('Endpoint', () => {

    let endpointCaller: EndpointCallerShunt = null;
    let endpoint: Endpoint                  = null;
    let subscriptions                       = {
        onApiSuccess       : null,
        onValidationSuccess: null,
        onApiFailure       : null
    };
    let eventsCalled                        = {
        onApiSuccess       : 0,
        onValidationSuccess: 0,
        onApiFailure       : 0
    };
    beforeEach(() => {
        endpointCaller                    = new EndpointCallerShunt();
        endpointCaller.mockResponse       = {
            ok  : true,
            json: () => {
                return {
                    data: {
                        id: 1
                    }
                };
            }
        };
        endpoint                          = new Endpoint(endpointCaller);
        endpoint.path                     = '/test';
        eventsCalled                      = {
            onApiSuccess       : 0,
            onValidationSuccess: 0,
            onApiFailure       : 0
        };
        subscriptions.onApiSuccess        = endpoint.events.onApiSuccess.first().subscribe(() => eventsCalled.onApiSuccess++);
        subscriptions.onValidationSuccess = endpoint.events.onValidationSuccess.take(2).subscribe(() => eventsCalled.onValidationSuccess++);
        subscriptions.onApiFailure        = endpoint.events.onApiFailure.first().subscribe(() => eventsCalled.onApiFailure++);
    });
    afterEach(() => {
        subscriptions.onApiSuccess.unsubscribe();
        subscriptions.onValidationSuccess.unsubscribe();
        subscriptions.onApiFailure.unsubscribe();
    });
    it('should return an error if an exception is thrown during the request', (done) => {
        try {
            endpoint.validator.input = new AsynchronousDefinition(new ObjectValidator('input', {
                shouldExist: new StringValidator('shouldExist')
            }));
            let observable           = endpoint.request('get', {
                willFail: true
            }).subscribe({
                next : () => {
                    expect('Should have failed').toBeFalsy();
                    done();
                },
                error: (error) => {
                    expect(error).toBeTruthy();
                    done();
                }
            });
        } catch (e) {
            expect('Should not have thrown an exception').toBeFalsy();
            done();
        }
    });
    it('should return an error if an exception is thrown during the response', (done) => {
        try {

            endpoint.validator.output = new AsynchronousDefinition(new ObjectValidator('output', {
                shouldExist: new StringValidator('shouldExist')
            }));
            let observable            = endpoint.request('get').subscribe({
                next : (data) => {
                    expect('Should have failed').toBeFalsy();
                    done();
                },
                error: (error) => {
                    expect(error).toBeTruthy();
                    done();
                }
            });
        } catch (e) {
            expect('Should not have thrown an exception').toBeFalsy();
            done();
        }
    });
    it('should call each event while calling the api', () => {
        endpoint.request('get').subscribe({
            complete: () => {
                expect(eventsCalled.onApiSuccess).toEqual(1);
                expect(eventsCalled.onValidationSuccess).toEqual(2);
                expect(eventsCalled.onApiFailure).toEqual(0);
            }
        })
    });
});
