import { Filter, Loader, Search } from "lucide-react";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import LessonList from "@/components/lessons/LessonsList";
import { useGetStudentLessons } from "@/lib/react-query/student/studentProfile";
import { useState } from "react";
import "../../../index.css";

const StudentLessons = () => {
  const token = cookieService.getToken()!;
  const { data: lessons, isLoading } = useGetStudentLessons(token);
  const academicYears = [
    "First year of middle school",
    "Second year of middle school",
    "Third year of middle school",
    "First year of secondary school",
    "Second year of secondary school",
    "Third year of secondary school",
  ];
  const country = ["Cairo", "Alex", "Other"];
  const category = [
    "Web Development",
    "Mobile App Development",
    "Software Engineering",
    "Frontend Development",
    "Backend Development",
  ];

  const [selectedYear, setSelectedYear] = useState<number>();
  const [selectedCountry, setSelectedCountry] = useState<number>();
  const [selectedTeacher, setSelectedTeacher] = useState<number>();
  const [minPrice, setMinPrice] = useState(2000);
  const [maxPrice, setMaxPrice] = useState(5000);
  const handleMinChange = (e: any) => {
    const newMin = Number(e.target.value);
    if (newMin <= maxPrice) {
      setMinPrice(newMin);
    } else {
      setMinPrice(maxPrice);
    }
  };
  const handleMaxChange = (e: any) => {
    const newMax = Number(e.target.value);

    if (newMax >= minPrice) {
      setMaxPrice(newMax);
    } else {
      setMaxPrice(minPrice);
    }
  };

  return (
    <div className="pb-10 mt-4 overflow-hidden bg-white rounded-lg ">
      {/* Features Section*/}
      <div className="my-10 flex flex-col justify-center items-center">
        <h2 className="font-bold text-main text-3xl font-sora">
          Features Section
        </h2>
        <div className="w-[70%] mt-10 flex flex-col lg:flex-row justify-between items-center gap-10 ">
          {/* Global Access */}
          <div className="flex flex-col justify-center items-center gap-3">
            <svg
              width="61"
              height="60"
              viewBox="0 0 81 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M77.568 24.9682C74.2485 16.7747 68.3066 9.9125 60.6725 5.45449C53.0377 0.996653 44.1404 -0.804629 35.3729 0.331755C26.605 1.46814 18.4619 5.47891 12.216 11.7361C6.13267 17.8183 2.17248 25.7 0.923896 34.2106C-0.325361 42.7216 1.20383 51.4088 5.28376 58.9829C9.78714 57.1376 14.1734 55.0195 18.4192 52.6402C25.3591 48.7324 31.8811 44.1243 37.8823 38.8881C37.2514 37.6667 36.3664 36.5952 35.2864 35.7449C33.8296 35.0263 32.1452 34.9253 30.6131 35.4643C28.1572 36.8673 28.4941 38.2704 28.1857 41.456C28.045 42.8591 26.5715 43.6731 25.3794 44.01C23.527 44.487 22.7409 42.4949 21.3377 41.8209C19.64 41.0069 18.4186 41.2172 17.4786 39.4075C16.8011 37.6653 15.4355 36.2796 13.7037 35.5764C11.9356 34.8459 10.3571 33.7234 9.08619 32.2933C8.61894 31.6986 8.46712 30.9146 8.67953 30.1882C10.3069 24.9987 13.1669 20.2804 17.0156 16.4366C18.0302 15.4326 19.1081 14.4953 20.2432 13.6298C20.872 13.1389 21.7097 13.0059 22.4604 13.2789C24.046 13.854 24.4388 15.9868 25.0146 17.362L25.0139 17.3627C26.2521 19.8401 26.7395 22.6248 26.4178 25.3751C26.1232 27.1292 23.9479 30.6797 27.3579 30.3426C28.5646 30.2166 29.3648 29.0377 30.4308 28.5747C32.8305 27.5226 35.5107 28.771 37.9389 28.0135C42.4157 26.6104 47.7623 24.9121 46.1482 19.2851C45.8467 17.7449 44.7924 16.4589 43.3412 15.8606C41.2069 15.3565 38.9939 15.2806 36.8304 15.6364C34.9356 15.8753 33.6731 16.6189 31.9051 15.5383H31.9044C30.9894 14.8942 30.2394 14.0433 29.7151 13.0544C29.1343 12.3205 28.7353 11.4599 28.5508 10.5428C28.5508 9.88339 28.7611 8.73243 29.477 8.49428V8.49358C36.6187 5.95557 44.4123 5.92705 51.5731 8.41281C58.7337 10.8993 64.8324 15.7513 68.8635 22.1692C72.8954 28.5871 74.6189 36.1882 73.7498 43.7168C72.8808 51.246 69.4707 58.2545 64.0837 63.5853C62.9751 64.6938 61.4737 66.5459 59.7051 65.8727C57.9371 65.1993 57.6982 63.0666 58.1056 61.4246V61.4239C58.3848 60.3795 58.7755 59.3685 59.2699 58.4068C59.813 57.606 60.1598 56.6876 60.2803 55.7267C60.2803 54.1829 58.3438 53.8744 57.1927 53.4817C53.9791 52.3732 57.1927 47.8688 55.8599 45.6238C55.3418 44.9004 54.6071 44.36 53.7631 44.0801C52.9184 43.8009 52.0069 43.7953 51.1588 44.0662C50.4012 44.3468 48.1136 45.1886 48.7731 50.1144C49.2501 53.6225 51.5793 58.6463 47.7766 61.1857C46.0642 62.3082 43.9314 61.5227 42.1633 62.3646C40.3953 63.2064 39.7776 65.1707 38.9497 66.5745L38.9504 66.5738C37.9867 68.1767 36.6657 69.5359 35.0913 70.5448C34.0983 71.3539 32.9229 71.9075 31.6673 72.1589C29.4919 72.3831 26.1947 70.7558 25.9558 68.3702C25.7595 66.3356 28.061 65.1992 27.696 63.0656C27.2469 60.3856 31.0079 59.9929 32.8463 60.2595C34.0956 60.4141 35.0356 61.1578 36.2564 60.4002L36.2557 60.3995C37.452 59.6078 38.2813 58.369 38.5571 56.9618C38.7507 55.6841 39.0369 54.4224 39.4136 53.1871C39.486 52.9566 39.4074 52.7052 39.2159 52.5583C39.0244 52.4107 38.7618 52.3981 38.5571 52.5277C33.4779 55.7398 28.1793 58.5905 22.6998 61.0588C18.5795 62.9173 14.3636 64.5571 10.0699 65.9707C10.7621 66.7749 11.4828 67.5562 12.2307 68.3139H12.2314C18.7618 74.83 27.3443 78.8887 36.5256 79.803C45.7063 80.7173 54.9209 78.4306 62.6095 73.3307C70.298 68.2303 75.9865 60.6299 78.7134 51.8152C81.4397 43.002 81.0357 33.5172 77.5707 24.9662L77.568 24.9682Z"
                fill="#057DCD"
              />
              <path
                d="M62.7087 23.5391L57.7973 41.8799L53.9102 37.993H53.9095C50.1116 41.4098 46.1041 44.587 41.9113 47.5067C35.5612 51.9283 28.8149 55.7518 21.76 58.929C17.4433 60.8745 13.0209 62.5749 8.51267 64.0225C7.23068 64.434 5.94937 64.8226 4.66746 65.1874C4.50799 65.2341 4.34296 65.2578 4.17653 65.2578C3.40289 65.2362 2.75109 64.6722 2.61809 63.9097C2.48508 63.1473 2.90777 62.3959 3.6292 62.1147C4.5644 61.7498 5.50028 61.3759 6.43547 60.9922L6.43617 60.9915C10.9283 59.1268 15.3049 56.9946 19.5429 54.6071C26.5413 50.6694 33.1239 46.034 39.1896 40.7714C42.3031 38.0654 45.2689 35.1946 48.073 32.1691L44.3546 28.4508L62.7087 23.5391Z"
                fill="#057DCD"
              />
            </svg>

            <h3 className="text-black font-bold text-base font-sora">
              Global Access
            </h3>

            <p className="text-xs font-sora text-center text-gray-500">
              Learn from anywhere in the world through our online platform, with
              easy and flexible access to all courses.
            </p>
          </div>
          {/* Certified Certificates */}
          <div className="flex flex-col justify-center items-center gap-3">
            <svg
              width="61"
              height="60"
              viewBox="0 0 81 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M53.6067 27.3997C60.0145 33.7402 62.8456 43.0226 58.926 46.9014L48.2188 57.4961C47.8815 57.8299 47.3301 57.509 47.4447 57.0496C48.4041 53.2012 46.5805 45.972 40.7082 40.1615C34.8013 34.3166 26.0993 31.6635 22.031 34.0842C21.3448 34.3851 20.5426 34.2375 20.0121 33.7126L6.17085 20.0096C5.5971 19.4411 6.00363 18.4697 6.81596 18.4697H16.5956C17.0994 18.4697 17.5074 18.066 17.5074 17.5675L17.5081 7.88915C17.5081 7.08536 18.4898 6.68309 19.0643 7.25153L33.9961 22.0366C37.9149 18.1589 47.1987 21.0587 53.607 27.3999L53.6067 27.3997Z"
                fill="#0AB99D"
              />
              <path
                d="M30.5424 69.7575C30.4969 69.8024 30.4292 69.8188 30.3665 69.801C30.3045 69.7825 30.2576 69.7311 30.2454 69.6676C29.3019 64.8412 24.779 59.336 17.9661 58.4444C17.8695 58.4316 17.7888 58.366 17.7578 58.2754C17.726 58.1841 17.7506 58.0828 17.819 58.0151L21.0662 54.802C21.2147 54.6551 21.4425 54.6201 21.6248 54.7235C23.6496 55.8718 25.8522 57.5229 28.1775 59.8928C28.1811 59.8964 28.1847 59.8985 28.1884 59.9021C28.1912 59.9049 28.1927 59.9085 28.197 59.9114C28.8976 60.6039 30.0616 60.6467 30.8076 59.9306L42.1289 48.7282C42.219 48.6391 42.2435 48.5022 42.1866 48.3887C41.78 47.5643 41.3353 46.7612 40.5266 45.6429C40.4711 45.5659 40.3831 45.5166 40.288 45.5088C40.1921 45.5002 40.0984 45.5352 40.0307 45.6029L29.8143 55.7093C29.6384 55.8833 29.3588 55.8869 29.1757 55.7214C24.7767 51.7203 19.3614 48.6748 13.4634 48.6492C13.0561 48.6471 12.8608 48.1507 13.1491 47.8661L24.2702 36.8618C24.312 36.8205 24.3257 36.7577 24.3048 36.7028C24.2832 36.6479 24.2313 36.6101 24.1722 36.6065C22.35 36.5045 20.453 36.6678 18.6177 37.252L3.02144 52.6844C-4.42491 60.0533 5.81601 76.5152 18.1715 79.4675C26.1506 81.3719 26.684 78.7786 44.0764 61.5687C44.6632 60.1502 44.7821 58.3151 44.568 56.3516C44.5594 56.2724 44.506 56.2061 44.4304 56.1797C44.3554 56.1533 44.2703 56.1726 44.2134 56.2282L30.5424 69.7575ZM10.0033 70.5292C4.64851 65.2306 2.65569 58.2498 5.64973 55.2864C8.78086 52.1882 13.3592 51.6905 17.6399 52.987L10.4825 60.0692C8.84921 61.6846 11.106 64.2215 12.9311 62.8279C14.5839 61.5705 19.8254 61.4178 23.4359 64.9454C25.4837 66.9475 26.7111 69.4301 26.7176 71.5847C26.7399 77.416 17.906 78.3482 10.0033 70.5292Z"
                fill="#0AB99D"
              />
              <path
                d="M79.9116 11.3383L76.5297 14.6847C76.3632 14.8494 76.3524 15.1076 76.4987 15.2909C79.8323 19.4589 80.8774 25.0684 77.1734 28.8099C77.1625 28.8206 77.1546 28.8349 77.1438 28.8456L64.6202 41.2384C64.5841 41.274 64.5294 41.2862 64.4818 41.2676C64.4335 41.2491 64.4011 41.2049 64.3982 41.1535C64.3319 39.8498 64.125 38.5681 63.7523 37.2238C63.7084 37.0654 63.7516 36.8957 63.8684 36.7794L74.482 26.2773C74.4828 26.2766 74.4828 26.2751 74.4842 26.2744C76.7324 24.0498 75.7896 20.5986 73.9141 18.0167C73.7483 17.7892 73.4124 17.77 73.2113 17.9682L61.0798 29.9723C60.8708 30.1792 60.5269 30.1407 60.3669 29.8939C59.866 29.1229 59.3268 28.3697 58.7531 27.6393C58.6097 27.4575 58.6241 27.2007 58.7884 27.0381L75.6267 10.3767C75.8155 10.1898 75.8054 9.87885 75.6079 9.70126C66.831 1.80948 58.7553 2.73883 54.7552 6.69431L44.1539 17.1835C44.0365 17.2998 43.8656 17.3418 43.7056 17.2976C42.3794 16.9346 41.0719 16.7107 39.8098 16.6393C39.7493 16.6358 39.6967 16.5972 39.6743 16.5409C39.6527 16.4846 39.6657 16.4211 39.7096 16.3783L52.1266 4.09174C59.901 -3.60322 71.6526 0.478599 79.9524 8.69703C80.6422 9.37815 80.733 10.5243 79.9113 11.3381L79.9116 11.3383Z"
                fill="#0AB99D"
              />
            </svg>

            <h3 className="text-black font-bold text-base font-sora">
              Certified Certificates
            </h3>

            <p className="text-xs font-sora text-center text-gray-500">
              You will be given an accredited electronic certificate proving
              your successful completion of the course, which can be added to
              your CV or professional files.
            </p>
          </div>
          {/* Practical projects*/}
          <div className="flex flex-col justify-center items-center gap-3">
            <svg
              width="61"
              height="60"
              viewBox="0 0 81 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5133 0.000108696C1.42095 0.0839858 0.494861 0.919951 0.500021 1.81789V65.4547C0.500021 66.4069 1.55878 67.2725 2.72261 67.2732H31.4037C35.2951 74.7616 44.3897 80 54.944 80C69.0318 80 80.5 70.617 80.5 59.0903C80.5 49.125 71.9257 40.7753 60.4998 38.693V16.3632C60.5041 15.879 60.2612 15.3968 59.8399 15.0564L42.0625 0.511085C41.649 0.184032 41.0752 -0.00417026 40.5006 7.01488e-05H2.51504L2.5133 0.000108696ZM4.9443 3.63639H38.2765V16.3639C38.2765 17.3162 39.3353 18.1817 40.4991 18.1824H56.0548V38.2116C55.6861 38.1975 55.3131 38.182 54.9418 38.182C52.2772 38.182 49.6859 38.5252 47.2686 39.1477C47.0653 39.1047 46.8542 39.0856 46.644 39.0906H12.5112C11.3474 39.135 10.3386 40.0421 10.3928 40.9937C10.4471 41.9466 11.5558 42.772 12.7197 42.7276H39.0741C37.0746 44.0267 35.3155 45.5492 33.8657 47.2732H12.5122C11.3484 47.3176 10.3396 48.2247 10.3938 49.1763C10.4481 50.1286 11.5568 50.954 12.7207 50.9095H31.4354C30.6825 52.351 30.1105 53.8699 29.7685 55.4551H12.5122C11.3483 55.4995 10.3395 56.4066 10.3938 57.3582C10.4481 58.3105 11.5568 59.1359 12.7207 59.0908H29.3868C29.3868 60.6457 29.616 62.1767 30.0114 63.6363H4.94275L4.9443 3.63639ZM42.7204 6.19291L52.9289 14.5454H42.7204V6.19291ZM12.5132 30.9082C11.3493 30.9526 10.3405 31.8597 10.3948 32.8113C10.4491 33.7636 11.5578 34.5897 12.7217 34.5445H48.277C49.4511 34.5579 50.5306 33.6867 50.5306 32.726C50.5306 31.7653 49.4512 30.8942 48.277 30.9075H12.5144L12.5132 30.9082ZM54.9426 41.8172C66.6285 41.8172 76.0541 49.529 76.0541 59.0897C76.0541 68.651 66.6288 76.363 54.9426 76.363C43.2576 76.363 33.832 68.6512 33.832 59.0897C33.832 49.5292 43.2574 41.8172 54.9426 41.8172ZM64.7341 50.8796C64.1578 50.9268 63.609 51.1672 63.2412 51.533L51.3312 62.8967L46.3655 59.4873C45.4653 58.8776 43.969 58.9925 43.2229 59.729C42.4777 60.4656 42.6181 61.6899 43.5184 62.3003L50.1852 66.8459C51.0769 67.4542 52.5637 67.3463 53.3098 66.6189L66.6429 53.8914C67.2331 53.3451 67.3605 52.4965 66.9505 51.8502C66.5413 51.2032 65.6195 50.8 64.7338 50.8796L64.7341 50.8796Z"
                fill="#EEAA42"
              />
            </svg>

            <h3 className="text-black font-bold text-base font-sora">
              Practical projects
            </h3>

            <p className="text-xs font-sora text-center text-gray-500">
              We provide opportunities for practical application through real
              programming projects, to enhance skills and gain practical
              experience during the learning period.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* filter and search */}
        <div
          className="col-span-1 mt-10  px-10 py-6 bg-white rounded-2xl border-r"
          style={{
            boxShadow: "0 -6px 0 #194D80, 0 6px 0 #194D80",
          }}
        >
          {/* Buttons */}
          <div className="flex gap-5 mb-10">
            <button className="border-[2px] border-main bg-[#F2F2F2] text-[#194D80] ps-4 pe-8 py-2 rounded-md flex items-center gap-2 hover:bg-[#e0e0e0] hover:text-[#163c60] transition-colors duration-200">
              <Filter size={20} />
              Filter
            </button>
            <div className="relative w-[150px]">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#194D80]">
                <Search size={20} />
              </span>
              <input
                className="border-[2px] border-main bg-[#F2F2F2] text-[#194D80] ps-9 focus:border-main active:border-main py-2 rounded-md w-full placeholder:text-[#194D80]"
                placeholder="Search"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-6 text-sm text-gray-700">
            {/* Academic Year */}
            <div>
              <h3 className="text-main font-bold text-base mb-2">
                academic year
              </h3>
              <div className="space-y-2">
                {academicYears.map((label, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="address"
                        id={`academic-${i}`}
                        className="sr-only"
                        checked={selectedYear === i}
                        onChange={() => setSelectedYear(i)}
                      />
                      <div className="w-4 h-4 rounded-full border border-main flex items-center justify-center">
                        {selectedYear === i && (
                          <div className="w-2.5 h-2.5 bg-[#B2B5BD] rounded-full" />
                        )}
                      </div>
                    </label>
                    <label
                      htmlFor={`academic-${i}`}
                      className="text-base text-[#33363F]"
                    >
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Country */}
            <div>
              <h3 className="text-main font-bold text-base mb-2">Country</h3>
              <div className="space-y-2">
                {country.map((city, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="country"
                        id={`country-${i}`}
                        className="sr-only"
                        checked={selectedCountry === i}
                        onChange={() => setSelectedCountry(i)}
                      />
                      <div className="w-4 h-4 rounded-full border border-main flex items-center justify-center">
                        {selectedCountry === i && (
                          <div className="w-2.5 h-2.5 bg-[#B2B5BD] rounded-full" />
                        )}
                      </div>
                    </label>
                    <label
                      htmlFor={`country-${i}`}
                      className="text-base text-[#33363F]"
                    >
                      {city}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Teachers */}
            <div>
              <h3 className="text-main font-bold text-base mb-2">Teachers</h3>
              <div className="space-y-2">
                {["Ahmed Ali", "Amr Jamal", "Yara Ali"].map((teacher, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="teacher"
                        id={`teacher-${i}`}
                        className="sr-only"
                        checked={selectedTeacher === i}
                        onChange={() => setSelectedTeacher(i)}
                      />
                      <div className="w-4 h-4 rounded-full border border-main flex items-center justify-center">
                        {selectedTeacher === i && (
                          <div className="w-2.5 h-2.5 bg-[#B2B5BD] rounded-full" />
                        )}
                      </div>
                    </label>

                    <label
                      htmlFor={`teacher-${i}`}
                      className="text-base text-[#33363F]"
                    >
                      {teacher}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <h3 className="text-main font-bold text-base mb-2">Category</h3>
              <div className="space-y-2">
                {category.map((cat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`category-${i}`}
                      className="accent-[#B2B5BD] w-4 h-4"
                    />
                    <label
                      htmlFor={`category-${i}`}
                      className="text-base text-[#33363F]"
                    >
                      {cat}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {/* Price */}
            <div>
              <h3 className="text-main font-bold text-base mb-4">Price</h3>
              <div className="flex justify-between text-[#33363F] text-md mb-1">
                <span>Min</span>
                <span>Max</span>
              </div>

              <div className="relative h-4 flex items-center bg-[#F0FCFF] rounded-full px-3 border border-[#057DCD]">
                <div
                  className="absolute h-2 bg-blue-600 rounded-full z-5"
                  style={{
                    left: `${(minPrice / 10000) * 100}%`,
                    right: `${100 - (maxPrice / 10000) * 100}%`,
                  }}
                ></div>

                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={minPrice}
                  onChange={handleMinChange}
                  className="w-full h-2 bg-transparent appearance-none absolute z-10"
                  style={{
                    WebkitAppearance: "none",
                    outline: "none",
                  }}
                />

                {/* شريط الحد الأقصى */}
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={maxPrice}
                  onChange={handleMaxChange}
                  className="w-full h-2 bg-transparent appearance-none absolute z-10"
                  style={{
                    WebkitAppearance: "none",
                    outline: "none",
                  }}
                />

                {/* الخلفية بتاعة الشريط */}
                <div className="w-full h-2 bg-[#F0FEFC] rounded-full relative z-0" />
              </div>

              <div className="flex justify-between text-md mt-1 text-[#33363F]">
                <span>{minPrice.toLocaleString()} L.E</span>
                <span>{maxPrice.toLocaleString()} L.E</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <h2 className="font-sora font-bold text-center capitalize text-main text-2xl mt-5">
            our lessons
          </h2>
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white"
          >
            <div className="py-6 md:py-10 px-3 md:px-8 ">
              {isLoading ? (
                <Loader size={40} className="animate-spin mx-auto" />
              ) : (
                <LessonList
                  lessons={lessons?.data || []}
                  customGridClass="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-9"
                />
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default StudentLessons;
