import React, { useState, useEffect } from 'react';
import Post from "./post"
import './App.css'
import { db } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import { auth, storage } from './firebase';
import ImageUpload from './imageUpload'
import InstagramEmbed from 'react-instagram-embed';
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const { modoleStyle } = useState(getModalStyle);

  const [Posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPasword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser)

        if (authUser.displayName) {

        } else {
          return authUser.updateProfile({
            displayName: username
          })
        }

      } else {
        setUser(null)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [user, username]);
  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    });
  }, []);
  const signup = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password).then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
      .catch((error) => alert(error.message))
  }

  const signin = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch((error) => alert(error.message))
    setOpenSignIn(false)
  }
  return (
    <div className="App">


      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modoleStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/640px-Instagram_logo.svg.png"
                alt="Instagram-Logo"
              />
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="text"
                value={password}
                onChange={(e) => setPasword(e.target.value)}
              />
              <Button onClick={signup}>Sign-Up</Button>

            </center>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modoleStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/640px-Instagram_logo.svg.png"
                alt="Instagram-Logo"
              />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="text"
                value={password}
                onChange={(e) => setPasword(e.target.value)}
              />
              <Button onClick={signin}>Sign in</Button>

            </center>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img className="app__headerImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/640px-Instagram_logo.svg.png"
          alt="Instagram-Logo"
        />
        {
          user ? (
            <Button onClick={() => auth.signOut()}>Logout</Button>
          ) : (
              <div className="app__loginContainer">
                <Button onClick={() => setOpen(true)}>sign up</Button>
                <Button onClick={() => setOpenSignIn(true)}>Login</Button>
              </div>

            )}

      </div>
      <div className="app__posts">
        <div className="app_postLeft">
          {
            Posts.map(({ id, post }) => (
              <Post user={user} key={id} postId={id} username={post.username} caption={post.caption} ImageUrl={post.imageUrl || post.imageurl} />
            ))
          }
        </div>
        <div className="app__postRight">
          <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>

      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
          <h3>You need to be logged in</h3>
        )
      }
    </div>
  );
}

export default App;
