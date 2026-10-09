import React from "react";

const UserCard = ({user,deleteHandler, setToggle,setEditToggle, setID}) => {
    // console.log("img url",user.imageUrl)

        return(
        <div className="w-full max-w-sm rounded-2xl bg-slate-900 p-6 text-center shadow-xl" key={user.id}>
      <img
        src={user.imageUrl}
        alt="User"
        className="mx-auto h-24 w-24 rounded-full object-cover"
      />

      <h2 className="mt-4 text-xl font-bold text-white">
        {user.name}
      </h2>

      <p className="mt-1 text-sm text-slate-400">
        {user.email}
      </p>

      <div className="mt-5 flex gap-3">
        <button className="flex-1 rounded-xl bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-500" onClick={()=>{
            setToggle(prev=>!prev)
            setEditToggle(true)
            setID(user.id)
            
        }}>
          Edit
        </button>

        <button className="flex-1 rounded-xl bg-red-600 py-2 font-medium text-white hover:bg-red-500" onClick={()=>{
            deleteHandler(user.id)
        }}>
          Delete
        </button>
      </div>
    </div>
        )

    
    }
export default UserCard;