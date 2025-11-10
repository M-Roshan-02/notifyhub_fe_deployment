

//Apps Links Type & Data
interface appsLinkType {
  href: string;
  title: string;
  subtext: string;
  avatar: string;
}

const appsLink: appsLinkType[] = [
  {
    href: "/apps/chats",
    title: "Chat Application",
    subtext: "New messages arrived",
    avatar: "/images/svgs/icon-dd-chat.svg",
  },
  {
    href: "/apps/ecommerce/shop",
    title: "eCommerce App",
    subtext: "New stock available",
    avatar: "/images/svgs/icon-dd-cart.svg",
  },
  {
    href: "/apps/notes",
    title: "Notes App",
    subtext: "To-do and Daily tasks",
    avatar: "/images/svgs/icon-dd-invoice.svg",
  },
  {
    href: "/apps/calendar",
    title: "Calendar App",
    subtext: "Get dates",
    avatar: "/images/svgs/icon-dd-date.svg",
  },
  {
    href: "/apps/contacts",
    title: "Contact Application",
    subtext: "2 Unsaved Contacts",
    avatar: "/images/svgs/icon-dd-mobile.svg",
  },
  {
    href: "/apps/tickets",
    title: "Tickets App",
    subtext: "Submit tickets",
    avatar: "/images/svgs/icon-dd-lifebuoy.svg",
  },
  {
    href: "/apps/email",
    title: "Email App",
    subtext: "Get new emails",
    avatar: "/images/svgs/icon-dd-message-box.svg",
  },
  {
    href: "/apps/blog/post",
    title: "Blog App",
    subtext: "added new blog",
    avatar: "/images/svgs/icon-dd-application.svg",
  },
];

interface LinkType {
  href: string;
  title: string;
}

const pageLinks: LinkType[] = [
  {
    href: "/theme-pages/pricing",
    title: "Pricing Page",
  },
  {
    href: "/auth/auth1/login",
    title: "Authentication Design",
  },
  {
    href: "/auth/auth1/register",
    title: "Register Now",
  },
  {
    href: "/auth/error",
    title: "404 Error Page",
  },
  {
    href: "/apps/kanban",
    title: "Kanban App",
  },
  {
    href: "/apps/user-profile/profile",
    title: "User Application",
  },
  {
    href: "/apps/blog/post",
    title: "Blog Design",
  },
  {
    href: "/apps/ecommerce/checkout",
    title: "Shopping Cart",
  },
];

//   Search Data
interface SearchType {
  href: string;
  title: string;
}

const SearchLinks: SearchType[] = [
  {
    title: "Analytics",
    href: "/dashboards/analytics",
  },
  {
    title: "eCommerce",
    href: "/dashboards/eCommerce",
  },
  {
    title: "CRM",
    href: "/dashboards/crm",
  },
  {
    title: "Contacts",
    href: "/dashboards/eCommerce",
  },
  {
    title: "Posts",
    href: "/dashboards/posts",
  },
  {
    title: "Details",
    href: "/dashboards/details",
  },
];

//   Message Data
interface MessageType {
  title: string;
  avatar: any;
  subtitle: string;
}

import avatar1 from "/public/images/profile/user-2.jpg";
import avatar2 from "/public/images/profile/user-3.jpg";
import avatar3 from "/public/images/profile/user-4.jpg";
import avatar4 from "/public/images/profile/user-5.jpg";
import avatar5 from "/public/images/profile/user-6.jpg";

const MessagesLink: MessageType[] = [
  {
    avatar: avatar1,
    title: "Complete UI Design for Beinex",
  subtitle: "Finish the UI design for Beinex."
  },
  {
    avatar: avatar2,
    title: "Review the new wireframes",
    subtitle: "Check the wireframesmobile app"
  },
  {
    avatar: avatar3,
    title: "Develop the login screen",
    subtitle: "Start coding the user login"
  },
  {
    avatar: avatar4,
    title: "Fix the checkout bug",
    subtitle: "Debug and fix the bug in  e-commerce"
  },
  {
    avatar: avatar5,
    title: "Prepare for client meeting",
    subtitle: "Gather all project documents"
  }
];


//  Profile Data
interface ProfileType {
  title: string;
  img: any;
  subtitle: string;
  url: string;
}

import acccountIcon from "/public/images/svgs/icon-account.svg";
import inboxIcon from "/public/images/svgs/icon-inbox.svg";
import taskIcon from "/public/images/svgs/icon-tasks.svg";

const profileDD: ProfileType[] = [
  {
    img: acccountIcon,
    title: "My Profile",
    subtitle: "Account settings",
    url: "/apps/user-profile/profile",
  },
  {
    img: inboxIcon,
    title: "Department Management",
    subtitle: "Manage departments",
    url: "/apps/user-profile/followers",
  },
  {
    img: taskIcon,
    title: "User Management",
    subtitle: "Manage users",
    url: "/apps/user-profile/friends",
  },
];

export {
  appsLink,
  pageLinks,
  SearchLinks,
  MessagesLink,
  profileDD,
};
