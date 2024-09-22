import { cn } from "../util/twMerge";



type SectionHeaderProp = {
  className?: string;
  headingClassName?: string;
  pClassName?: string;
  headingChildren: React.ReactNode;
  pChildren?: React.ReactNode;
};
const SectionHeader = ({
  className,
  headingClassName,
  pClassName,
  headingChildren,
  pChildren,
}: SectionHeaderProp) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <h2 className={cn("  text-[1.5rem] md:text-[3rem]  ", headingClassName)}>
        {headingChildren}
      </h2>
      <p
        className={cn(
          " text-[#434343] font-pop text-[15px] md:text-[1.1rem]",
          pClassName
        )}
      >
        {pChildren}
      </p>
    </div>
  );
};

export default SectionHeader;
