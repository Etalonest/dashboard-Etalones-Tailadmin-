export default function EventsCandidate({ candidate }: { candidate: any }) {
    console.log("EventsCandidate", candidate);
  
    return (
      <div>
        <div className="mt-4">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {candidate?.events?.map((event: any, index: number) => (
              <li key={index} className="flex flex-col gap-2 bg-gray-100 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-semibold text-black dark:text-white">{event?.eventType}</h4>
                  <span className="text-sm text-gray-500">
                    {new Date(event?.createdAt).toLocaleString()}
                  </span>
                </div>
  
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Описание:</strong> {event?.description}
                </p>
  
                {event?.vacancy && (
                  <p className="text-sm text-gray-500 mt-2">
                    <strong>Вакансия:</strong> {event?.vacancy}
                  </p>
                )}
  
                {event?.comment && event?.comment.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    <strong>Комментарий:</strong> {event?.comment}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  