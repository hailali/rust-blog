import React from "react";
import {Link} from "react-router-dom";

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

export function Field({type, name, label}) {
    return (
        <div className="form-group row">
            <label htmlFor={name} className="col-sm-4 col-form-label">{label}</label>
            <div className="col-sm-8">
                <input type={type} name={name} className="form-control" id={name} />
            </div>
        </div>
    )
}

export function TextField({name, label}) {
    return <Field type="text" name={name} label={label} />
}

export function PasswordField({name, label}) {
    return <Field type="password" name={name} label={label} />
}


export function NavBar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <Link to="/" className="nav-link">Home <span className="sr-only">(current)</span></Link>
                    </li>
                    <li className="nav-item active">
                        <Link to="/posts" className="nav-link">Posts <span className="sr-only">(current)</span></Link>
                    </li>
                    <li className="nav-item active">
                        <Link to="/tags" className="nav-link">Tags <span className="sr-only">(current)</span></Link>
                    </li>
                    <li className="nav-item active">
                        <Link to="/login" className="nav-link">Login <span className="sr-only">(current)</span></Link>
                    </li>
                    <li className="nav-item dropdown">
                        <Link  className="nav-link dropdown-toggle" to="/users" id="navbarDropdown" role="button"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Users
                        </Link> 
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Link className="dropdown-item" to="/user/add">User add</Link>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
