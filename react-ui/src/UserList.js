import React from 'react';

export default class UserList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            loaded: false
        }
    }

    componentDidMount() {
        getUsers()
            .then(res => {
                let contentType = res.headers.get("content-type");
                if(res.ok && contentType && contentType.indexOf("application/json") !== -1) {
                    return res.json()
                } else {
                    throw new Error('Error when retrieving the users. The response status code is '+res.status);
                }
            })
            .then(users => {
                this.setState({
                    users: users
                })
            })
            .catch((error) => {
                console.error(error);
            });
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

function getUsers(callback) {
    return fetch("http://localhost:8000/users", {
        method: 'GET',
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Authorization': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    })
}
