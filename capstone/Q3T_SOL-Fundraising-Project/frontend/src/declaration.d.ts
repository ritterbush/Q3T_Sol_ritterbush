declare module '*.png' {
    const value: string;
    export default value;
  }
  
declare namespace JSX {
  interface IntrinsicElements {
    "lottie-player": any;
  }
}