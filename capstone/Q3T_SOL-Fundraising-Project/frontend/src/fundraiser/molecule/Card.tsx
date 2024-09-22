
import { MdSupervisedUserCircle } from "react-icons/md";

const Card = ({ active,title,result,subText,icon }:{active?:boolean,result?:string,title:string,subText?:string, icon?:any}) => {
  return (
      <div className="flex gap-[10px] bg-white rounded-[20px] p-[20px] py-[30px] cursor-pointer border-l-[1px] sborder-r-[1px] border-solid sborder-primary_color shadow-light_shadow w-[100%] lg:w-[28%] ehovher:bg-[black] ">
        
        <div className="flex flex-col pt-0 mt-0 gap-[10px] ">
          <div className="flex items-center gap-3  ">{icon}
          <span className="text-[1.2rem]">{title}</span>
          </div>
          <span className="font-bold text-center text-[2.4rem]">{result}</span>
          {/* <span className="text-[16px]">
            <span className={active ? "text-[green]" : "text-[red]"}>12%</span>{" "}
            {subText}
          </span> */}
        </div>
      </div>
  );
};

export default Card;
