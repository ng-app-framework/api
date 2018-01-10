import {Observable}          from "rxjs/Rx";
import {EndpointConfig}      from "../../src/lib/Service/Impl/EndpointConfig";
import {EndpointCallerShunt} from "../Mock/EndpointCallerShunt";

describe('EndpointCaller', () => {

    let endpoint: EndpointCallerShunt = null;
    beforeAll(() => {
        endpoint              = new EndpointCallerShunt();
        endpoint.mockResponse = {
            status: 200,
            ok    : true,
            body  : {
                data: {
                    id: 1
                }
            }
        };
    });
    describe('EndpointConfig', () => {
        it('should accept an EndpointConfig object', () => {
            let config = new EndpointConfig();
            expect(() => new EndpointCallerShunt(config)).not.toThrow();
        });

    });
    it('should return an observable when a call is successful', () => {
        let observable = endpoint.call('', 'get');
        expect(observable instanceof Observable).toBeTruthy('return of request was not an Observable');
    });
    it('should contain the last request and last response for debugging purposes', (done) => {
        endpoint.lastRequest  = null;
        endpoint.lastResponse = null;
        endpoint.call('http://frontend.dev/test', 'get', {
            exists: true
        }).subscribe({
            complete: () => {
                expect(endpoint.lastRequest).toBeTruthy();
                expect(endpoint.lastResponse).toBeTruthy();
                done();
            }
        });
    });
    describe('Get Object From Response', () => {
        it('should return an empty object if it is not provided', () => {
            expect(endpoint.tryGettingObjectFromResponse(null)).toEqual({});
        });
    });
});
