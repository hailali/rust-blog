import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import {Redirect} from "react-router-dom";
import jwt from 'jwt-decode';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            authenticated: false,
            authenticationError: false
        }
    }

    handleChangeUsername(e) {
        this.setState({username: e.target.value})
    }

    handleChangePassword(e) {
        this.setState({password: e.target.value})
    }

    handleSubmit(e) {
        e.preventDefault()

        const response = fetch("http://localhost:8000/login", {
            method: 'POST',
            mode: "cors",
            cache: "no-cache",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })

        response.then(response => {
            let contentType = response.headers.get("content-type");
            if(response.ok && contentType && contentType.indexOf("application/json") !== -1) {
                return response.json()
            } else {
                throw new Error('Something went wrong');
            }
        })
        .then((json) => {
            let decode = jwt(json.token);
            sessionStorage.setItem("token", json.token)
            sessionStorage.setItem("last_name", decode.last_name)
            sessionStorage.setItem("first_name", decode.first_name)
            sessionStorage.setItem("email", decode.email)
            sessionStorage.setItem("exp", decode.exp)
            this.setState({
                authenticated: true
            })
        }).catch((error) => {
            sessionStorage.removeItem('token');
            this.setState({
                authenticationError: true
            })
        });
    }

    render() {
        const {username, password, authenticated, authenticationError} = this.state

        return (
            <Card title="Login">
                {authenticationError ? <div className="alert alert-dark" role="alert">
                    Invalid username or password
                </div> : ''}
                <div className="container">
                    <form  onSubmit={(e) => this.handleSubmit(e)}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" name="username" value={username} className="form-control" id="username" placeholder="Enter email" onChange={(e) => this.handleChangeUsername(e)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" value={password} className="form-control" id="password" placeholder="Password"  onChange={(e) => this.handleChangePassword(e)}/>
                        </div>

                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
                {authenticated ? <Redirect to='/'/> : ''}
            </Card>
        )
    }
}

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Login />
            </div>
        )
    }
}

function Card(props) {
    const {title, children} = props;

    return (
        <div className="card">
            <div className="card-header">
                {title}
            </div>
            <div className="card-body">{children}</div>
        </div>
    )
}

export default App;
