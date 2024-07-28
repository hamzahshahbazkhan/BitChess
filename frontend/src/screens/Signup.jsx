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
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/");
        }
    }, [navigate]);

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
            const response = await axios.post("http://localhost:3000/signup", {
                username,
                password,
                email,
                name
            });
            localStorage.setItem("token", response.data.token);
            navigate("/");
        } catch (error) {
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
                        <Button onClick={handleSubmit} label="Sign Up" />
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
