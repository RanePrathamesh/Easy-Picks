import Image from "next/image";

const Banner = ({ text, children, lastUpdated }) => {
  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  // const formattedTime = lastUpdated
  //   ? new Date(lastUpdated).toLocaleTimeString("en-US", {
  //       hour: "numeric",
  //       minute: "numeric",
  //       second: "numeric",
  //       hour12: true,
  //     })
  //   : "";

  return (
    <div className="w-full relative lg:px-52 px-5  py-7 mb-5 bg-shady items-center sm:text-5xl text-2xl font-semibold text-white ">
      <div className="">
        <h2>{text}</h2>
        {formattedDate && (
          <span className="flex space-x-2 font-satoshi md:pt-10 pt-4 text-meta-2 font-thin text-sm ">
            <Image
              src="/checked.svg"
              alt=""
              width={20}
              height={20}
              style={{ filter: "invert(1)" }}
            />
            <p>Last Updated - {formattedDate}</p>
          </span>
        )}
      </div>
      {children && 
      <div>{children}</div>
      }
    </div>
  );
};

export default Banner;
