import React,{useEffect,useState,useContext} from 'react';
import { Card, Col} from 'react-bootstrap';
import ButtonLoad from 'react-bootstrap-button-loader';
import firebase from '../../NFTFolder/firebase';
import fireDb from '../../NFTFolder/firebase';
import { ToastContainer, Toast, Zoom, Bounce, toast} from 'react-toastify';
import { useHistory } from "react-router-dom";
import configfile from '../../NFTFolder/config.json'
import {abiauction} from './Auctionnftcontract';
import web3 from './web3';
import {DataContext} from "../../App";
const OwnedAuctioTab =({x})=>{
    let history=useHistory();
    const EAWalletbalances = useContext(DataContext);
    const handleShowLoad = () => setLoader(true);
    const handleHideLoad = () => setLoader(false);
    const [selectValue31,setSelectValue31] = useState("1");        
    const handleChange31 = (e)=>{
        setSelectValue31(e.target.value)
    }        
    const[getIProfile,setgetIProfile]=useState([""]);       
    const [getprices,setprices]=useState("")
    const[loader, setLoader] = useState(false);
    const [algobalanceApp,setalgobalanceApp] = useState("");        
    //EPolygonNFTABuy
    const dbcallProfile=async()=>{            
      if(localStorage.getItem("EAWalletAddress")  === null || localStorage.getItem("EAWalletAddress")  === "" || localStorage.getItem("EAWalletAddress")  === " " || localStorage.getItem("wallet") === undefined || localStorage.getItem("EAWalletAddress") === ''){
      }
      else{
        //firebase.auth().signInAnonymously().then(async(response)=>{           
          const hasRestaurant = await fireDb.database()
          .ref(`EPuserprofile/${localStorage.getItem('EAWalletAddress')}`)
          .orderByKey().limitToFirst(1).once('value')
          .then(res => res.exists());          
          if(hasRestaurant)
          {
              let r=[];
          try {    
          //firebase.auth().signInAnonymously().then((response)=>{           
          firebase.database().ref("EPuserprofile").child(localStorage.getItem('EAWalletAddress')).on("value", (data) => {          
              if (data) {  
                  try{
  
                  
                  r.push({
                  Bio:data.val().Bio,
                  Customurl: data.val().Customurl,
                  Email: data.val().Email,
                  Imageurl:data.val().Imageurl,
                  Personalsiteurl: data.val().Personalsiteurl,
                  TimeStamp: data.val().TimeStamp,
                  Twittername: data.val().Twittername,
                  UserName: data.val().UserName,
                  WalletAddress: data.val().walletAddress,
                  bgurl:data.val().bgurl,
                  valid:data.val().valid
                  })                
              }   catch(e){                      
              }                 
              }
              else{
              setgetIProfile([""]);  
              }
              setgetIProfile(r);
          });         
          //})         
          } catch (error) {          
          }                
          }else{
              setgetIProfile([""]);  
          }            
        //})
      }        
  }    
  useEffect(()=>{dbcallProfile()},[])        
    

    const setpricedb=async(b)=>{      
        if(getprices === null || getprices === undefined || getprices === "" ){
            toast.warning(`please enter price`,{autoClose:5000})
            handleHideLoad()            
        }else if(isNaN(getprices))
        {        
            toast.warning(`please valid number`,{autoClose:5000})
            handleHideLoad()            
        }
        //else if(getprices === "0" || parseInt(getprices) === 0){
        else if(getprices === "0"){
            toast.warning(`please enter above 0 price`,{autoClose:5000})
            handleHideLoad()            
        }
        else if(getprices === "00" || getprices === "000" || getprices === "0000" || getprices === "00000"){
            toast.warning(`you are entered zeros`,{autoClose:5000})
            handleHideLoad()            
        }
        else if(getprices.length >= 5 ){                                    
            toast.warning(`you are entered Maximum Values`,{autoClose:5000})
            handleHideLoad()            
        }        
        else if(localStorage.getItem('EAWalletAddress') === null || localStorage.getItem('EAWalletAddress') === "" || localStorage.getItem('EAWalletAddress') === undefined || localStorage.getItem('EAWalletAddress') === " "){
            toast.warning(`please connect your wallet`,{autoClose:5000})
            handleHideLoad()         
        }                
        else if(EAWalletbalances === "" || EAWalletbalances === "0" || EAWalletbalances === undefined || EAWalletbalances === null){
            toast.warning(`Insufficient balance to NFT Updating Price `,{autoClose:5000})
            handleHideLoad()            
        }
        else{        
        handleShowLoad()                     
        toast.info("Updating The Price of NFT",{autoClose:5000});                         
        let amountmul=(parseFloat(getprices)*100000000);
        let timegivencontract;
        let a;
        let time;
        if(selectValue31 === "1" || selectValue31 === 1){
            a = Math.floor(new Date().getTime()/1000.0)
            time = a + 86400;
            timegivencontract = 86400;
        }else{
            a = Math.floor(new Date().getTime()/1000.0)
            time = a + 604800;
            timegivencontract = 604800;
        }
        try {   
        let getaaaa=new web3.eth.Contract(abiauction,b.EscrowAddress);                
        await getaaaa.methods.setTokenPrice(b.Assetid,web3.utils.toBN(amountmul)).send({
            from:localStorage.getItem('EAWalletAddress'),              
            gas: 210000,
            //gasPrice: '20000000000'
        })
        const priceamount = await getaaaa.methods.items(b.Assetid).call();
        console.log(priceamount.price)
        
        const accounts = await web3.eth.getAccounts();
        await getaaaa.methods.auction(timegivencontract,accounts[0],b.Assetid).send({
            from:localStorage.getItem('EAWalletAddress')
        })

            
        let cl="res2CS.hash";        
        let dateset=new Date().toDateString();
        //fireDb.auth().signInAnonymously().then((responses)=>{                     
        fireDb.database().ref(`EPolygonNFTAS/${localStorage.getItem('EAWalletAddress')}`).child(b.keyId).set({
            Assetid:b.Assetid,Imageurl:b.Imageurl,NFTPrice:parseFloat(amountmul),EscrowAddress:b.EscrowAddress,keyId:b.keyId,
            NFTName:b.NFTName,userSymbol:b.userSymbol,Ipfsurl:b.Ipfsurl,ownerAddress:b.ownerAddress,previousoaddress:localStorage.getItem('EAWalletAddress'),
            TimeStamp:dateset,NFTDescription:b.NFTDescription,HistoryAddress:b.HistoryAddress,Appid:b.Appid,valid:b.valid,
            CreatorAddress:b.CreatorAddress,NFTType:b.NFTType,NFTChannel:b.NFTChannel,SocialLink:b.SocialLink,NFTModel:b.NFTModel,AuctionTime:time
        }).then(()=>{  
            fireDb.database().ref(`EPolygonNFTABuy/${localStorage.getItem('EAWalletAddress')}`).child(b.keyId).remove();
            let refactivity=fireDb.database().ref(`EPolygonactivitytable/${localStorage.getItem('EAWalletAddress')}`);   
            const db = refactivity.push().key;                         
            refactivity.child(db).set({
                Assetid:b.Assetid,Imageurl:b.Imageurl,NFTPrice:parseFloat(amountmul),EscrowAddress:"priceupdated",keyId:db,
                NFTName:b.NFTName,userSymbol:b.userSymbol,Ipfsurl:b.Ipfsurl,ownerAddress:b.ownerAddress,previousoaddress:localStorage.getItem('EAWalletAddress'),
                TimeStamp:dateset,NFTDescription:cl,HistoryAddress:b.HistoryAddress,Appid:b.Appid,valid:b.valid,
                CreatorAddress:b.CreatorAddress,NFTType:b.NFTType,NFTChannel:b.NFTChannel,SocialLink:b.SocialLink,NFTModel:b.NFTModel,AuctionTime:time
        })
        .then(()=>{                                                    
            toast.success(`NFT Price Updated Successfully`,{autoClose: 5000});            
            toast.dismiss()
            toast.success(`Move NFT To Sale`,{autoClose: 5000});            
            handleHideLoad()
            done()
            })                        
        })            
        //})
    //db end here                  
    } catch (err) {
            console.error(err);            
            toast.error(`your browser appearing issue`,{autoClose: 5000});            
            handleHideLoad()     
          }        
        }            
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    const done=async()=>{
        await sleep(7000);
        history.push("/my-NFT")
        window.location.reload(false);    
    } 

    const toastDiv = (txId) =>
    (
    <div>
         <p> Transaction is successful &nbsp;<a style={{color:'#133ac6'}} href={txId} target="_blank" rel="noreferrer"><br/><p style={{fontWeight: 'bold'}}>View in Algoexplorer <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M11.7176 3.97604L1.69366 14L0.046875 12.3532L10.0697 2.32926H1.23596V0H14.0469V12.8109H11.7176V3.97604Z" fill="#133ac6"/>
          </svg></p></a></p>  
     </div>
    );
    return(           
                <Col xxl={3} md={4} sm={6} xs={12} className='mb-4'>
                <Card className='card-dash p-3 d-block border-0'>
                    <div className='card-img text-center mb-2'>           
                            <img src={x.Imageurl} alt="image" className='img-fluid' />                        
                    </div>
                    <div className='d-flex mb-2 justify-content-between flex-wrap align-items-center'>                        
                    </div>
                                        <h5 className='mb-2'>{x.NFTName} <br />
                                        </h5>
                                        <h6 className='mb-2'>Price</h6>
                                        <p className='subheading mb-0'>
                                        <span className='text-success'>
                                        {x.NFTPrice === null || x.NFTPrice === "" || x.NFTPrice === undefined ?(
                                                <>{configfile.nullvalue}
                                                <Col md={4} xs={6}>
                                        <div className='mb-3'>
                                            <label>End-Date</label>
                                            <select className="form-control form-control-field border-0"
                                            defaultValue={selectValue31} 
                                            onChange={handleChange31}>
                                                <option value="1">1 day</option>
                                                <option value="7">7 days</option>                                                
                                            </select>
                                        </div>
                                        </Col>
                                                </>
                                            ):(
                                                <h6>{(parseFloat(x.NFTPrice)/1000000)}
                                                <Col md={4} xs={6}>
                                        <div className='mb-3'>
                                            <label>End-Date</label>
                                            <select className="form-control form-control-field border-0"
                                            defaultValue={selectValue31} 
                                            onChange={handleChange31}>
                                                <option value="1">1 day</option>
                                                <option value="7">7 days</option>                                                
                                            </select>
                                        </div>
                                        </Col>
                                                </h6>
                                            )}                                            
                                        </span>
                                        </p>
                                        <br />
                                        
                        <>
                    {x.NFTPrice === "" || x.NFTPrice === null || x.NFTPrice === undefined ?(
                        <>                                            
                        <h5 className='d-flex mb-3 align-items-center'><img src={getIProfile[0].Imageurl} alt="logo" className='me-2 avatar-pic' />                        
                        <div className="input-group-max d-flex align-items-center text-nowrap px-3 input-group-max-lg w-100">
                        <input type="number" placeholder='Enter Price' className='form-control' value={((getprices))} onChange={event => setprices((event.target.value))} />
                        </div>
                        </h5> 
                        <ButtonLoad loading={loader} variant="blue" className='w-100' onClick={()=>{setpricedb(x)}}>Update Price and Sale</ButtonLoad>                                        
                        </>
                    ):(
                        <>                        
                        <h5 className='d-flex mb-3 align-items-center'><img src={getIProfile[0].Imageurl} alt="logo" className='me-2 avatar-pic' />                        
                        <div className="input-group-max d-flex align-items-center text-nowrap px-3 input-group-max-lg w-100">
                        <input type="number" placeholder='Enter Price' className='form-control' value={((getprices))} onChange={event => setprices((event.target.value))} />
                        </div>
                        </h5> 
                        <ButtonLoad loading={loader} variant="blue" className='w-100' onClick={()=>{setpricedb(x)}}>Update Price and Sale</ButtonLoad>                                        
                        </>
                    )} 
                    </>                    
                </Card>
                </Col>                        
    )
}

export default OwnedAuctioTab