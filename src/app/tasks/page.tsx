import DefaultLayout from "@/src/components/Layouts/DefaultLayout";
import AllTasks from "@/src/components/tasksList/AllTasks";

const Tasks = () => {
    return (
        <DefaultLayout>

        <div className="mx-auto max-w-screen-xl">
            <h1 className="text-3xl font-bold">Задачи</h1>
            <div className="mt-5">
                <AllTasks />
            </div>
        </div>
        </DefaultLayout>
    );
};  

export default Tasks;