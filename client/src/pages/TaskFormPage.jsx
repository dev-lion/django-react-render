import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import { createTask, deleteTask, updateTask, getTask, getStatusTask } from '../api/tasks.api';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast';
import { CustomButton } from '../components/CustomButton';

export function TaskFormPage() {

  const { register, handleSubmit, formState: {
    errors
  }, setValue } = useForm();

  const navigate = useNavigate()
  const params = useParams()
  console.log(params)

  const [statusTask, setStatusTask] = useState([]);

  const onSubmit = handleSubmit(async (data) => {
    if (params.id) {
      console.log('actualizando')

      await updateTask(params.id, data);
      console.log('nuevo data');
      console.log(data);
      toast.success('Tarea actualizada', {
        position: "bottom-right",
        style: {
          background: "#101010",
          color: "#fff"
        }
      })
    } else {
      console.log(data);
      const res = await createTask(data);
      console.log(res)
      toast.success('Tarea creada', {
        position: "bottom-right",
        style: {
          background: "#101010",
          color: "#fff"
        }
      });

    }
    navigate('/tasks')
  })

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        console.log('obteniendo datos');
        //const resD = await getTask(params.id);
        //console.log(resD);
        //setValue('title', resD.data.title);
        //setValue('description', resD.data.description);
        const {
          data: {
            title, description, status
          } } = await getTask(params.id);




        setValue('title', title);
        setValue('description', description);
        setValue('status', status);
      }
    }
    loadTask();
  }, [])



  useEffect(() => {

    async function loadStatusTask() {
      const res = await getStatusTask();
      console.log("----a----");
      console.log(res);
      setStatusTask(res.data);
    }
    loadStatusTask();
  }, [])

  return (
    <div className='max-w-xl mx-auto'>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="title"
          {...register("title", { required: true })}
          className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
        />
        {errors.title && <span>title field is required</span>}
        <textarea rows="3" placeholder="Description"
          {...register("description", { required: true })}
          className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
        ></textarea>
        {errors.description && <span>description field is required</span>}


        <select
          {...register("status", { required: true })}
          className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
        >
          <option value="">Seleccione un estatus</option>
          {statusTask.map((statusO) => (
            <option key={statusO.id} value={statusO.id}>{statusO.status}</option>
          ))}
        </select>
        {errors.status && <span>status field is required</span>}


        <CustomButton type="submit" className="w-full mt-3">
          Save
        </CustomButton>

        


      </form>
      {params.id && (
        <div className='flex justify-end'>
          <button
            className='bg-red-500 p-3 rounded-lg w-48 mt-3 hover:cursor-pointer'
            onClick={async () => {
              const accepted = window.confirm('are you sure?');
              if (accepted) {
                await deleteTask(params.id);
                toast.success('Tarea eliminada', {
                  position: "bottom-right",
                  style: {
                    background: "#101010",
                    color: "#fff"
                  }
                })
                navigate("/tasks");
              }
            }}>Delete</button>
        </div>
      )}

    </div>
  )
};

