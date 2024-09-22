import React, { useState } from 'react'
import Button from '../atom/Button';
import { FaCopy } from 'react-icons/fa6';

const CampaignSuccessModal = ({campaignDetails ,setShowDetails}:any) => {
  const [copiedPublicKey, setCopiedPublicKey] = useState<boolean>(false);
  const [copiedPrivateKey, setCopiedPrivateKey] = useState<boolean>(false);


  return (
   <section className="fixed left-0 top-0 w-screen h-screen flex flex-col items-center justify-center bg-blk_graet_bg z-50">
          <lottie-player
            autoplay
            controls
            loop
            mode="normal"
            src="https://lottie.host/bb7d8892-14db-4c71-8fbf-ba38cb3bb906/TD3JJKhgdu.json"
            style={{ width: "320px" }}
          ></lottie-player>
          <ul className="bg-white capitalize flex flex-col text-[1.2rem] rounded-lg px-[2%] py-[2%]">
            <li className="mb-3">
              <h4 className="text-[1.8rem] font-bold"> {campaignDetails.title}</h4>
              <p className="">
               {campaignDetails.description}
              </p>
            </li>
            <li className="flex items-center my-2">
              <h4 className="font-bold"> Public key: </h4>
              <div className="flex gap-3 justify-between items-center">
                <input
                  className="mx-2  w-[400px]"
                  readOnly
                  value={"hbsd78wdcbwe8g23jd9vadjcv9dvjb2ei8dvh"}
                />
                <FaCopy
                  className="cursor-pointer"
                  onClick={() => {
                    navigator.clipboard
                      .writeText("hbsd78wdcbwe8g23jd9vadjcv9dvjb2ei8dvh")
                      .then(() => {
                        setCopiedPublicKey(true);
                        setTimeout(() => setCopiedPublicKey(false), 2000);
                      })
                      .catch((err) => {
                        console.error("Failed to copy text: ", err);
                      });
                  }}
                />
                {copiedPublicKey && <p className="ml-2">Copied!</p>}
              </div>
            </li>
            <li className="flex items-center my-2">
              <h4 className="font-bold"> Private key: </h4>
              <div className="flex gap-3 justify-between items-center">
                <input
                  className="mx-2  w-[400px]"
                  readOnly
                  value={"asjhdvcjhbaksdcjasdcbvajhc vasd vhasd cvsdjcvajsdb"}
                />
                <FaCopy
                  className="cursor-pointer"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(
                        "asjhdvcjhbaksdcjasdcbvajhc vasd vhasd cvsdjcvajsdb"
                      )
                      .then(() => {
                        setCopiedPrivateKey(true);
                        setTimeout(() => setCopiedPrivateKey(false), 2000);
                      })
                      .catch((err) => {
                        console.error("Failed to copy text: ", err);
                      });
                  }}
                />
                {copiedPrivateKey && <p className="ml-2">Copied!</p>}
              </div>
            </li>
            <li className="flex items-center my-2">
              <h4 className=" font-bold"> Target amount: </h4>
              <p className="">
               {campaignDetails.targetAmount}
              </p>
            </li>
            <Button
              className="self-end border-[1px] border-solid border-gray-400 w-[40%] py-2 mt-7 text-[1rem]  hover:bg-[#1a1f2e] hover:text-white"
              onClick={() => {
                setShowDetails(false)
              }}
            >
              Close
            </Button>
          </ul>
        </section>
  )
}

export default CampaignSuccessModal