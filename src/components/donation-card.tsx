"use client";
import { getStripeClientSecret } from "@/actions/payments";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button, Input, Modal, Progress } from "antd";
import { message as antdMessage } from "antd";
const { TextArea } = Input;
import React from "react";
import PaymentModal from "./payment-modal";
import { getDonationsByCampaignId } from "@/actions/donations";

interface DonationCardProps {
  campaign: CampaignType;
  donations?: DonationType[];
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function DonationCard({ campaign, donations = [] }: DonationCardProps) {
  const [allDonations = [], setAllDonations] = React.useState<DonationType[]>(
    []
  );
  const [showAllDonationsModal = false, setShowAllDonationsModal] =
    React.useState<boolean>(false);
  const [showPaymentModal = false, setShowPaymentModal] =
    React.useState<boolean>(false);
  const [loading = false, setLoading] = React.useState<boolean>(false);
  const [clientSecret = "", setClientSecret] = React.useState<string>("");
  const [amount, setAmount] = React.useState<number>();
  const [message, setMessage] = React.useState("");
  const collectedPercentage = Math.round(
    (campaign.collectedAmount / campaign.targetAmount) * 100
  );

  const getClientSecret = async () => {
    try {
      setLoading(true);
      const response = await getStripeClientSecret({ amount });
      if (response.error) throw new Error(response.error);
      setClientSecret(response.clientSecret);
      setShowPaymentModal(true);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const donationCard = (donation: DonationType) => {
    return (
      <div className="p-2 rounded-sm  bg-gray-100 flex flex-col">
        <span className="text-gray-600 text-sm font-semibold">
          $ {donation.amount} by {donation.user.userName}
        </span>
        <span className="text-gray-500 text-sm">{donation.message}</span>
      </div>
    );
  };

  const getRecentDonations = () => {
    if (donations?.length === 0)
      return (
        <span className="text-gray-600 text-sm">
          No donation yet. Be the first to donate to this campaign.
        </span>
      );

    return donations?.map((donation) => donationCard(donation));
  };

  const getAllDonations = async () => {
    try {
      const response: any = await getDonationsByCampaignId(campaign._id);
      if (response.error) throw new Error(response.error);
      setAllDonations(response?.data);
    } catch (error: any) {
      antdMessage.error(error.message);
    }
  };

  return (
    <div className="border border-solid rounded border-gray-300 p-5">
      <span className="text-xl text-primary font-semibold">
        $ {campaign.collectedAmount} raised of ${campaign.targetAmount}
      </span>
      <Progress percent={collectedPercentage} />

      {campaign.showDonarsInCampaign && (
        <>
          <span className="text-gray-600 text-sm font-semibold my-5 pb-5">
            Recent Donations
          </span>
          <div className="flex flex-col gap-5 my-5">{getRecentDonations()}</div>

          {donations?.length > 0 && (
            <span
              className="text-primary text-sm font-semibold cursor-pointer underline"
              onClick={() => {
                setShowAllDonationsModal(true);
                getAllDonations();
              }}
            >
              View all{" "}
            </span>
          )}
        </>
      )}

      <hr className="my-10" />

      <div className="flex flex-col gap-5 mt-5">
        <Input
          placeholder="Amount"
          type="number"
          onChange={(e) => setAmount(Number(e.target.value))}
          value={amount}
        />

        <TextArea
          placeholder="Message"
          rows={4}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />

        <Button
          type="primary"
          block
          disabled={!amount}
          onClick={getClientSecret}
          loading={loading}
        >
          Donate
        </Button>
      </div>

      {showPaymentModal && clientSecret && (
        <Modal
          open={showPaymentModal}
          onCancel={() => {
            setShowPaymentModal(false);
            setClientSecret("");
          }}
          width={600}
          footer={null}
          title="Complete your donation payment"
        >
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
            }}
          >
            <PaymentModal
              messageText={message}
              campaign={campaign}
              amount={amount || 0}
            />
          </Elements>
        </Modal>
      )}

      {showAllDonationsModal && (
        <Modal
          open={showAllDonationsModal}
          onCancel={() => {
            setShowAllDonationsModal(false);
          }}
          width={600}
          footer={null}
          title="All donations for this campaign"
        >
          <div className="flex flex-col gap-5 my-5">
            {allDonations.map((donation) => donationCard(donation))}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default DonationCard;
