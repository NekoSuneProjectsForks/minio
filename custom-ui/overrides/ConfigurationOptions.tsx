// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
// Modified by NekoSuneProjectsForks for the custom Console presentation.
// Licensed under the GNU AGPL-3.0-or-later.

import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  Box,
  Grid,
  HelpBox,
  PageLayout,
  ScreenTitle,
  SettingsIcon,
} from "mds";
import { configurationElements } from "../utils";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import ConfigurationForm from "./ConfigurationForm";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";
import ExportConfigButton from "./ExportConfigButton";
import ImportConfigButton from "./ImportConfigButton";
import HelpMenu from "../../HelpMenu";
import { setErrorSnackMessage, setHelpName } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { api } from "../../../../api";
import { IElement } from "../types";
import { errorToHandler } from "../../../../api/errors";

const getRoutePath = (path: string) => `${IAM_PAGES.SETTINGS}/${path}`;
const NON_SUB_SYS_CONFIG_ITEMS = ["region"];
const IGNORED_CONFIG_SUB_SYS = ["cache"];

const ConfigurationOptions = () => {
  const { pathname = "" } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [configSubSysList, setConfigSubSysList] = useState<string[]>([]);

  const fetchConfigSubSysList = useCallback(async () => {
    api.configs
      .listConfig()
      .then((res) => {
        if (res && res?.data && res?.data?.configurations) {
          const confSubSysList = (res?.data?.configurations || []).reduce(
            (acc: string[], { key = "" }) => {
              if (!IGNORED_CONFIG_SUB_SYS.includes(key)) {
                acc.push(key);
              }
              return acc;
            },
            [],
          );
          setConfigSubSysList(confSubSysList);
        }
      })
      .catch((err) => {
        dispatch(setErrorSnackMessage(errorToHandler(err)));
      });
  }, [dispatch]);

  useEffect(() => {
    fetchConfigSubSysList();
    dispatch(setHelpName("settings_Region"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const availableConfigSubSys = configurationElements.filter(
    ({ configuration_id }: IElement) =>
      NON_SUB_SYS_CONFIG_ITEMS.includes(configuration_id) ||
      configSubSysList.includes(configuration_id) ||
      !configSubSysList.length,
  );

  return (
    <Fragment>
      <PageHeaderWrapper label={"Configuration"} actions={<HelpMenu />} />
      <PageLayout>
        <Grid item xs={12} id={"settings-container"} className={"nekosune-settings"}>
          <Box
            className={"nekosune-settings-hero"}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <ScreenTitle
                icon={<SettingsIcon />}
                title={"System Configuration"}
                actions={null}
                sx={{ marginBottom: 4 }}
              />
              <Box className={"nekosune-subtitle"}>
                Manage storage, API, scanning, notifications and cluster behaviour.
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 10 }}>
              <ImportConfigButton />
              <ExportConfigButton />
            </Box>
          </Box>

          <Box
            className={"nekosune-settings-workspace"}
            sx={{
              display: "grid",
              gridTemplateColumns: "280px minmax(0, 1fr)",
              gap: 18,
              alignItems: "start",
            }}
          >
            <Box className={"nekosune-settings-nav"}>
              <Box className={"nekosune-settings-nav-title"}>Configuration</Box>
              <Box className={"nekosune-settings-nav-caption"}>
                Select a subsystem
              </Box>
              <Box className={"nekosune-settings-nav-list"}>
                {availableConfigSubSys.map((element) => {
                  const active = pathname.endsWith(
                    `/${element.configuration_id}`,
                  );
                  return (
                    <Box
                      key={element.configuration_id}
                      className={`nekosune-settings-nav-item ${
                        active ? "is-active" : ""
                      }`}
                      onClick={() => navigate(getRoutePath(element.configuration_id))}
                    >
                      <Box className={"nekosune-settings-nav-icon"}>
                        {element.icon}
                      </Box>
                      <Box className={"nekosune-settings-nav-label"}>
                        {element.configuration_label}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            <Box className={"nekosune-settings-content"}>
              <Routes>
                {availableConfigSubSys.map((element) => (
                  <Route
                    key={`configItem-${element.configuration_label}`}
                    path={`${element.configuration_id}`}
                    element={<ConfigurationForm />}
                  />
                ))}
                <Route
                  path={"/"}
                  element={<Navigate to={`${IAM_PAGES.SETTINGS}/region`} />}
                />
              </Routes>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sx={{ paddingTop: "18px" }}>
          <Box className={"nekosune-help-panel"}>
            <HelpBox
              title={"Configuration help"}
              iconComponent={<SettingsIcon />}
              help={
                <Fragment>
                  Configure region, compression, API behaviour, scanning,
                  notifications and other server subsystems from this workspace.
                  <br />
                  <br />
                  Changes should be reviewed before applying them to production.
                </Fragment>
              }
            />
          </Box>
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default ConfigurationOptions;
