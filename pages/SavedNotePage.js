import React, { useEffect, useState,useRef} from 'react'
import {BiEditAlt} from 'react-icons/bi'
import {MdDelete,MdAccountCircle} from 'react-icons/md'
import {HiChatBubbleLeftRight} from 'react-icons/hi2'
import {FiMaximize2,FiMinimize2} from 'react-icons/fi'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import loaderpath from '../public/loader.gif'
import savedNotes from '../styles/SavedNote.module.css'



const SavedNotePage = () => {

  const[userExist,setUserExist]=useState(false);
  const[notes,setNotes]=useState([]);
  const[showEditor,setShowEditor]=useState();
  const[newQsn,setNewQsn]=useState();
  const[newAns,setNewAns]=useState();
  const[deleted,setDeleted]=useState(false);
  const[edited,setEdited]=useState(false)
  const[loader,setLoader]=useState(true)
  const[maxsize,setMaxSize]=useState(false)
  
  const answerref = useRef(null);

  useEffect(()=>{
    if(localStorage.getItem("Id") && localStorage.getItem("email") && localStorage.getItem("username")){
      setUserExist(true);
      getNotes();
    }
    
  },[])


  useEffect(()=>{
    if(answerref.current) showFullEditAns();
  },[showEditor])

  useEffect(()=>{
    getNotes();
  },[deleted,edited])



   const sizeChange = (index)=>{
    if(maxsize) {
      setMaxSize(false)
      setShowEditor({status:false})
    }else{
      setMaxSize(true)
      setShowEditor( {status:true,id:index});
    }
   
   }
   
  const getNotes= async()=>{
    try{
      const res = await fetch("/api/Routes/NotesRoute/");
      const data = await res.json();
      if(data){
        setNotes(data);
        setLoader(false)
      }
        
    }catch(err){
      alert("Server is overloaded with rquests, please try again later");
      console.log(err);
    }
  }

  const editNotes = async (e,index,id,username)=>{
    e.preventDefault();
    const newData = {
      id,
      username,
      question:newQsn,
      ans:newAns
    }
    try{
      await fetch("/api/Routes/NotesRoute/",{
        method:"PUT",
        body:JSON.stringify({
          newData

        }),
        headers:{
          "Content-Type":"application/json",
        },
      }).then((res)=>{
        notes.splice(index,1,newData);
        setEdited(true);
        setShowEditor({status:false,id:index})
      })

    }catch(err){
      alert("Server is overloaded with rquests, please try again later");
      console.log(err);
    }
  }
  const deleteNotes = async(id,index)=>{
    setDeleted(true);
    if(id){
      try{
        await  fetch("/api/Routes/NotesRoute/",{
          method:"DELETE",
          body:JSON.stringify({
            id:id
          }),
          headers:{
            "Content-Type":"application/json",
          },
        }).then((res)=>{
          if(res){
            delete notes[index];
            setDeleted(false)
            
          }
          
        })
      }catch(err){
        alert("Server is overloaded with rquests, please try again later");
        console.log(err);
      }
    }
    
  }

  const editQsn = (e)=>{
    setNewQsn(e.target.value)
  }
  const editAns = (e)=>{
    
    setNewAns(e.target.value)
  }

  const editClicked = (index)=>{
    setNewQsn(notes[index].question);
    setNewAns(notes[index].ans);
    setShowEditor( {status:true,id:index});
    
  }
  function showFullEditAns(){
    
      answerref.current.style.height=`${answerref.current.scrollHeight}px`;
    }
 
  return (
    <>
    <Head>
  <title>ChatAnything_MyNotes</title>
</Head>
     <div className={styles.main}>

<span className={styles.blob1}></span>
<span className={styles.blob2}></span>
<span className={styles.blob3}></span>
<span className={styles.blob4}></span>
<div className={styles.container}>

  <div className={userExist ? styles.titleheader : styles.hideElement}>
  <Link href="/UserAcc" title='Goto MyAccount'><MdAccountCircle className={styles.titleheadericons}/></Link>
  <div className={styles.initialtitle}>{loader ? <Image src={loaderpath} alt="Loader" width={200} height={65}  className={styles.loader} /> : "MY NOTES"}</div>
  <Link href="/ChatPage" title='Goto ChatPage'><HiChatBubbleLeftRight className={styles.titleheadericons}/></Link>

  </div>

    <div className={userExist ?  savedNotes.noteswindow :savedNotes.noteswindowlogin } >
    {
              userExist
              ?
              ""
              :
              <Link href="/" className={styles.gotoLogin}>Please Login</Link> 
        }
        {notes.length>0 ? "" :<div className={savedNotes.emptynotes}>!YOU DONT HAVE ANY NOTES!</div>}
       {
        notes && notes.map((note,index)=>{
          return(
          <>
          <div className={savedNotes.notescontainer} key={index}>
            
            
              <div className={savedNotes.notesHeader}>
              <div className={savedNotes.notesCount}>{index+1}</div>

              <BiEditAlt className={savedNotes.notesUpdateDelete} onClick={()=>{editClicked(index)}} title='Edit Notes'/>
              
              {maxsize ? <FiMinimize2 className={savedNotes.notesUpdateDelete} onClick={()=>sizeChange(index)} title='Minimize'/> :<FiMaximize2 className={savedNotes.notesUpdateDelete} onClick={()=>sizeChange(index)} title='Maximize'/> }
              {deleted ? <MdDelete  className={savedNotes.notesUpdateDeleteFade} readOnly/> : <MdDelete className={savedNotes.notesUpdateDelete} onClick={()=>deleteNotes(notes[index]._id,index)} title='Delete Notes'/> }
              
  
            </div>
            {
              showEditor && showEditor.status && index==showEditor.id
              ?
              <>
              <form onSubmit={(e)=>editNotes(e,index,notes[index]._id,notes[index].username)}>
                  <input type="text" placeholder='Question' defaultValue={notes[index].question} className={savedNotes.editorqsn} onChange={editQsn} minlength="5" required/>
         
                
                  <textarea placeholder='Answer' defaultValue={notes[index].ans} className={savedNotes.editorans} onChange={editAns} ref={answerref} minlength="5" required></textarea>

                  
                
                  <button type="submit" className={maxsize ? styles.hideElement :savedNotes.submitBtn}> Submit</button>
              </form>
              </>
              
              :
              <>
              <div className={savedNotes.notesQuestion}>{note.question}</div>
              <textarea className={savedNotes.notesAnswer} value={note.ans}  readOnly></textarea>
              </>
              
            }
            
            
          
          </div>
          
          
          </>
          )
            
        })
       }
    </div>

</div></div>
    </>
  )
}

export default SavedNotePage
