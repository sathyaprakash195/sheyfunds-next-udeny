import DonationCard from "@/components/donation-card";
import LinkButton from "@/components/link-button";
import { connectDB } from "@/db/config";
import CampaignModel from "@/models/campaign-model";
import DonationModal from "@/models/donation-model";
import React from "react";

connectDB();

interface SingleCampaignPageProps {
  params: {
    campaignid: string;
  };
}

async function SingleCampaignPage({ params }: SingleCampaignPageProps) {
  const campaign: CampaignType = (await CampaignModel.findById(
    params.campaignid
  )) as any;

  const recent5Donations = await DonationModal.find({
    campaign: params.campaignid,
  })
    .populate("user", "userName")
    .sort({ createdAt: -1 })
    .limit(5);

  const getProperty = (key: string, value: any) => {
    return (
      <div className="flex flex-col text-sm">
        <span className="font-bold text-gray-800">{key}</span>
        <span className="text-gray-600">{value}</span>
      </div>
    );
  };

  return (
    campaign && (
      <div className="flex flex-col">
        <LinkButton title="Back to Campaigns" path="/" />
        <h1 className="text-2xl font-bold text-gray-600">{campaign.name}</h1>

        <div className="grid md:grid-cols-3 gap-7 grid-cols-1">
          <div className="col-span-2 flex flex-col gap-7">
            <div className="flex flex-wrap gap-5">
              {campaign.images.map((image) => (
                <img src={image} className="h-60 object-cover rounded" />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {getProperty("Organizer", campaign.organizer)}
              {getProperty("Start date", campaign.startDate)}
              {getProperty("End date", campaign.endDate)}
              {getProperty("Target amount", `$ ${campaign.targetAmount}`)}
              {getProperty("Collected amount", `$ ${campaign.collectedAmount}`)}
            </div>

            <p className="text-sm text-gray-600">{campaign.description}</p>
          </div>
          <div className="col-span-1">
            <DonationCard
              donations={JSON.parse(JSON.stringify(recent5Donations))}
              campaign={JSON.parse(JSON.stringify(campaign))}
            />
          </div>
        </div>
      </div>
    )
  );
}

export default SingleCampaignPage;
