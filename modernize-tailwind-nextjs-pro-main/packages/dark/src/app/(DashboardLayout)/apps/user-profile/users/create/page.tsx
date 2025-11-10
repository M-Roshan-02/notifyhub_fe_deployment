import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import CreateUserApp from "@/app/components/apps/userprofile/users/create";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create User",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    to: "/apps/user-profile/friends",
    title: "Users",
  },
  {
    title: "Create User",
  },
];

const CreateUser = () => {
  return (
    <>
      <BreadcrumbComp title="Create User" items={BCrumb} />
      <CreateUserApp />
    </>
  );
};

export default CreateUser;
