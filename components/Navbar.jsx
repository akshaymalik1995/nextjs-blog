import Link from 'next/link'
import { UserButton } from "@clerk/nextjs";
import { FaPlus, FaLock } from "react-icons/fa"
import { useUser } from '@clerk/nextjs';
export default function Navbar() {
  const { isLoading, isSignedIn, user } = useUser()
  return (
    <div className="navbar container max-w-6xl mx-auto bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link href="/" >Home</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/tags">Tags</Link></li>
            
            {!isLoading && isSignedIn && (
              <>
              <li><Link href="/blog/create"> <FaPlus /> Create</Link></li>
              <li><Link href="/admin"> <FaLock />Admin</Link></li>
              <li className='mx-1'><UserButton afterSignOutUrl="/"/></li>
              </>
              
            )}
            

          </ul>
        </div>
        <Link className="btn btn-ghost normal-case text-xl" href="/">My Blog</Link>
      </div>
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li className='mx-1' ><Link href="/" >Home</Link></li>
          <li className='mx-1'><Link href="/blog">Blog</Link></li>
          <li className='mx-1'><Link href="/tags">Tags</Link></li>
          {!isLoading && isSignedIn && (
              <>
              <li><Link href="/blog/create"> <FaPlus /> Create</Link></li>
              <li><Link href="/admin"> <FaLock />Admin</Link></li>
              <li className='mx-1'><UserButton afterSignOutUrl="/"/></li>
              </>
            )}
          

        </ul>
      </div>
    </div>
  )
}