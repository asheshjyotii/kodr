import React from 'react'
import {useForm} from 'react-hook-form'
const App = () => {
  const {register, handleSubmit, formState:{errors}} = useForm()
  function sub(){
    console.log("form is correct");
    
  }
  return (
    <div>
      <form action="" onSubmit={handleSubmit(sub)}>
        <input type="text" {...register("username",{required:"Please enter your username",minLength:{value:4,message:"minimum lenght of username should be 4 characters"}})} placeholder='username' />
        <p>{errors.username?.message}</p>
        <button>submit</button>
      </form>
    </div>
  )
}

export default App