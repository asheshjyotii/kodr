import React from 'react'
import { useState } from 'react'
import {nanoid} from 'nanoid'
import Tasks from './tasks'

const App = () => {
  const [Task, setTask] = useState([])

  const createTask = (title)=>{
    let data = {
      id: nanoid(),
      title: title
    }

    return data
  }

  const deleteTask = (id)=>{

    const newTask = Task.filter((obj)=>{
      return obj.id!=id
    })
    setTask(
      newTask
    )

  }
  return (
    <main className="container min-h-screen py-20 md:py-20 ">
        <div id="task-list" className="min-h-5 w-2xs max-h-100 overflow-y-auto mx-auto md:w-lg border-2 border-gray-500 ">
          
          {Task.map((obj)=>(
            <Tasks data = {obj} key={obj.id} deleteFunc={deleteTask} />
          ))}

        </div>
        <form 
          onSubmit={(e)=>{
            e.preventDefault();
            
            let task = createTask(e.target[0].value);

            setTask([...Task, task])

          }}

          action="" className="w-2xs md:w-lg mx-auto flex justify-between mt-7"> 
            <input
             id="task-input" type="text" className="border-2 border-gray-600 w-60  rounded-md md:w-110 "placeholder="Add tasks"/>

            <button 
            type='submit'
            className="bg-emerald-700 rounded-sm w-10 md:w-15 text-gray-200  active:bg-lime-500 active:text-gray-100">Add</button>
        </form>
    </main>
  )
}

export default App