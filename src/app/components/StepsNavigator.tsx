import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Assuming you have the react-icons library installed

const StepsNavigator = ({ steps }: any) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-[#0A0A0A]">
      <button
        onClick={goToPreviousStep}
        disabled={currentStepIndex === 0}
        className="text-xl p-2 rounded-full bg-white text-[#2A2D34] disabled:opacity-50"
      >
        <FaChevronLeft />
      </button>

      {
        steps[currentStepIndex] && (
          <p className="text-lg font-semibold text-white">{`${steps[currentStepIndex].maneuver.instruction}`}</p>
        )
      }

      <button
        onClick={goToNextStep}
        disabled={currentStepIndex === steps.length - 1}
        className="text-xl p-2 rounded-full bg-white text-[#2A2D34] disabled:opacity-50"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default StepsNavigator;
