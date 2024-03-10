"use client";
import { useEffect, useState } from "react";
import { CronTime as PatterGenerator } from "cron-time-generator";
import cronstrue from 'cronstrue';
import { toast } from "react-toastify";
import { tosterProps } from "@/utils/generic-util";
import { addTaskInSchedule, deleteCronTask, getCronTasks, toggleCronStatus } from "@/services/cronService";
import { faCirclePause, faPencil, faTrashCan, faRefresh, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loader from "@/components/common/Loader";

const scheduleTask = () => {
  const constants = {
    Minutes_Interval: "minutes",
    Hours_Interval: "hours",
    Specific_Interval: "specificTime",
    Active_Cron_Status: "active",
    Paused_Cron_Status: "paused",
    Category_Cron_Type: "category",
  }
  const [selectedInterval, setSelectedInterval] = useState();
  const [cronTime, setCronTime] = useState({ minutes: "", hours: "", date: "" });
  const [error, setError] = useState();
  const [addCronJob, setAddCronJob] = useState(false);
  const [loading, setLoading] = useState(false);
  const [crons, setCrons] = useState([]);
  const [refetch, setRefetch] = useState([]);

  function addNewCronJob() {
    setAddCronJob(!addCronJob);
  };

  function handleIntervalType(interval) {
    setCronTime({ minutes: "", hours: "", date: "" });
    setSelectedInterval(interval)
  }

  function setCronInterval(e) {
    setCronTime({ ...cronTime, [e.target.name]: (e.target.value < 10 ? "0" + e.target.value : e.target.value) });
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    let cronPattern;
    let cronDescription;
    const cronStatus = constants.Active_Cron_Status;
    const cronType = constants.Category_Cron_Type;
    setLoading(true)
    const date = new Date(`${cronTime.date ? cronTime.date : "4500-12-12"}T${cronTime.hours ? cronTime.hours : '00'}:${cronTime.minutes ? cronTime.minutes : '00'}:00`);
    if (cronTime.date && date < new Date()) {
      return toast.error("Past Date is not possible we don't have TimeMachine", tosterProps)
    }
    if (selectedInterval === constants.Minutes_Interval) {
      cronPattern = PatterGenerator.every(parseInt(cronTime.minutes)).minutes()
    }
    if (selectedInterval === constants.Hours_Interval) {
      cronPattern = PatterGenerator.every(parseInt(cronTime.hours)).hours()
    }
    if (selectedInterval === constants.Specific_Interval) {
      cronPattern = `${date.getMinutes()} ${date.getHours()} ${cronTime.date ? date.getDate() : "*"} ${cronTime.date ? date.getMonth() + 1 : "*"} *`;
    }
    cronDescription = cronstrue.toString(cronPattern);
    const response = await addTaskInSchedule({
      cronPattern, cronDescription, cronStatus, cronType
    })
    setLoading(false);
    if (response.success) {
      setRefetch([]);
      setAddCronJob(false)
      toast.success(response.message, tosterProps)
    } else {
      toast.error("Error occured while adding task", tosterProps)
    }
  };

  useEffect(() => {
    async function fetch() {
      const response = await getCronTasks();
      setCrons(response.crons)
      // setRefetch(false)
    }
    fetch();
  }, [refetch])

  async function handleDelete({ _id: id }) {
    let response = await deleteCronTask(id);
    if (response.success) {
      toast.success(response.message, tosterProps);
      setRefetch(true);
    } else {
      toast.error(response.message, tosterProps)
    }
  }

  async function toggleStatus({_id:id}){
    let response = await toggleCronStatus(id);
    if(response.success){
      setRefetch([])
    }
  }

  return (
    <div>
      <button onClick={addNewCronJob} className={`w-full p-4 rounded-lg my-1 ${addCronJob ? 'bg-meta-1' : 'bg-primary'
        } text-white`}>
        {addCronJob ? "Hide" : "Add New Cron"}
      </button>
      {addCronJob && (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className=" border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Add New Cron
            </h3>
          </div>
          <form className="p-6.5" onSubmit={submitHandler}>
            <div className=" grid grid-rows-1 ">
              Select Fetch Interval
              <div className="row-span-1 flex gap-5">
                <div className="items-center flex mb-4 mt-2">
                  <input
                    id="default-radio-1"
                    onChange={(e) => handleIntervalType(e.target.value)}
                    type="radio"
                    value="minutes"
                    name="intervalType"
                    required
                    className="text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="default-radio-1"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Minutes
                  </label>
                </div>
                <div className="flex items-center mb-4 mt-2">
                  <input
                    id="default-radio-2"
                    onChange={(e) => handleIntervalType(e.target.value)}
                    type="radio"
                    value="hours"
                    required
                    name="intervalType"
                    className=" text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="default-radio-2"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Hours
                  </label>
                </div>
                <div className="flex items-center mb-4 mt-2">
                  <input
                    id="default-radio-3"
                    onChange={(e) => handleIntervalType(e.target.value)}
                    type="radio"
                    value="specificTime"
                    name="intervalType"
                    required
                    className="text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="default-radio-3"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Specific Time
                  </label>
                </div>
              </div>
            </div>

            {selectedInterval === constants.Minutes_Interval && (
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full ">
                  <label className="p-4 text-black dark:text-white">
                    At minutes -
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="(0-59)"
                    value={cronTime.minutes}
                    name="minutes"
                    onChange={(e) => setCronInterval(e)}
                    required
                    className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>
            )}

            {selectedInterval === constants.Hours_Interval && (
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className=" ">
                  <label className="p-4 text-black dark:text-white">
                    At hours -
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="23"
                    placeholder="(1-23)"
                    value={cronTime.hours}
                    name="hours"
                    onChange={(e) => setCronInterval(e)}
                    required
                    className=" rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>
            )}

            {selectedInterval === constants.Specific_Interval && (
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full ">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Select Date/Time -
                  </label>
                  <div className="flex">
                    <input
                      type="date"
                      // value={cronTime.date}
                      name="date"
                      onChange={(e) => setCronInterval(e)}
                      className=" rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <label className="p-4 text-black dark:text-white">
                      At hours -
                    </label> <input
                      type="number"
                      min="0"
                      max="23"
                      placeholder="(0-23)"
                      value={cronTime.hours}
                      name="hours"
                      {...!cronTime.date && { required: true }}
                      onChange={(e) => setCronInterval(e)}
                      className=" rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <label className="p-4 text-black dark:text-white">
                      At minutes -
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      placeholder="(0-59)"
                      value={cronTime.minutes}
                      name="minutes"
                      {...!cronTime.date && { required: true }}
                      onChange={(e) => setCronInterval(e)}
                      className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Modules
              </label>
              <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                  className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary "
                  onChange={(e) => setSelectedModule(e.target.value)}
                  value={selectedModule}
                >
                  <option value="">Select a Module</option>
                  {modules &&
                    modules.map((module) => (
                      <option value={module}>{module}</option>
                    ))}
                </select>
                <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                  <svg
                    className="fill-current"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.8">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill=""
                      ></path>
                    </g>
                  </svg>
                </span>
              </div>
            </div> */}
            {error && (
              <div className="bg-meta-1 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="flex w-full justify-center rounded bg-primary my-3 p-3 font-medium text-gray"
            >
              {!loading ? "Save" : "Saving..."}
            </button>
          </form>
        </div>
      )}

      <div className="py-5">
        <Breadcrumb pageName="Cron Jobs" />
        {crons?.length > 0 ? (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            {/* <div className="py-6 px-4 md:px-6 xl:px-7.5">
              <h4 className="text-xl font-semibold text-black dark:text-white">
                Crons
              </h4>
            </div> */}
            <div className="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5">
              <div className="col-span-2 flex items-center">
                <p className="font-medium">Type</p>
              </div>
              <div className="col-span-1 hidden items-center sm:flex">
                <p className="font-medium">Description</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Status</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Actions</p>
              </div>
            </div>
            { (crons &&
              crons.map((cron, index) => (
                <div
                  className="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5"
                  key={index}
                >
                  <div className="col-span-2 flex items-center">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      {cron.cronType}
                    </div>
                  </div>
                  <div className="col-span-1 hidden items-center sm:flex">
                    <p className="text-sm text-black dark:text-white">
                      {cron.cronDescription}
                    </p>
                  </div>
                  <div className="col-span-1 hidden items-center sm:flex">
                    <p className="text-sm text-black dark:text-white">
                      {cron.cronStatus}
                    </p>
                  </div>

                  <div className="col-span-1 flex items-center space-x-3.5">
                    <button
                      className="hover:text-primary"
                      title="Edit"
                      onClick={() => toggleStatus(cron)}
                    >
                      <FontAwesomeIcon icon={faPencil} />
                    </button>
                    <button
                      className="hover:text-primary"
                      title="Edit"
                      onClick={() => handleEdit(cron)}
                    ><FontAwesomeIcon icon={faRefresh} /> </button>
                    <button
                      className="hover:text-primary"
                      onClick={() => handleDelete(cron)}
                    ><FontAwesomeIcon icon={faTrashCan} /></button>
                    {cron.cronStatus === constants.Active_Cron_Status ?
                      (<button
                        className="hover:text-primary"><FontAwesomeIcon
                          title="pause"
                          onClick={()=>toggleStatus(cron)}
                          icon={faCirclePause} className="text-[#d22d2d] dark:text-[inherit]" />
                      </button>) :
                      (<button
                        className="hover:text-primary"><FontAwesomeIcon
                          title="activate"
                          onClick={()=>toggleStatus(cron)}
                          icon={faPlay} className="text-[#38a344] dark:text-[inherit]" />
                      </button>)
                    }
                  </div>
                </div>
              )))}
          </div>
        ) : (
          <h2 className="w-[fit-content] mx-auto dark:text-white">No cron Jobs Scheduled!!</h2>
        )}
      </div>
    </div>
  );
};

export default scheduleTask;
