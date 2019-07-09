import React from 'react'
import { withFirebase } from 'react-redux-firebase'
import { Redirect } from 'react-router-dom'
import {compose} from 'recompose'
import { connect } from 'react-redux'
import { sendSignInSignal } from '../../../redux/actions/authActions'

const INITIAL_STATE = {
    name: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};
class RegisterFormBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.onChange = this.onChange.bind(this);
        this.isInvalid = this.isInvalid.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    render() {
        const {
            name,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;
        const { auth } = this.props;
        if(auth.uid)return <Redirect to='/profile' />;
        return (
            < div class="styled-form register-form" >
                <div class="section-title style-2">
                    <h3>Register Now</h3>
                </div>
                <form onSubmit={this.onSubmit}>
                    <div class="form-group">
                        <span class="adon-icon"><span class="fa fa-user"></span></span>
                        <input type="text" name="name" value={name} onChange={this.onChange} placeholder="Enter Your Name" />
                    </div>
                    <div class="form-group">
                        <span class="adon-icon"><span class="fa fa-envelope-o"></span></span>
                        <input type="email" name="email" value={email} onChange={this.onChange} placeholder="Enter Mail id *" />
                    </div>
                    <div class="form-group">
                        <span class="adon-icon"><span class="fa fa-unlock-alt"></span></span>
                        <input type="password" name="passwordOne" value={passwordOne} onChange={this.onChange} placeholder="Enter your password" />
                    </div>
                    <div class="form-group">
                        <span class="adon-icon"><span class="fa fa-unlock-alt"></span></span>
                        <input type="password" name="passwordTwo" value={passwordTwo} onChange={this.onChange} placeholder="Re-enter your password" />
                    </div>
                    {error && <p style={{ color: "red" }}> {error} </p>}
                    <div class="clearfix">
                        <div class="form-group pull-left">
                            <button type="submit" disabled={this.isInvalid()} class="thm-btn">Register</button>
                        </div>
                    </div>
                </form>
            </div >
        );
    }

    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            error: null
        });
    };

    isInvalid() {
        const { passwordOne, email, name, passwordTwo } = this.state;
        return (passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            name === '');
    }

    onSubmit(event) {
        event.preventDefault();
        const { name, email, passwordOne } = this.state;
        this.props.firebase.auth()
            .createUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                this.props.sendSignInSignal(authUser); //send Sign in signal from the connect to redux
                this.setState({ ...INITIAL_STATE });
            })
            .catch(err => {
                this.setState({ error: err.message });
            });
    };
} 

//makes the register form have firebase and router so it can route the user if the login is successful
const RegisterForm = compose(
    withFirebase,
)(RegisterFormBase);

const mapStoreToProps = (store) => {
    return {
        auth: store.firebase.auth
    }
}
export default  connect(mapStoreToProps, {sendSignInSignal})(RegisterForm);