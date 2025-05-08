import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const NotificationPanel = ({ notifiactionRef, data }) => {
  return (
    <div
      ref={notifiactionRef}
      className="w-full sm:w-[375px] fixed sm:absolute bg-white sm:right-10  right-0 top-14  rounded overflow-hidden z-[15] shadow-[0px_8px_32px_0px_rgba(48,48,48,0.32)]"
    >
      <div className="flex flex-col w-full">
        <div className="flex py-2 px-4 items-center justify-between border-b !border-ostad-black-light-overlay bg-white">
          <p className="text-subtitle-s1 text-ostad-black-70">Notification</p>
          <div className="w-8 h-8 rounded-full bg-none hover:!bg-ostad-black-opac flex justify-center items-center focus-within:!bg-ostad-black-light-overlay focus:!bg-ostad-black-light-overlay">
            <img
              className="cursor-pointer w-6 h-6"
              src="https://cdn.ostad.app/public/icons/settings-5-line.svg"
              alt="Settings"
            />
          </div>
        </div>
        <div className="flex py-1 px-4 items-center justify-between self-stretch border-b !border-ostad-black-opac bg-white">
          <p className="text-body-b2 text-ostad-black-60">Unread (0)</p>
        </div>
        <div className="flex flex-col justify-start w-full h-[375px] bg-ostad-black-opac overflow-y-scroll overflow-auto scrollbar">
          <div className="flex flex-col gap-1">
            {!data || data.length === 0 ? (
              <div className="flex justify-center items-center h-full w-full">
                <div
                  className="flex flex-col justify-center items-center rounded-lg gap-8 bg-[#FFFBEE]"
                  style={{ height: "371px", width: "100%", maxWidth: "631px" }}
                >
                  <img
                    className="w-[100px] h-[100px]"
                    src="https://cdn.ostad.app/public/upload/2023-05-07T09-48-40.170Z-icon-notification-for-empty-state.png"
                    alt="No Notifications"
                  />
                  <p className="subtitle-s1 text-ostad-black-100">
                    There is no notification for you yet!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start px-4">
                New live class added clik now:
                <div></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
