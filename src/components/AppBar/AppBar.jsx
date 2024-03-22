import React, { useRef } from "react";
import {
  AppBar,
  Toolbar,
  Slide,
  useScrollTrigger,
  Typography,
} from "@mui/material";
import { ExpandLess } from "@mui/icons-material";
import ChapterMenu from "../ChapterMenu/ChapterMenu";

export default function HideAppBar({ chapters, headerRef }) {
  const trigger = useScrollTrigger();
  const menuRef = useRef();

  /**
   * When user clicks the Top icon in the app bar, scroll them to the top of the page
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: headerRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  return (
    <Slide appear={false} direction="up" in={!trigger}>
      <AppBar
        sx={{
          top: "auto",
          bottom: 0,
          height: "3.5em",
        }}
      >
        <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}} ref={menuRef}>
          {/* Chapter menu */}
          <ChapterMenu chapters={chapters} menuRef={menuRef} />
          {/* Back to top button */}
          <div className = 'to-top'>
            <Typography onClick={scrollToTop} component="div">
              Top <ExpandLess sx={{ verticalAlign: "middle"}} />
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
    </Slide>
  );
}
