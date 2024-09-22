import { cn } from '../util/twMerge'

type ImageProp={
  alt?:string,
  src:string,
  imgClassName?:string,
  className?:string,
}
const Image = ({alt, src,imgClassName,className}:ImageProp) => {
  return (
    <div className={className}>
      <img src={src} alt={alt} className={cn("w-full h-full",imgClassName)}  />
    </div>
  )
}

export default Image