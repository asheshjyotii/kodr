import React, { useState } from 'react'

import Card from './Card'

import data from './data'

const App = () => {

  const [globalIsOpen, setglobalIsOpen] = useState(false)


  return (
    // <main className='flex flex-col justify-center items-center p-40 bg-slate-950 h-screen gap-8'>
    //   <div className='flex gap-20'>
    //     <button className='bg-slate-200 px-3 py-1 rounded-xl active:bg-slate-300 active:text-shadow-slate-950' onClick={()=>{
    //       setCard1(true)
    //       setCard2(true)
    //       setCard3(true)
    //     }}>open all</button>
    //     <button className='bg-slate-200 px-3 py-1 rounded-xl active:bg-slate-300 active:text-shadow-slate-950' onClick={()=>{
    //       setCard1(false)
    //       setCard2(false)
    //       setCard3(false)
    //     }}>close all</button>
    //   </div>
      
    //   <div>
    //   <div className='w-3xs md:w-100 h-10 md:h-15 bg-lime-200 rounded-t-lg flex justify-between items-center px-2'>
    //     <p className='ml-5 text-xl font-bold text-shadow-gray-900'>Who are you?</p>
    //     <i className="ri-arrow-drop-down-line text-5xl" onClick={()=>{
    //       setCard1(!Card1)
    //     }}></i>
    //   </div>
    //   {Card1 && <Card data={"Find out who you are."}/>}
    //   </div>
      

    //   <div>
    //   <div className='w-3xs md:w-100 h-10 md:h-15 bg-lime-200 rounded-t-lg flex justify-between items-center px-2'>
    //     <p className='ml-5 text-xl font-bold text-shadow-gray-900'>Wat's your goal?</p>
    //     <i className="ri-arrow-drop-down-line text-5xl" onClick={()=>{
    //       setCard2(!Card2)
    //     }}></i>
    //   </div>
    //   {Card2 && <Card data={"A man without goal is already dead."}/>}
    //   </div>

    //   <div>
    //   <div className='w-3xs md:w-100 h-10 md:h-15 bg-lime-200 rounded-t-lg flex justify-between items-center px-2'>
    //     <p className='ml-5 text-xl font-bold text-shadow-gray-900'>How hungry are you?</p>
    //     <i className="ri-arrow-drop-down-line text-5xl" onClick={()=>{
    //       setCard3(!Card3)
    //     }}></i>
    //   </div>
    //   {Card3 && <Card data={"Without hunger success is just another option u will fail to choose..."}/>}
    //   </div>
   
    // </main>

    <main className='flex flex-col justify-center items-center p-40 bg-slate-950 h-screen gap-8'>

      <div className='flex gap-20'>
        <button className='bg-slate-200 px-3 py-1 rounded-xl active:bg-slate-300 active:text-shadow-slate-950' onClick={()=>{
          setglobalIsOpen(true)
        }}>open all</button>
        <button className='bg-slate-200 px-3 py-1 rounded-xl active:bg-slate-300 active:text-shadow-slate-950' onClick={()=>{
          setglobalIsOpen(false)
        }}>close all</button>
      </div>

        {data && data.length > 0? (

         data.map((obj)=>{
          return <Card data={obj} globalIsOpen={globalIsOpen} key={obj.id} />
         })

    )  : null}
    </main>
  )
}

export default App