import React from 'react';
import logo from './assets/logo_gravid.png';
import './App.css';
import SectionHeader from './fundraiser/atom/SectionHeader';
import Button from './fundraiser/atom/Button';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <section className='items-center h-screen w-[90vw] overflow-y-auto lg:flex flex-col lg:overflow-y-clip'>
      <div className="h-auto  sself-start w-full   bg-[#FBECF] sticky lg:flex flex-col itfems-center  dlg:h-screen  md:px-[31px] lg:text-left lg:px-[3%] lg:w-[45%] ">
        <SectionHeader
          headingChildren={"Gravid Fundraiser"}
          headingClassName="font-bold "
          pChildren={"Securely donate and raise funds for noble causes"}
          pClassName="  text-[#808080] my-[8px]"
        />
      </div>

      <article className=" flex flex-col justify-between items-center gap-8 mt-8 md:flex-row">
        <div className="shadow-form_shadow bg-white px-6 py-8 rounded-[20px]  md:w-[40%] ">
        <h2 className="font-bold text-[1.6rem]">  Do you want to donate to an ongoing cause?</h2>
        <p className="">Donate securely and with ease to those who need it from the comfort of your home </p>
          <Link to={"/donate"}>
            <Button className='bg-primary_color text-white py-4 text-[1.2rem] mt-9 border-[1.5px] border-solid hover:text-primary_color hover:bg-transparent hover:border-primary_color '>
              View ongoing campaigns
            </Button>
          </Link>
        </div>
        <div className="shadow-form_shadow bg-white px-6 py-8 rounded-[20px]  md:w-[40%] ">
          <h2 className="font-bold text-[1.6rem]">Fundraising made easy</h2>
        <p className="">Create, update and securely manage your fundraising campaign</p>
          <Link  to={"/auth/sign-in"}>
            <Button className='bg-primary_color text-white py-4 text-[1.2rem] mt-9 border-[1.5px] border-solid hover:text-primary_color hover:bg-transparent hover:border-primary_color '>
              Sign in
            </Button>
          </Link>  
        </div>
      </article>      
    </section>
  );
}
