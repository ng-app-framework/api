import {ModuleWithProviders, NgModule} from '@angular/core';
import {ValidationModule} from "@ng-app-framework/validation";
import {EndpointCaller, EndpointConfig} from "./Service/Impl/index";
import {Callable, Requestable} from "./Service/Interface/index";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@NgModule({
    imports  : [
        ValidationModule,
        HttpClientModule
    ],
    exports  : [
        HttpClientModule
    ],
    providers: [
        EndpointCaller,
        EndpointConfig,
        {
            provide    : Callable,
            useExisting: EndpointCaller
        },
        {
            provide    : Requestable,
            useExisting: HttpClient
        }
    ]
})
export class ApiModule {
    static forRoot(baseUri: string): ModuleWithProviders {
        return {
            ngModule : ApiModule,
            providers: [
                {
                    provide : EndpointConfig,
                    useValue: {baseUri: baseUri}
                }
            ]
        };
    }
}

