import {HttpErrorResponse, HttpResponse} from "@angular/common/http";

export class HeaderLoader {

    static headerMap: { [key: string]: string } = {};

    static load(response: HttpResponse<any>) {

        if (response.body instanceof Object) {
            response.body.data = response.body.data || {};
            for (let headerConstant of Object.keys(HeaderLoader.headerMap)) {
                let header = this.getHeader(response, headerConstant);
                if (header !== null) {
                    if (response.body.data[HeaderLoader.headerMap[headerConstant]]) {
                        response.body.data[HeaderLoader.headerMap[headerConstant]] = header || response.body.data[HeaderLoader.headerMap[headerConstant]];
                        continue;
                    }
                    response.body.data[HeaderLoader.headerMap[headerConstant]] = header;
                }
            }
        }
        return response;
    }

    static loadFromError(response: HttpErrorResponse) {
        if (response.error instanceof Object) {
            response.error.data = response.error.data || {};
            for (let headerConstant of Object.keys(HeaderLoader.headerMap)) {
                let header = this.getHeader(response, headerConstant);
                if (header !== null) {
                    if (response.error.data[HeaderLoader.headerMap[headerConstant]]) {
                        response.error.data[HeaderLoader.headerMap[headerConstant]] = header || response.error.data[HeaderLoader.headerMap[headerConstant]];
                        continue;
                    }
                    response.error.data[HeaderLoader.headerMap[headerConstant]] = header;
                }
            }
        }
        return response;
    }

    static getHeader(response, header) {
        return response.headers.get(header.toLowerCase()) || response.headers.get(header.toUpperCase());
    }
}
