// src/components/CustomDatePicker.tsx
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({ selectedDate, onChange }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleCalendar = () => setIsOpen(!isOpen);

	return (
  <div className="relative">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleCalendar}
      className="flex items-center space-x-2 bg-whatsapp-green/20 text-whatsapp-green hover:bg-whatsapp-green/30 transition-colors px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:ring-opacity-50"
    >
      <Calendar className="w-5 h-5" />
      <span>{selectedDate.toLocaleDateString()}</span>
    </motion.button>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute z-10 mt-2"
      >
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            onChange(date);
            setIsOpen(false);
          }}
          inline
          calendarClassName="bg-profundo border border-whatsapp-green rounded-lg shadow-lg"
          dayClassName={(date) =>
            `text-white hover:bg-whatsapp-green/30 rounded-full transition-colors`
          }
          monthClassName={() => `text-whatsapp-green font-bold`}
          weekDayClassName={() => `text-whatsapp-green/70`}
          todayClassName="bg-whatsapp-green/50 text-white rounded-full"
          popperClassName="react-datepicker-popper"
          popperModifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 10],
              },
            },
            {
              name: "preventOverflow",
              options: {
                rootBoundary: "viewport",
                tether: false,
                altAxis: true,
              },
            },
          ]}
        />
      </motion.div>
    )}
  </div>
);
};

export default CustomDatePicker;
