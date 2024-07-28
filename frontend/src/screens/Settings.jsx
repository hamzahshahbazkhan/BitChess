import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Sidebar } from '../components/Sidebar';
import { Heading } from '../components/Heading';
import { Button } from '../components/Button.jsx';

export const Settings = () => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // To display error messages

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/signin");
        } else {
            getUserData();
        }
    }, [navigate]);

    const update = async () => {
        if (!password) {
            setError("Password is required.");
            return; // Prevent form submission if password is empty
        }

        try {
            const response = await axios.put("http://bit-chess-api.vercel.app/updateInfo", {
                username,
                password,
                email,
                name
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            //console.log(response);
            setError(""); // Clear error on successful update
            // Optionally handle success feedback to the user here

        } catch (error) {
            console.error("Update error:", error);
            // Optionally handle error feedback to the user here
        }
    };

    const getUserData = async () => {
        try {
            const response = await axios.get('http://bit-chess-api.vercel.app/userinfo', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const { username, name, email } = response.data.data;

            setUsername(username);
            setEmail(email);
            setName(name);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    return (
        <div className='flex max-h-screen'>
            <Sidebar />
            <div className='flex flex-col max-h-screen bg-zinc-800 shadow-inner shadow-zinc-900 w-screen'>
                <div className='flex flex-grow'>
                    <div className='flex justify-center items-center flex-grow gap-5 p-8'>
                        <div className='flex flex-col justify-center items-center w-2/5 bg-transparent text-amber-50 rounded-lg'>
                            <div className='flex flex-col justify-center items-center text-lg bg-transparent text-amber-50 rounded-lg p-6'>
                                <div className='p-4 rounded-lg shadow-inner shadow-zinc-950'>
                                    <Heading label="Edit Info" className='text-2xl font-semibold mb-4' />
                                    {error && <p className='text-red-500'>{error}</p>} {/* Display error message */}
                                    <div className='space-y-2'>
                                        <div className='flex'>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>Username</div>
                                            <p className='text-lg w-64 shadow-inner bg-zinc-800 shadow-zinc-900 p-2'>{username}</p>
                                        </div>
                                        <div className='flex'>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>Email</div>
                                            <input
                                                className='text-lg w-64 shadow-inner bg-zinc-800 shadow-zinc-900 p-2'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className='flex'>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>Name</div>
                                            <input
                                                className='text-lg w-64 shadow-inner bg-zinc-800 shadow-zinc-900 p-2'
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className='flex'>
                                            <div className='text-lg w-48 shadow-inner shadow-zinc-900 p-2'>Password</div>
                                            <input
                                                type="password"
                                                className='text-lg w-64 shadow-inner bg-zinc-800 shadow-zinc-900 p-2'
                                                placeholder='Enter new password'
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className='flex'>
                                            <Button
                                                label={"Save Changes"}
                                                onClick={update}
                                                disabled={!password} // Disable button if password is empty
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='flex-3 justify-center items-center bg-slate-700 rounded-lg'>
                                <div className='max-w-lg mt-16'>
                                    <img src="/BOARD.png" alt="BOARD" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
