// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
// Licensed under GNU AGPL-3.0-or-later.

import React, { Fragment } from "react";
import { Box, PageHeader } from "mds";
import ObjectManagerButton from "../ObjectManager/ObjectManagerButton";
import DarkModeActivator from "../DarkModeActivator/DarkModeActivator";

interface IPageHeaderWrapper {
  label: React.ReactNode;
  middleComponent?: React.ReactNode;
  actions?: React.ReactNode;
}

const PageHeaderWrapper = ({
  label,
  actions,
  middleComponent,
}: IPageHeaderWrapper) => {
  return (
    <Box className={"nekosune-page-header"}>
      <PageHeader
        label={label}
        actions={
          <Fragment>
            {actions}
            <DarkModeActivator />
            <ObjectManagerButton />
          </Fragment>
        }
        middleComponent={middleComponent}
      />
    </Box>
  );
};

export default PageHeaderWrapper;
