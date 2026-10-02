

// Selectors
const form = document.querySelector('form') 
const taskList = document.querySelector('#task-list')




const taskData = []

const createData = (task)=>{
    let data = {
        id: crypto.randomUUID(),
        title: task,
        Completed: false
    }

    return data
}

const getTasks = ()=>{
    let tasks = JSON.parse(localStorage.getItem("tasks"));

    return tasks
}


const addTask = (arr,data)=>{
    arr.push(data)
    return arr
}


const showTask = ()=>{

    let data = getTasks()

    // delete existing elements
    taskList.innerHTML = "";
    
    // insert task  

    // traverse data array
    data.forEach((element, index)=>{

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

        deleteButton.addEventListener('click',()=>{deleteTask(id)})

        div.setAttribute("class","flex justify-between p-2 my-2 bg-gray-100");

        //adding elements to a div
        div.append(task,deleteButton);

        // add as a child

        taskList.append(div)


    })
}


    



// add to local Storage
const addToStorage = (arr)=>{
    // add to storage

    localStorage.setItem("tasks", JSON.stringify(arr))
}

// 3. Delete task
const deleteTask = (id)=>{
    let data = getTasks()

    let index = data.indexOf(data.find((element)=>element.id===id))

    data.splice(index, 1);
    

    addToStorage(data);

    showTask();
}

// 2. Add new taks |  form on click event 

form.addEventListener("submit",(events)=>{

    // get existing task
    let existingData = getTasks();



    // stop the page from reloading
    events.preventDefault()
    
    // fetch data from form
    let data = form[0].value;
    
    if(data === ""){
        return
    }
    
    // convert task to object and add to the array
    data = createData(data)
    data = addTask(existingData,data)

    //add to storage
    addToStorage(data)
    



    // show task
    showTask();

    // empty the input
    form.reset();
})
 
// 1. populate on reload |show task
showTask(getTasks());


// deleteButton.addEventListener("click",(events)=>{

// })


