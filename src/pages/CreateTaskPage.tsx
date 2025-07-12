import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { createTask } from '../services';
import { useNavigate } from 'react-router';

interface IFormInput {
  title: string;
  start_date: string;
  due_date?: string;
  description?: string;
  status: 'to_do' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee_id?: number;
}

const schema: yup.ObjectSchema<IFormInput> = yup.object({
  title: yup.string().required().min(3).max(100),
  start_date: yup.string().required().matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  due_date: yup.string().optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date')
    .test('due_date-after-start_date', 'Due date must be after start date', function (value) {
      if (!value) return true;
      const { start_date } = this.parent;
      return new Date(value) >= new Date(start_date);
    }),
  description: yup.string().optional().max(500),
  status: yup.mixed<'to_do' | 'in_progress' | 'done'>().required(),
  priority: yup.mixed<'low' | 'medium' | 'high'>().required(),
  assignee_id: yup.number().min(1, 'Assignee ID must be positive'),
});

export default function CreateTaskPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      start_date: '',
      due_date: '',
      description: '',
      status: 'to_do',
      priority: 'medium',
      assignee_id: undefined,
    },
    mode: 'onChange',
  });

  // const onSubmit: SubmitHandler<IFormInput> = async (data) => {
  //   try {
  //     const taskToSubmit = {
  //       ...data,
  //       start_date: new Date(data.start_date),
  //       due_date: data.due_date ? new Date(data.due_date) : undefined,
  //     };

  //   try {
  //     await createTask(data);
  //     navigate('/tasks');
  //   } catch (error) {
  //     console.error('Error creating task:', error);
  //     alert('Failed to create task. Please try again.');
  //   }
  // };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const taskToSubmit = {
        ...data,
        start_date: new Date(data.start_date),
        due_date: data.due_date ? new Date(data.due_date) : undefined,
      };

      await createTask(taskToSubmit);
      navigate('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    }
  };


  return (
    <div className="container mt-5">
      <h3 className="mb-4">Create New Task</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="title" className="form-label">Title</label>
          <input {...register('title')} className={`form-control ${errors.title ? 'is-invalid' : ''}`} />
          {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
        </div>

        <div className="col-md-6">
          <label htmlFor="description" className="form-label">Description</label>
          <input {...register('description')} className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
          {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
        </div>

        <div className="col-md-6">
          <label htmlFor="start_date" className="form-label">Start Date</label>
          <input type="date" {...register('start_date')} className={`form-control ${errors.start_date ? 'is-invalid' : ''}`} />
          {errors.start_date && <div className="invalid-feedback">{errors.start_date.message}</div>}
        </div>

        <div className="col-md-6">
          <label htmlFor="due_date" className="form-label">Due Date</label>
          <input type="date" {...register('due_date')} className={`form-control ${errors.due_date ? 'is-invalid' : ''}`} />
          {errors.due_date && <div className="invalid-feedback">{errors.due_date.message}</div>}
        </div>

        <div className="col-md-6">
          <label htmlFor="status" className="form-label">Status</label>
          <select {...register('status')} className={`form-select ${errors.status ? 'is-invalid' : ''}`}>
            <option value="to_do">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          {errors.status && <div className="invalid-feedback">{errors.status.message}</div>}
        </div>

        <div className="col-md-6">
          <label htmlFor="priority" className="form-label">Priority</label>
          <select {...register('priority')} className={`form-select ${errors.priority ? 'is-invalid' : ''}`}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && <div className="invalid-feedback">{errors.priority.message}</div>}
        </div>

        <div className="col-md-6">
          <label htmlFor="assignee_id" className="form-label">Assignee ID</label>
          <input type="number" {...register('assignee_id')} className={`form-control ${errors.assignee_id ? 'is-invalid' : ''}`} />
          {errors.assignee_id && <div className="invalid-feedback">{errors.assignee_id.message}</div>}
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">Create Task</button>
        </div>
      </form>
    </div>
  );
}
