import React from 'react'

const Tasks = ({data,deleteFunc}) => {
    // console.log(data);
    
    let id= data.id;

    let title = data.title;

  return (
    


    <div className='flex justify-between p-2 my-2 bg-gray-100'>
        <p>{title}</p>
        <button className='bg-green-400 rounded-md w-20 active:bg-lime-700 active:text-white' onClick={()=>{deleteFunc(id)}}>done</button>
    </div>

   

  )
}

export default Tasks