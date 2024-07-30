import { useState, useEffect } from 'react';
import { Button } from "../components/Button";
import { Heading } from '../components/Heading';
import { SubHeading } from '../components/SubHeading';
import { InputBox } from '../components/InputBox';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/");
        }
    }, [navigate, loading]);

    const validate = () => {
        const errors = {};
        if (!name) errors.name = "Name is required";
        if (!username) errors.username = "Username is required";
        if (!email) errors.email = "Email is required";
        if (!password) errors.password = "Password is required";
        return errors;
    };

    const handleSubmit = async () => {
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("https://bitchess-za11.onrender.com/signup", {
                username,
                password,
                email,
                name
            });
            localStorage.setItem("token", response.data.token);
            navigate("/");
        } catch (error) {
            setLoading(false);
            console.error("Signup error:", error);
        }
    };
    const handleClick = (event) => {
        event.preventDefault();
        navigate('/signin');
    };

    return (
        <div className='flex'>
            <Sidebar />
            <div className='h-screen flex flex-col mb-0 text-amber-50 w-full bg-zinc-800 shadow-inner shadow-zinc-950'>
                <div className='flex w-1/2 ml-56 h-32'>
                    <div className='w-36 h-36'>
                        <img src="/logo.png" alt="" />
                    </div>
                    <div className='flex flex-col'>
                        <Heading label="Welcome to Bit Chess" className='p-2 m-2 text-amber-50 max-w-80 ' />
                        <SubHeading label="Challenge. Think. Win." className='p-2 mb-0 m-2 text-amber-50 max-w-80' />
                    </div>
                </div>

                <div className='flex justify-center items-center'>
                    <div className='flex justify-center items-center w-[70vh] h-[70vh] mr-7 rounded-lg'>
                        <img src="/BOARD.png" alt="BOARD" className='w-full h-full object-cover' />
                    </div>
                    <div className='flex-3 flex-col items-center bg-zinc-800 pb-4 pt-0 p-8 text-amber-50 text-lg font-normal rounded-lg shadow-inner shadow-zinc-950'>
                        <Heading label="Sign Up" />
                        <div className='w-full'>
                            <InputBox
                                label={`Name`}
                                placeholder={`${errors.name ? errors.name : "Enter your name"}`}
                                className={`${errors.name ? "placeholder-red-500" : "placeholder-pink-400"}`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />


                        </div>
                        <div className='w-full'>
                            <InputBox
                                label="Username"
                                placeholder={`${errors.username ? errors.username : "Enter your username"}`}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className='w-full'>
                            <InputBox
                                label="Email"
                                placeholder={`${errors.email ? errors.email : "Enter your email"}`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {/* {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>} */}
                        </div>
                        <div className='w-full'>
                            <InputBox
                                label="Password"
                                placeholder={`${errors.password ? errors.password : "Enter your password"}`}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {/* {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>} */}
                        </div>
                        {loading ?
                            <div role="status" className="flex items-center justify-center">
                                <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-emerald-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span class="sr-only">Loading...</span>
                            </div> :
                            <Button onClick={handleSubmit} label="Sign Up" />
                        }
                        <div className='flex font-normal text-sm'>
                            <div>
                                Already have an account?
                            </div>
                            <a href="/Signin" onClick={handleClick} className='ml-2 text-emerald-400 hover:underline'>Signin</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
