import { useState } from "react";
import menuImage from "../assets/menu.png";
import { Link } from "react-router";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

function MainHeader() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const logoutHandler = () => {
    logout();
  };

  return (
    <>
      <header className='flex justify-between relative pb-6 p-6 lg:px-32 2xl:px-64 lg:pt-1'>
        <div className='flex items-center'>
          <h1 className='text-3xl text-black font-extrabold mr-8'>BazUuuu</h1>
          <ul className='hidden md:flex text-sm font-bold text-gray-400 space-x-6'>
            <li>
              <a href='#'>Features</a>
            </li>

            <li>
              <a href='#'>Notes</a>
            </li>

            <li>
              <a href='#'>Pricing</a>
            </li>
          </ul>
        </div>
        {user ? (
          <div>
            <button
              onClick={logoutHandler}
              className='main-btn rounded-full cursor-pointer'
            >
              Logout
            </button>
          </div>
        ) : (
          <div className='hidden md:flex items-center space-x-6'>
            <Link to='/login' className='font-bold text-gray-400' href='#'>
              Login
            </Link>
            <Link
              to='/register'
              className='main-btn rounded-full cursor-pointer'
            >
              Sign Up
            </Link>
          </div>
        )}

        <img
          src={menuImage}
          alt='menu icon'
          width={48}
          height={48}
          className='md:hidden cursor-pointer'
          onClick={() => setMobileMenu((prevState) => !prevState)}
        />
      </header>
      {mobileMenu && (
        <div className='absolute ml-6 bg-violet-600 w-[calc(100%-3.5rem)] mx-auto md:hidden rounded-lg text-xl px-8 py-2 text-white z-10'>
          <ul className='flex flex-col items-center my-8 space-y-6'>
            <li>Features</li>
            <li>Notes</li>
            <li>Pricing</li>
          </ul>
          <hr className='border-grayish-violet ' />
          <div className='flex flex-col items-center space-y-6 my-8'>
            {user ? (
              <button
                onClick={logoutHandler}
                className='main-btn w-full text-center !text-xl rounded-full cursor-pointer'
              >
                Logout
              </button>
            ) : (
              <>
                <Link to='/login' className='font-bold' href='#'>
                  Login
                </Link>
                <Link
                  to='/register'
                  className='main-btn w-full text-center !text-xl rounded-full cursor-pointer'
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default MainHeader;
