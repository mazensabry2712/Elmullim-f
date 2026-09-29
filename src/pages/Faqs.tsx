import Newsletter from "@/components/Newsletter";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { containerVariants, itemVariants } from "@/animations";
import { useI18n } from "@/i18n";
import { getFaqCopy } from "./faqCopy";

const Faqs = () => {
  const { language } = useI18n();
  const copy = getFaqCopy(language);

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container text-center text-white space-y-4 md:space-y-6 pt-20 md:pt-32 pb-16 md:pb-24"
      >
        <h1 className="text-4xl font-bold leading-tight uppercase md:text-6xl md:leading-[74px]">
          {copy.title}
        </h1>
        <p
          className="font-sora font-light capitalize leading-[30px]"
          aria-label={copy.breadcrumb}
        >
          {copy.breadcrumbHome} <span className="text-main">//</span> {copy.title}
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
        aria-label={copy.title}
      >
        <div className="container py-12 md:py-24">
          <Accordion defaultValue="item-0" type="single" collapsible>
            <motion.div
              className="w-full space-y-5"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
            >
              {copy.items.map((item, index) => (
                <motion.div key={item.question} variants={itemVariants}>
                  <AccordionItem
                    value={`item-${index}`}
                    className="overflow-hidden rounded-[5px] border border-[#2E1E1]"
                  >
                    <AccordionTrigger className="px-4 text-start text-xl font-semibold text-black-blue hover:no-underline data-[state=open]:mb-5 data-[state=open]:rounded-b-none data-[state=open]:bg-[#FC9F0B] data-[state=open]:text-white">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 text-start font-sora text-[17px] leading-[32px] text-[#333931]">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </motion.div>
          </Accordion>
        </div>
        <Newsletter />
      </motion.section>
    </main>
  );
};

export default Faqs;
