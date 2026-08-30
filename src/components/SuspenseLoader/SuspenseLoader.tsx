import { BallTriangle } from "react-loader-spinner";
const SuspenseLoader = () => {
  return (
    <div className="bg-white min-h-screen flex justify-center items-center">
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#0AB99D"
        ariaLabel="ball-triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

export default SuspenseLoader;
