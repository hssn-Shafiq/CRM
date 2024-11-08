import React from "react";
import EmailEditor from "../../components/EmailEditor/EmailEditor";
import "mdb-react-ui-kit/dist/css/mdb.min.css";



const EmailEditorSection = () => {

    return (
        <>
            <div className="App">
                <header className="App-header">
                    React Custom Media Library Using React Email Editor (Drag & Drop)
                </header>
                <EmailEditor />
            </div>
        </>
    )

}
export default EmailEditorSection;