import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import BasicNav from "./components/BasicNav/BasicNav";
// import { response } from "express";

export default function Login() {

    const [loginFormState, setLoginFormState] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    function updateUserNameInState(event) {
        setLoginFormState(prevState => ({
            ...prevState,
            username: event.target.value
        }));
    }
    
    function updatePasswordInState(event) {
        setLoginFormState(prevState => ({
            ...prevState,
            password: event.target.value
        }));
    }

    async function submitLogin() {
        try {
            setErrorMessage('');
            const response = await axios.post('/api/user/login', loginFormState)
            navigate('/')    
        } catch (err) {
            if (err.response && err.response.status === 404 ) {
                console.log(err.response.data)
                setErrorMessage(err.response.data);
            }else {
                setErrorMessage("Issue logging in, please try again :)");
            }
        }
    }

    async function submitSignUp() {
        try {
            setErrorMessage('');
            const response = await axios.post('/api/user/signup', loginFormState)
            navigate('/')    
        } catch (err) {
            setErrorMessage(err.response.data);
        }
    }


    return (
        <div>
        <BasicNav/>
        <div>Username:</div>
        <input type='text' onInput={updateUserNameInState} />
        <div>Password:</div>
        <input type='password' onInput={updatePasswordInState} />
        <Stack direction="row" margin={3} spacing={2}>
            <Button variant="contained" onClick={submitLogin}> Login
            </Button>
            <Button variant="contained" onClick={submitSignUp}> Sign up
            </Button>
        </Stack>
        <div> {errorMessage && <div style={{ color: 'blue' }}>{errorMessage}</div>}
         </div>
    </div>
    )}

        {/* <div>
            <button onClick={submitLogin}>Login</button>
            <button onClick={submitLogin}>Sign Up</button>
        </div> */}
    // function updateUserNameInState(event) {
    //     const username = event.target.value;

    //     const newLoginFormState = {
    //         password: loginFormState.password,
    //         username: username,
    //     }

    //     setLoginFormState(newLoginFormState)
    // }
    
    // function updatePasswordInState(event) {
    //     const password = event.target.value;

    //     const newLoginFormState = {
    //         username: loginFormState.username,
    //         password: password,
    //     }

    //     setLoginFormState(newLoginFormState)
    // }
