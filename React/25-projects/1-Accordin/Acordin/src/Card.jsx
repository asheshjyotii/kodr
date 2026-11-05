import React, { useEffect, useState } from 'react'
import Details from './Details'


const Card = ({data, globalIsOpen}) => {
  const [isOpen, setisOpen] = useState(false)
  
  useEffect(() => {
    setisOpen(globalIsOpen)
  }, [globalIsOpen])
  
  return (
   
      
      
      <div>
      <div className='w-3xs md:w-100 h-10 md:h-15 bg-lime-200 rounded-t-lg flex justify-between items-center px-2'>
        <p className='ml-5 text-xl font-bold text-shadow-gray-900'>{data.title}</p>
        <i className="ri-arrow-drop-down-line text-5xl" onClick={()=>{
          setisOpen(!isOpen)
        }}></i>
      </div>
      {isOpen && <Details data={data.details}/>}
      </div>
   


  )
}

export default Card