import BaseClient from "./BaseClient";

interface UserSentInterface {
    username: string,
    password: string,
    last_name: string,
    first_name: string,
    email: string,
}

export default class UserClient extends BaseClient {
    static async getAll() {
        try {
            let response = await super.get("http://localhost:8000/users")
            return await super.getJsonFromResponse(response)
        } catch (e) {
            console.error(e)
        }
    }

    static async getByUrl(url: string) {
        let response = await super.get(url)
        return await super.getJsonFromResponse(response)
    }

    static async create(user: UserSentInterface) {
        try {
            let response = await super.post("http://localhost:8000/users", JSON.stringify(user))

            return response.ok
        } catch (e){
            console.error(e)

            return false;
        }
    }

    static async deleteUser(userId: number): Promise<boolean> {
        try {
            let response = await super.delete(`http://localhost:8000/users/${userId}`)

            return response.ok
        } catch (e){
            console.error(e)

            return false
        }
    }
}
