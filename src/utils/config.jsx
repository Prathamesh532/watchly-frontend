import React from "react";
import {
  History,
  House,
  ListEnd,
  ThumbsUp,
  Tv,
  Twitter,
  UserCheck,
} from "lucide-react";

export const SideBarTags = [
  { icon: <House color="#ffffff" />, label: "Home", to: "/" },
  {
    icon: <ThumbsUp color="#ffffff" />,
    label: "Liked Videos",
    to: "/profile?tab=liked",
  },
  {
    icon: <ListEnd color="#ffffff" />,
    label: "User Playlists",
    to: "/profile?tab=playlists",
  },
  {
    icon: <Tv color="#ffffff" />,
    label: "Subscription Channels",
    to: "/profile?tab=channels",
  },
  {
    icon: <Twitter color="#ffffff" />,
    label: "Tweets",
    to: "/tweets",
  },
];
