import { ClipLoader } from "react-spinners";

const Loader = ({loading}) => {
  return (
    <>
      <div
        className="w-100 d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <ClipLoader color="#fff"  size={50} />
      </div>
    </>
  );
};

export default Loader;
