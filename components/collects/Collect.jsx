'use client';
import {  collectCategoryPageData, collectHomePageData, setCookiesForCollect } from '@/services/interactivityService'
import React, { useEffect } from 'react'

export default  function collect(props) {
    useEffect(()=>{
      const currentUrl= window.location.href
      let url=new URL(currentUrl);
      async function fetch(){
        const visitId= localStorage.getItem('visitId');
        if(!visitId){
          let {visitId}= await setCookiesForCollect();
           localStorage.setItem('visitId',visitId)
        }
        switch (url.pathname) {
          case '/' :
            await collectHomePageData({visitId,currentUrl})
            break;
          case '/categories' :
            await collectCategoryPageData({visitId,currentUrl})
            break;
          default:
            console.log("page url not found")
            break;
        }
      }
       fetch();
    },[])
  return (
    <></>
  )
}
