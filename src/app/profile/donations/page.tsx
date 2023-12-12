import { getCurrentUserDataFromMongoDB } from "@/actions/users";
import DonationsTable from "@/components/donations-table";
import PageTitle from "@/components/page-title";
import { connectDB } from "@/db/config";
import DonationModal from "@/models/donation-model";
import React from "react";

connectDB();

async function DonationsPage() {
  const mongoUser = await getCurrentUserDataFromMongoDB();
  const donations = await DonationModal.find({ user: mongoUser.data._id })
    .populate("campaign")
    .populate("user")
    .sort({ createdAt: -1 });
  return (
    <div>
      <PageTitle title="Donations" />
      <DonationsTable
        donations={JSON.parse(JSON.stringify(donations))}
        fromAdmin={false}
      />
    </div>
  );
}

export default DonationsPage;
