
import React from "react";
const SiteLocationForm = React.lazy(() => import("../forms/siteinfo/SiteLocationform.jsx"));
const SiteVisitInfoForm = React.lazy(() => import("../forms/siteinfo/Site-vistinfoForm.jsx"));
const SiteInformationForm = React.lazy(() => import("../forms/siteinfo/SiteInformation.jsx"));
const SiteAccess=React.lazy(()=>import("../forms/siteinfo/SiteAccess.jsx"))
const AcInformationForm=React.lazy(()=>import("../forms/Ac-power/AcConnectionInfo.jsx"))
const PowerForm = React.lazy(() =>import("../forms/Ac-power/PowerMeterForm.jsx"))
const Acpanel= React.lazy(()=>import("../forms/Ac-power/AC-Panels.jsx"))
const RoomInfo=React.lazy(()=>import("../forms/Room/Roominfo.jsx"))
const RoomPrepForm = React.lazy(() =>import("../forms/Room/RoomPreparationForm.jsx"))
const Ran=React.lazy(()=>import("../forms/Room/RanFrom.jsx"))
const Transmission=React.lazy(()=>import("../forms/Room/TransmissionForm.jsx"))
const Dc=React.lazy(()=>import("../forms/Room/DCsystemform.jsx"))
const outdoor=React.lazy(()=>import("../forms/Outdoor/Outdoor_generallayout_info.jsx"))
const Existing_outdoor_cabinets=React.lazy(()=>import("../forms/Outdoor/Existing outdoor cabinets.jsx"))
const Existing_Radio=React.lazy(()=>import("../forms/ExistingRadio/New radio installations.jsx"))
const New_Radio=React.lazy(()=>import("../forms/NewRadio/New radio installations.jsx"))
const New_Anntena=React.lazy(()=>import("../forms/NewRadio/Newantennas.jsx"))

export const tabsConfig ={
  "site-info": [
    { label: "Site Location", key: "site-location", component: SiteLocationForm },
    { label: "Site Visit Info", key: "site-visit", component: SiteVisitInfoForm },
    { label: "Site Information", key: "site-information", component: SiteInformationForm },
    { label: "Site Access", key:"site-Access", component: SiteAccess}
  ],
  "ac-power": [
    { label: "AC connection Info", key: "ac-info", component: AcInformationForm },
    {label:"Power Meter",key:"power-meter",component:PowerForm},
    {label:"Ac-Panel",key:"ac-panel",component:Acpanel}
  ],
  "room":[
    {label:"Shelter or Telecom Room Info",key:"room-info",component:RoomInfo},
    {label:"Shelter or telecom room preparations",key:"room-prep",component:RoomPrepForm},
    {label:"RAN",key:"ran",component:Ran},
    {label:"Transmission/MW",key:"tm",component:Transmission},
    {label:"Dc Power System",key:"dc",component:Dc}

  ],
  "Outdoor":[
    {label:"Outdoor general layout info",key:"Outdoor_generallayout_info",component:outdoor},
    {label:"Shelter or Telecom Room Preparation",key:"Existing_outdoor_cabinets",component:Existing_outdoor_cabinets},
    {label:"RAN",key:"ran",component:Ran},
    {label:"Transmission / MW (O)",key:"tm",component:Transmission},
    {label:"DC power system (O)",key:"dc",component:Dc}

  ],
  "Existing Radio":[
    {label:"Antenna structure info",key:"Outdoor_generallayout_info",component:Existing_Radio},
    {label:"MW antennas",key:"Existing_outdoor_cabinets",component:Existing_Radio},
    {label:"External DC PDU (DC panels, FPFH, …)",key:"ran",component:Ran},
    {label:"Radio antennas",key:"tm",component:Transmission},
    {label:"Radio units",key:"dc",component:Dc}

  ],
  "New Radio":[
    {label:"New radio installations",key:"Outdoor_generallayout_info",component:New_Radio},
    {label:"New antennas",key:"Newantennas",component:New_Anntena},
    {label:"New radio units, …)",key:"ran",component:Ran},
    {label:"New FPFHs",key:"tm",component:Transmission},
    {label:"GPS",key:"dc",component:Dc}

  ],

};
