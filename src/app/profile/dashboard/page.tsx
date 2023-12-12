import DashboardCard from "@/components/dashboard-card";
import PageTitle from "@/components/page-title";
import { connectDB } from "@/db/config";
import CampaignModel from "@/models/campaign-model";
import DonationModal from "@/models/donation-model";
import React from "react";
import DonationsTable from "@/components/donations-table";
import { getCurrentUserDataFromMongoDB } from "@/actions/users";
import mongoose from "mongoose";

connectDB();

async function Dashboard() {
  const mongoUser = await getCurrentUserDataFromMongoDB();
  const userId = new mongoose.Types.ObjectId(mongoUser.data._id);
  let [donationsCount, amountRaised] = await Promise.all([
    DonationModal.countDocuments({
      user: mongoUser.data._id,
    }),
    DonationModal.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  amountRaised = amountRaised[0]?.totalAmount || 0;

  const recentDonations = await DonationModal.find({
    user: mongoUser.data._id,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("campaign");
  return (
    <div>
      <PageTitle title="Dashboard" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardCard
          cardTitle="Donations"
          description="Total number of donations for all campaigns"
          value={donationsCount.toString()}
          onClickPath="/admin/donations"
        />

        <DashboardCard
          cardTitle="Amount Donated"
          description="Total amount donated for all campaigns"
          value={`$ ${amountRaised}`}
        />
      </div>

      <div className="mt-10">
        <h1 className="text-2xl font-semibold">Recent Donations</h1>
        <DonationsTable
          donations={JSON.parse(JSON.stringify(recentDonations))}
          fromAdmin={false}
        />
      </div>
    </div>
  );
}

export default Dashboard;
