import React, { Component } from 'react'
import '../assets/login.css'
import Avatar from '../assets/avatar.svg'
import { connect } from 'react-redux'
import { authLogin, authSignup } from '../store/actions/auth'
import Spinner from 'react-bootstrap/Spinner';

export class Login extends Component {

    state = {
        islogin: true,
        login_username: '',
        login_password: '',
        signup_username: '',
        signup_email: '',
        signup_password: ''
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value })

    toggleForm = e => {
        this.setState({ islogin: !this.state.islogin })
    }

    loginSubmit = e => {
        e.preventDefault();
        this.props.authLogin(this.state.login_username, this.state.login_password)
    }

    signupSubmit = e => {
        e.preventDefault();
        this.props.authSignup(this.state.signup_username, this.state.signup_email, this.state.signup_password)
    }

    render() {

        const { error, token, loading } = this.props.loginState

        let errorMsg = null
        if (error) {
            errorMsg = (<p>{error.message}</p>)
        }

        return (
            <div className="outer-login form-group text-center">
                <div className="container col-md-6 col-lg-4 login">
                    <div className="content-section">

                        <div style={{ color: "red" }}>{errorMsg}</div>

                        {
                            loading ?

                                <form onSubmit={this.loginSubmit}>
                                    <fieldset className="form-group">
                                        <img className="form-group text-center" src={Avatar} />
                                        <h5 className=" mb-4 text-center">WELCOME</h5>
                                        <div>
                                            <Spinner animation="border" className="my-5" variant='primary' /> <br />
                                            <a className="mt-5">Loading...</a>
                                        </div>
                                    </fieldset>

                                </form>
                                :

                                <div>
                                    {this.state.islogin ?

                                        <form onSubmit={this.loginSubmit}>
                                            <fieldset className="form-group">
                                                <img className="form-group text-center" src={Avatar} />
                                                <h5 className=" mb-4 text-center">WELCOME</h5>

                                                <div className="input-field ">
                                                    <i className="fa fa-user"></i>
                                                    <input type="text" className="input" name="login_username"
                                                        onChange={this.onChange} value={this.state.login_username} placeholder="username" />
                                                </div>
                                                <div className="input-field ">
                                                    <i className="fa fa-lock"></i>
                                                    <input type="password" className="input" name="login_password"
                                                        onChange={this.onChange} value={this.state.login_password} placeholder="password" />
                                                </div>
                                                <div>
                                                    <a>Dont have an account?</a>
                                                    <div className="btn btn-sm btn-info ml-2" onClick={this.toggleForm}>signup</div>
                                                </div>
                                            </fieldset>
                                            <div className="form-group text-center">
                                                <button className="btn btn-md btn-success px-4" type="submit">Login</button>
                                            </div>
                                        </form>

                                        :

                                        <form onSubmit={this.signupSubmit}>
                                            <fieldset className="form-group">
                                                <img className="form-group text-center" src={Avatar} />
                                                <h5 className=" mb-4 text-center">WELCOME</h5>

                                                <div className="input-field ">
                                                    <i className="fa fa-user"></i>
                                                    <input type="text" className="input" name="signup_username"
                                                        onChange={this.onChange} value={this.state.signup_username} placeholder="username" />
                                                </div>
                                                <div className="input-field ">
                                                    <i className="fa fa-envelope"></i>
                                                    <input type="email" className="input" name="signup_email"
                                                        onChange={this.onChange} value={this.state.signup_email} placeholder="email" />
                                                </div>
                                                <div className="input-field ">
                                                    <i className="fa fa-lock"></i>
                                                    <input type="password" className="input" name="signup_password"
                                                        onChange={this.onChange} value={this.state.signup_password} placeholder="password" />
                                                </div>
                                                <div>
                                                    <a>Have an account?</a>
                                                    <div className="btn btn-sm btn-info ml-2" onClick={this.toggleForm}>login</div>
                                                </div>
                                            </fieldset>
                                            <div className="form-group text-center">
                                                <button className="btn btn-md btn-success px-4" type="submit">signup</button>
                                            </div>

                                        </form>
                                    }
                                </div>

                        }


                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    loginState: state
})

export default connect(mapStateToProps, { authLogin, authSignup })(Login)
