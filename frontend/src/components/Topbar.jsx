
import { useNavigate } from 'react-router-dom'

export const Topbar = ({username, rating}) => {
    
    return <>


        <nav className="bg-zinc-800">
            <div className="max-w-screen-sm  flex flex-wrap items-center justify-between  bg-zinc-800  mx-auto p-2">
                <div className='text-2xl font-medium text-amber-50'>{username}</div>
                <div className='text-xl opacity-90 font-medium text-amber-50'>
                    {rating}
                </div>
            </div>
        </nav>


    </>
}