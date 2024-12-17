import TaskCard from "./TaskCard";

function BoardView({ tasks }) {
  return (
    <div className="w-full py-4 grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-4 2xl:gap-10">
      {tasks.map((task, index) => (
        <TaskCard task={task} key={index} />
      ))}
    </div>
  );
}

export default BoardView;
