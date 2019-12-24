'use strict';
export const Response = class Response {
    constructor(success, data) {
        this.success = success;
        this.data = data;
    }
}