import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import { db, storage } from './firebase'
import firebase from 'firebase'
import './imageUpload.css'
function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress)
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage.ref("images").child(image.name).getDownloadURL().then(url => {
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                        , caption: caption,
                        imageUrl: url,
                        username: username
                    })
                    setProgress(0);
                    setCaption(null);
                    setImage(null);
                })
            }
        )
    }
    return (
        <div className="imageupload">
            <progress className="imageupload__progress"value={progress} max="100"/>
            <input placeholder="Enter a caption" type="text" onChange={event => setCaption(event.target.value)} calue={caption} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload file</Button>

        </div>
    )
}

export default ImageUpload;
