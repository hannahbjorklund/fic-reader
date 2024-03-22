import React, { useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
} from "@mui/icons-material";

export default function ChapterMenu({ chapters, menuRef }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  /**
   * When user clicks the menu icon, open the menu and change icon
   */
  const handleMenuClick = () => {
    setMenuIsOpen(!menuIsOpen);
    setAnchorEl(menuRef.current);
  };

  /**
   * When the user clicks a chapter to navigate to, or clicks outside of the chapter menu,
   * close the menu and change the menu icon
   */
  const handleClose = () => {
    setAnchorEl(null);
    setMenuIsOpen(false);
  };

  /**
   * When the user clicks a chapter in the menu, close the menu then scroll them to that chapter
   */
  const scrollToChapter = (id) => {
    handleClose();
    document.querySelector(`.chap-${id}-header`).scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <>
      <Button onClick={handleMenuClick}>
        {menuIsOpen ? (
          <MenuOpenIcon sx={{ color: "white" }}></MenuOpenIcon>
        ) : (
          <MenuIcon sx={{ color: "white" }} />
        )}
      </Button>
      <Menu
        sx={{ height: "50vh", width: "auto"}}
        open={menuIsOpen}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {chapters &&
          chapters.map((x, i) => {
            return (
              <MenuItem key={i}>
                <p
                  id={i + 1}
                  onClick={() => scrollToChapter(i + 1)}
                  className="menu-item"
                >
                  {x.chapter_title}
                </p>
              </MenuItem>
            );
          })}
      </Menu>
    </>
  );
}
