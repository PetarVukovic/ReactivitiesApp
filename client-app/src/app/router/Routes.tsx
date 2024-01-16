import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import { ActivityDashboard } from "../../features/activities/dashboard/ActivityDashboard";
import { ActivityForm } from "../../features/activities/form/ActivityForm";
import { ActivityDetails } from "../../features/activities/details/ActivityDetails";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,

        children: [
            { path: '', element: <HomePage /> },
            { path: 'activities', element: <ActivityDashboard /> },
            { path: 'activities/:id', element: <ActivityDetails /> },
            { path: 'createActivity', element: <ActivityForm key='create' /> },//key is used to DISTINGUISH between the two routes with same componenets 
            { path: 'manage/:id', element: <ActivityForm key='manage' /> },


        ]
    }
]

export const router = createBrowserRouter(routes);