import BaseClient from "./BaseClient";

export default class TagClient extends BaseClient {
    static async findAll() {
        let response = await super.get('http://localhost:8000/tags');
        let json = await super.getJsonFromResponse(response);

        return json
    }
}
