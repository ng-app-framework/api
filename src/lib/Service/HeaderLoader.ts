import {HttpResponse} from "@angular/common/http";

export class HeaderLoader {

    static headerMap: { [key: string]: string } = {};

    static load(response: HttpResponse<any>) {

        for (let headerConstant of Object.keys(HeaderLoader.headerMap)) {
            response.body.data                                         = response.body.data || {};
            response.body.data[HeaderLoader.headerMap[headerConstant]] = this.getHeader(response, headerConstant);
        }
        return response;
    }

    static getHeader(response, header) {
        return response.headers.get(header.toLowerCase()) || response.headers.get(header.toUpperCase()) || false;
    }
}
