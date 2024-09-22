import React, { useEffect, useState } from "react";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import WalletConnectButton from "./connectWalletButton";
import "./donate.css";
import importedWallet from "./utils/wallet.json";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import createContribution from "./utils/contribute";
import { getCampaignById, updateCampaign } from "../api/campaign";
import { getImage } from "../api/fileApi";
import { getRemainingTime } from "../components/getDate";
import { Campaign } from "../api/types";
import { Bounce, toast, ToastContainer } from "react-toastify";
import Input from "../fundraiser/atom/Input";

export default function Donate() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [amount, setAmount] = useState("0");

  // const network = WalletAdapterNetwork.Devnet;
  const { publicKey } = useWallet();

  const baseAccount = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(importedWallet)
  );

  console.log(baseAccount.publicKey.toString());

  const wallet = useAnchorWallet();

  const parsedId = id ? id : null;

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

  const fetchCampaign = async () => {
    if (id) {
      try {
        const data = await getCampaignById(id);
        setCampaign(data); // Set the campaign data
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const image = await getImage(data.campaignImage);
        setImageUrl(image); //
      } catch (error) {
        console.error("Error fetching campaign:", error);
      }
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const contribute = async () => {
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
    if (Number(amount) <= 0) {
      toast.error("Amount must not be 0", {
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
    if (publicKey && wallet) {
      const id = toast.loading(
        "initializing wallet for fundraising campaign contribution..."
      );
      const hash = await createContribution(
        publicKey,
        getProvider(),
        baseAccount,
        amount
      );
      if (!hash) {
        toast.update(id, {
          render: "Initialization Failed",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
      try {
        await updateCampaign(parsedId, {
          publicKey: getProvider()?.wallet.publicKey,
          amount: Number(amount),
        });
      } catch (e) {
        toast.update(id, {
          render: "an error occurred",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
      toast.update(id, {
        render: "Initialization Successful and Contributions Successful",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    } else {
      console.log("failed to initialize and load wallet");
    }
  };

  return (
    <div
      className="body"
      style={{
        marginTop: -25,
        backgroundImage: `linear-gradient(rgba(200, 70, 87, 0.3), rgba(133, 54, 95, 0.8)), url(${imageUrl})`,
      }}
    >
      <div id="app" className="donate-funding">
        <ToastContainer />
        <WalletConnectButton />
        <div>
          <div className="donate-funding__header">
            <div className="donate-funding__header__description">
              <h1>{campaign?.title}</h1>
              <p>{campaign?.title}</p>
              <div className="hashtags">{campaign?.tag}</div>
            </div>

            <div className="donate-funding__header__details">
              <h5 className="days-to-go">
                {getRemainingTime(campaign?.endDate)}
              </h5>
              {/* <p className="days-to-go">days to go</p> */}
              <div className="funding-counter">
                <p>
                  <strong>
                    Sol {campaign?.currentAmount} / SOL {campaign?.targetAmount}{" "}
                    raised
                  </strong>
                </p>
                {/* <div className="funding-counter__bar"></div> */}
              </div>
            </div>
          </div>
          <div className="donate-funding__main" key={parsedId}>
            <div className="donate-funding__main__col col1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                fill="#85365f"
              >
                <path d="M 26.978516 3.0214844 C 26.978516 3.0214844 18 3 11 10 C 10.676811 10.323189 10.395406 10.675024 10.140625 11.039062 C 8.8995439 10.939831 6.9997651 10.972248 6.0273438 11.945312 C 3.7573437 14.215312 3 18 3 18 L 8 17.285156 L 8 19 L 11 22 L 12.714844 22 L 12 27 C 12 27 15.784688 26.242656 18.054688 23.972656 C 19.027752 23.000235 19.060169 21.100456 18.960938 19.859375 C 19.324976 19.604594 19.676811 19.323189 20 19 C 27 12 26.978516 3.0214844 26.978516 3.0214844 z M 19 9 C 20.105 9 21 9.895 21 11 C 21 12.105 20.105 13 19 13 C 17.895 13 17 12.105 17 11 C 17 9.895 17.895 9 19 9 z M 7.1992188 19.996094 C 6.8192188 20.096094 6.4591094 20.286984 6.1621094 20.583984 C 4.7961094 21.949984 5.0136719 24.984375 5.0136719 24.984375 C 5.0136719 24.984375 8.0281094 25.219938 9.4121094 23.835938 C 9.7091094 23.538937 9.9 23.176875 10 22.796875 L 9.5429688 22.339844 C 9.4979688 22.403844 9.4701094 22.478156 9.4121094 22.535156 C 8.4371094 23.510156 6.9746094 23.023438 6.9746094 23.023438 C 6.9746094 23.023438 6.4868906 21.560938 7.4628906 20.585938 C 7.5208906 20.527938 7.59225 20.501078 7.65625 20.455078 L 7.1992188 19.996094 z"></path>
              </svg>
              <h4>{campaign?.title}</h4>
              <span className="content">{campaign?.description}</span>
              <span className="content">{campaign?.description}</span>
              <div>
                <Input
                  id="title"
                  name="title"
                  type="number"
                  className="mt-4"
                  htmlFor="title"
                  label={
                    <>
                      Amount of SOL to donate
                      <span className="font-bold text-red-500">*</span>
                    </>
                  }
                  value={amount}
                  required
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="button">
                <strong onClick={() => contribute()}>
                  <small>Confirm</small>
                </strong>
              </div>
            </div>

            <div className="donate-funding__main__col col2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                fill="#85365f"
              >
                <path d="M 6.5292969 2.515625 A 1 1 0 0 0 5.8085938 2.8085938 A 1 1 0 0 0 5.8085938 4.2226562 A 1 1 0 0 0 7.2226562 4.2226562 A 1 1 0 0 0 7.2226562 2.8085938 A 1 1 0 0 0 6.5292969 2.515625 z M 23.5 2.515625 A 1 1 0 0 0 22.777344 2.8085938 A 1 1 0 0 0 22.777344 4.2226562 A 1 1 0 0 0 24.191406 4.2226562 A 1 1 0 0 0 24.191406 2.8085938 A 1 1 0 0 0 23.5 2.515625 z M 15 3 C 10.029 3 6 7.029 6 12 C 6 17 10 19 12 23 L 18 23 C 20 19 24 17 24 12 C 24 7.029 19.971 3 15 3 z M 15 6 L 15 11 L 19 11 L 15 18 L 15 13 L 11 13 L 15 6 z M 3 11 A 1 1 0 0 0 2 12 A 1 1 0 0 0 3 13 A 1 1 0 0 0 4 12 A 1 1 0 0 0 3 11 z M 27 11 A 1 1 0 0 0 26 12 A 1 1 0 0 0 27 13 A 1 1 0 0 0 28 12 A 1 1 0 0 0 27 11 z M 6.5292969 19.484375 A 1 1 0 0 0 5.8066406 19.777344 A 1 1 0 0 0 5.8066406 21.191406 A 1 1 0 0 0 7.2226562 21.191406 A 1 1 0 0 0 7.2226562 19.777344 A 1 1 0 0 0 6.5292969 19.484375 z M 23.498047 19.486328 A 1 1 0 0 0 22.777344 19.777344 A 1 1 0 0 0 22.777344 21.193359 A 1 1 0 0 0 24.191406 21.193359 A 1 1 0 0 0 24.191406 19.777344 A 1 1 0 0 0 23.498047 19.486328 z M 12 25 L 12 26 C 12 27.105 12.895 28 14 28 A 1 1 0 0 0 15 29 A 1 1 0 0 0 16 28 C 17.105 28 18 27.105 18 26 L 18 25 L 12 25 z"></path>
              </svg>
              <h4>
                Why should you care? Who knows. But here's a list to help you
                decide:
              </h4>
              <ul>
                {campaign?.whyCare?.map((val: any) => (
                  <li className="list-content">{val}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
