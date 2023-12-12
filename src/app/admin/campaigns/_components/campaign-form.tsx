"use client";
import { addNewCampaign, editCampaign } from "@/actions/campaigns";
import { uploadImagesToFirebaseAndReturnUrls } from "@/helpers/uploads";
import { Button, Form, Input, Select, Switch, Upload, message } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

const { TextArea } = Input;

const categories = [
  {
    value: "medical",
    label: "medical",
  },
  {
    value: "education",
    label: "education",
  },
  {
    value: "emergency",
    label: "emergency",
  },
  {
    value: "Environment",
    label: "environment",
  },
  {
    value: "others",
    label: "others",
  },
];

interface Props {
  initialData?: any;
  isEditForm?: boolean;
}

function CampaignForm({ initialData, isEditForm = false }: Props) {
  const [loading = false, setLoading] = React.useState<boolean>(false);
  const [isActive, setIsActive] = React.useState(
    initialData?.isActive || false
  );
  const [showDonarsInCampaign, setShowDonarsInCampaign] = React.useState(
    initialData?.showDonarsInCampaign || false
  );
  const [newlySelectedFiles = [], setNewlySelectedFiles] = React.useState<
    any[]
  >([]);
  const [existingImages, setExistingImages] = React.useState<any[]>(
    initialData?.images || []
  );
  const router = useRouter();
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      values.isActive = isActive;
      values.showDonarsInCampaign = showDonarsInCampaign;

      const newlyUploadedImages = await uploadImagesToFirebaseAndReturnUrls(
        newlySelectedFiles
      );

      values.images = [...existingImages, ...newlyUploadedImages];

      let response: any = null;
      if (isEditForm) {
        values._id = initialData._id;
        response = await editCampaign(values);
      } else {
        response = await addNewCampaign(values);
      }
      if (response.error) throw new Error(response.error);
      message.success(response.message);
      router.refresh();
      router.push("/admin/campaigns");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={(values) => {
        onFinish(values);
      }}
      initialValues={initialData}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-3">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input a name" }]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="lg:col-span-3">
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input a description" }]}
          >
            <TextArea />
          </Form.Item>
        </div>

        <Form.Item
          name="organizer"
          label="Organizer"
          rules={[{ required: true, message: "Please input an organizer" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="targetAmount"
          label="Target Amount"
          rules={[{ required: true, message: "Please input an target amount" }]}
        >
          <Input type="number" min={100} />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please input a category" }]}
        >
          <Select options={categories} />
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Start date"
          rules={[{ required: true, message: "Please input a start date" }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="End date"
          rules={[{ required: true, message: "Please input an end date" }]}
        >
          <Input type="date" />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        <div className="flex gap-5">
          <span>Is Active ?</span>
          <Switch
            checked={isActive}
            onChange={(checked) => setIsActive(checked)}
          />
        </div>

        <div className="flex gap-5">
          <span>Show Donars in Campaign ?</span>
          <Switch
            checked={showDonarsInCampaign}
            onChange={(checked) => setShowDonarsInCampaign(checked)}
          />
        </div>
      </div>

      <Upload
        className="mt-5"
        beforeUpload={(file) => {
          setNewlySelectedFiles((prev) => [...prev, file]);
          return false;
        }}
        listType="picture-card"
        multiple
      >
        Upload Images
      </Upload>

      <div className="flex flex-wrap mt-5 gap-5">
        {existingImages.map((image, index) => (
          <div
            className="p-3 border rounded flex flex-col gap-2 border-dashed"
            key={index}
          >
            <img className="w-24 h-24 object-cover" src={image} alt="" />
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => {
                setExistingImages((prev) => prev.filter((_, i) => i !== index));
              }}
            >
              Delete
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-5 mt-5">
        <Button onClick={() => router.push("/admin/campaigns")}>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </div>
    </Form>
  );
}

export default CampaignForm;
