import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react'
import { api } from '~/utils/api';

const Navbar = () => {
  return (
    <div className='fixed backdrop-blur-sm bg-white/75 dark:bg-slate-900/75 z-50 top-0 left-0 right-0 h-20 border-b border-slate-300 dark:border-slate-700 shadow-sm flex items-center justify-between'>
        <div className='container max-w-7xl mx-auto w-full flex justify-between items-center'>
            <img src="https://assets-sports.thescore.com/hockey/team/23/logo.png" 
            alt="LA Kings logo" 
            className='h-20'
            />
            <h1 className='text-white'>The King's List</h1>
            <div className='flex '>
                <button className='rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20 mt-6'>Toggle goes here</button>
                <AuthShowcase />
            </div>

        </div>
    </div>

  )
}

export default Navbar

const AuthShowcase: React.FC = () => {
    const { data: sessionData } = useSession();
  
    const { data: secretMessage } = api.example.getSecretMessage.useQuery(
      undefined, // no input
      { enabled: sessionData?.user !== undefined },
    );
  
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl text-white">
          {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
          {secretMessage && <span> - {secretMessage}</span>}
        </p>
        <button
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </div>
    );
  };
