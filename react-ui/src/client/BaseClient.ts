import {getUserToken} from "../component/UserUtils";

const userToken = getUserToken();

export default class BaseClient {
    static async get(url: string): Promise<Response> {
        return await fetch(url, {
            method: 'GET',
            mode: "cors",
            cache: "no-cache",
            headers: {
                'Authorization': userToken,
                'Content-Type': 'application/json'
            }
        })
    }

    static async post(url: string, data: string): Promise<Response> {
        return await fetch(url, {
            method: 'POST',
            mode: "cors",
            cache: "no-cache",
            headers: {
                'Authorization': userToken,
                'Content-Type': 'application/json'
            },
            body: data
        })
    }

    static async delete(url: string): Promise<Response> {
        return await fetch(url, {
            method: 'DELETE',
            mode: "cors",
            cache: "no-cache",
            headers: {
                'Authorization': userToken,
            }
        })
    }

    static async getJsonFromResponse(response: Response) {
        let contentType = response.headers.get("content-type");
        if (response.ok && contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
        } else {
            throw new Error('Error when retrieving json from request. The response status code is ' + response.status);
        }
    }
}
