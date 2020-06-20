import UserClient from "./UserClient";
import BaseClient from "./BaseClient";

export default class PostClient extends BaseClient {
    constructor() {
        super();
    }

    static async getAll() {
        try {
            let response = await super.get("http://localhost:8000/posts")

            let posts = await super.getJsonFromResponse(response);

            let promises = posts.map(async post => {
                let user = await UserClient.getByUrl(post.user);
                return {...post, 'user': `${user.first_name} ${user.last_name}` }
            });

            // return all posts with user information
            return await Promise.all(promises);
        } catch (e) {
            console.error(e)
        }
    }
}
