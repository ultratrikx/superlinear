"use client";

import { ESize, EState, MbButton } from "mintbase-ui";
import Items from "./Items";
import { useState } from "react";
import { SelectedNft } from "@/types/types";
import BuyModal from "./BuyModal/BuyModal";

const LandingPage = () => {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({} as SelectedNft);

  const handleOpenBuyModal = (item: SelectedNft) => {
    setSelectedItem(item);
    setShowBuyModal(true);
  };

  const handleCloseBuyModal = () => {
    setSelectedItem({} as SelectedNft);
    setShowBuyModal(false);
  };

  return (
    <div className="w-full flex flex-col items-start gap-4">
      <div className="text-[40px]">Mintbase Simple Marketplace Example</div>
      <div>
        <p>
          View all user transations. Automatically deploy smart contracts to sent out rewards.
        </p>
        <p>Powered by NEAR.</p>
        <p>View user purchases below!</p>
        <div className="mt-4 flex">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://mintbase.xyz/leaderboard"
          >
            <MbButton
              label="See Leaderboard"
              size={ESize.MEDIUM}
              state={EState.ACTIVE}
            />
          </a>
        </div>
      </div>
      <div className="flex w-full">
        <Items showModal={handleOpenBuyModal} />
      </div>
      <div className="mx-24 mt-4">
        {!!showBuyModal && (
          <BuyModal closeModal={handleCloseBuyModal} item={selectedItem} />
        )}
      </div>
    </div>
  );
};

export default LandingPage;
