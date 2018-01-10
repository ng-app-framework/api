import {Observable}     from "rxjs/Rx";
import {Injectable}     from "@angular/core";
import {EndpointConfig} from "../Impl/EndpointConfig";
import {HttpResponse}   from "@angular/common/http";

@Injectable()
export abstract class Callable {
    public config: EndpointConfig;

    public abstract call(absoluteUrl: string, method: string, requestData?: any): Observable<HttpResponse<any> | any>;
}
