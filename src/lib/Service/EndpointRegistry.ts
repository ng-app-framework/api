import {EventEmitter} from "@angular/core";
import {Endpoint}     from "./Endpoint";

export class EndpointRegistry {

    static list = [];

    static listChange = new EventEmitter<any>();

    static register(endpoint: Endpoint) {
        this.list.push(endpoint);
        this.listChange.emit(this.list);
    }

    getOrganizedList() {
        let modules = {};
        for (let endpoint of EndpointRegistry.list) {
            if (!modules[endpoint.module]) {
                modules[endpoint.module] = [];
            }
            modules[endpoint.module].push(endpoint);
        }
        return modules;
    }
}
