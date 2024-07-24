import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

export const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [signedIn, setSignedIn] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {

        if (localStorage.getItem("token")) {
            setSignedIn(true)
        } else {
            setSignedIn(false)
        }
    }, [navigate]);

    const logout = () => {
        localStorage.clear();
        navigate("/signin");
    };

    const signin = () => {
        navigate("/signin");
    }

    const signup = () => {
        navigate("/signup");
    }

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex ">
            <div className={`h-screen ${isCollapsed ? 'w-0' : 'w-48'} bg-zinc-800 text-amber-50 flex flex-col justify-between transition-all duration-300`}>
                <div>
                    <div className='flex flex-row justify-center items-center p-2 pl-0 pr-0'>
                        <div className={`h-20 ${isCollapsed ? 'w-16' : 'w-20'} transition-all duration-300`}>
                            <img src="logo.png" alt="Bit Chess" />
                        </div>
                        {!isCollapsed && <div className=" text-2xl font-bold">Bit Chess</div>}
                    </div>

                    <nav className="flex-grow">
                        <ul>
                            <li>
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        `block px-4 py-2 text-lg hover:bg-emerald-700 ${isActive ? 'bg-zinc-800' : ''}`
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/profile"
                                    className={({ isActive }) =>
                                        `block px-4 py-2 text-lg hover:bg-emerald-600 ${isActive ? 'bg-zinc-800' : ''}`
                                    }
                                >
                                    Profile
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/settings"
                                    className={({ isActive }) =>
                                        `block px-4 py-2 text-lg hover:bg-emerald-600 ${isActive ? 'bg-zinc-800' : ''}`
                                    }
                                >
                                    Settings
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
                {signedIn ?
                    <button onClick={logout} className='text-amber-50 text-lg bg-emerald-600 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 rounded-lg px-5 py-2.5 m-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 focus:outline-none dark:focus:ring-emerald-800'>
                        Log Out
                    </button> :
                    <div className='w-44 P-2'>
                        <button onClick={signin} className='text-amber-50 w-full text-lg bg-emerald-600 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 rounded-lg px-5 py-2.5 m-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 focus:outline-none dark:focus:ring-emerald-800'>
                            Sign In
                        </button>
                        <button onClick={signup} className='text-amber-50 w-full text-lg bg-emerald-600 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 rounded-lg px-5 py-2.5 m-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 focus:outline-none dark:focus:ring-emerald-800'>
                            Sign Up
                        </button>
                    </div>

                }
            
            </div>
            <div className="w-4 bg-zinc-800">
                <button onClick={toggleSidebar} className="text-amber-50 text-l bg-zinc-800 rounded-md">
                    {isCollapsed ? <FaBars /> : <FaTimes />}
                </button>
            </div>
        </div>
    );
};
