import React, { useState } from "react";
import Codec from "./Logic";


function Home() {
    const [file, setfile] = useState({ selectedFile: null });
    const [isMessage, setIsMessage] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [msg, setMsg] = useState("");

    
    function onUploadFile (e) {
        setfile({ selectedFile: e.target.files[0] });
        return Promise.resolve("Success");;
    }

    const saveFile = () => {
        var uploadedFile = file.selectedFile;
        if (uploadedFile === undefined || uploadedFile === null) {
            alert("No file uploaded.\nPlease upload a valid .txt file and try again!");
            return;
        }
        let nameSplit = uploadedFile.name.split('.');
        var extension = nameSplit[nameSplit.length - 1].toLowerCase();
        if (extension !== "txt") {
            alert(`Invalid file type (.${extension}).\nPlease upload a valid .txt file and try again`);
            return;
        }
        // alert("File submitted!");
        setIsSubmitted(true);
    }
    let codecObj = new Codec();

    const encodeBtn = () => {
        //Checking if file is uploaded
        var uploadedFile = file.selectedFile;
        if (uploadedFile === undefined) {
            alert("No file uploaded.\nPlease upload a valid .txt file and try again!");
            return;
        } 
        if (isSubmitted === false) {
            alert("File not submitted.\nPlease click the submit button on the previous step\nto submit the file and try again!");
            return;
        }

        //Giving warning on smaller sizes
        if (uploadedFile.size === 0) {
            alert("WARNING: You have uploaded an empty file!\nThe compressed file might be larger in size than the uncompressed file (compression ratio might be smaller than one).\nBetter compression ratios are achieved for larger file sizes!");
        }
        else if (uploadedFile.size < 1000) {
            alert("WARNING: The uploaded file is small in size (" + uploadedFile.size + " bytes) !\nThe compressed file's size might be larger than expected (compression ratio might be small).\nBetter compression ratios are achieved for larger file sizes!");
        }

        //Reading the files and sending it for encoding and then, to download
        let reader = new FileReader();
        reader.onload = function () {
            let text = reader.result;
            let [encodedString, outputMsg] = codecObj.encode(text);
            setIsMessage(true);
            setMsg(outputMsg);
            myDownloadFile(uploadedFile.name.split('.')[0] + "_compressed.txt", encodedString);
            // onDownloadChanges(outputMsg);
        };
        reader.readAsText(uploadedFile, "UTF-8");
    }

    //Called when decompress button is clicked
    const decodeBtn = () => {
        var uploadedFile = file.selectedFile;

        //If file is not uploaded
        if (uploadedFile === undefined) {
            alert("No file uploaded.\nPlease upload a valid .txt file and try again!");
            return;
        } 
        if (isSubmitted === false) {
            alert("File not submitted.\nPlease click the submit button on the previous step\nto submit the file and try again!");
            return;
        }

        //Rading the file and sending it for decode and then, to download
        let reader = new FileReader();
        reader.onload = function () {
            let text = reader.result;
            let [decodedString, outputMsg] = codecObj.decode(text);
            setIsMessage(true);
            setMsg(outputMsg);
            myDownloadFile(uploadedFile.name.split('.')[0] + "_decompressed.txt", decodedString);
        };
        reader.readAsText(uploadedFile, "UTF-8");
    }

    function myDownloadFile(fileName, text) {
        let a = document.createElement('a');
        a.href = "data:application/octet-stream," + encodeURIComponent(text);
        a.download = fileName;
        a.click();
    }

    const onChangeHandler = (e) => {
        onUploadFile(e).then(() => {
            saveFile();
        });
      };

    return (
        <body>
            <div className="window">
                <div className="titlebar">
                    <h1 className="heading">
                        <div className="buttons">
                            <div className="close">
                                <a className="closebutton" href="https://portfolio-deeppatel23.vercel.app/"><span><strong>x</strong></span></a>
                            </div>
                            <div className="minimize">
                                <a className="minimizebutton" href="https://portfolio-deeppatel23.vercel.app/"><span><strong>&ndash;</strong></span></a>
                            </div>
                            <div className="zoom">
                                <a className="zoombutton" href="https://portfolio-deeppatel23.vercel.app/"><span><strong>+</strong></span></a>
                            </div>

                        </div>
                        File Compressor
                    </h1>
                </div>
                <div className="content">
                    <div>
                        <div className="align">
                            <form
                                method="post"
                                enctype="multipart/form-data"
                                className="form">
                                <input type="file" className="btn first" onChange={onChangeHandler} />
                            </form>
                            
                        </div>
                        <div className="align">
                            <button type="button" className="btn first" onClick={encodeBtn}>COMPRESS</button>
                            <button type="button" className="btn first" onClick={decodeBtn}>DE-COMPRESS</button>
                            <br />
                        </div>
                        <div  className="align" style={{fontSize:"small"}}>   
                            {
                                isMessage ? <p className="message">{msg}</p> : <p className="message">{msg}</p>
                            }
                        </div >
                        <div className="align" > 
                        <button type="button" className="btn first" onclick="location.reload()" >Start Again</button> 
                        <button type="button" className="btn first" onclick="location.reload()" >Know More</button> 
                        </div>
                        <br />  
                    </div>
                </div>
            </div>

        </body>
    );
}
export default Home;
