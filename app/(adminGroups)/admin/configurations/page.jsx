'use client'
import { getConfigKeys, updateConfigKeys } from '@/services/configService'
import React, { useEffect, useState } from 'react'

const Configurations = () => {
    const [openaiapikey, setOpenaiapikey] = useState()
    const [nextauthsecret, setNextauthsecret] = useState()
    const [error, setError] = useState()
    useEffect(() => {
        getConfigKeys()
      .then((configData) => {
        setOpenaiapikey(configData.openai_api_key || '');
        setNextauthsecret(configData.nextauth_secret || '');
      })
      .catch((fetchError) => {
        setError('Error fetching configuration keys.');
        console.error('Error fetching configuration keys:', fetchError);
      });
    },[])
    const handleSubmit = async (e) => {
        e.preventDefault()
        await updateConfigKeys({ openaiapikey, nextauthsecret });
        console.log(`Updated Keys: OPENAI - ${openaiapikey}    NEXTAUTH - ${nextauthsecret}`);
    }
  return (
    <div className=" rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="w-full border-stroke dark:border-strokedark  xl:border-l-2">
            <div className="w-full  p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Configurations
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                  OPENAI_API_KEY
                  </label>
                  <div className="relative">
                    <input
                    value={openaiapikey}
                      onChange={(e) => setOpenaiapikey(e.target.value)}
                      type="text"
                      placeholder="Enter OPENAI KEY"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                  NEXTAUTH_SECRET
                  </label>
                  <div className="relative">
                    <input
                    value={nextauthsecret}
                      onChange={(e) => setNextauthsecret(e.target.value)}
                      type="text"
                      placeholder="Enter Next-auth SECRET"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Save"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>
                {error && (
            <div className="bg-meta-1 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}</div>)}
              </form>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Configurations