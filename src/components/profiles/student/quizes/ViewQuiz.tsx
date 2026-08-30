function ViewQuiz() {
const academicYearOptions = [
    "First Secondary",
    "Second Secondary",
    "Third Secondary",
  ];
    return (
        <section>
            <div className="bg-[#F0FEFC] px-[10%] py-16 grid grid-cols-1 md:grid-cols-2">
            {/* quiz details */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-5">
                    <h3 className="font-bold text-[#194D80] text-lg">Quiz title :</h3>
                     <p className="font-semibold text-base text-[#194D80]">Lesson 10</p>
                </div>
                <div className="flex items-center gap-5">
                    <h3 className="font-bold text-[#194D80] text-lg">Subject :</h3>
                     <p className="font-semibold text-base text-[#194D80]">English</p>
                </div>
                <div className="flex items-center gap-5">
                    <h3 className="font-bold text-[#194D80] text-lg">Quiz start time</h3>
                     <p className="font-semibold text-base text-[#194D80]">8:00 Pm</p>
                </div>
                <div className="flex items-center gap-5">
                    <h3 className="font-bold text-[#194D80] text-lg">Quiz Time limit</h3>
                     <p className="font-semibold text-base text-[#194D80]">30 Min</p>
                </div>
                <div className="flex items-center gap-5">
                    <h3 className="font-bold text-[#194D80] text-lg">Quiz date</h3>
                     <p className="font-semibold text-base text-[#194D80]">16 June 2025</p>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-5">
                    <h3 className="font-bold text-[#194D80] text-lg">Quiz title :</h3>
                     <p className="font-semibold text-base text-[#194D80]">Lesson 10</p>
                </div>
                <div className="flex items-center gap-5">
                    <h3 className="font-bold text-[#194D80] text-lg">Subject :</h3>
                     <p className="font-semibold text-base text-[#194D80]">English</p>
                </div>
                <div className="flex items-center gap-5">
                    <h3 className="font-bold text-[#194D80] text-lg">Quiz start time</h3>
                     <p className="font-semibold text-base text-[#194D80]">8:00 Pm</p>
                </div>
                <div className="flex items-center gap-5">
                    <h3 className="font-bold text-[#194D80] text-lg">Quiz Time limit</h3>
                     <p className="font-semibold text-base text-[#194D80]">30 Min</p>
                </div>
                <div className="flex items-center gap-5">
                    <h3 className="font-bold text-[#194D80] text-lg">Quiz date</h3>
                     <p className="font-semibold text-base text-[#194D80]">16 June 2025</p>
                </div>
            </div>
        </div>
        <form>
            <div className="bg-white py-10 px-6 flex flex-col gap-5 ">
        <div className="flex items-center gap-5">
            <label
              htmlFor="quizTitle"
              className="block text-lg font-bold text-[#194D80]  capitalize"
            >
              enter your Name
            </label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              
              className="mt-1 flex-shrink-0 block w-[50%] focus:outline-none md:w-[30%] border border-[#194D80] rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-5">
            <label
              htmlFor="quizTitle"
              className="block text-lg font-bold text-[#194D80]  capitalize"
            >
              enter your ID
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              
              className="mt-1 flex-shrink-0 block w-[50%] focus:outline-none md:w-[30%] border border-[#194D80] rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-5" >
            <label
              htmlFor="academicYear"
              className="block text-lg font-bold text-[#194D80]  capitalize"
            >
              academic year
            </label>
            <select
              id="academicYear"
              name="academicYear"
              
              className="mt-1 text-center flex-shrink-0 block w-[50%] md:w-[30%] border border-[#194D80] rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {academicYearOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            
          </div>
          {/* questions */}
          <div className="mb-6 ">
        <div className="relative ms-10 mt-5">
            <div className="bg-gradient-to-b from-[#14B8AF] to-[#FFFFFF] text-[#194D80] font-bold absolute px-4 py-2 rounded-md -left-11">1</div>
            <h3 className="text-lg font-bold mb-2 text-[#194D80] absolute -top-3 left-6 bg-white px-2">Questions 1</h3>
        <p className="text-black px-2  text-sm w-full border border-[#194D80] rounded-lg text-center py-3 overflow-x-hidden">Nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn</p>
        </div>
        <div className="mt-5 flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-[#0E2A46] capitalize ">Choose one answer</h3>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-20">
            <label className="flex items-center">
            <input type="radio" name="q1" className="mr-2" />
            <span className="text-[#5299E0] border border-[#5299E0] px-8 py-2 text-lg rounded-sm">Mmmmmmmmmmmmmmmmm</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="q1" className="mr-2" />
            <span className="text-[#5299E0] border border-[#5299E0] px-8 py-2 text-lg rounded-sm">Mmmmmmmmmmmmmmmmm</span>
          </label>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-20">
            <label className="flex items-center">
            <input type="radio" name="q1" className="mr-2" />
            <span className="text-[#5299E0] border border-[#5299E0] px-8 py-2 text-lg rounded-sm">Mmmmmmmmmmmmmmmmm</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="q1" className="mr-2" />
            <span className="text-[#5299E0] border border-[#5299E0] px-8 py-2 text-lg rounded-sm">Mmmmmmmmmmmmmmmmm</span>
          </label>
          </div>
        </div>
      </div>

      {/* Question 2 */}
      <div className="mb-6">
        <div className="relative ms-10 mt-5">
            <div className="bg-gradient-to-b from-[#14B8AF] to-[#FFFFFF] text-[#194D80] font-bold absolute px-4 py-2 rounded-md -left-12">2</div>
            <h3 className="text-lg font-bold mb-2 text-[#194D80] absolute -top-3 left-6 bg-white px-2">Questions 2</h3>
        <p className="text-black px-2 text-sm w-full border border-[#194D80] rounded-lg text-center py-3 overflow-x-hidden">Nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn</p>
        </div>
        <div className="mt-5 flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-[#0E2A46] capitalize ">Choose one answer</h3>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-20">
            <label className="flex items-center">
            <input type="radio" name="q2" className="mr-2" />
            <span className="text-[#5299E0] border border-[#5299E0] px-8 py-2 text-lg rounded-sm">True</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="q2" className="mr-2" />
            <span className="text-[#5299E0] border border-[#5299E0] px-8 py-2 text-lg rounded-sm">False</span>
          </label>
          </div>
          
        </div>
      </div>
      </div>
        </form>
        </section>
    )
}

export default ViewQuiz
