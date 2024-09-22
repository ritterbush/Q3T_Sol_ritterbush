import React, { useState } from "react";
import Button from "../atom/Button";
import SectionHeader from "../atom/SectionHeader";
import Input from "../atom/Input";
import { checkCampaign, createCampaign } from "../../api/campaign";
import { useNavigate } from "react-router";
import { useCreateCampaignStore } from "../util/store";
import { IoIosArrowBack } from "react-icons/io";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import importedWallet from "../../contributor/utils/wallet.json";
import initialize from "../../contributor/utils/initialize";
import { uploadImage } from "../../api/fileApi";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { convertWallet } from "../../contributor/utils/convertKeys";

interface CampaignCreation {
  title: string;
  description: string;
  whyCare: [string];
  tag: string;
}

const CreateCampaign = () => {
  const initialData: CampaignCreation = {
    title: "",
    description: "",
    whyCare: [""],
    tag: "",
    // uploadFile: "",
  };
  const [inputValue, setInputValue] = useState<any>(initialData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFilename, setUploadedFilename] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [datetime, setDatetime] = useState<string>("");
  const navigate = useNavigate();
  const { updateCampaginDetails } = useCreateCampaignStore();

  const { publicKey } = useWallet();

  const baseAccount = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(importedWallet)
  );
  // console.log(convertWallet(baseAccount.secretKey));
  // const baseAccount = anchor.web3.Keypair.generate();
  // console.log(baseAccount.secretKey);
  console.log(baseAccount.publicKey);

  const wallet = useAnchorWallet();
  function getProvider() {
    if (!wallet) {
      console.log("No wallet connected");
      return;
    }
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const provider = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "confirmed",
    });

    return provider;
  }

  const handleChanges = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInputValue((prev: { [key: string]: string }) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  function handleChangeDate(ev: any) {
    if (!ev.target["validity"].valid) return;
    const dt = ev.target["value"] + ":00Z";
    setDatetime(dt);
  }

  const formatDateForInput = (datetimeString: any) => {
    const date = new Date(datetimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading 0
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleUpload = async (): Promise<string | null> => {
    if (!selectedFile) {
      toast.error("Please select an image for campaign", {
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
      return null;
    }

    try {
      const data = await uploadImage(selectedFile);
      setUploadedFilename(data.filename);
      return data.filename; // Assuming backend responds with file information
    } catch (error) {
      toast.error("Error Uploading Image", {
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
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = toast.loading("Create and initializing fundraising campaign...");
    const checkStatus = await checkCampaign();
    console.log(checkStatus);
    if (checkStatus.message !== "false") {
      toast.warning("You already have an active campaign running", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (publicKey && wallet) {
      console.log(amount);
      if (!amount || !datetime) {
        toast.update(id, {
          render: "Incorrect details were passed",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        return;
      }
      await initialize(
        publicKey,
        getProvider(),
        baseAccount,
        datetime,
        Number(amount)
      )
        .then(async (response) => {
          if (response) {
            let fileName = await handleUpload();
            if (!fileName) return;
            const formData = {
              ...inputValue,
              whyCare: inputValue.whyCare.split("|"),
              campaignImage: fileName,
              campaignProgramId: response,
              privateKey: convertWallet(baseAccount.secretKey),
              publickKey: baseAccount.publicKey,
              endDate: datetime,
              targetAmount: amount,
            };
            try {
              const createdCampaign = await createCampaign(formData);
              if (createdCampaign) {
                toast.update(id, {
                  render: "Initialization Successful",
                  type: "success",
                  isLoading: false,
                  autoClose: 5000,
                });
                toast.success("Fundraising Campaign Created Successfully", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                  transition: Bounce,
                });
                setTimeout(() => {
                  updateCampaginDetails(createdCampaign);
                  navigate("/dashboard");
                }, 5000);
              }

              console.log(createdCampaign);
            } catch (error) {
              toast.update(id, {
                render: "Initialization Failed",
                type: "error",
                isLoading: false,
              });
              console.error("Error creating campaign:", error);
            }
          }
        })
        .catch(() => {
          toast.update(id, {
            render: "Initialization Failed",
            type: "error",
            autoClose: 5000,
            isLoading: false,
          });
        });
    } else {
      console.log("failed to initialize and load wallet");
    }
  };

  return (
    <main className="bg-graidnt_bg items-center w-[90vw] justify-center overflow-y-auto lg:flex lg:overflow-y-clip">
      <ToastContainer />
      <div
        onClick={() => navigate(-1)}
        className=" absolute top-5 left-5 hidden lg:flex items-center text-black  text-[20px] cursor-pointer"
      >
        <IoIosArrowBack className="text-[1.7rem]" /> <p className="">Back</p>
      </div>
      <div className="h-auto  sself-start w-full   bg-[#FBECF] sticky lg:flex flex-col itfems-center  dlg:h-screen  md:px-[31px] lg:text-left lg:px-[3%] lg:w-[45%] ">
        <SectionHeader
          headingChildren={"Create your campaign"}
          headingClassName="font-bold text-[2rem]"
          pChildren="Guidance, expertise, and personalized setup - all a conversation away."
          pClassName="  text-[#808080] my-[8px]"
        />
      </div>
      <section className="w-[100%] my-[10%] px-[16px]  h-screen no-scrollbar overflow-y-scroll md:w-[80%] lg:my-0 lg:px-[5%] lg:py-[4%]  lg:w-[55%]">
        <form
          className="shadow-form_shadow no-scrollbar overflow-y-scroll rounded-[10px] md:w-[100%] md:px-[31px] lg:py-[5%] lg:px-[5%] "
          onSubmit={handleSubmit}
        >
          <Input
            id="title"
            name="title"
            type="text"
            className="mt-4"
            htmlFor="title"
            label={
              <>
                Campaign Title<span className="font-bold text-red-500">*</span>
              </>
            }
            value={inputValue.title}
            required
            onChange={handleChanges}
          />

          <div className="my-[16px]">
            <label
              className="block  text-[#3E3E3E] text-[1rem]  md:[1.3rem]"
              htmlFor="description"
            >
              Campaign description
              <span className="font-bold text-red-500">*</span>
            </label>

            <textarea
              rows={2}
              required
              className="w-full border-b-[3px] bg-transparent border-[#808080] py-4 rounded-[4px] pl-[10px] pr-[5px]  mt-[12px]  text-[1.1rem] outline-0 "
              value={inputValue.description}
              onChange={handleChanges}
              name="description"
              id="description"
            ></textarea>
          </div>
          <Input
            id="targetAmount"
            name="targetAmount"
            type="number"
            min={"0"}
            className="mt-4"
            htmlFor="targetAmount"
            label={
              <>
                <div>
                  Target amount in SOL
                  <span className="font-bold text-red-500">*</span>
                </div>
                <i>
                  Write down the amount you intend raising for this campaign
                </i>{" "}
              </>
            }
            value={amount}
            required
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="my-[16px]">
            <label
              className="block  text-[#3E3E3E] text-[1rem]  md:[1.3rem]"
              htmlFor="whyCare"
            >
              <div className="">
                Why should the contributor care ?
                <span className="font-bold text-red-500">*</span>
              </div>
              <i>Separate each reason with </i>
              <b>'|'</b>
            </label>
            <textarea
              rows={2}
              required
              placeholder="Example: To get | test"
              className="w-full border-b-[3px] bg-transparent border-[#808080] py-4 rounded-[4px] pl-[10px] pr-[5px]  mt-[12px]  text-[1.1rem] outline-0 "
              value={inputValue.whyCare}
              onChange={handleChanges}
              name="whyCare"
              id="whyCare"
            ></textarea>
          </div>
          <Input
            id="endDate"
            name="endDate"
            type="datetime-local"
            className="mt-4"
            htmlFor="endDate"
            label={
              <>
                How long should your campaign last
                <span className="font-bold text-red-500">*</span>
              </>
            }
            value={formatDateForInput(datetime)}
            onChange={handleChangeDate}
            required
          />
          <Input
            id="tag"
            name="tag"
            type="text"
            className="mt-4"
            htmlFor="hashtags"
            label={
              <>
                <div className="">Hashtags</div>
                <i>Add as many tags as you want</i>
              </>
            }
            value={inputValue.tag}
            onChange={handleChanges}
          />
          <Input
            id="uploadFile"
            name="uploadFile"
            type="file"
            className="mt-4 "
            inputClassName="border-b-0"
            htmlFor="uploadFile"
            label={
              <>
                Upload a cover photo
                <span className="font-bold text-red-500">*</span>
              </>
            }
            value={inputValue.uploadFile}
            onChange={handleFileChange}
          />
          <Button className="bg-primary_color text-white py-4 text-[1.2rem] mt-3 ">
            Create campaign
          </Button>
        </form>
      </section>
    </main>
  );
};

export default CreateCampaign;
