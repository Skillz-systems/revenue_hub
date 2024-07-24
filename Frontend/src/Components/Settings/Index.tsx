import React from 'react'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { StreetTable } from './Street/StreetTable'
import { CadastralZoneTable } from './CadastralZone/CadastralZoneTable'
import { CategoryTable } from './Category/CategoryTable'
import { PropertyTypeTable } from './PropertyType/PropertyTypeTable'
import { PropertyUseTable } from './PropertyUse/PropertyUseTable'
import { OfficeZoneTable } from './OfficeZone/OfficeZoneTable'
import { RatingDistrictTable } from './RatingDistrict/RatingDistrictTable'



export const Index = () => {
  return (
    <TabGroup className="w-full">
      <TabList className="w-full grid grid-cols-4 gap-4 ">
        <Tab className="px-4 py-2 border rounded   data-[selected]:bg-blue-800 data-[selected]:text-white font-lexend text-[15px] bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-800">Street</Tab>
        <Tab className="px-4 py-2 border rounded  data-[selected]:bg-blue-800 data-[selected]:text-white font-lexend text-[15px] bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-800">Cadastral Zone</Tab>
        <Tab className="px-4 py-2 border rounded  data-[selected]:bg-blue-800 data-[selected]:text-white font-lexend text-[15px] bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-800 ">Rating District</Tab>
        <Tab className="px-4 py-2 border rounded  data-[selected]:bg-blue-800 data-[selected]:text-white font-lexend text-[15px] bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-800">Proprty Type</Tab>
        <Tab className="px-4 py-2 border rounded  data-[selected]:bg-blue-800 data-[selected]:text-white font-lexend text-[15px] bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-800">Property Use</Tab>
        <Tab className="px-4 py-2 border rounded  data-[selected]:bg-blue-800 data-[selected]:text-white font-lexend text-[15px] bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-800">Office Zone</Tab>
        <Tab className="px-4 py-2 border rounded  data-[selected]:bg-blue-800 data-[selected]:text-white font-lexend text-[15px] bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-800">Category</Tab>
        <Tab className="px-4 py-2 border rounded  data-[selected]:bg-blue-800 data-[selected]:text-white font-lexend text-[15px] bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-800">Particular Street</Tab>
      </TabList>
      <TabPanels className="w-full  mt-4 ">
        <TabPanel><StreetTable /></TabPanel>
        <TabPanel><CadastralZoneTable /></TabPanel>
        <TabPanel><RatingDistrictTable /></TabPanel>
        <TabPanel><PropertyTypeTable /></TabPanel>
        <TabPanel><PropertyUseTable /></TabPanel>
        <TabPanel><OfficeZoneTable /></TabPanel>
        <TabPanel><CategoryTable /></TabPanel>
        <TabPanel>Particular Street Content</TabPanel>
      </TabPanels>
    </TabGroup>
  )
}
