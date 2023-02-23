import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Task from "./Task"
import TaskForm from "./TaskForm"
import axios from "axios" 
import { URL } from "../App"
import loadingImg from "../assets/loader.gif"
 
const TaskList = () => {

  const [tasks, setTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "", 
    completed: false
  })

  const {name} = formData
  
  const handleInputChange = (e) => {
    const {name, value} = e.target
    setFormData({ ...formData, [name]:value})
  };


  const getTasks = async () => {
    setIsLoading(true)

    try {
      const {data} = await axios.get(`${URL}/api/task`);
      setTasks(data);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false); 
    }
  }

  useEffect(() => {
    getTasks()
  }, [])






  const createTask = async (e) =>{
    e.preventDefault()
    if (name === "") {
      return toast.error("Input Field Can't Be Empty!!!");
    }

    try {
      await axios.post(`${URL}/api/task`, formData)
      toast.success("Task Added Successfully!!!")
      setFormData({...formData, name: ""})
    } catch (error) {
      toast.error(error.message);
    }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/task/${id}`)
      getTasks()
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm name={name} handleInputChange={handleInputChange} createTask={createTask}/>
      <div className="--flex-between --pb">
        <p> <b>Total Task:</b> </p> 0
        <p> <b>Completed Task:</b> </p> 0
      </div>
      <hr />
      {
        isLoading && (
          <div className="--flex-center">
            <img src={loadingImg} alt="Loading..." />
          </div>
        )
      }
      {
        !isLoading && tasks.length === 0 ? (
          <p className="--py">No Task Added.
          Please add a task.</p>
        ) : (
          <>
            {tasks.map((task, index) => {
              return <Task key={task._id} task={task} index={index} deleteTask={deleteTask}/>;
            })}
          </>
        )
      }
    </div>
  );
};

export default TaskList;
