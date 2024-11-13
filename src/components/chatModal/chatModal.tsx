import { useState } from "react";
import { SpeedDial, SpeedDialAction, Modal, Box, Typography } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import CloseIcon from "@mui/icons-material/Close";
import DirectMessage from "../directMessage/directMessage"; // Import komponen yang sudah kita buat sebelumnya

const DirectMessageSpeedDial = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {/* Speed Dial Button */}
      <SpeedDial
        ariaLabel="Direct Message Speed Dial"
        onClick={handleOpen}
        sx={{
          position: "fixed",
          bottom: 30,
          right: 30,
        }}
        icon={<MessageIcon />}
      >
        <SpeedDialAction
          key="openChat"
          icon={<MessageIcon />}
          tooltipTitle="Open Chat"
          onClick={handleOpen}
        />
      </SpeedDial>

      {/* Modal for DirectMessageForm */}
      <Modal open={open} onClose={handleClose} aria-labelledby="direct-message-modal">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" component="h2">
              Direct Message
            </Typography>
            <CloseIcon onClick={handleClose} style={{ cursor: "pointer" }} />
          </div>
          <DirectMessage /> {/* Render DirectMessageForm di dalam modal */}
        </Box>
      </Modal>
    </div>
  );
};

export default DirectMessageSpeedDial;
