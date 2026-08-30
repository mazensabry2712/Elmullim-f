interface IProps {
  image: string;
  name: string;
}

const FavoriteSubject = ({ image, name }: IProps) => {
  return (
    <div className="flex flex-col items-center justify-evenly w-[187px] h-[231px] rounded-[3px] text-center bg-main">
      <img className="w-[120px] h-[120px]" src={image} alt={name} />
      <p className="font-sora capitalize font-[600px] text-[20px] text-white">
        {name}
      </p>
    </div>
  );
};

export default FavoriteSubject;
