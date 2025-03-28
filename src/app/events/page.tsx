import EventsList from "@/src/components/EventsList/EventsList";
import DefaultLayout from "@/src/components/Layouts/DefaultLayout";

const Events = () => {
    
    return (
        <>
        <div className="mx-auto max-w-screen-xl">
            <h1 className="text-3xl font-bold">Последние события</h1>
            <div className="mt-5">
                <EventsList />
            </div>
        </div>
        </>
    );
};

export default Events;