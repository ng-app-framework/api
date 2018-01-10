import {ModuleWithProviders, NgModule} from '@angular/core';
import {NgValidationModule}            from "@ng-app-framework/validation";
import {HttpClientModule}              from "@angular/common/http";
import {NgCoreModule}                  from "@ng-app-framework/core";
import {HttpProxy}                     from "./Service/HttpProxy";
import {EndpointCaller}                from "./Service/Impl/EndpointCaller";
import {EndpointConfig}                from "./Service/Impl/EndpointConfig";
import {Callable}                      from "./Service/Interface/Callable";
import {Requestable}                   from "./Service/Interface/Requestable";

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

