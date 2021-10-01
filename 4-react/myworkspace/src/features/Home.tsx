import { useState } from "react";
import Pagination from "../components/Pagination";

const Home = () => {
  const [currentPage, setCurrentpage] = useState(0);

  const handlePageChanged = (page: number) => {
    setCurrentpage(page);
  };

  return (
    <div>
      <h2>This is Home Component</h2>
      <Pagination
        blockSize={10}
        totalPages={25}
        currentPage={currentPage}
        onPageChanged={handlePageChanged}
      />
    </div>
  );
};

export default Home;
