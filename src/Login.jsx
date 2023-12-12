import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router";

export default function Login() {

    const [loginFormState, setLoginFormState] = useState({});
    const [errorDetailsState, setErrorDetailsState] = useState('');
    const navigate = useNavigate();

    function updateUserNameInState(event) {
        const username = event.target.value;

        const newLoginFormState = {
            password: loginFormState.password,
            username: username,
        }

        setLoginFormState(newLoginFormState)
    }
    
    function updatePasswordInState(event) {
        const password = event.target.value;

        const newLoginFormState = {
            username: loginFormState.username,
            password: password,
        }

        setLoginFormState(newLoginFormState)
    }

    async function submitLogin() {
        try {
            const response = await axios.post('/api/user/login', loginFormState)

            navigate('/')    
        } catch (err) {
            setErrorDetailsState("Issue logging in, please try again :)")
        }


    }

    let errorMessage = null;
    if(errorDetailsState) {
        errorMessage = <div>{errorDetailsState}</div>
    }

    return <div>
        <div>Username:</div>
        <input type='text' onInput={updateUserNameInState} />
        <div>Password:</div>
        <input type='password' onInput={updatePasswordInState} />
        <div>
            <button onClick={submitLogin}>Login</button>
        </div>
        <div>
            {errorMessage}
        </div>

    </div>
}