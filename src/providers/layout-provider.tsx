"use client";
import { getCurrentUserDataFromMongoDB } from "@/actions/users";
import { UserButton } from "@clerk/nextjs";
import { Button, Dropdown, Spin, message } from "antd";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [menuToShow, setMenuToShow] = React.useState<any>([]);
  const pathname = usePathname();
  const router = useRouter();

  const userMenu = [
    {
      name: "Dashboard",
      url: "/profile/dashboard",
    },
    {
      name: "Donations",
      url: "/profile/donations",
    },
  ];
  const adminMenu = [
    {
      name: "Dashboard",
      url: "/admin/dashboard",
    },
    {
      name: "Donations",
      url: "/admin/donations",
    },
    {
      name: "Campaigns",
      url: "/admin/campaigns",
    },
    {
      name: "Users",
      url: "/admin/users",
    },
  ];

  const getCurrentUser = async () => {
    try {
      const response = await getCurrentUserDataFromMongoDB();
      if (response.error) throw new Error(response.error);
      setCurrentUser(response.data);
      if (response.data?.isAdmin) {
        setMenuToShow(adminMenu);
      } else {
        setMenuToShow(userMenu);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const getHeader = () => {
    // if the route sign-in or sign-up, don't show header
    if (pathname.includes("/sign-in") || pathname.includes("sign-up"))
      return null;

    return (
      <div className="p-3 bg-primary flex justify-between items-center">
        <h1
          className="font-semibold text-2xl text-white cursor-pointer"
          onClick={() => router.push("/")}
        >
          SHEYFUNDS
        </h1>
        <div className="bg-white rounded py-2 px-3 flex items-center gap-5">
          <Dropdown
            menu={{
              items: menuToShow.map((menu: any) => ({
                key: menu.name,
                label: menu.name,
                onClick: () => {
                  router.push(menu.url);
                },
              })),
            }}
          >
            <Button type="link" className="text-primary">
              {currentUser?.userName}
            </Button>
          </Dropdown>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    );
  };

  const getContent = () => {
    // if the route is private , render children only after getting current user
    const isPrivateRoute = pathname !== "/sign-in" && pathname !== "/sign-up";
    const isAdminRoute = pathname.includes("/admin");
    if (isPrivateRoute && !currentUser)
      return (
        <div className="flex justify-center items-center mt-20">
          <Spin />
        </div>
      );

    if (isPrivateRoute && currentUser && isAdminRoute && !currentUser.isAdmin) {
      return (
        <div className="flex justify-center mt-20">
          <span>
            You are not authorized to access this page. Please contact admin.
          </span>
        </div>
      );
    }
    return <div className={`${isPrivateRoute ? "p-5" : ""}`}>{children}</div>;
  };

  useEffect(() => {
    getCurrentUser();
  }, []);
  return (
    <div>
      {getHeader()}
      {getContent()}
    </div>
  );
}

export default LayoutProvider;
