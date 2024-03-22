import React, { useState } from "react";
import { Button, Tooltip } from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";
import axios from "axios";

export default function ImportForm({setFicData}) {
  const [inputURL, setInputURL] = useState("");

  /**
   * Handles form submission when user clicks submit button. Will strip the fic ID from the given url and
   *  make an axios request for the fic info
   * @param {*} e event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // Trim the id from the provided url, the id will be between works/id/chapters if the work has multiple chapters,
    //  or after works/ if it is a single chapter work
    let ficID;
    if (inputURL.includes("/chapters")) {
      ficID = inputURL.substring(
        inputURL.indexOf("works/") + 6,
        inputURL.indexOf("/chapters")
      );
    } else {
      ficID = inputURL.substring(inputURL.indexOf("works") + 6);
    }

    // Send a request to the server
    axios({
      method: "GET",
      url: `/api/ao3/work/${ficID}`,
    }).then((result) => {
      setFicData(result.data);
    });
    setInputURL("");
  };

  /**
   * When the user clicks the clear button, will clear the form input field
   * @param {*} e event
   */
  const handleClear = (e) => {
    e.preventDefault();
    setInputURL("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <label>URL: </label>
        <input
          required
          placeholder="Work URL"
          value={inputURL}
          onChange={(e) => setInputURL(e.target.value)}
        />
        <Tooltip title="Import currently supports AO3 and Wattpad urls" placement='top-end' enterTouchDelay={0}>
          <InfoIcon/>
        </Tooltip>
      </div>
      <div className="button-group">
        <Button size="medium" type="submit" variant="contained">
          Submit
        </Button>
        <Button
          sx={{ marginLeft: "0.5em" }}
          variant="outlined"
          onClick={handleClear}
        >
          Clear
        </Button>
      </div>
    </form>
  );
}
