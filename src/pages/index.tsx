import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { Item } from "@prisma/client";
import { useState } from "react";
import { HiX } from "react-icons/hi";
import Navbar from "./components/Navbar";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';



const Home: NextPage = () => {
  const [input, setInput] = useState<string>('');
  const [items, setItems] = useState<Item[]>([]);
  const [checkedItems, setCheckedItems] = useState<Item[]>([]);
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
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
  const { mutate: updateOrder } = api.item.updateOrder.useMutation({
    onSuccess: (item) => {
      console.log(item);
    },
  });
  const { data: itemsData, isLoading } = api.item.getAllItems.useQuery(undefined, {
    onSuccess: (itemsData) => {
      setItems(itemsData)
      const checked = itemsData.filter((item: { checked: boolean; }) => item.checked === true)
      setCheckedItems(checked)
    },
  });

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setInput('');
  }

  const handleDragEnd = async (event: { active: any; over: any; }) => {
    const { active, over } = event;
    const oldIndex = items.findIndex(({ id }) => id === active.id);
    console.log(active);
    const newIndex = items.findIndex(({ id }) => id === over.id);
    console.log(newIndex);
    
    const newArray = arrayMove(items, oldIndex, newIndex);
    console.log(newArray);
    
    if (active.id !== over.id) {
      
      updateOrder({ array: newArray });
      
      setItems(newArray);
    }

  }
  const SortableItem = (item: { id: any; name: any; }) => {
    const { id, name } = item;
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };


    return (

      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className='flex gap-2 w-full h-12 items-center justify-between border-solid border-2 border-slate-600 text-white text-3xl'>
        <input className="form-checkbox h-4 w-4 m-2" type='checkbox' checked={checkedItems.some((item) => item.id === id)} onChange={() => toggleCheck({ id, checked: !checkedItems.some((item) => item.id === id) })} />
        <span
          style={checkedItems.some((item) => item.id === id) ? { textDecoration: 'line-through' } : {}}

          className='cursor-pointer'
        >
          {name}
        </span>
        <HiX onClick={() => deleteItem({ id })} className='cursor-pointer' />
      </div>

    )
  }


  return (
    <>
      <Head>
        <title>The King's List</title>
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {items.map((item) => {
                  const { id, name } = item
                  return (
                    <SortableItem key={id} item={item} />
                  )
                })}
              </SortableContext>
            </DndContext>
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


