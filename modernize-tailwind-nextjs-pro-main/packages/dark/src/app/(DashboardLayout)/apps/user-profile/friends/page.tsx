import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import FriendsApp from "@/app/components/apps/userprofile/friends";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Users",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Users",
  },
];

const Friends = () => {
  return (
    <>
      <BreadcrumbComp title="Users" items={BCrumb} />
      <FriendsApp />
    </>
  );
};

export default Friends;
