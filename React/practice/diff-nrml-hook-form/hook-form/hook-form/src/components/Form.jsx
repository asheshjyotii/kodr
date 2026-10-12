import React from 'react'
import {useForm, ErrorMessage} from 'react-hook-form'

const Form = () => {

    function submit(data){
        console.log(data)
    }

    const {register, handleSubmit, formState:{errors}, control} = useForm()
  return (
    <div>
        <form action="" onSubmit={handleSubmit(submit)} >
            <input {...register("name",{required:"Mandatory field"})} type="text" placeholder='name'/>
            <input {...register("email",{required:"Mandatory field"})} type="email" placeholder='email'/>
            <input {...register("password",{required:"Mandatory field", minLength:{value:8,message:"Min length should be 8"}})} type="password" placeholder='password'/>
            <ErrorMessagex
        control={control}
        name="password"
        render={({ message }) => <p>{message}</p>}
      />
            <button>submit</button>
        </form>
    </div>
  )
}

export default Form