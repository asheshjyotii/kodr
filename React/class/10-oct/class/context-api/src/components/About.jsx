import React from 'react'
import { useContext } from 'react'
import { MyStore } from './context/MyContext'

const About = () => {
    let data = useContext(MyStore)
  return (
    <div>
        <p>{data}</p>
    </div>
  )
}

export default About