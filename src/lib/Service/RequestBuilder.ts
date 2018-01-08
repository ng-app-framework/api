import {StringValue, Value} from "@ng-app-framework/core";
import * as qs              from "qs";

export class RequestBuilder {

    static getRequestArgs(method: string, url: string, data: { [key: string]: any }): any {
        if (method === 'get' || method === 'delete') {
            return this.getQueryStringRequest(method, url, data);
        }
        return this.getBodyRequest(method, url, data);
    }

    static getBodyRequest(method: string, url: string, data: { [key: string]: any }) {
        return {
            method: method,
            url   : this.populateValuesInUrl(url, data),
            body  : data
        };
    }

    static getQueryStringRequest(method: string, url: string, data: { [key: string]: any }) {
        let fullUrl = this.populateValuesInUrl(url, data);
        return {
            method: method,
            url   : RequestBuilder.getUrlWithQueryParameters(fullUrl, data)
        };
    }

    static getUrlWithQueryParameters(url: string, data: { [key: string]: any }): string {
        let queryStringData = qs.stringify(data);
        if (queryStringData.length > 0) {
            let delimiter = '?';
            if (url.indexOf('?') !== -1) {
                delimiter = '&';
            }
            return url + delimiter + qs.stringify(data);
        }
        return url;
    }

    static populateValuesInUrl(url: string, data: { [key: string]: any }): string {
        let formatted = url;
        for (let key in data) {
            if (Value.isScalar(data[key])) {
                formatted = StringValue.replace(formatted, `:${key}`, data[key].toString());
            }
        }
        return formatted;
    }
}
