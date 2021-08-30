import react from "react";
import { useState, useRef } from "react";

const Exam210824 = () => {
  const [keywords, setKeywords] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {keywords}
      {inputRef}
    </>
  );
};

export default Exam210824;
