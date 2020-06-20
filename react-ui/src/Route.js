import {BrowserRouter as Router, Link, Redirect, Route, Switch} from "react-router-dom";
import React from "react";
import Home from "./Home";
import UserList from "./UserList";
import PostList from "./PostList";
import App from "./App";

function PrivateRoute({ children, ...rest }) {
    return (
        <Route
            {...rest}
            render={({ location }) =>
                sessionStorage.getItem('exp') !== null &&
                sessionStorage.getItem('token') !== null &&
                sessionStorage.getItem('exp') > Math.floor(Date.now() / 1000) ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}


export default function AppRouter() {
    return (
        <Router>
            <div>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/users">Users</Link>
                    </li>
                    <li>
                        <Link to="/posts">Posts</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                </ul>

                <hr />
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <PrivateRoute path="/users">
                        <UserList />
                    </PrivateRoute>
                    <PrivateRoute path="/posts">
                        <PostList />
                    </PrivateRoute>
                    <Route path="/login">
                        <App />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}