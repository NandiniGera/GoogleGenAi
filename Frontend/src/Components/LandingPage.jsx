// This will be the page which will be opened when the users open the application
import React from "react";
import Introduction from "./Intro";
import Services from "./Services/services";

function LandingPage(){
    return(
        <div>
            <Introduction/>
            <Services/>
        </div>
    );
}
export default LandingPage;