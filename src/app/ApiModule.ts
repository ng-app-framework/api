import {ModuleWithProviders, NgModule} from '@angular/core';
import {NgValidationModule} from "@ng-app-framework/validation";
import {EndpointCaller, EndpointConfig} from "./Service/Impl/index";
import {Callable, Requestable} from "./Service/Interface/index";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {NgCoreModule} from "@ng-app-framework/core";

@NgModule({
    imports  : [
        NgCoreModule,
        NgValidationModule,
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
export class NgApiModule {
    static forRoot(baseUri: string): ModuleWithProviders {
        return {
            ngModule : NgApiModule,
            providers: [
                {
                    provide : EndpointConfig,
                    useValue: {baseUri: baseUri}
                }
            ]
        };
    }
}

