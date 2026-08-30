import { containerVariants, itemVariants } from "@/animations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  useGetLessonContents,
  useGetLessonLectures,
} from "@/lib/react-query/lessons/lessons";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { FileVideo, Loader, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface IProps {
  lessonId: number;
}

const ViewLessonContent = ({ lessonId }: IProps) => {
  const token = cookieService.getToken()!;
  const [contentId, setContentId] = useState<number>();
  const { data: contents, isLoading: isLoadingContents } =
    useGetLessonContents(lessonId);
  const { data: lectures, isLoading: isLoadingLectures } = useGetLessonLectures(
    {
      token,
      lessonId,
      contentId: contentId!,
    }
  );

  return (
    <>
      {isLoadingContents ? (
        <div className="py-10">
          <Loader className="animate-spin mx-auto" size={40} />
        </div>
      ) : (
        <Accordion type="single" collapsible>
          <motion.div
            className="w-full space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {contents?.data.map(({ title, description, id }, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AccordionItem
                  value={`item-${index}`}
                  className="border border-[##2E1E1] rounded-[5px]"
                >
                  <AccordionTrigger
                    className="font-bold text-black-blue text-xl data-[state=open]:bg-[#eaeaea] px-4 data-[state=open]:mb-2 rounded-t-[5px] hover:no-underline"
                    onClick={() => setContentId(id)}
                  >
                    {title}
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pt-2 text-[#333931] font-sora">
                    <p className="text-sm px-4"> {description}</p>

                    {isLoadingLectures ? (
                      <div className="py-5">
                        <Loader2 className="animate-spin mx-auto" size={32} />
                      </div>
                    ) : (
                      <div className="space-y-1 mt-3">
                        {lectures?.data.map((lecture) => (
                          <Link
                            to={`/courses/${lessonId}/view`}
                            state={{
                              lecture: lecture,
                            }}
                            key={lecture.id}
                            className="block bg-[#f1f1f1] space-y-0.5 px-4 py-2 hover:bg-[#dcdcdc] transition-all duration-300"
                          >
                            <h3 className="flex items-center gap-2 text-base font-medium">
                              <FileVideo className="shrink-0" size={18} />

                              {lecture.title}
                            </h3>
                            <p className="pl-4 text-sm">
                              {lecture.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </motion.div>
        </Accordion>
      )}
    </>
  );
};

export default ViewLessonContent;
