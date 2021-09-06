import { makeStyles } from '@material-ui/core/styles';
import { TextField, Typography, Button } from '@material-ui/core';
import { signIn } from '../store/reducers/auth';
import LoginForm from './LoginForm';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(2),

        },
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #D5D5D5',
        boxSizing: 'border-box',
        borderRadius: '8px',
        minWidth: '350px',
        height: '400px',
        left: '0px',
        top: '0px',
        alignItems: 'center',
        fontFamily: 'Poppins',
    },
    btn: {
        backgroundColor: '#086972',
        width: '70%',
        marginTop: '35px',
        color: '#E5E5E5',
    },
    margin: {
        margin: '0',
        color: '#086972',
    },
}));


function Auth() {

    const classes = useStyles();

    const handleSubmit =  (event) => {
        event.preventDefault();
        console.log({
            email: event.target.email.value ,
            password: event.target.password.value,
        })
         signIn({
            email: event.target.email.value ,
            password: event.target.password.value,
        })
    }

    return (
        <div className="auth">
            <div className="title-auth-container">
                <div className="title-auth">
                    <h1 className="procad">procad</h1>
                    <p className="subtitle">Sistema de progressão e promoção de carreira acadêmica</p>
                </div>
            </div>
            <LoginForm handleSubmit={handleSubmit}/>
        </div>
    )
}

export default Auth;