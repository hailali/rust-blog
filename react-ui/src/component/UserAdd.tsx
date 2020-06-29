import React, {RefObject} from "react";
import {Card, TextField, PasswordField} from "./Bootstrap"
import UserClient from "../client/UserClient.ts";

interface StateInterface {
    userCreatedSuccessfully: boolean
}

export default class UserAdd extends React.Component<any, StateInterface> {
    ref_form: RefObject<string> = React.createRef();

    state: StateInterface = {
        userCreatedSuccessfully: false
    }

    private handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        let [username, password, last_name, first_name, email] = this.ref_form.getElementsByTagName("input");

        UserClient.create({
            username: username.value,
            password: password.value,
            last_name: last_name.value,
            first_name: first_name.value,
            email: email.value,
        }).then((userCreated) => {
            if (userCreated) {
                this.ref_form.reset()
                this.setState({
                    userCreatedSuccessfully: true
                })
            }
        })
    }


    render() {
        const {userCreatedSuccessfully} = this.state
        return (
            <div className="App">
                <Card title="Create user">
                    {userCreatedSuccessfully ? <div className="alert alert-success" role="alert">
                        User created successfully !
                    </div> : ''}
                    <div className="container">
                        <form ref={(ref) => this.ref_form = ref} onSubmit={(e) => this.handleSubmit(e)}>
                            <TextField name="username" label="Username"/>
                            <PasswordField name="password" label="Password"/>
                            <TextField name="last_name" label="Last name"/>
                            <TextField name="first_name" label="First name"/>
                            <TextField name="email" label="Email"/>

                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </Card>
            </div>
        )
    }
}
