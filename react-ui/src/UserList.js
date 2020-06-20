import React from 'react';
import UserClient from "./client/UserClient";


export default class UserList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            loaded: false
        }
    }

    componentDidMount() {
        UserClient.getAll().then(users => {
            this.setState({
                users: users
            })
        })
    }

    render() {
        let {users, loaded} = this.state;

        return (
            <div>
                <h1>User list</h1>
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First name</th>
                        <th scope="col">Last name</th>
                        <th scope="col">email</th>
                        <th scope="col">username</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => {
                        return (
                            <tr key={user.id}>
                                <th scope="row">{user.id}</th>
                                <td>{user.last_name}</td>
                                <td>{user.first_name}</td>
                                <td>{user.email}</td>
                                <td>{user.username}</td>
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