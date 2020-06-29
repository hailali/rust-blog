import React, {RefObject} from "react";
import {TextField, TextareaField, Card} from './Bootstrap'
import PostClient from "../client/PostClient.ts";

interface StateInterface {
    postCreatedSuccessfully: boolean
}

export class PostAdd extends React.Component<any, StateInterface> {
    private readonly ref_form: RefObject<any>
    private state: StateInterface

    constructor() {
        super()

        this.ref_form = React.createRef()
        this.state = {
            postCreatedSuccessfully: false
        }
    }

    private handleSubmit(e) {
        e.preventDefault();

        PostClient.create({
            'title': this.ref_form.current['title'].value,
            'body': this.ref_form.current['body'].value,
            'active': true
        }).then((isPostCreated) => {
            if (isPostCreated) {
                this.ref_form.current.reset()
                this.setState({
                    postCreatedSuccessfully: true
                })
            }
        })
    }

    render() {
        const {postCreatedSuccessfully} = this.state

        return (
            <div className="App">
                <Card title="Create post">
                    {postCreatedSuccessfully ? <div className="alert alert-success" role="alert">
                        Post created successfully !
                    </div> : ''}
                    <div className="container">
                        <form ref={this.ref_form} onSubmit={(e) => this.handleSubmit(e)}>
                            <TextField name="title" label="Title"/>
                            <TextareaField name="body" label="Body"/>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </Card>
            </div>
        )
    }
}
