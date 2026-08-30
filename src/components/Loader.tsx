import { RotatingLines } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <RotatingLines
        visible={true}
        width={"64px"}
        strokeColor="#0AB99D"
        strokeWidth={"5px"}
        animationDuration={"0.75"}
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
};

export default Loader;
