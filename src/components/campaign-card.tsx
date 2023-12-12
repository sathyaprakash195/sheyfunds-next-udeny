"use client";
import React from "react";
import { Progress } from "antd";
import { useRouter } from "next/navigation";

interface CampaignCardProps {
  campaign: CampaignType;
}

function CampaignCard({ campaign }: CampaignCardProps) {
  const router = useRouter();
  const mainImage = campaign.images[0];
  const collectedPercentage = Math.round(
    (campaign.collectedAmount / campaign.targetAmount) * 100
  );
  return (
    <div
      className="border rounded  border-gray-300 border-solid hover:border-gray-700 cursor-pointer"
      onClick={() => router.push(`/campaign/${campaign._id}`)}
    >
      <img src={mainImage} className="w-full h-60 object-cover rounded-t" />
      <div className="p-3 flex flex-col">
        <h1 className="text-sm font-semibold text-primary">{campaign.name}</h1>
        <Progress percent={collectedPercentage} />
        <span className="text-sm text-gray-500">
          $ {campaign.collectedAmount} raised of ${campaign.targetAmount}
        </span>

        <span className="text-xs text-gray-500 mt-2 font-semibold">
          Organized by {campaign.organizer}
        </span>
      </div>
    </div>
  );
}

export default CampaignCard;
