import BaseClient from "./BaseClient";

export default class UserClient extends BaseClient {
    constructor() {
        super();
    }

    static async getAll() {
        try {
            let response = await super.get("http://localhost:8000/users")
            return await super.getJsonFromResponse(response)
        } catch (e) {
            console.error(e)
        }
    }

    static async getByUrl(url) {
        let response = await super.get(url)
        return await super.getJsonFromResponse(response)
    }
}
