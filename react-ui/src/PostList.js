import React from 'react';
import PostClient from "./client/PostClient";

export default class PostList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            loaded: false
        }
    }

    componentDidMount() {
        PostClient.getAll().then(posts => {
            this.setState({
                posts: posts
            });
        });
    }

    render() {
        let {posts, loaded} = this.state;

        return (
            <div>
                <h1>Posts list</h1>
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">User</th>
                        <th scope="col">Title</th>
                        <th scope="col">Body</th>
                        <th scope="col">Active</th>
                    </tr>
                    </thead>
                    <tbody>
                    {posts.map(post => {
                        return (
                            <tr key={post.id}>
                                <th scope="row">{post.id}</th>
                                <td>{post.user}</td>
                                <td>{post.title}</td>
                                <td>{post.body}</td>
                                <td>{post.active}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                {loaded ? '<div>Loading....</div>' : ''}
            </div>
        )
    }
}