import { DateObject } from "../api/types";

export function getRemainingTime(targetDate: any): string {
    const now = new Date();
    const endDate = new Date(targetDate);
  
    // Calculate the difference in milliseconds
    const difference = endDate.getTime() - now.getTime();
  
    // If the time has elapsed
    if (difference <= 0) {
      return "Expired";
    }
  
    // Time calculations for days, hours, minutes, and seconds
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
    // Return the largest non-zero unit of time remaining
    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} remaining`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} remaining`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} remaining`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} remaining`;
    }
  }
  

  export function getRemainingTimeOnly(targetDate: any): DateObject {
    const now = new Date();
    const endDate = new Date(targetDate);
  
    // Calculate the difference in milliseconds
    const difference = endDate.getTime() - now.getTime();
  
    // If the time has elapsed
    if (difference <= 0) {
      return {range: "Expired", rangeDuration: 0};
    }
  
    // Time calculations for days, hours, minutes, and seconds
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
    // Return the largest non-zero unit of time remaining
    if (days > 0) {
        return {range : days > 1 ? "days" :"day", rangeDuration : days}
    } else if (hours > 0) {
        return {range : hours > 1 ? "hours" :"hour", rangeDuration : hours}
    } else if (minutes > 0) {
        return {range : minutes > 1 ? "minutes" :" minute", rangeDuration : minutes}
    } else {
        return {range : seconds > 1 ? "seconds" :"second", rangeDuration: seconds}
    }
  }
  