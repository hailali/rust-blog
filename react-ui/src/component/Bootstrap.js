import React from "react";
import {Link} from "react-router-dom"
import {connect} from "react-redux";
import {USER_LOGOUT_ACTION} from "../redux/actions";
import {userLogOut} from "./UserUtils";

export function Card({title, children}) {
    return (
        <div className="card">
            <div className="card-header">
                {title}
            </div>
            <div className="card-body">{children}</div>
        </div>
    )
}

export function TrashIcon() {
    return (
        <svg className="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor"
             xmlns="http://www.w3.org/2000/svg">
            <path
                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fillRule="evenodd"
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
    )
}

export function PersonCircleIcon() {
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-person-circle" fill="currentColor"
             xmlns="http://www.w3.org/2000/svg">
            <path
                d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z"/>
            <path fillRule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            <path fillRule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"/>
        </svg>
    )
}

export function Field({type, name, label}) {
    return (
        <div className="form-group row">
            <label htmlFor={name} className="col-sm-4 col-form-label">{label}</label>
            <div className="col-sm-8">
                <input type={type} name={name} className="form-control" id={name}/>
            </div>
        </div>
    )
}

export function TextField({name, label}) {
    return <Field type="text" name={name} label={label}/>
}

export function PasswordField({name, label}) {
    return <Field type="password" name={name} label={label}/>
}

export function TextareaField({name, label}) {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <textarea className="form-control" id={name} rows="3"/>
        </div>
    )
}

let NavBar = function ({isUserAuthenticated, onLogout}) {
    console.log("NAV BAR COMPONENT DISPLAYED", isUserAuthenticated, onLogout)

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto order-1">
                    <li className="nav-item active">
                        <Link to="/" className="nav-link">Home <span className="sr-only">(current)</span></Link>
                    </li>
                    <li className="nav-item dropdown">
                        <Link className="nav-link dropdown-toggle" to="/posts" id="navbarDropdown" role="button"
                              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Posts
                        </Link>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Link className="dropdown-item" to="/posts">Posts list</Link>
                            <Link className="dropdown-item" to="/posts/add">Post add</Link>
                        </div>
                    </li>
                    <li className="nav-item">
                        <Link to="/tags" className="nav-link">Tags <span className="sr-only">(current)</span></Link>
                    </li>
                    <li className="nav-item dropdown">
                        <Link className="nav-link dropdown-toggle" to="/users" id="navbarDropdown" role="button"
                              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Users
                        </Link>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Link className="dropdown-item" to="/users">User list</Link>
                            <Link className="dropdown-item" to="/users/add">User add</Link>
                        </div>
                    </li>
                </ul>
                {!isUserAuthenticated ?
                    <ul className="navbar-nav d-none d-lg-flex ml-2 order-2">
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/users/add">Register</Link>
                        </li>
                    </ul>
                    : ''}
                <div className="navbar-nav d-none d-lg-flex ml-2 order-3">
                    {isUserAuthenticated ?
                        <div className="nav-item dropdown">
                            <a className="dropdown-toggle navbar-icon-link" id="userdetails" data-toggle="dropdown"
                               aria-haspopup="true" aria-expanded="true">
                                <PersonCircleIcon/>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userdetails">
                                <a className="dropdown-item" href="#" onClick={() => {
                                    userLogOut();
                                    onLogout();
                                    console.log("On click link")
                                }}>Logout </a>
                            </div>
                        </div>
                        : ''}
                </div>
            </div>
        </nav>
    )
}

const mapStateToProps = (state) => {
    return {
        isUserAuthenticated: state.isUserAuthenticated
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(USER_LOGOUT_ACTION),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NavBar)


