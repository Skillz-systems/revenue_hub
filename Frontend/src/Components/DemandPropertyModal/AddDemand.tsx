import React, { useEffect, useState } from "react";
import { data } from "./inputFieldData";
import { useTokens, useTriggerError } from "../../Utils/client";
import axios from "axios";
import { BsCaretDownFill } from "react-icons/bs";

const apiUrl = import.meta.env.VITE_API_URL as string;
interface AddPropertyProps {
  hideAddDemandModal: () => void;
  propertyModalTransition: boolean;
}

const AddProperty: React.FC<AddPropertyProps> = ({
  hideAddDemandModal,
  propertyModalTransition,
}) => {

  const { token } = useTokens();
  const [districtState, setDistrictState] = useState<string>("");
  const [propertyUseState, setPropertyUseState] = useState<string>("");
  const [displaySearchIcon, setDisplaySearchIcon] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingCadastralZone, setLoadingCadastralZone] = useState(false);
  const [propertyLoader, setPropertyLoader] = useState(false);
  const [loadingStreet, setLoadingStreet] = useState(false);
  const [ratingDistricts, setRatingDistricts] = useState([]);
  const [ratingDistrict, setRatingDistrict] = useState(0);
  const [cadastralZone, setCadastralZone] = useState(0);
  const [street, setStreet] = useState(0);
  const [cadastralZones, setCadastralZones] = useState([]);
  const [streets, setStreets] = useState([]);
  const [order, setOrder] = useState<boolean>(true);


  const [paginationMeta, setPaginationMeta] = useState({
    next: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const triggerError = useTriggerError();
  useEffect(() => {
    // When ratingDistrict changes, reset both cadastralZone and street
    if (ratingDistrict > 0) {
      setCadastralZone(0); // Reset cadastral zone
      setStreet(0); // Reset street
      setCadastralZones([]); // Reset cadastral zone
      setStreets([]); // Reset street
      fetchCadastralZone();
    }
  }, [ratingDistrict]);

  useEffect(() => {
    // When cadastralZone changes, reset the street
    if (cadastralZone > 0) {
      setStreet(0); // Reset street
      setStreets([]); // Reset street
      fetchStreet();
    }
  }, [cadastralZone]);


  const fetchCadastralZone = async () => {
    setLoadingCadastralZone(true)
    try {
      const response = await axios.get(
        `${apiUrl}/api/cadastral-zone/by-rating-district/${ratingDistrict}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response) {
        setCadastralZones(response.data.data);
        setLoadingCadastralZone(false)
      }

    } catch (error) {
      console.error(error);
      setLoadingCadastralZone(false)
    }
  };

  const fetchStreet = async () => {
    setLoadingStreet(true)
    try {
      const response = await axios.get(
        `${apiUrl}/api/street/by-cadastral-zone/${cadastralZone}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response) {
        setStreets(response.data.data);
        setLoadingStreet(false)
      }

    } catch (error) {
      console.error(error);
      setLoadingStreet(false)
    }
  };

  useEffect(() => {
    fetchRatingDistrict();
  }, [token]);

  const fetchRatingDistrict = async () => {
    setCadastralZones([])
    setCadastralZone(0)
    setStreets([])
    setStreet(0)

    try {
      const response = await axios.get(`${apiUrl}/api/rating-district`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRatingDistricts(response.data.data)

    } catch (error) {
      console.error(error);
    }
  };

  const generateBulkDemandNotice = async () => {
    const data = {
      rating_district_id: ratingDistrict,
      cadastral_zone_id: cadastralZone,
      street_id: street
    }
    try {
      const response = await axios.post(`${apiUrl}/api/demand-notice/create-bulk-demand-notice`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      className={`flex-col relative min-w-[290px] sm:min-w-[350px] md:min-w-[500px] bg-white rounded overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white ${propertyModalTransition
        ? "lg:w-4/12 transition-all ease-in-out duration-500"
        : "w-32"
        }`}
      style={{ height: "95vh" }}
    >
      <img
        src={"/lightCheckeredBackgroundPattern.png"}
        alt="Checkered Background"
        className="absolute top-0 left-0 z-0 w-1/2"
      />
      <div className="absolute z-10 flex-col w-full p-4 space-y-16">
        <div
          className="flex items-start justify-between"
          style={{ height: "10vh" }}
        >
          <h3 className="text-base font-bold text-color-text-two">
            BATCH DEMAND NOTICE
          </h3>
          <button
            className="w-1/5 text-xs text-color-dark-red font-lexend font-medium px-0.5 py-2 border-0.6 border-color-dark-red rounded"
            onClick={hideAddDemandModal}
            type="button"
            title="Close Add New Property Modal"
          >
            Close
          </button>
        </div>
        <div className="flex-col space-y-6">
          <div>
            <h3 className="text-sm font-bold text-color-text-two">
              Rating District
            </h3><div
              className="w-[100px] flex items-center justify-between gap-2 pr-1.5 border rounded border-divider-grey text-color-text-two"
              title="Filter by District"
            >
              <select
                className="w-[100%] hover:cursor-pointer p-2 py-1.5 overflow-y-auto text-xs font-medium rounded outline-none appearance-none font-lexend overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
                onChange={(e: any) => setRatingDistrict(e.target.value)}
                value={ratingDistrict}
              >
                <option value="0"> All Districts</option>
                {ratingDistricts.map((district: any, index) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
              <span className="text-xs">
                <BsCaretDownFill />
              </span>
            </div>

          </div>

          <div>
            <h3 className="text-sm font-bold text-color-text-two">
              Cadastral Zone
            </h3>

            <div
              className="w-[100px] flex items-center justify-between gap-2 pr-1.5 border rounded border-divider-grey text-color-text-two"
              title="Filter by District"
            >
              <select
                className="w-[100%] hover:cursor-pointer p-2 py-1.5 overflow-y-auto text-xs font-medium rounded outline-none appearance-none font-lexend overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
                onChange={(e: any) => setCadastralZone(e.target.value)}
                value={cadastralZone}
              >
                <option value="0"> Cadastral Zone</option>
                {cadastralZones.map((cadastralZone: any, index) => (
                  <option key={cadastralZone.id} value={cadastralZone.id}>
                    {cadastralZone.name}
                  </option>
                ))}
              </select>
              <span className="text-xs">
                <BsCaretDownFill />
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-color-text-two">
              Street
            </h3>

            <div
              className="w-[100px] flex items-center justify-between gap-2 pr-1.5 border rounded border-divider-grey text-color-text-two"
              title="Filter by District"
            >
              <select
                className="w-[100%] hover:cursor-pointer p-2 py-1.5 overflow-y-auto text-xs font-medium rounded outline-none appearance-none font-lexend overscroll-contain scrollbar-thin scrollbar-thumb-color-text-two scrollbar-track-white"
                onChange={(e: any) => setStreet(e.target.value)}
                value={street}
              >
                <option value="0"> Select Street</option>
                {streets.map((street: any, index) => (
                  <option key={street.id} value={street.id}>
                    {street.name}
                  </option>
                ))}
              </select>
              <span className="text-xs">
                <BsCaretDownFill />
              </span>
            </div>
          </div>


          <div className="flex">
            <button
              className="w-full text-sm text-white font-lexend font-medium px-6 py-3 border-0.6 bg-primary-color rounded"
              onClick={() => generateBulkDemandNotice()}
              type="button"
              title="Close Add New Property Modal"
            >
              Generate Demand Notice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
