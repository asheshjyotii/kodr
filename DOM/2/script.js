// selectors
const form = document.querySelector('form')
const bttn = document.querySelector('button')
const taskContainer = document.querySelector('#task-list')


// variables
const temp = []

// uitility function

// get data

const getData = ()=>{
    let data = localStorage.getItem("tasks") // if empty can return null
    
    if (data===null){
        return [] //return empty array
        
    }
    else{
        // console.log("run")
        return JSON.parse(data)
    }
     
}

// set data
const setData = (arr)=>{
    localStorage.setItem("tasks",JSON.stringify(arr)) // overwrites existing data, takes only string

}





// core functions

// data creation

const createTask = (title)=>{
    return {
        id: crypto.randomUUID(),
        title: title
    }
}

// append data
const appendData = (obj)=>{
    let data = getData() // get existing data 
    // console.log(data)
    data.push(obj) //pushing into the data

    return data // new modified data
}
// render data

const renderData = ()=>{
    // basically we need to traverse the array and render elements for each of the items

    //first clear the existing screen
    taskContainer.innerHTML=""

    // fetch data
    let arr = getData()
    console.log(arr)

    // now render the array
    arr.forEach((element, index)=>{

        // elements created
        const div = document.createElement('div')
        const task = document.createElement('p')
        const deleteButton = document.createElement('button')


        let val = element.title
        let id = element.id
        
        // adding attr to the element
        task.textContent=val;
        deleteButton.textContent="done";

        deleteButton.setAttribute("class","bg-green-400 rounded-md w-20 active:bg-lime-700 active:text-white");

        deleteButton.setAttribute("id",id);
        // console.log(deleteButton)

        deleteButton.addEventListener('click',()=>{deleteTask(id)}) // event listener to the done button already added

        div.setAttribute("class","flex justify-between p-2 my-2 bg-gray-100");

        //adding elements to a div
        div.append(task,deleteButton);

        // add as a child

        taskContainer.append(div)


    })
}

// delete data 

const deleteTask = (id)=>{

    // fetch the data from store
    let arr = getData()
   
    let index = arr.findIndex(element => element.id === id)
    // console.log(index)

    arr.splice(index,1)

    // update the data
    setData(arr)
    renderData()

}

// task add event
bttn.addEventListener('click',(events)=>{
    events.preventDefault() // stops from page reload after form submit

    // i need to fetch the value from input 
    let task = form[0].value  // this gives the first elements input field

    
    // creating the data
    task = createTask(task)
    

    //append data
    let data = appendData(task)
    // console.log(data)

    // set the data, actually render data should render form the storage itself.
    setData(data) // finally!!! Bugs!

    // render the elements
    renderData()
    // console.log(bttn) //id is missing

    


})
// setData() //the issue!
renderData()