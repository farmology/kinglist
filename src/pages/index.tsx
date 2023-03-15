import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { Item } from "@prisma/client";
import { useState } from "react";
import { HiX } from "react-icons/hi";
import Navbar from "./components/Navbar";


const Home: NextPage = () => {
  const [input, setInput] = useState<string>('');
  const [items, setItems] = useState<Item[]>([]); 
  const [checkedItems, setCheckedItems] = useState<Item[]>([]);
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { mutate: addItem } = api.item.addItem.useMutation({
    onSuccess: (item) => {
      setItems((prev) => [...prev, item])
    },
  });
  const { mutate: deleteItem } = api.item.deleteItem.useMutation({
    onSuccess: (shoppingItem) => {
      setItems((prev) => prev.filter((item) => item.id !== shoppingItem.id))
    },
  });
  const { mutate: deleteAllItems } = api.item.deleteAllItems.useMutation({
    onSuccess: (items) => {
      setItems([])
      setCheckedItems([])
    },
  });
  const { mutate: toggleCheck } = api.item.toggleCheck.useMutation({
    onSuccess: (shoppingItem) => {
      if (checkedItems.some((item) => item.id === shoppingItem.id)) {
        setCheckedItems((prev) => prev.filter((item) => item.id !== shoppingItem.id))
      } else {
        setCheckedItems((prev) => [...prev, shoppingItem])
      }
    },
  });
  const { data: itemsData, isLoading } = api.item.getAllItems.useQuery(undefined, {
    onSuccess: (itemsData) => {
      setItems(itemsData)
      const checked = itemsData.filter((item: { checked: boolean; }) => item.checked === true)
      setCheckedItems(checked)
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setInput('');
  }

  return (
    <>
      <Head>
        <title>King List</title>
        <meta name="description" content="A robust fully featured to-do made using t3 stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">The King's List</span>
          </h1>
          
          <form onSubmit={handleSubmit}>
            <input type='text' value={input} onChange={(e) => setInput(e.target.value)} />
            <button  
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" 
              onClick={() => addItem({ name: input })}>
                Add item</button>
          </form>
          
          <div className="flex flex-col items-center gap-2">
          <ul className="text-white text-3xl">
              {items.map((item) => {
                const { id, name, checked } = item
                return (
                <li key={id} className='flex items-center justify-between'>
                    <span 
                      style={checkedItems.some((item) => item.id === id) ? {textDecoration: 'line-through'} : {}}
                      onClick={() => toggleCheck({id, checked: !checkedItems.some((item) => item.id === id)})} 
                      className='cursor-pointer'
                    >
                      {name}
                    </span>
                    <HiX onClick={() => deleteItem({id})} className='cursor-pointer'/>
                </li>
                )
              })}
            </ul>
            <button  
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20 mt-6" 
              onClick={() => deleteAllItems()}>
                Clear All
            </button>
            
            
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;


