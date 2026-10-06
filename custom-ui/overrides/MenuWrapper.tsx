// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
// Licensed under GNU AGPL-3.0-or-later.

import React from "react";
import { useSelector } from "react-redux";
import { Box, Menu } from "mds";
import { AppState, useAppDispatch } from "../../../store";
import { validRoutes } from "../valid-routes";
import { menuOpen } from "../../../systemSlice";
import { selFeatures } from "../consoleSlice";
import {
  getLogoApplicationVariant,
  getLogoVar,
  registeredCluster,
} from "../../../config";
import { useLocation, useNavigate } from "react-router-dom";
import { getLicenseConsent } from "../License/utils";

const MenuWrapper = () => {
  const dispatch = useAppDispatch();
  const features = useSelector(selFeatures);
  const navigate = useNavigate();
  const { pathname = "" } = useLocation();
  const sidebarOpen = useSelector((state: AppState) => state.system.sidebarOpen);
  const licenseInfo = useSelector((state: AppState) => state?.system?.licenseInfo);
  const isAgplAckDone = getLicenseConsent();
  const clusterRegistered = registeredCluster();
  const { plan = "" } = licenseInfo || {};

  let licenseNotification = true;
  if (plan || isAgplAckDone || clusterRegistered) {
    licenseNotification = false;
  }

  const allowedMenuItems = validRoutes(features, licenseNotification);

  return (
    <Box className={"nekosune-sidebar"}>
      <Menu
        isOpen={sidebarOpen}
        displayGroupTitles
        options={allowedMenuItems}
        applicationLogo={{
          applicationName: getLogoApplicationVariant(),
          subVariant: getLogoVar(),
        }}
        callPathAction={(path) => navigate(path)}
        signOutAction={() => navigate("/logout")}
        collapseAction={() => dispatch(menuOpen(!sidebarOpen))}
        currentPath={pathname}
        mobileModeAuto={false}
      />
    </Box>
  );
};

export default MenuWrapper;
