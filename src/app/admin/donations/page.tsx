import DonationsTable from "@/components/donations-table";
import PageTitle from "@/components/page-title";
import { connectDB } from "@/db/config";
import DonationModal from "@/models/donation-model";
import React from "react";

connectDB();

async function DonationsPage() {
  const donations = await DonationModal.find({}).populate("campaign").populate("user").sort({ createdAt: -1 });
  return (
    <div>
      <PageTitle title="Donations" />
      <DonationsTable donations={JSON.parse(JSON.stringify(donations))} fromAdmin={true} />
    </div>
  )
}

export default DonationsPage