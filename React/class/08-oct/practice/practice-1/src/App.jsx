import React, { useState } from 'react'
import Form from './components/Form'
import UserCard from './components/UserCard'
import Navbar from './components/Navbar'
const App = () => {
  const [Toggle, setToggle] = useState(true)
  const [UserData, setUserData] = useState([])
  const [EditToggle, setEditToggle] = useState(false)
  const [ID, setID] = useState("")

  function deleteHandler(id){
    let newArr = UserData.filter(val=>val.id!==id)
    setUserData(newArr)
  }

  function editHandler(FormData){
    let index = UserData.findIndex(val=>val.id===ID)
    setUserData(prev=>{
      const updated = [...prev]
      updated[index]= {...updated[index], ...FormData}
      return updated
  })

  }

  console.log(UserData)
  return (
    <div className='bg-slate-950 h-screen'>
      
      <Navbar setToggle={setToggle} />
      {Toggle?<Form setUserData={setUserData} setEditToggle={setEditToggle} EditToggle={EditToggle} editHandler={editHandler}/>:(UserData.map((user)=>(<UserCard user={user} key={user.id} deleteHandler={deleteHandler} setToggle={setToggle} setEditToggle={setEditToggle} setID={setID}/>)))}
      
    </div>
  )
}

export default App