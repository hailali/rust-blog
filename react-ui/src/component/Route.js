import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import React from "react";
import Home from "./Home";
import UserList from "./UserList";
import PostList from "./PostList";
import App from "./Login";
import TagList from "./TagList";
import UserAdd from "./UserAdd.tsx";
import {NavBar} from "./Bootstrap";
import {PostAdd} from "./PostAdd.tsx";
import {isUserAuthenticated} from "./UserUtils.ts";

function PrivateRoute({ children, ...rest }) {
    return (
        <Route
            {...rest}
            render={({ location }) =>
                isUserAuthenticated() ? (
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
                <NavBar />
                <hr />
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/users/add">
                        <UserAdd />
                    </Route>
                    <PrivateRoute path="/users">
                        <UserList />
                    </PrivateRoute>
                    <PrivateRoute path="/posts/add">
                        <PostAdd />
                    </PrivateRoute>
                    <PrivateRoute path="/posts">
                        <PostList />
                    </PrivateRoute>
                    <PrivateRoute path="/tags">
                        <TagList />
                    </PrivateRoute>
                    <Route path="/login">
                        <App />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}