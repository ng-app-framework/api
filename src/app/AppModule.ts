import {NgApiModule}                     from "../lib/NgApiModule";
import {Component, Injectable, NgModule} from "@angular/core";
import {BrowserModule}                   from "@angular/platform-browser";
import {CommonModule}                    from "@angular/common";
import {Endpoint}                        from "../lib/Service/Endpoint";
import {EndpointCaller}                  from "../lib/Service/Impl/EndpointCaller";

@Injectable()
export class TestEndpoint extends Endpoint {

    path = '/test.json';

    constructor(public endpointCaller: EndpointCaller) {
        super(endpointCaller);
    }

    getAbsoluteUrl() {
        return this.path;
    }

}

@Component({
    selector: 'app',
    template: `
        <div>It works!</div>
    `
})
export class AppComponent {

    constructor(endpoint: TestEndpoint) {

        endpoint.request('get').subscribe({
            next    : (response) => console.log(response),
            error   : (err) => console.log(err),
            complete: () => console.log('completed!')
        });

    }
}

@NgModule({
    declarations: [AppComponent],
    imports     : [
        BrowserModule,
        CommonModule,
        NgApiModule.forRoot('/api')
    ],
    exports     : [AppComponent],
    providers   : [TestEndpoint],
    bootstrap   : [AppComponent]

})
export class AppModule {

}
