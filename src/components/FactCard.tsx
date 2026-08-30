interface IProps {
  statistic: {
    title: string;
    icon: string;
    description: string;
  };
}

const FactCard = ({ statistic }: IProps) => {
  return (
    <div className="flex gap-3">
      <div className="bg-white w-[70px] h-[70px] flex justify-center items-center flex-shrink-0 rounded-[10px]">
        <i
          className={`${statistic.icon} flex justify-center items-center text-3xl text-main`}
        />
      </div>
      <div>
        <h4 className="font-bold text-3xl text-white">{statistic.title}</h4>
        <p className="font-sora text-white capitalize">
          {statistic.description}
        </p>
      </div>
    </div>
  );
};

export default FactCard;
