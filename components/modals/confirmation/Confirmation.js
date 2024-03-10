import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Confirmation({ isShow, setIsShow, externalMethod, argument }) {
  return (
    <>
      <div
        className={`transition-all duration-300 ease-in-out fixed border-2 top-25 -right-1/2 transform -translate-x-1/2
         ${isShow && 'right-[-120px] block'} bg-white text-black shadow-md rounded-md `
        }
      >
        <div className='relative'>
          <div className='p-4 font-semibold text-xl border-b-2 border-y-bodydark2'>
            <span className='mr-4'>Confirmation</span>
            <FontAwesomeIcon
              icon={faTimes}
              className='absolute right-4 cursor-pointer hover:border py-1 px-2 origin-center transition-all duration-200 top-3'
              onClick={() => {
                setIsShow(false);
              }}
            />
          </div>
          <div className='p-4 text-md font-inter'>
            <p>Do you really want to delete the category?</p>
            <div className='flex justify-end items-center mt-4 space-x-4'>
              <button className='px-4 py-2 rounded-md bg-primary text-white hover:shadow-md' onClick={async () => { await externalMethod(argument); setIsShow(false) }}>
                Yes
              </button>
              <button className='px-4 py-2 rounded-md text-white bg-graydark hover:shadow-md' onClick={() => setIsShow(false)}>
                Cancel
              </button>
            </div>
          </div>
          <div className='p-2 border-t-2 min-h-[40px] border-y-bodydark2'></div>
        </div>
      </div>
    </>
  );
}
