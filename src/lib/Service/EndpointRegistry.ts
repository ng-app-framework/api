import {Endpoint} from "./Endpoint";

export class EndpointRegistry {

    static list = [];

    static register(endpoint:Endpoint) {
        this.list.push(endpoint);
    }
}
