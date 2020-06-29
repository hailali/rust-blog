import BaseClient from "./BaseClient.ts";
import jwt from "jwt-decode";

export default class LoginClient extends BaseClient {
    static async login(data) {
        try {
            let response = await super.post('http://localhost:8000/login', data);
            let json = await super.getJsonFromResponse(response);

            let decode = jwt(json.token);
            sessionStorage.setItem("token", json.token)
            sessionStorage.setItem("last_name", decode.last_name)
            sessionStorage.setItem("first_name", decode.first_name)
            sessionStorage.setItem("email", decode.email)
            sessionStorage.setItem("exp", decode.exp)

            return true
        }
        catch (e) {
            return false
        }
    }
}
