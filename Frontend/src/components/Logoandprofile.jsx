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
            >
                <div className="h-14 w-14 rounded-full overflow-hidden  
                  flex items-center justify-center cursor-pointer"
                    onClick={() => navigate('/')}>
                    <img src={img} alt="Logo" className="w-full h-full object-cover" />
                </div>

                <div className="h-12 w-15 bg-gray-200 rounded-full flex items-center 
                justify-center cursor-pointer">
                    <div className="profile flex h-10 w-10 text-center justify-center items-center gap-3 cursor-pointer"
                        onClick={() => navigate('/profile')}>

                        {/* //ist char of the name */}
                        <span className="text-gray-700 font-medium text-center">{localStorage.getItem("doctorName")?.charAt(0) || localStorage.getItem("userName")?.charAt(0) || <CiUser className="text-2xl text-gray-700" />}</span>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Logoandprofile
