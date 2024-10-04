import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { IoFileTrayOutline } from "react-icons/io5";
import Button from "../atom/Button";
import WalletConnectButton from "../../contributor/connectWalletButton";
import CampaignSuccessModal from "../molecule/CampaignSuccessModal";
import { useCreateCampaignStore } from "../util/store";
import { logout } from "../../api/auth";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { getAllCampaigns } from "../../api/campaign";
import { Campaign } from "../../api/types";
import { getImage } from "../../api/fileApi";
import Image from "../atom/Image";
import { getRemainingTime } from "../../components/getDate";

interface User {
  name: string;
  id: string;
  email: string;
}

const Dashboard = () => {
  const [hasCampagin, setHasCampagin] = useState<boolean>(true);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [copiedPublicKey, setCopiedPublicKey] = useState<boolean>(false);
  const [allCampaigns, setAllCampaigns] = useState<Array<Campaign>>([]);
  const [user, setUser] = useState<User>();
  const [campaignImages, setCampaignImages] = useState<{
    [key: string]: string;
  }>({});
  const navigate = useNavigate();
  const { campaignDetails } = useCreateCampaignStore();
  const wallet = useAnchorWallet();

  const handleAllCampaign = async () => {
    try {
      const campaigns = await getAllCampaigns();
      setAllCampaigns(campaigns);

      // Preload campaign images
      const imagePromises = campaigns.map(async (campaign) => {
        console.log(campaign);
        const imageUrl = await getImage(campaign.campaignImage);
        return { id: campaign._id, imageUrl };
      });

      const loadedImages = await Promise.all(imagePromises);
      const imagesMap = loadedImages.reduce((acc, { id, imageUrl }) => {
        acc[id] = imageUrl;
        return acc;
      }, {} as { [key: string]: string });

      setCampaignImages(imagesMap);
    } catch (error) {
      console.error("Error fetching campaigns or images:", error);
    }
  };

  const checkWalletStatus = () => {
    if (!wallet) {
      toast.error("Please connect wallet to continue", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
    return navigate("/dashboard/create-campaign");
  };

  useEffect(() => {
    handleAllCampaign();
    if (campaignDetails && Object.keys(campaignDetails).length > 0) {
      setShowDetails(true);
    }
    const getAccessToken = () => {
      const authUser = localStorage.getItem("user");
      if (authUser) {
        console.log(authUser);
        const parsedUser: User = JSON.parse(authUser);
        setUser(parsedUser);
      }
    };
    getAccessToken();
  }, []);

  return (
    <main className="w-[80vw] overflow-clip  py-[5%]">
      <ToastContainer />
      <section className="relative h-[40vh] lg:h-[50vh]  rounded-md">
        <Image
          className="h-full rounded-[12px]"
          imgClassName="object-cover rounded-[12px]"
          src="https://images.unsplash.com/photo-1726266852936-bb4cfcdffaf0?q=80&w=2062&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <div className="blk_graet_bg bg-color_gradient bg-center w-full absolute top-0 h-full rounded-[12px]" />
        <div className="flex flex-col md:flex-row md:items-end md:justify-between absolute bottom-[20px] text-white  px-8 w-full">
          <div className="w-full md:w-[50%]">
            <h3 className="text-[2rem] md:text-[2.5rem] font-bold">
              {user?.name}
            </h3>
            <p className="text-[.8rem] md:text-[1rem]">
              Good of the Earth is a non-profit organization dedicated to
              environmental conservation.
            </p>
            <div className="flex items-end justify-between">
              <Link to="">
                <Button
                  onClick={checkWalletStatus}
                  className="bg-[#512da8] text-white hover:bg-[#1a1f2e] mt-5 py-3 text-[1.1rem]"
                >
                  Create campaign
                </Button>
              </Link>
              <p onClick={logout} className="underline cursor-pointer mt-2">
                Logout
              </p>
            </div>
          </div>
          <WalletConnectButton />
        </div>
      </section>

      <section className="flex flex-wrap justify-center items-center mt-7 w-full px-5">
        <div className="w-[100%] flex flex-col md:flex-row items-center justify-around gap-[10px] rounded-[12px]">
          {/* Campaign cards */}
          {hasCampagin ? (
            allCampaigns.map((item) => (
              <Link
                to={`/dashboard/${item._id}`}
                key={item.id}
                className="flex-1 cursor-pointer w-full md:w-[30%] px-2 py-3 rounded-[5px] bg-cover bg-center"
                style={{
                  backgroundImage: campaignImages[item._id]
                    ? `linear-gradient(rgba(200, 70, 87, 0.3), rgba(133, 54, 95, 1)), url(${
                        campaignImages[item._id]
                      })`
                    : "none",
                }}
              >
                <h3 className="text-white text-[2rem] font-bold">
                  {item.title}
                </h3>

                <div className="flex items-center justify-between z-[3] gap-5 px-3 relative mt-5">
                  <div className="">
                    <div className="font-bold text-white">
                      <span className="lg:text-[2rem]">
                        SOL {item.currentAmount.toLocaleString()}{" "}
                      </span>
                      <span className="">
                        /SOL {item.targetAmount.toLocaleString()} raised
                      </span>
                    </div>
                    <span
                      className="block sbg-progress_bar border-[1px] border-[white] mt-1 h-[8px] w-full"
                      style={{
                        backgroundImage: `linear-gradient(to right, #fff ${item.currentAmount}%, transparent ${item.currentAmount}%)`,
                      }}
                    ></span>
                  </div>
                  <span className="text-[1.1rem]  text-white">
                    {getRemainingTime(item.endDate)}{" "}
                    {/* <span className="text-[1.1rem]">days left</span>{" "} */}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <section className="flex flex-col justify-center items-center bg-slate-400 w-[70%] py-6 rounded-[3px]">
              <h2 className="text-[1.2rem] font-bold flex items-center">
                <IoFileTrayOutline className="text-[2rem]" /> No campaign found
              </h2>
              <Link to={"/create-campaign"}>
                <Button className="bg-[#512da8] text-white hover:bg-[#1a1f2e] mt-5 py-3 text-[1.1rem]">
                  Create campaign
                </Button>
              </Link>
            </section>
          )}
        </div>
        {showDetails && (
          <CampaignSuccessModal
            campaignDetails={campaignDetails}
            setShowDetails={setShowDetails}
          />
        )}
      </section>
    </main>
  );
};

export default Dashboard;
