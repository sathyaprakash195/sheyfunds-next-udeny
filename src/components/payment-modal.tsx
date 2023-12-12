import React from "react";
import {
  AddressElement,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, message } from "antd";
import { addNewDonation } from "@/actions/donations";
import { useRouter } from "next/navigation";

interface PaymentModalProps {
  campaign: CampaignType;
  amount: number;
  messageText: string;
}

function PaymentModal({ campaign, amount, messageText }: PaymentModalProps) {
  const [loading, setLoading] = React.useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      setLoading(true);
      event.preventDefault();

      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }

      const result = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: "https://localhost:3000/profile/donations",
        },
        redirect: "if_required",
      });

      if (result.error) {
        message.error(result.error.message);
      } else {
        message.success("Payment successful");
        const donationPayload = {
          campaign: campaign._id,
          amount,
          message: messageText,
          paymentId: result.paymentIntent?.id,
        };
        await addNewDonation(donationPayload);
        message.success("Donation successful");
        router.push("/profile/donations");
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <PaymentElement />
      <AddressElement
        options={{
          allowedCountries: ["US"],
          mode: "shipping",
        }}
      />
      <div className="flex gap-5 justify-end mt-5">
        <Button>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          Pay
        </Button>
      </div>
    </form>
  );
}

export default PaymentModal;
