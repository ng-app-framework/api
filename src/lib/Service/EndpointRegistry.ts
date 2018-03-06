import {Endpoint} from "./Endpoint";

export class EndpointRegistry {

    static list = {};

    static register(endpoint:Endpoint) {
        if (this.list[endpoint.module] === undefined) {
            this.list[endpoint.module] = [];
        }
        this.list[endpoint.module].push(endpoint);
    }
}
