

export const Navbar = () => {
    return <>


        <nav className="bg-white border-gray-200 dark:bg-slate-800">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
                <a href="https://chess.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="../public/N1.png" className="h-8" alt="Flowbite Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">StakeMate</span>
                </a>
                <button className='"text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
                    SignIn
                </button>
            </div>
        </nav>


    </>
}