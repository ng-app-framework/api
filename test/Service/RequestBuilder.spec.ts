import {Value}          from "@ng-app-framework/core";
import {RequestBuilder} from "../../src/lib/Service/RequestBuilder";

describe('Request Builder', () => {

    describe('Get Request Args', () => {

        let getRequestArgs = function (method: string) {
            return RequestBuilder.getRequestArgs(method, '/test/url/:bind', {
                bind: 'aha',
                test: 'success'
            });
        };

        function assertShouldHaveBody(method: string) {
            let result = getRequestArgs(method);
            expect(Value.isProvided(result['body'])).toBeTruthy(method);
        }

        function assertShouldNotHaveBody(method: string) {
            let result = getRequestArgs(method);
            expect(Value.isProvided(result['body'])).toBeFalsy(method);
        }

        it('should not have a body property if delete or get', () => {
            assertShouldNotHaveBody('get');
            assertShouldNotHaveBody('delete');
        });

        it('should have a body property if post, put, or patch', () => {
            assertShouldHaveBody('post');
            assertShouldHaveBody('put');
            assertShouldHaveBody('patch');
        });
    });

    describe('Get Non GET Request Args', () => {
        function assertGetNonGetResult(method) {
            expect(RequestBuilder.getBodyRequest(method, '/test/url/:bind', {
                bind: 'aha',
                test: 'success'
            })).toEqual({
                method: method,
                url   : '/test/url/aha',
                body  : {
                    bind: 'aha',
                    test: 'success'
                }
            })
        }

        it('should return a RequestArgs structure with a body', () => {
            assertGetNonGetResult('post');
            assertGetNonGetResult('put');
        })
    });

    describe('Get GET Request Args', () => {
        function assertQueryStringResult(method) {
            expect(RequestBuilder.getQueryStringRequest(method, '/test/url/:bind', {
                bind: 'aha',
                test: 'success'
            })).toEqual({
                method: method,
                url   : '/test/url/aha?bind=aha&test=success'
            });
        }

        it('should return a RequestArgs structure without a body', () => {
            assertQueryStringResult('get');
            assertQueryStringResult('delete');
        });
    });

    describe('Get Url With Query Parameters', () => {
        function assertGetUrlResult(url, data, result) {
            expect(RequestBuilder.getUrlWithQueryParameters(url, data)).toEqual(result);
        }

        it('should add a query string', () => {
            assertGetUrlResult('/test/url', {test: 'success', nested: {field: 'match'}}, '/test/url?test=success&nested%5Bfield%5D=match');
        });
        it('should append a query string', () => {
            assertGetUrlResult('/test/url?already=queryStringed', {test: 'success'}, '/test/url?already=queryStringed&test=success');
        });
    });

    describe('Populate Values In Url', () => {

        function assertPopulateResult(url, data, result) {
            expect(RequestBuilder.populateValuesInUrl(url, data)).toEqual(result);
        }

        it('should swap placeholder text with properties of the data provided', () => {
            assertPopulateResult('/test/me/:value', {value: 'word'}, '/test/me/word');
        });
        it('should replace all instances of the text', () => {
            assertPopulateResult('/test/:me/again/:me', {me: 'word'}, '/test/word/again/word');
        });
        it('should not add a non-scalar value to a url', () => {
            assertPopulateResult('/test/:me', {me: {should: 'not be added'}}, '/test/:me');
        });
    });
});
