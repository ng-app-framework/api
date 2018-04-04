import {HttpErrorResponse, HttpResponse} from "@angular/common/http";

export class HeaderLoader {

    static headerMap: { [key: string]: string } = {};

    static load(response: HttpResponse<any> | HttpErrorResponse) {

        for (let headerConstant of Object.keys(HeaderLoader.headerMap)) {
            let body   = response['body'] || response['error'];
            body.data  = body.data || {};
            let header = this.getHeader(response, headerConstant);
            if (header !== null) {
                if (body.data[HeaderLoader.headerMap[headerConstant]]) {
                    body.data[HeaderLoader.headerMap[headerConstant]] = header || body.data[HeaderLoader.headerMap[headerConstant]];
                    continue;
                }
                body.data[HeaderLoader.headerMap[headerConstant]] = header;
            }
        }
        return response;
    }

    static getHeader(response, header) {
        return response.headers.get(header.toLowerCase()) || response.headers.get(header.toUpperCase());
    }
}
