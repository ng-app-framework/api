import {Endpoint} from "./Endpoint";

export class EndpointRegistry {

    static list = [];

    static register(endpoint: Endpoint) {
        this.list.push(endpoint);
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
