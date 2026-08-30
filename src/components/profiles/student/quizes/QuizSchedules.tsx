import { Clock, Table, User } from 'lucide-react';

import { useState } from 'react';

import { useNavigate } from 'react-router-dom'; // Import useNavigate



const days = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'];



const schedule = [

  { day: 'Fri', subject: 'English', teacher: 'Mr / John', time: '8:00 PM', date: '15/6', button: 'View Quiz' },

  { day: 'Sat', subject: 'English', teacher: 'Mr / John', time: '8:00 PM', date: '18/6', button: 'Join Now' },

  { day: 'Sun', subject: 'English', teacher: 'Mr / John', time: '8:00 PM', date: '19/6', button: 'Join Now' },

  { day: 'Mon', subject: 'English', teacher: 'Mr / John', time: '8:00 PM', date: '20/6', button: 'Join Now' },

  { day: 'Tue', subject: 'English', teacher: 'Mr / John', time: '8:00 PM', date: '21/6', button: 'Join Now' },

  { day: 'Wed', subject: 'English', teacher: 'Mr / John', time: '8:00 PM', date: '22/6', button: 'Join Now' },

  { day: 'Thu', subject: 'English', teacher: 'Mr / John', time: '8:00 PM', date: '23/6', button: 'Join Now' },

];



const ExamSchedules = () => {

  const [selectedDay, setSelectedDay] = useState(null);

  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate



  const handleDaySelect = (day:any) => {

    setSelectedDay(day);

    setShowDropdown(false);

  };



  const handleButtonClick = (buttonType:string) => {

    if (buttonType === 'View Quiz') {

      navigate('/view-quiz'); // Navigate to /view-quiz route

    }

    // You can add more conditions here for other button types if needed

  };



  const filteredSchedule = selectedDay

    ? schedule.filter((item) => item.day === selectedDay)

    : schedule;



  return (

    <div className="p-6 bg-white rounded-md pb-10">

      <div className="w-full flex justify-end mb-5">

        <input

          type="search"

          className="border border-main rounded-md p-2 w-[100%] md:w-[50%] focus:outline-none"

          placeholder="🔍 Search"

        />

      </div>

      <div className="bg-[#194D80] ps-2 rounded-md md:w-[80%] mx-auto mb-10">

        <div className="w-full bg-white flex justify-between items-center mb-4">

          <h2 className="text-xl font-bold text-[#194D80] font-epilogue ps-2">

            Exam Schedule

          </h2>

          <div className="flex items-center gap-2">

            <button

              className="border border-[#194D80] text-[#194D80] px-3 py-1 rounded-md font-bold"

              onClick={() => setSelectedDay(null)}

            >

              All

            </button>

            <div className="relative">

              <button

                className="bg-main text-white px-3 py-1 rounded-md flex items-center gap-1"

                onClick={() => setShowDropdown(!showDropdown)}

              >

                Select Day <Table size={20} />

              </button>

              {showDropdown && (

                <div className="absolute right-0 mt-2 w-32 bg-white border border-[#194D80] rounded-md shadow-lg z-10">

                  {days.map((day) => (

                    <button

                      key={day}

                      className="block w-full text-left px-4 py-2 text-[#194D80] hover:bg-main hover:text-white"

                      onClick={() => handleDaySelect(day)}

                    >

                      {day}

                    </button>

                  ))}

                </div>

              )}

            </div>

          </div>

        </div>

      </div>



      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">

        {days.map((day, dayIndex) => {

          const isLastDay = day === 'Thu';

          const isBottomDay = ['Sat', 'Mon', 'Wed'].includes(day);



          return (

            <div

              key={dayIndex}

              className={`pe-2 h-[400px] ${isLastDay ? '' : 'border-e'}`}

            >

              <p className="font-medium text-center mb-4 text-[#194D80] capitalize">

                {day}

              </p>



              {!isBottomDay && (

                <div className="flex flex-col">

                  {filteredSchedule

                    .filter((item) => item.day === day)

                    .map((item, index) => (

                      <div

                        key={index}

                        className="shadow-md flex flex-col items-center gap-1 rounded-lg p-4 mb-4 border-s-4 border-s-[#194D80] border-b-4 border-b-main bg-white"

                      >

                        <p className="text-[#14B8AF] font-bold">{item.subject}</p>

                        <p className="text-xs text-[#194D80] flex items-center gap-1">

                          <User size={15} />

                          {item.teacher}

                        </p>

                        <p className="text-xs text-[#194D80] flex items-center gap-1">

                          <Clock size={15} className="text-main" />

                          {item.time}

                        </p>

                        <p className="text-xs text-[#194D80] flex items-center gap-1">

                          <Clock size={15} className="text-main" />

                          {item.date}

                        </p>

                        <button

                          className={`text-xs w-full rounded-lg py-1 ${

                            item.button === 'View Quiz'

                              ? 'bg-[#194D80] text-white'

                              : 'bg-main text-white'

                          }`}

                          onClick={() => handleButtonClick(item.button)} // Call handleButtonClick on click

                        >

                          {item.button}

                        </button>

                      </div>

                    ))}

                </div>

              )}



              {isBottomDay && (

                <div className="flex flex-col justify-end h-full">

                  {filteredSchedule

                    .filter((item) => item.day === day)

                    .map((item, index) => (

                      <div

                        key={index}

                        className="shadow-md flex flex-col items-center gap-1 rounded-lg p-4 mb-12 border-s-4 border-s-[#194D80] border-b-4 border-b-main bg-white mt-auto"

                      >

                        <p className="text-[#14B8AF] font-bold">{item.subject}</p>

                        <p className="text-xs text-[#194D80] flex items-center gap-1">

                          <User size={15} />

                          {item.teacher}

                        </p>

                        <p className="text-xs text-[#194D80] flex items-center gap-1">

                          <Clock size={15} className="text-main" />

                          {item.time}

                        </p>

                        <p className="text-xs text-[#194D80] flex items-center gap-1">

                          <Clock size={15} className="text-main" />

                          {item.date}

                        </p>

                        <button

                          className={`text-xs w-full rounded-lg py-1 ${

                            item.button === 'View Quiz'

                              ? 'bg-[#194D80] text-white'

                              : 'bg-main text-white'

                          }`}

                          onClick={() => handleButtonClick(item.button)} // Call handleButtonClick on click

                        >

                          {item.button}

                        </button>

                      </div>

                    ))}

                </div>

              )}

            </div>

          );

        })}

      </div>

    </div>

  );

};



export default ExamSchedules;