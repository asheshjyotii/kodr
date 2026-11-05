import React, { useState } from 'react'
import {nanoid} from 'nanoid'
import Task from './Task'



const App = () => {
  const [Tasks, setTasks] = useState([])


  const addTask=(task)=>{

    let t = {
      id:nanoid(),
      title:task
    }

    let data = JSON.parse(localStorage.getItem("tasks"))
    
    
    data.push(t)

    // console.log((data));
    localStorage.setItem("tasks",JSON.stringify(data))
    setTasks(data)

  }

  const deleteTask = (id)=>{
    let data = JSON.parse(localStorage.getItem("tasks"))
    data = data.filter((item)=>{
      return item.id!=id
    })

    localStorage.setItem("tasks",JSON.stringify(data))
    setTasks(data)
  }

    

  return (
    <main className="container min-h-screen py-20 md:py-20 ">
        <div id="task-list" className="min-h-5 w-2xs max-h-100 overflow-y-auto mx-auto md:w-lg border-2 border-gray-500 ">
        
          <Task arr={JSON.parse(localStorage.getItem("tasks"))} delFunc={deleteTask} />
        </div>
        <form action="" className="w-2xs md:w-lg mx-auto flex justify-between mt-7" onSubmit={
          (e)=>{
            e.preventDefault()
            if(e.target[0].value !==''){
            let task = e.target[0].value

            addTask(task)

            // console.log(e)
            e.target[0].value = ''

          }
        }
        }> 
            <input id="task-input" type="text" className="border-2 border-gray-600 w-60  rounded-md md:w-110 "placeholder="Add tasks"/>
            <button className="bg-emerald-700 rounded-sm w-10 md:w-15 text-gray-200  active:bg-lime-500 active:text-gray-100">Add</button>
        </form>
    </main>
  )
}

export default App