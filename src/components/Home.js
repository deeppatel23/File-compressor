import React, { useState } from "react";
import Codec from "./Logic";


function Home() {
    const [file, setfile] = useState({ selectedFile: null });
    const [isMessage, setIsMessage] = useState(false);
    const [msg, setMsg] = useState("");


    function onUploadFile(e) {
        setfile({ selectedFile: e.target.files[0] });
    }

    function saveFile() {

        var uploadedFile = file.selectedFile;
        if (uploadedFile === undefined || uploadedFile === null) {
            alert("No file uploaded.\nPlease upload a valid .txt file and try again!");
            return false
        }
        let nameSplit = uploadedFile.name.split('.');
        var extension = nameSplit[nameSplit.length - 1].toLowerCase();
        if (extension !== "txt") {
            alert(`Invalid file type (.${extension}).\nPlease upload a valid .txt file and try again`);
            return false;
        }
        return true;
    }
    let codecObj = new Codec();

    const encodeBtn = () => {
        if (saveFile()) {
            //Checking if file is uploaded
            var uploadedFile = file.selectedFile;
            if (uploadedFile === undefined) {
                alert("No file uploaded.\nPlease upload a valid .txt file and try again!");
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
    }

    //Called when decompress button is clicked
    const decodeBtn = () => {
        if (saveFile()) {
            var uploadedFile = file.selectedFile;

            //If file is not uploaded
            if (uploadedFile === undefined) {
                alert("No file uploaded.\nPlease upload a valid .txt file and try again!");
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
    }

    function myDownloadFile(fileName, text) {
        let a = document.createElement('a');
        a.href = "data:application/octet-stream," + encodeURIComponent(text);
        a.download = fileName;
        a.click();
    }

    function refreshPage(){ 
        window.location.reload(); 
    }

    const onChangeHandler = (e) => {
        onUploadFile(e);
    }
    

    return (
        <body>
            <div className="window">
                <div className="titlebar">
                    <h1 className="heading">
                        <div className="buttons">
                            <div className="close">
                                <a className="closebutton" href="# " onClick={refreshPage}><span><strong>x</strong></span></a>
                            </div>
                            <div className="minimize">
                                <a className="minimizebutton" href="# " onClick={refreshPage}><span><strong>&ndash;</strong></span></a>
                            </div>
                            <div className="zoom">
                                <a className="zoombutton" href="# " onClick={refreshPage}><span><strong>+</strong></span></a>
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
                                className="form"
                            >
                                <input type="file" className="btn first" onChange={onChangeHandler} />
                            </form>

                        </div>
                        <div className="align">
                            <button type="button" className="btn first" onClick={encodeBtn}>COMPRESS</button>
                            <button type="button" className="btn first" onClick={decodeBtn}>DE-COMPRESS</button>
                            <br />
                        </div>

                        {
                            isMessage ? <div className="align" style={{ fontSize: "small" }}>  <p className="message">{msg}</p>  </div > : null
                        }

                        <div className="align" >
                            <a href="# " onClick={refreshPage}><button type="button" className="btn first" onclick="https://file-compressor-deeppatel23.vercel.app/" >Start Again</button> </a>
                            <a href='https://deeppatel23.medium.com/text-file-compressor-with-huffman-coding-9d0ddc30440a'><button type="button" className="btn first" onclick="https://deeppatel23.medium.com/text-file-compressor-with-huffman-coding-9d0ddc30440a" >Know More</button> </a>
                        </div>
                        <br />
                    </div>
                </div>
            </div>

        </body>
    );
}
export default Home;
