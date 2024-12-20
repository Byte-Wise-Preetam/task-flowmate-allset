import './App.css';
import Layout from './pages/Layout';
import Users from './pages/Users';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TasksLayout from './components/TasksLayout';
import FirstPage from './pages/FirstPage';
import TaskInfo from './components/tasks/TaskInfo';
import HomePage from './pages/HomePage';
import RegisterUser from './components/user/RegisterUser';
import LoginUser from './components/user/LoginUser';
import { Provider } from 'react-redux';
import store from './utils/appStore';
import NotFoundPage from './pages/NotFoundPage';
import { HelmetProvider } from 'react-helmet-async';


function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <FirstPage/>,
      children: [
        {
          path: "",
          element: <HomePage/>
        },
        {
          path: "/register",
          element: <RegisterUser/>,
        },
        {
          path: "/sign-in",
          element: <Provider store={store}><LoginUser/></Provider>
        },
        {
          path: "/dashboard",
          element: <Provider store={store}><Layout/></Provider>,
          children: [
            {
              path: "tasks",
              element: <TasksLayout />,
              children: [
                {
                  path: ":filter",
                  element: <TasksLayout />,
                }
              ]
            },
            {
              path: "task-info/:taskId",
              element: <TaskInfo/>,
              children: []
            },
            {
              path: "team",
              element: <Users/>,
              children: []
            }
          ]
        },
        {
          path: "404",
          element: <NotFoundPage/>
        },
        {
          path: "*",
          element: <NotFoundPage/>
        }
      ]
    }
  ])

  return (
    <>
      <HelmetProvider>
        <RouterProvider router={router}/>
      </HelmetProvider>
    </>
  )
}

export default App;
