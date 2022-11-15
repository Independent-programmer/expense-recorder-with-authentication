import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
//import CloseIcon from '@mui/icons-material/Close';
import closeImage from "../../image/close4.png";
import ModalVideo from "./modal";
import "./videoModal.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  p: 4,
};

function videoModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div class="videoModal">
      <Button onClick={handleOpen}>Open video</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* <CloseIcon /> */}

        <Box sx={style}>
          <button onClick={handleClose} id="close">
            <img src={closeImage} alt="close" width="40px" height="40px" />
          </button>
          <ModalVideo />
        </Box>
      </Modal>
    </div>
  );
}
export default videoModal;
