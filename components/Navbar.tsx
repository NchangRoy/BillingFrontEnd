import React from "react";
import NotificationIcon from "@mui/icons-material/Notifications";
import ProfileIcon from "@mui/icons-material/Person";
import NotificationHeaderIcon from "./NotificationHeaderIcon";
import MessageIcon from "@mui/icons-material/Message";
import Link from "next/link";

interface Props {
  name: string;
  signedIn: boolean;
}

const Navbar = ({ name, signedIn }: Props) => {
  const navItemClass =
    "capitalize cursor-pointer px-3 py-1 rounded hover:bg-[var(--color-secondary-light)] hover:text-[var(--color-secondary)] transition-all";

  return (
    <div className="flex justify-between items-center shadow py-3 px-6 bg-white text-[var(--color-secondary)]">
      {/* Logo / Name */}
      <div className="text-2xl font-bold font-serif">{name}</div>

      {/* Navigation Links */}
      

      {/* Right Side */}
      {!signedIn ? (
        <div className="flex gap-3 items-center">
          <div className={navItemClass}>Sign In</div>
          <div
            className="py-2 px-4 rounded font-semibold"
            style={{ backgroundColor: "var(--color-secondary)", color: "white" }}
          >
            Try it free
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <NotificationHeaderIcon Icon={NotificationIcon} number={2} path="/notification" />
          <NotificationHeaderIcon Icon={MessageIcon} number={4} path="/messages" />
          <Link href="/profile">
            <ProfileIcon
              style={{
                height: "30px",
                width: "30px",
                color: "var(--color-secondary)"
              }}
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
