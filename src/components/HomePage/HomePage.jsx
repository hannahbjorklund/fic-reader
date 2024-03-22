import React, { useState, useRef, useEffect } from "react";
import AppBar from "../AppBar/AppBar";
import WorkStats from "../WorkStats/WorkStats";
import WorkBody from "../WorkBody/WorkBody";
import ImportForm from "../ImportForm/ImportForm";

export default function HomePage(){
    const headerRef = useRef(null);
    const [ficData, setFicData] = useState("");

    useEffect(() => {document.title = 'Home'}, []);
  
    return (
      <div className="container">
        {/* Import section */}
        <div className="site-header" ref={headerRef}>
          <h1>Import a work:</h1>
          <ImportForm setFicData = {setFicData}/>
        </div>
        <hr />
  
        {/* Pre text body information */}
        {ficData && (
          <>
            <div className="pre-text">
              <div className="title-group">
                <h1 className="title">{ficData.title}</h1>
                <h2>by {ficData.author}</h2>
              </div>
              {/* Accordion component containing statistics about the imported work */}
              <WorkStats ficData={ficData} />
              <br />
            </div>
            <hr />
          </>
        )}
  
        {/* Text body */}
        <WorkBody ficData={ficData} />
        {/* App bar */}
        <AppBar chapters={ficData.chapters} headerRef={headerRef} />
      </div>
    );
}