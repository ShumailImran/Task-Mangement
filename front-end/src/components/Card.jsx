const Card = ({ label, count, bg, icon }) => {
  return (
    <div className="w-full h-32 bg-white dark:bg-[#121212] p-5 shadow-md rounded-md flex items-center justify-between">
      <div className="h-full flex flex-1 flex-col justify-between">
        <p className="text-base text-gray-600 dark:text-gray-300">{label}</p>
        <span className="text-2xl font-semibold dark:text-gray-50">
          {count}
        </span>
        <span className="text-sm text-gray-400 dark:text-gray-100">
          {"110 last month"}
        </span>
      </div>

      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white dark:text-[#121212] ${bg}`}
      >
        {icon}
      </div>
    </div>
  );
};

export default Card;
