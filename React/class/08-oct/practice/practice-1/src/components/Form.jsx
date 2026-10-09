import React, { useState } from 'react'
import {nanoid} from 'nanoid'

const Form = ({setUserData, setEditToggle, EditToggle,editHandler}) => {

    const [FormData, setFormData] = useState(   {
        id: "",
        name: "",
        email: "",
        imageUrl: ""
      })

    function handleChange(e){
        let {name,value} = e.target;

        setFormData({...FormData,[name]:value})
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-2">
  <form className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-2xl space-y-6">
    <h1 className="text-3xl font-bold text-white text-center">
      Create Profile
    </h1>

    <input
    name='name'
      type="text"
      placeholder="Name"
      className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
      onChange={(e)=>{
        handleChange(e)
      }}
    />

    <input
    name='email'
      type="email"
      placeholder="Email"
      className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
      onChange={(e)=>{handleChange(e)}}
    />

    <input
    name='imageUrl'
      type="url"
      placeholder="Image URL"
      className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
      onChange={(e)=>{handleChange(e)}}
    />

    <button
      type="submit"
      className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500"
      onClick={(e)=>{
        e.preventDefault()
        EditToggle
        ?(editHandler(FormData),setEditToggle(false))
        :(setUserData(prev=>[...prev,{...FormData,id:nanoid()}]))
        
        
      }}
    >
      Create Profile
    </button>
  </form>
</div>
  )
}

export default Form