import {ModuleWithProviders, NgModule} from '@angular/core';
import {NgValidationModule} from "@ng-app-framework/validation";
import {EndpointCaller, EndpointConfig} from "./Service/Impl/index";
import {Callable, Requestable} from "./Service/Interface/index";
import {HttpClientModule} from "@angular/common/http";
import {NgCoreModule} from "@ng-app-framework/core";
import {HttpProxy} from "./Service";

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
        HttpProxy,
        {
            provide    : Callable,
            useExisting: EndpointCaller
        },
        {
            provide    : Requestable,
            useExisting: HttpProxy
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

