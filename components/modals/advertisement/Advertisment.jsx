"use client"
import Image from 'next/image'
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import "./advertisment.css"

export default function advertisment({ product }) {
    const cid = useSearchParams().get("cid")
    const [closeModal, setCloseModal] = useState(true);
    const [clock, setClock] = useState({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
    });

    useEffect(() => {
        const countdownInterval = setInterval(() => updateCountdown(countdownInterval), 1000);
        return () => {
            clearInterval(countdownInterval);
        };
    }, []);


    useEffect(() => {
        let cookieToken;
        if (!cid) {
            cookieToken = "home"
        } else {
            cookieToken = cid
        }
        const handleMouseEnter = () => {
            //    nothing on mouse enter in viewport
        };
        const setCookie = () => {
            const now = new Date();
            const expires = new Date(now.getTime() + 24 * 60 * 60 * 10000);
            document.cookie = `ad-popup-v-${cookieToken}=yyssfortody${cookieToken}; expires=${expires.toUTCString()}; path=/`;
        };

        const addEventListener = function () {
            document.addEventListener('mouseenter', handleMouseEnter);
            document.addEventListener('mouseleave', handleMouseLeave);
        }
        const removeEventListener = function () {
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
        }

        const handleMouseLeave = () => {
            setCookie();
            setCloseModal(false);
            removeEventListener()
        };
        const adPopupCookie = Cookies.get(`ad-popup-v-${cookieToken}`);
        if (adPopupCookie) {
            const expirationDate = new Date(Cookies.get(`ad-popup-v-${cookieToken}`));
            if (expirationDate && expirationDate < new Date()) {
                Cookies.remove(`ad-popup-v-${cookieToken}`);
                addEventListener()
            }
        } else {
            addEventListener()
        }
        return () => {
            removeEventListener()
        };
    }, []);

    const targetDate = new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000;

    // Update the countdown every second  
    function updateCountdown(countdownInterval) {
        const currentDate = new Date().getTime();
        const timeDifference = targetDate - currentDate;
        const addTimes = {}
        if (timeDifference <= 0) {
            clearInterval(countdownInterval);
            console.log("Sale ended")
        } else {
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            if (days) addTimes.days = days
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            if (hours) addTimes.hours = hours
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            if (minutes) addTimes.minutes = minutes
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
            if (seconds) addTimes.seconds = seconds
            setClock({ ...clock, ...addTimes })
        }
    }

    return (
        <>
            <div className={`transition-opacity duration-300 ease-in-out ${closeModal ? 'opacity-0 pointer-events-none' : 'opacity-100'} min-w-[100vw] min-h-[100vh] fixed top-0 z-10`}>
                {/* Child with opacity */}
                <div className='w-full h-full bg-black absolute opacity-75'>
                </div>

                {/* Child without opacity */}
                <div className='xl:w-[50%] lg:w-[60%] bg-white  absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 lg:rounded-2xl rounded-md  w-[80%] max-h-[80%] overflow-y-auto scrollbar-hide'>
                    {/* Content for the child without opacity */}
                    <div className='font-bold lg:text-4xl opacity-65 apply-border px-3 absolute right-5 top-3 cursor-pointer text-2xl' onClick={() => setCloseModal(true)}>
                        X
                    </div>
                    <div className='md:flex'>
                        <div className='w-2/5 md:flex flex-col gap-5 justify-center items-center p-3 hidden '>
                            <div className='apply-border'>
                                <Image
                                    src={`/${product?.productID}/mainImage.webp`}
                                    width={200}
                                    height={200}
                                    alt='test image'
                                />
                            </div>
                            <div className=' flex h-20 overflow-hidden justify-center'>
                                <Image
                                    src="/images/amazon-logo.png"
                                    width={150}
                                    height={50}
                                    alt='test '
                                    className='apply-border object-contain'
                                />
                            </div>
                        </div>
                        <div className='md:w-3/5 md:flex justify-center md:p-10 p-5 w-full bg-bodydark'>
                            <div>
                                <h1 className='text-success md:text-5xl font-bold text-2xl'>Best Choice</h1>
                                <p className='text-form-strokedark mt-3 mb-6'>Today's deals ends in</p>
                                <div className='flex gap-1'>
                                    <div className='w-1/4 border text-center self-center sm:py-2 sm:px-3 p-1 bg-white rounded-lg'>
                                        <span className='w-[80%] font-bold md:text-4xl text-2xl text-black opacity-80'>{clock.days}</span>
                                        <p className='font-semibold text-center text-black opacity-80'>Days</p>
                                    </div>
                                    <div className='w-1/4 border text-center self-center sm:py-2 sm:px-3 p-1 bg-white rounded-lg'>
                                        <span className='w-[80%] font-bold md:text-4xl text-2xl text-black opacity-80'>{clock.hours}</span>
                                        <p className='font-semibold text-center text-black opacity-80'>hours</p>
                                    </div>
                                    <div className='w-1/4 border text-center self-center sm:py-2 sm:px-3 p-1 bg-white rounded-lg'>
                                        <span className='w-[80%] font-bold md:text-4xl text-2xl text-black opacity-80'>{clock.minutes}</span>
                                        <p className='font-semibold text-center text-black opacity-80'>minutes</p>
                                    </div>
                                    <div className='w-1/4 border text-center self-center sm:py-2 sm:px-3 p-1 bg-white rounded-lg'>
                                        <span className='w-[80%] font-bold md:text-4xl text-2xl text-black opacity-80'>{clock.seconds}</span>
                                        <p className='font-semibold text-center text-black opacity-80'>seconds</p>
                                    </div>

                                </div>
                                <div className='flex justify-between items-center mt-5'>
                                    <h3 className='sm:text-2xl text-base md:w-[200px] w-full md:text-primary text-black opacity-90 font-semibold md:line-clamp-2 line-clamp-4'>
                                        {product?.title}
                                    </h3>

                                    <div className='relative apply-border sm:p-4 p-2'>
                                        <div className='rounded-full sm:p-5 p-1 bg-primary'>
                                            <h1 className='sm:text-4xl text-3xl font-bold py-3 text-white'>30%</h1>
                                        </div>
                                        <div className='sm:block hidden'>
                                            <div className='absolute w-7 h-7 p-5 bg-primary rounded-full top-3 right-4'></div>
                                            <div className='absolute p-3 bg-primary rounded-full top-4 left-2'></div>
                                            <div className='absolute p-2 bg-primary rounded-full bottom-4 right-5'></div>
                                            <div className='absolute  p-1 bg-primary rounded-full top-[50%] right-2'></div>
                                            <div className='absolute  p-2 bg-primary rounded-full top-[60%] right-3'></div>
                                            <div className='absolute  p-1 bg-primary rounded-full top-[30%] right-2'></div>
                                            <div className='absolute  p-1 bg-primary rounded-full top-[50%] left-2'></div>
                                            <div className='absolute  p-2 bg-primary rounded-full top-[60%] left-3'></div>
                                            <div className='absolute  p-1 bg-primary rounded-full top-[30%] left-2'></div>
                                        </div>
                                    </div>
                                </div>
                                <button className='w-full bg-meta-7 mt-4 py-3 md:font-bold font-semibold text-white md:text-2xl text-lg md:rounded-lg rounded-md' >
                                    <a href={product?.url} target='_blank'>  View Deal</a>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}




