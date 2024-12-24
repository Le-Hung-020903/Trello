import React, { useState } from "react"
import Container from "@mui/material/Container"
import TabContext from "@mui/lab/TabContext"
import { Link, useLocation } from "react-router"
import Tab from "@mui/material/Tab"
import PersonIcon from "@mui/icons-material/Person"
import SecurityIcon from "@mui/icons-material/Security"
import TabPanel from "@mui/lab/TabPanel"
import TabList from "@mui/lab/TabList"
import AccountTab from "./AccountTab"
import SecurityTab from "./SecurityTab"
import Box from "@mui/material/Box"
import AppBoard from "~/components/AppBoard/AppBar"

const TABS = {
  ACCOUNT: "account",
  SECURITY: "security"
}
const Settings = () => {
  const location = useLocation()
  const getDefaultTab = () => {
    if (location.pathname.includes(TABS.ACCOUNT)) return TABS.ACCOUNT
    return TABS.SECURITY
  }
  const [activetab, setActiveTab] = useState(getDefaultTab())
  const handleChangeTab = (event, newTab) => {
    setActiveTab(newTab)
  }
  return (
    <Container disableGutters maxWidth={false}>
      <AppBoard />
      <TabContext value={activetab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChangeTab}>
            <Tab
              label="Account"
              value={TABS.ACCOUNT}
              icon={<PersonIcon />}
              iconPosition="start"
              component={Link}
              to="/settings/account"
            />
            <Tab
              label="Security"
              value={TABS.SECURITY}
              icon={<SecurityIcon />}
              iconPosition="start"
              component={Link}
              to="/settings/security"
            />
          </TabList>
        </Box>
        <TabPanel value={TABS.ACCOUNT}>
          <AccountTab />
        </TabPanel>
        <TabPanel value={TABS.SECURITY}>
          <SecurityTab />
        </TabPanel>
      </TabContext>
    </Container>
  )
}

export default Settings
