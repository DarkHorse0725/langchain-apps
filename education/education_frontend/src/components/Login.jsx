import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
    const [userRole, setUserRole] = useState(0);
    const [login, setLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        const loginForm = document.getElementById('loginForm');
        const data = new FormData(loginForm);

        const accurateData = {
            email: data.get('email'),
            password: data.get('password')
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/login`, accurateData);

            if (res.error) {
                toast.error(res.error.data.error);
            } else if (res.status === 200) {
                toast.success('Logged in successfully.');
                navigate('/student');
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                console.error(error);
                toast.error('An unexpected error occurred.');
            }
        }
    }

    const handleSignUp = async (event) => {
        event.preventDefault();

        const signupForm = document.getElementById('signupForm');
        const data = new FormData(signupForm);

        const accurateData = {
            name: data.get('username'),
            email: data.get('email'),
            password: data.get('password'),
            user_role: userRole
        }

        console.log("test = ", accurateData)
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/register`, accurateData);
            console.log(res);

            if (res.error) {
                toast.error(res.error.data.error);
            } else if (res.status === 201) {
                toast.success('Registered successfully.');
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                console.error(error);
                toast.error('An unexpected error occurred.');
            }
        }

    }

    const responseMessage = (response) => {
        console.log(response);
        navigate('/student');
    }

    const errorMessage = (error) => {
        console.log(error);
    }
    useEffect(() => {
        if (login === false) setUserRole(0);
    }, [login])
    return (
        <div className="mx-auto flex min-h-screen w-full items-center bg-indigo-600 justify-center">
            {login ?
                <form id='loginForm' className="flex w-[30rem] flex-col space-y-5 bg-white px-6 py-6 rounded-lg">
                    <div className="text-center text-4xl font-medium">Sign In to Education</div>

                    <input id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" placeholder="Email" />
                    <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" placeholder="Password" />
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={handleLogin}
                    >
                        SIGN IN
                    </button>

                    <a href="#" className="transform text-center font-semibold text-gray-500 duration-300">
                        FORGOT PASSWORD?
                    </a>

                    <p className="text-center text-lg">
                        No account? &nbsp;&nbsp;
                        <a href="#" className="font-medium text-indigo-500 underline-offset-4 hover:underline" onClick={() => setLogin(false)}>
                            Create One
                        </a>
                    </p>

                    <div>
                        <GoogleLogin
                            clientId={GOOGLE_CLIENT_ID}
                            buttonText="Login"
                            onSuccess={responseMessage}
                            onFailure={errorMessage}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>

                </form>
                :
                userRole == 0 ?
                    <div className="w-[30rem] flex flex-col gap-4 bg-white px-6 py-6 rounded-lg">
                        <h1 className="text-xl font-bold text-center">Lets get started</h1>
                        <div className="w-full flex gap-4 justify-between">
                            <div className="w-[14rem] flex flex-col items-center bg-indigo-600 px-6 py-6 rounded-lg cursor-pointer" onClick={() => { setUserRole(1) }}>
                                <img className="w-[80px]" src="img/teacher.png" alt='Teacher Logo' />
                                <p className="text-white">I am a teacher</p>
                            </div>
                            <div className="w-[14rem] flex flex-col items-center bg-indigo-600 px-6 py-6 rounded-lg cursor-pointer" onClick={() => { setUserRole(2) }}>
                                <img className="w-[80px]" src="img/student.png" alt='Student Logo' />
                                <p className="text-white">I am a student</p>
                            </div>
                        </div>
                        <p className="text-center text-sm text-lg">
                            Already have an account? &nbsp;&nbsp;
                            <a href="#" className="font-medium text-indigo-500 underline-offset-4 hover:underline" onClick={() => setLogin(true)}>
                                Log In
                            </a>
                        </p>
                    </div>
                    :
                    <form id='signupForm' className="flex w-[30rem] flex-col space-y-5 bg-white px-6 py-6 rounded-lg">
                        <div className="text-center text-4xl font-medium">Sign Up</div>

                        <input id="username" name="username" type="text" required className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" placeholder="Username" />
                        <input id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" placeholder="Email" />
                        <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" placeholder="Password" />

                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handleSignUp}
                        >
                            SIGN UP
                        </button>

                        <p className="text-center text-sm text-lg">
                            Already have an account? &nbsp;&nbsp;
                            <a href="#" className="font-medium text-indigo-500 underline-offset-4 hover:underline" onClick={() => setLogin(true)}>
                                Log In
                            </a>
                        </p>
                    </form>
            }
            <Toaster />
        </div>
    )
}