import Head from 'next/head'
import styles from '../styles/Home.module.css'
import savedNotes from '../styles/SavedNote.module.css'
import Link from 'next/link'
import Image from 'next/image'
import loaderpath from '../public/loader.gif'
import { useEffect, useState,useRef } from 'react'
import { IoSend} from 'react-icons/io5';
import {AiFillRobot} from 'react-icons/ai'
import {FaUserCheck} from 'react-icons/fa'
import {MdAddToPhotos,MdOutlineDownloadDone} from 'react-icons/md'
import {RiFileList2Fill} from 'react-icons/ri'
import {MdAccountCircle} from 'react-icons/md'

const ChatPage = () => {

  const[promptinput,setPrompinput]=useState("");
  const[allMsg,setAllMsg]=useState([]);
  const[botMsg,setBotMsg]=useState(null);
  const[myMsg,setMyMsg]=useState(null);
  const[saveClicked,setSaveClicked]=useState(false);
  const[noteSuccess,setNoteSuccess]=useState(false)
  const[userExist,setUserExist]=useState(false)
  const showansref = useRef(null);
  const afterResultTextref = useRef(null);
  

  useEffect(()=>{
    if(localStorage.getItem("Id") && localStorage.getItem("email") && localStorage.getItem("username")){
      setUserExist(true)
    }
  },[])
 
  useEffect(()=>{
    gotoBottom();
    if(showansref.current){
      showFullAns();
    }
    

  },[allMsg])

useEffect(()=>{
  if(botMsg){
    setAllMsg([...allMsg,botMsg]);
  }
},[botMsg])

useEffect(()=>{
  if(myMsg){
    setAllMsg([...allMsg,myMsg]);
    setBotMsg(null);
    
  }
},[myMsg])



const getPromptValue = (e)=>{
  (!botMsg && allMsg[0]) ? "" : setPrompinput(e.target.value);
}

  const sendData = async()=>{
    try{
      await  fetch("/api/Routes/getBotmsg/",{
        method:"POST",
        body:JSON.stringify({
          prompt:promptinput
        }),
        headers:{
          "Content-Type":"application/json",
        },
      }).then((res)=>res.json()).then((data)=>{
        
          setBotMsg({name:"bot",msgg:data.message,saved:false});
        
      });

    }catch(err){
      alert("Server is overloaded with rquests, please try again later");
      console.log(err);
    }
   
  }

  function showFullAns(){
    showansref.current.style.height=`${showansref.current.scrollHeight}px`;
}

  const forEntersent = (e) => ( e.keyCode === 13 ) ? handleSubmit(e) : "";
  const handleSubmit =(e)=>{
    e.preventDefault();
    if(allMsg && promptinput){
      setMyMsg({name:localStorage.getItem("username"),msgg:promptinput,saved:false});
      sendData();
      setPrompinput("");
    }
    

  }



  function gotoBottom(){
    afterResultTextref.current.scrollIntoView();
  }

  
  
  const saveNote = async (index)=>{

    setSaveClicked(true);
    let newAllmsg = [...allMsg];
    newAllmsg[index]["saved"]=true;
    setAllMsg(newAllmsg);

      try{
      await  fetch("/api/Routes/NotesRoute/",{
        method:"POST",
        body:JSON.stringify({
          username:localStorage.getItem("username"),
          question:allMsg[index-1].msgg,
          ans:allMsg[index].msgg
        }),
        headers:{
          "Content-Type":"application/json",
        },
      }).then((res)=>res.json()).then((data)=>{
        setNoteSuccess(true);
        setSaveClicked(false);
        
      });
    }catch(err){
      alert("Server is overloaded with rquests, please try again later");
      console.log(err);
    }
  }

  
  return (
    <>
      <Head>
        <title>ChatAnything_ChatPage</title>
        <meta name="description" content="This page is for chating with Ai" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>

        <span className={styles.blob1}></span>
        <span className={styles.blob2}></span>
        <span className={styles.blob3}></span>
        <span className={styles.blob4}></span>
        <div className={styles.container}>
        {
              userExist
              ?
              ""
              :
              <Link href="/" className={styles.gotoLogin}>Please Login</Link> 
        }
          <div className={userExist ? styles.titleheader : styles.hideElement}>
              <Link href="/UserAcc" title='Goto MyAccount'><MdAccountCircle className={styles.titleheadericons}/></Link>
              <div className={styles.initialtitle}>{!botMsg && allMsg[0] ? <span ><Image src={loaderpath} alt="Loader" width={150} height={50} className={styles.loader}/></span>: "CHATPAGE"}</div>
              <Link href="/SavedNotePage" title='Goto MyNotes'><RiFileList2Fill className={styles.titleheadericons}/></Link>
              <span className={styles.margin}></span>
              
          </div>
        
            <div className={userExist ? styles.chatwindow : styles.hideElement} >

            
            {
              

              allMsg && allMsg.map((msg,index)=>(
                msg.name!="bot"
                ?
                <div className={styles.usersection} key={index}>
                <FaUserCheck className={styles.userimage}/>
                  <div>
                 {msg.msgg}
                  </div>
              </div>

              :

                <div className={styles.botsection} key={index}>
                  <div className={styles.botheader}><AiFillRobot className={styles.botimage}/>{(allMsg[index].saved===true) && noteSuccess ?<MdOutlineDownloadDone className={styles.notesaved} title='Note Saved' />:(saveClicked ?<MdAddToPhotos className={styles.savefade} title='Save Notes' />:<MdAddToPhotos className={styles.save} onClick={()=>saveNote(index)} title='Save Notes' /> )}</div>
                
                <textarea className={savedNotes.notesAnswer} ref={showansref} value={msg.msgg}  readOnly>
                </textarea>
              </div>

              ))
            }
            <div ref={afterResultTextref} ></div>
</div>
            
              <form className={userExist ?  styles.formfield : styles.hideElement}>
                  <input type='text' placeholder={(!botMsg && allMsg[0] )? "Waiting for response..." : "Type here..."} name='prompt' value={promptinput} className={ (!botMsg && allMsg[0]) ? styles.promptdisabled : styles.prompt}  onChange={getPromptValue} onKeyDown={forEntersent} />
                  <button type="button" className={(!botMsg && allMsg[0]) ? styles.sendbuttondisabled : styles.sendbutton} onClick={handleSubmit} ><IoSend/></button>
              </form>
              
        
        </div>
        
      </main>
    </>
  )
}


export default ChatPage
