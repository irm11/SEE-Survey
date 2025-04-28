import { useParams } from "react-router-dom";
import { useState } from "react";


// import All forms here 
import SiteLocationform from "../Components/forms/SiteLocationform.jsx";


const allTabs={

"site-info":[
    {label:"Site Location",
     key:"Site Location",
     form:<SiteLocationform/>
    },
    {
      label:"Site Information",
      key:"Site Information",
      form:""
    },
    {
      label:"Site Access",
      key:"Site Access",
      form:""
    },
    {
      label:"Site Visit Information",
      key:"Site Visit Information",
      form:""
    }
    
],

}

const PageContainer =()=> {

 const {pageName}=useParams();
 const tabs=allTabs[pageName]|| [];

 const [activeTab, setActiveTab] = useState(tabs.length > 0 ? tabs[0].key : "");
 const currentForm=tabs.find(tab=>tab.key===activeTab)?.form


  return (
    <div>

    <div className="flex gap-2 mb-4 p-0">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={` px-4 py-2 rounded font-bold font-sans border-2 w-50 h-10 overflow-hidden text-center sm: ${activeTab === tab.key ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

 {/* Show form */}
 <div className=" w-full border p-4 rounded shadow">
        {currentForm || <div>No form available</div>}
      </div>
    </div>
  
    
  );
};

export default PageContainer