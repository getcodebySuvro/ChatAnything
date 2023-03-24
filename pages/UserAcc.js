import styles from '../styles/Home.module.css'
import landing from '../styles/LandingPage.module.css'
import Useracc from "../styles/Useracc.module.css"
import Link from 'next/link'
import Image from 'next/image'
import account from '../public/account.png'
import { useState, useEffect } from 'react'
import { useRouter} from 'next/router'
import  Head  from 'next/head'

const UserAcc =()=> {

  const[userData,setUserData]=useState({id:null,username:null,email:null})
  const router = useRouter();


  useEffect(()=>{
    const _id = localStorage.getItem("Id");
    const  name = localStorage.getItem("username");
    const mail = localStorage.getItem("email");
  
    (_id && name && mail) ? setUserData({id:_id,username:name,email:mail}) :"";
  },[])



  const deletemyAccPressed= async ()=>{
     
     try{
      await  fetch("/api/Routes/UsersRegister/",{
        method:"DELETE",
        body:JSON.stringify({
          id:userData.id
        }),
        headers:{
          "Content-Type":"application/json",
        },
      }).then((res)=>res.json()).then((data)=>{
        if(data=="Deleted"){
          clearLocalStorage_And_gotoLandingpage();
          alert("Account Deleted Successfully")
          
        }
        
      });

     }catch(err){
      alert("Server is overloaded with rquests, please try again later");
      console.log(err);
     }
      
    }
    
    const logOutPressed = ()=>{
      clearLocalStorage_And_gotoLandingpage();
      
    }

    const clearLocalStorage_And_gotoLandingpage = ()=>{
      localStorage.removeItem("Id");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      router.push("/");
    }
      

    



  return (
    <>
<Head>
  <title>ChatAnything_UserAccount</title>
</Head>
<main className={styles.main}>

<span className={styles.blob1}></span>
<span className={styles.blob2}></span>
<span className={styles.blob3}></span>
<span className={styles.blob4}></span>
<div className={landing.container}>
  {
    
      userData.id
      ?
      ""
      :
      <Link href="/" className={styles.gotoLogin}>Please Login</Link> 

  }
  <div className={userData.id ?  "" : styles.hideElement}>
  <div className={userData.id ? Useracc.list : styles.hideElement}>
      <span className={Useracc.userNavigateLinks}><Link href="/ChatPage">Chatpage</Link></span>
      <span  className={Useracc.userNavigateLinks}><Link href="/SavedNotePage">My Notes</Link></span>  
  </div >
    <div className={landing.left}>
      <div className={Useracc.headcontainer}>
      <div className={landing.welcometo}>
          My Account
          </div>
        <div className={Useracc.username}>{userData.username}</div>
        <div className={Useracc.email}>{userData.email}</div>
        <div className={landing.intro}>Thank you for using <strong>ChatAnything</strong>. This is your account section , you can logout or permanently delete your account from here. </div>
        <div className={landing.buttonsec}>
            <button className={Useracc.logout} onClick={logOutPressed}>LogOut</button>
            <button className={Useracc.deltacc} onClick={deletemyAccPressed}>Delete My Account </button>
        </div>
      </div>
        
    </div>
    <div className={landing.right}>
      {
       
        <div >
        <Image src={account} alt="User account image" height={360} width={330} className={Useracc.accimage} priority/>
        </div>
        
        }
      
        
    </div>
    
      

</div>
  </div>


</main>
    </>
  )
}

export default UserAcc;