import cookieService from "@/utils/cookieService";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGetCourseById } from "@/lib/react-query/courses/courses";
import { Input } from "@/components/ui/input";
function EnrollCourse() {
   const token = cookieService.getToken()!;
  const { courseId } = useParams();
  const {
      data: course,
    } = useGetCourseById({
      courseId: Number(courseId),
      ...(token && { token }),
    });
  return (
     <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container text-center text-white space-y-4 md:space-y-6 pt-16 md:pt-24 pb-12 md:pb-20"
      >
        <h1 className="uppercase text-4xl md:text-6xl font-bold leading-[74px]">
          Students Subscriptions
        </h1>
        <p className="font-sora font-light capitalize leading-[30px]">
          home <span className="text-main">//</span>  Subscription <span className="text-main">// </span> Payment
        </p>
      </motion.div>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
      >
        <div className="pt-5 p-9">
          <div className="flex items-center gap-3 mb-8 ms-4">
            <img
              src="/icons/left-chevron.png"
              alt="left arrow"
              width={48}
              height={48}
              style={{
                border: '1px solid #21374B',
                borderRadius: '5px',
                width: '48px',
                height: '48px',
                objectFit: 'cover',
              }}
            />
            <p
              className="font-roboto font-bold text-[42px] leading-[100%] tracking-[0] text-black-blue "
              style={{ textTransform: 'capitalize' }}
            >
              payment method
            </p>
          </div>
          {/* Another section in a different row */}
            <h2 className="text-xl font-bold mb-2 text-black-blue text-center">Electronic wallet</h2>
          <div
            className="mt-8 p-6 shadow flex items-center justify-between gap-4 bg-[#21374BBD] rounded-[20px] w-[80%] m-auto"
          >
            <p
              className="text-[32px] font-bold ms-5 px-4 py-2 rounded-lg"
              style={{ color: 'hsl(var(--white-gray))', }}
            >
              {course?.data.price} L.E
            </p>
            {/* Button to add money to wallet */}
            <Button
              className="mt-2 me-6 w-90  bg-white text-[hsl(var(--black-blue))] py-7 hover:text-white hover:bg-main/90 transition-all duration-200 rounded-[5px] font-sora font-weight-semibold"
              size="lg"
            >
              Add Money To Wallet
            </Button>
          </div>
          {/* New grid section with two cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 w-[80%] m-auto">
            {/* Card 1: Course Details */}
            <div className="bg-[#F0FEFC] rounded-[20px] shadow p-6 flex flex-col items-center">
              <img
                src={course?.data?.image}
                alt={course?.data?.title}
                className="object-cover rounded-lg mb-4"
                style={{ width: '376px', height: '256px', maxWidth: '100%' }}
              />
              <div style={{ maxWidth: '90%', width: '100%' }}>
                <div className="w-85 flex items-center justify-between mb-2">
                  <span className="font-medium text-[28px] text-black-blue" style={{ fontWeight: 500 }}>Course Name</span>
                  <span className="font-normal text-[24px] text-black-blue" style={{ fontWeight: 400 }}>{course?.data?.title}</span>
                </div>
                <p className="text-base font-normal mb-4 text-black-blue leading-relaxed text-center">{course?.data?.description}</p>
                <div className="w-[70%] mx-auto">
                  <p className="text-lg font-semibold text-main mb-2 flex justify-around">
                    <span>Price</span>
                    <span>{course?.data?.price} L.E</span>
                  </p>
                  <p className="text-left text-black-blue mb-2 flex justify-between">
                    <span>Trainer Name</span>
                    <span>{course?.data?.teacher?.name}</span>
                  </p>
                  <p className="text-left text-black-blue mb-2 flex justify-between">
                    <span>Level:</span>
                    <span>{course?.data?.level}</span>
                  </p>
                  <p className="text-base text-black-blue mb-2 flex justify-between">
                    <span>Start Date:</span>
                    <span>{course?.data?.created_at ? new Date(course.data.created_at).toLocaleDateString() : '-'}</span>
                  </p>
                  <p className="text-base text-black-blue mb-2 flex justify-between">
                    <span>How to attend:</span>
                    <span>Online</span>
                  </p>
                </div>
              </div>
            </div>
            {/* Card 2: Payment Form */}
            <div className="bg-white rounded-[20px] shadow p-6 flex flex-col gap-6">
              <form className="flex flex-col gap-4  ">
                <label className="font-bold text-black-blue">Email</label>
                <Input type="email" placeholder="@gmail.com" className="mb-2" />
                {/* Payment method tabs */}
                <div className="flex gap-2 mb-4">
                  <Button type="button" className="px-4 py-2 rounded bg-[#E6E6E6] text-[#194C80] border border-main font-bold hover:bg-white">Visa</Button>
                  <Button type="button" className="px-4 py-2 rounded bg-[#E6E6E6] text-[#194C80] border border-main font-bold hover:bg-white">Electronic Wallet</Button>
                  <Button type="button" className="px-4 py-2 rounded bg-[#E6E6E6] text-[#194C80] border border-main font-bold hover:bg-white">Bank Transfer</Button>
                </div>
                {/* Card details form */}
                <div className="bg-[#F0FEFC] rounded-[20px] border border-[#21374B] p-[37px_25px]">

                <div className="mb-2">
                  <label className="block text-black-blue font-normal text-[1rem] mb-1" style={{ fontWeight: 400 }}>Name Of Card</label>
                  <Input type="text" className="mb-2 h-8 border border-[#194C80]" />
                </div>
                <div className="mb-2">
                  <label className="block text-black-blue font-normal text-[1rem] mb-1" style={{ fontWeight: 400 }}>Card Number</label>
                  <Input type="text" className="mb-2 h-8 border border-[#194C80]" />
                </div>
                <div className="flex gap-2">
                  <div className="w-1/2 mb-2">
                    <label className="block text-black-blue font-normal text-[1rem] mb-1" style={{ fontWeight: 400 }}>Expire Date</label>
                    <Input type="text" className="mb-2 h-8 border border-[#194C80]" />
                  </div>
                  <div className="w-1/2 mb-2">
                    <label className="block text-black-blue font-normal text-[1rem] mb-1" style={{ fontWeight: 400 }}>CVV</label>
                    <Input type="text" className="mb-2 h-8 border border-[#194C80]"/>
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-black-blue font-normal text-[1rem] mb-1" style={{ fontWeight: 400 }}>Zip Code</label>
                  <Input type="text" className="mb-2 h-8 border border-[#194C80]" />
                </div>
                <div className="mb-2">
                  <label className="block text-black-blue font-normal text-[1rem] mb-1" style={{ fontWeight: 400 }}>Address</label>
                  <Input type="text" className="mb-2 h-8 border border-[#194C80]" />
                </div>
                </div>
                <div className="flex items-center gap-2 mt-2 w-53 m-auto">
                  <input type="checkbox" id="save-info" className="w-5 h-5" />
                  <label htmlFor="save-info" className="bg-main rounded-[5px] text-white p-1  text-sm">Securely save my information for 1-click checkout</label>
                </div>
                <Button className="mt-4 w-48 m-auto bg-[#194C80] text-white py-4 rounded-1 font-bold text-lg">Pay</Button>
              </form>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  )
}

export default EnrollCourse