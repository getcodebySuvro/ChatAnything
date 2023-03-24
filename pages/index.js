import styles from '../styles/Home.module.css'
import  Head  from 'next/head'
import landing from '../styles/LandingPage.module.css'
import {AiFillCloseCircle} from "react-icons/ai"
import Image from 'next/image'
import LandingImage from '../public/LandingImage.png'
import loaderpath from '../public/loader.gif'
import { useState,useRef, useEffect } from 'react'
import { useRouter} from 'next/router'

export default function Home() {

  
  const[clickSignUp,setClickSignUp] = useState(false);
  const[clickLogIn,setClickLogIn]=useState(false)
  const[loading,setLoading]=useState(false)
  const[signupSuccess,setSignUpSuccess]=useState(false)
  const[loginSuccess,setLoginSuccess]=useState(false)
  const[error,setError]=useState({status:false,msg:null})
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const router = useRouter();

  useEffect(()=>{
    if(localStorage.getItem("Id") && localStorage.getItem("email") && localStorage.getItem("username")){
      router.push("/ChatPage");
    }
  },[])


  const signUpPressed=()=>{
    setClickSignUp(true)
    setClickLogIn(false)
  }
  const LogInPressed=()=>{
    setClickLogIn(true)
    setClickSignUp(false)
  }

  const closePopup=()=>{
    setClickSignUp(false);
    setClickLogIn(false);
  }

  const handleSubmit= async (e)=>{

    e.preventDefault();
    setLoading(true);
    if(clickSignUp){
     
     try{
      await  fetch("/api/Routes/UsersRegister/",{
        method:"POST",
        body:JSON.stringify({
        username:nameRef.current.value,
        email:emailRef.current.value,
        password:passwordRef.current.value
        }),
        headers:{
          "Content-Type":"application/json",
        },
      }).then((res)=>res.json()).then((data)=>{
        if(data=="User already exist") setError({status:true,msg:data})
        if(data._id){
          setSignUpSuccess(true);
          setLocalstorage_And_gotoChatPage(data._id,data.username,data.email);
          
        }
        
        
      });

     }catch(err){
      alert("Server is overloaded with rquests, please try again later");
      setError({status:true});
     }
      
    }
    if(clickLogIn){
      try{
        await  fetch("/api/Routes/UsersLogin/",{
          method:"POST",
          body:JSON.stringify({
          username:nameRef.current.value,
          password:passwordRef.current.value
          }),
          headers:{
            "Content-Type":"application/json",
          },
        }).then((res)=>res.json()).then((data)=>{
          if(data=="Wrong  password") setError({status:true,msg:data});
          if(data=="No user found") setError({status:true,msg:data})
          if(data._id){
          setLoginSuccess(true);
          setLocalstorage_And_gotoChatPage(data._id,data.username,data.email);
          }
            
          
        });

      }catch(err){
        alert("Server is overloaded with rquests, please try again later");
        setError({status:true});
      }
      
    }
    
  }

  const setLocalstorage_And_gotoChatPage = (id,username,email)=>{
           localStorage.setItem('Id',id);
            localStorage.setItem('username',username);
            localStorage.setItem('email',email);
            setLoading(false);
            setError({status:false});
            router.push("/ChatPage");

  }


  return (
    <>
    <Head>
      <title>ChatAnything</title>
      <meta name="description" content="Chatanything is a Ai driven chat application for your every queries. In chatanything you can ask any question  and get the answear from ai and  also can save it." />
      <meta name="keywords" content="artificial intelligence,artificial intelligence chatbot online,artificial intelligence chatbot project,free artificial intelligence chatbot,chatgpt for writers,openai"/>
      <meta name="author" content="Suvrojyoti Bhuniya"/>
    </Head>


      <main className={styles.main}>

        <span className={styles.blob1}></span>
        <span className={styles.blob2}></span>
        <span className={styles.blob3}></span>
        <span className={styles.blob4}></span>
        <div className={landing.container}>
            <div className={landing.left}>
              <div className={landing.headbox}>
              <div className={landing.welcometo}>Welcome To</div>
                <div className={landing.heading}>ChatAnything</div>
                <div className={landing.intro}>Chatanything is the ultimate solution for your every queries. In chatanything you can ask any question and save it.</div>
              </div>
                
                <div className={landing.buttonsec}>
                    <button className={landing.signup} onClick={signUpPressed}>SignUp</button>
                    <button className={landing.login} onClick={LogInPressed}>LogIn</button>
                </div>
            </div>
            <div className={landing.right}>
              {
                clickSignUp || clickLogIn
                ?
                <div className={landing.SignUpContainer}>
                  <AiFillCloseCircle className={landing.cross} onClick={closePopup}/>
                  <div className={landing.registerTitle}>{clickLogIn ? "LogIn" : "SignUp"}</div>

                  <form onSubmit={handleSubmit}>
                    <input type="text" placeholder='Username' minLength='3' maxLength="15" className={landing.register} ref={nameRef} name="username" required/>
                    {!clickLogIn ? <input type="email" placeholder='Email' className={landing.register} ref={emailRef} name="email" required/> : ""}
                    <input type="password" placeholder='Password' minLength='5' maxLength="20" className={landing.register} ref={passwordRef} name="password" required/>
                    <button type='submit' className={loading ? landing.registerButtonload  :landing.registerButton}>{loading ? <Image src={loaderpath} alt="Loader" width={65} height={20} />: "Submit"}</button>
                  </form>
                  <span className={landing.authstatus}>{signupSuccess ? "Registration Successfull":""}</span>
                  <span className={landing.authstatus}>{loginSuccess ? "LogIn Successfull":""}</span>
                  <span className={landing.autherror}>{error ? error.msg:""}</span>
                </div>
                :
                <div>
                  <Image src={LandingImage} alt="Landing Page Image" width={375} height={380} className={landing.landingimage} priority/>


                </div>
                




              }
              
                
            </div>
            
              
        
        </div>
        
      </main>
    </>
  )
}

