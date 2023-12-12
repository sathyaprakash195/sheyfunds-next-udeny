"use client";
import { Select, Input, Button } from "antd";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

const options = [
  {
    label: "All",
    value: "",
  },
  {
    value: "medical",
    label: "Medical",
  },
  {
    value: "education",
    label: "Education",
  },
  {
    value: "emergency",
    label: "Emergency",
  },
  {
    value: "environment",
    label: "Environment",
  },
  {
    value: "others",
    label: "Others",
  },
];

function Filters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [category = "", setCategory] = React.useState<string>(
    searchParams.get("category") || ""
  );
  const [organizer = "", setOrganizer] = React.useState<string>(
    searchParams.get("organizer") || ""
  );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 gap-5 my-5 items-end">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-500">
          Select Category
        </span>
        <Select
          value={category}
          options={options}
          onChange={(value) => setCategory(value)}
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-500">
          Search by Organizer
        </span>
        <Input
          value={organizer}
          onChange={(e: any) => setOrganizer(e.target.value)}
        />
      </div>
      <div className="flex gap-5">
        <Button
          onClick={() => {
            router.push(`/`);
            setCategory("");
            setOrganizer("");
          }}
          block
        >
          Reset
        </Button>
        <Button
          type="primary"
          onClick={() => {
            router.push(`/?category=${category}&organizer=${organizer}`);
          }}
          block
        >
          Filter
        </Button>
      </div>
    </div>
  );
}

export default Filters;
