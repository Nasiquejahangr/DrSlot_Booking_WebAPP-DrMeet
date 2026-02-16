import { CiUser } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import img from '../assets/Logo.svg';

function Logoandprofile() {
    const navigate = useNavigate();

    return (
        <>
            {/* Logo and profile section */}
            <div className="logo flex justify-between items-center h-17 border-b
             border-gray-300 p-6 fixed top-0 left-0 w-full
              bg-white z-50"
                onClick={() => navigate('/')}>
                <div className="h-14 w-14 rounded-full overflow-hidden bg-white shadow-sm border border-gray-200 flex items-center justify-center">
                    <img src={img} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div
                    className='h-9 w-20 flex items-center justify-center cursor-pointer'>

                    <div className='h-11 w-11 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer'
                        onClick={() => navigate('/Profile')}>
                        <CiUser size={24} className="text-gray-700" />

                    </div>

                </div>
            </div>
        </>
    )
}

export default Logoandprofile
