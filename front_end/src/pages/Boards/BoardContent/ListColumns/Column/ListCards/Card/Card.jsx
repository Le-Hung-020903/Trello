import React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import GroupIcon from "@mui/icons-material/Group";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import AttachmentIcon from "@mui/icons-material/Attachment";
const CardItem = (props) => {
  const cardItem = props.cardItem;
  return (
    <>
      <Card
        sx={{
          cursor: "pointer",
          boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
          overflow: "unset",
        }}
      >
        {cardItem?.cover && (
          <CardMedia
            sx={{ height: 140 }}
            image={cardItem?.cover}
            title="green iguana"
          />
        )}

        <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
          <Typography>{cardItem?.title}</Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Button startIcon={<GroupIcon />} size="small">
            {cardItem?.memberIds.length ?? 0}
          </Button>
          <Button startIcon={<ModeCommentIcon />} size="small">
            {cardItem?.comments.length ?? 0}
          </Button>
          <Button startIcon={<AttachmentIcon />} size="small">
            {cardItem?.attachments.length ?? 0}
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default CardItem;
