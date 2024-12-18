import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Pagination,
  PaginationItem,
  Stack,
  styled,
  Typography
} from "@mui/material"
import React, { useEffect, useState } from "react"
import AppBoard from "~/components/AppBoard/AppBar"
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard"
import ListAltIcon from "@mui/icons-material/ListAlt"
import HomeIcon from "@mui/icons-material/Home"
import { Link, useLocation } from "react-router-dom"
import randomColor from "randomcolor"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import SidebarCreateBoardModal from "./create"
import { fetchBoardsAPI } from "../../apis/index"
import { DEFAULT_ITEMS_PAGE, DEFAULT_PAGE } from "../../utils/constants"

const SiderbarItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  padding: "12px 16px",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark" ? "#33485DD" : theme.palette.grey[300]
  },
  "&.active": {
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#e9f2ff",
    color: theme.palette.mode === "dark" ? "#90caf9" : "#0c66e4"
  }
}))

const Boards = () => {
  const [boards, setBoards] = useState(null)
  const [totalBoards, setTotalBoards] = useState(null)
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const page = parseInt(query.get("page") || "1", 10)
  const updateStataData = (res) => {
    setBoards(res.boards || [])
    setTotalBoards(res.totalBoards || 0)
  }

  useEffect(() => {
    fetchBoardsAPI(location.search).then(updateStataData)
  }, [location.search])

  const afterCreateNewBoard = () => {
    fetchBoardsAPI(location.search).then(updateStataData)
  }
  return (
    <Container disableGutters maxWidth={false}>
      <AppBoard />
      <Box
        sx={{
          paddingX: 2,
          my: 4
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Stack direction="column" spacing={1}>
              <SiderbarItem className="active">
                <SpaceDashboardIcon fontSize="small" /> Boards
              </SiderbarItem>
              <SiderbarItem>
                <ListAltIcon fontSize="small" /> Templates
              </SiderbarItem>
              <SiderbarItem>
                <HomeIcon fontSize="small" /> Home
              </SiderbarItem>
            </Stack>
            <Divider sx={{ my: 1 }} />

            <Stack direction="column" spacing={1}>
              <SidebarCreateBoardModal
                afterCreateNewBoard={afterCreateNewBoard}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
              Your boards:
            </Typography>
            {boards && boards.length === 0 && (
              <Typography variant="span" sx={{ fontWeight: "bold", mb: 3 }}>
                No result found!
              </Typography>
            )}
            <Grid container spacing={2}>
              {boards?.map((b, i) => (
                <Grid item xs={2} sm={3} md={4} key={b._id}>
                  <Card sx={{ width: "250px" }}>
                    <Box
                      sx={{
                        height: "50px",
                        backgroundColor: randomColor()
                      }}
                    ></Box>
                    <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
                      <Typography gutterBottom variant="h6" component="div">
                        {b?.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis"
                        }}
                      >
                        {b?.description}
                      </Typography>
                      <Box
                        component={Link}
                        to={`/boards/${b?._id}`}
                        sx={{
                          mt: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          color: "primary.main",
                          "&:hover": { color: "primary.light" }
                        }}
                      >
                        Go to Board <ArrowRightIcon fontSize="small" />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {totalBoards > 0 && (
              <Box
                sx={{
                  my: 3,
                  pr: 5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end"
                }}
              >
                <Pagination
                  size="large"
                  color="secondary"
                  showFirstButton
                  showLastButton
                  count={Math.ceil(totalBoards / DEFAULT_ITEMS_PAGE)}
                  page={page}
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/boards${
                        item.page === DEFAULT_PAGE ? "" : `?page=${item.page}`
                      }`}
                      {...item}
                    />
                  )}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Boards
