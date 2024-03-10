import { faArrowUpWideShort } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

const FilterBox = ({filter}) => {
  return (
    <div className="relative">
    <input type="checkbox" id="sortbox" className="hidden absolute"/>
    <label htmlFor="sortbox" className="flex items-center  cursor-pointer">
    <FontAwesomeIcon icon={faArrowUpWideShort} size='2xs' className='hover:drop-shadow-1 w-6 h-6'/>
    </label>

        <div id="sortboxmenu" className="absolute mt-5 right-1  top-full min-w-max shadow rounded hidden bg-gray-300 border border-gray-400 transition delay-75 ease-in-out z-10">
        <ul className="block text-right text-black bg-meta-2 text-base font-inter font-normal shadow-2">
            <li><Link href={`?`} className={`block px-3 py-2  border-b  ${filter==="toprelevant" && "bg-primary text-white"}`}>Top relevant</Link></li>
            <li><Link href={`?filter=discount`} className={`block px-3 py-2 border-b  ${filter==="discount" && "bg-primary text-white"}`}>Discount</Link></li>
            <li><Link href={`?filter=priceToPay`} className={`block px-3 py-2  ${filter==="priceToPay" && "bg-primary text-white"}`}>Price: Low to High</Link></li>
        </ul>
    </div>
</div>
  );
};

export default FilterBox;
