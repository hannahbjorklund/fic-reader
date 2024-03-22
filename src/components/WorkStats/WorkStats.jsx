import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

export default function WorkStats({ ficData }) {
  return (
    <Accordion
      sx={{
        fontFamily: "Open Sans",
        backgroundColor: "#303030",
        color: "antiquewhite",
        fontSize: "19px",
        width: "95%",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore style={{ color: "antiquewhite" }} />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        Work Stats
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor: "#343434",
          fontFamily: "Open Sans",
          fontSize: "16px",
        }}
      >
        <div className="stats-container">
          <div>
            <p>Words: {ficData.stats.words}</p>
            <p>Chapters: {ficData.stats.chapters}</p>
            <p>Published: {ficData.stats.published}</p>
            <p>Completed: {ficData.stats.completed}</p>
          </div>
          <div>
            <p>Hits: {ficData.stats.hits}</p>
            <p>Kudos: {ficData.stats.kudos}</p>
            <p>Comments: {ficData.stats.comments}</p>
            <p>Bookmarks: {ficData.stats.bookmarks}</p>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
