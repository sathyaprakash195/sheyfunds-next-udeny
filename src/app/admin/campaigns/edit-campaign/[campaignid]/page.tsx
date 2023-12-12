export const dynamic = "force-dynamic";

import React from "react";
import PageTitle from "@/components/page-title";

import CampaignForm from "../../_components/campaign-form";
import { connectDB } from "@/db/config";
import CampaignModel from "@/models/campaign-model";

connectDB();
interface Props {
  params: {
    campaignid: string;
  };
}

async function EditCampaignPage({ params }: Props) {
  const campaign = await CampaignModel.findById(params.campaignid);
  return (
    <div>
      <PageTitle title="Edit Campaign" />
      {campaign && (
        <CampaignForm
          initialData={JSON.parse(JSON.stringify(campaign))}
          isEditForm={true}
        />
      )}
    </div>
  );
}

export default EditCampaignPage;
