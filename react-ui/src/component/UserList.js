import React from 'react';
import UserClient from "../client/UserClient.ts";
import {TrashIcon} from "./Bootstrap";

export default class UserList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            loaded: false,
            deleteUserError: null
        }
    }

    handleDeleteUser(e, userId) {
        e.preventDefault();

        UserClient.deleteUser(userId).then((isUserDeleted) => {
            if (isUserDeleted) {
                this.setState((state) => {
                    let users = state.users.slice()
                    return {
                        users: users.filter(user => user.id !== userId),
                        deleteUserError: null
                    }
                })
            } else {
                this.setState({
                    deleteUserError: `An error occurred while deleting the user with id ${userId}`
                })
            }
        })
    }

    componentDidMount() {
        UserClient.getAll().then(users => {
            this.setState({
                users: users
            })
        })
    }

    render() {
        let {users, loaded, deleteUserError} = this.state;

        return (
            <div>
                <h1>User list</h1>
                {deleteUserError !== null ? <div className="alert alert-dark" role="alert">
                    {deleteUserError}
                </div> : ''}
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First name</th>
                        <th scope="col">Last name</th>
                        <th scope="col">email</th>
                        <th scope="col">username</th>
                        <th scope="col"></th>
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
                                <td>
                                    <a href="#" onClick={(e) => this.handleDeleteUser(e, user.id)}><TrashIcon /></a>
                                </td>
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