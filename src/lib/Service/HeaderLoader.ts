import {HttpResponse} from "@angular/common/http";

export class HeaderLoader {

    static headerMap: { [key: string]: string } = {};

    static load(response: HttpResponse<any>) {

        for (let headerConstant of Object.keys(HeaderLoader.headerMap)) {
            response.body.data = response.body.data || {};
            let header         = this.getHeader(response, headerConstant);
            if (header !== null) {
                if (response.body.data[HeaderLoader.headerMap[headerConstant]]) {
                    response.body.data[HeaderLoader.headerMap[headerConstant]] = header || response.body.data[HeaderLoader.headerMap[headerConstant]];
                    continue;
                }
                response.body.data[HeaderLoader.headerMap[headerConstant]] = header;
            }
        }
        return response;
    }

    static getHeader(response, header) {
        return response.headers.get(header.toLowerCase()) || response.headers.get(header.toUpperCase());
    }
}
