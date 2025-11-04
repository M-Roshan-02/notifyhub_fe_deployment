import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import UsersApp from "@/app/components/apps/userprofile/users";
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

const Users = () => {
  return (
    <>
      <BreadcrumbComp title="Users" items={BCrumb} />
      <UsersApp />
    </>
  );
};

export default Users;
