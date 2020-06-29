import UserClient from "./UserClient.ts";
import BaseClient from "./BaseClient.ts";

interface PostSentInterface {
    title: string,
    body: string,
    active: boolean
}

export default class PostClient extends BaseClient {

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

    static async delete(postId) {
        try {
            let response = await super.delete(`http://localhost:8000/posts/${postId}`)

            return response.ok
        } catch (e) {
            console.error(e)

            return false
        }
    }

    static async create(post: PostSentInterface): Promise<boolean> {
        try {
            let response = await super.post("http://localhost:8000/posts", JSON.stringify(post))

            return response.ok
        } catch (e) {
            console.error(e)

            return false
        }
    }
}
