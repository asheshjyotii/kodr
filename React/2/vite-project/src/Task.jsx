import React from 'react'

const Task = ({arr, delFunc}) => {
    if (arr){
  return (
    <>
    {arr.map((obj)=>(
        <div className='flex justify-between p-2 my-2 bg-gray-100' key={obj.id}>
        <p>{obj.title}</p>
        <button className='bg-green-400 rounded-md w-20 active:bg-lime-700 active:text-white' onClick={()=>{delFunc(obj.id)}}>done</button>
    </div>
    ))}
   </>
  )
}
}

export default Task