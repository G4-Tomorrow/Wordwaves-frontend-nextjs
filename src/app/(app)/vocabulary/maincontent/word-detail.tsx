import {
  IconX,
  IconInfoCircle,
  IconBookmark,
  IconVolume2,
} from "@tabler/icons-react";
import Image from "next/image";
import { useEffect } from "react";

interface Phonetic {
  text: string;
  audio: string;
}

interface Definition {
  definition: string;
  example?: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface Word {
  id: string;
  name: string;
  thumbnailUrl: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
}

interface WordDetailModalProps {
  word: Word;
  onClose: () => void;
}
// Component WordModal
// Description: Shows detailed information about a selected word, including phonetics, meanings, and examples. Allows users to listen to the pronunciation and mark as known.
const WordDetailModal: React.FC<WordDetailModalProps> = ({ word, onClose }) => {
  // Function to speak the word
  const speakWord = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  // Automatically speak the word when the modal opens
  useEffect(() => {
    speakWord(word.name);
  }, [word.name]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
      <div className="bg-white dark:bg-[#222222] rounded-lg shadow-lg max-w-4xl w-full p-4 relative scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src={
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQsAAAELCAYAAAG5UpPEAAAACXBIWXMAAC4jAAAuIwF4pT92AAAWtUlEQVR4nO3dTWxTZ74G8KeoDgqJIGkuTYYmECJAqKOhIEZTIfVOUjFH89FFPXfUbtAVYX0Wk9l427DNZpiF7+YuCLpiFvSqOixuq9Fp1aS9EndGQnyMWmWCx2ASUYfImET+qOPW3EVs+uL32H6Pz3vsY+f5Sagltt/z79snf5/v89KzZ88QBLvaXUAFC6nGQqqxkGospBoLqfayjkEipun4hTUXjb6kOsZLzX7pRUxzGsBlAOjv68N74fALr1++ehUAsLy8fMqy7duNxmtqRiozcOHcOceFV7kFoOHMuCpEnIVKETUW7ppyIWHDmD927Nj5oxMTeOvMGaUClpeX9RcC4DwA3IvHcS8e11qEciFhw1BOdHUBlm0r/ea46iP1/iuXl5edXh9UHdv1b43qlKvORIVyH1H93+O2ANeF+C0w3zUspBoLqcZCqrGQaiykWiC+awIxGyyigkVUsIgKFlHBIio87wGKmOZtAG84vHRhLhqdVxnDy96f5x+s3vkCbO8DWV5eVtqKc11ErYUnHz/GJ7b9wnsr27uNCnG71+eF3U5bxSKuXrvmZghvRYgF/O3mTXy1tFT3/bFYTLkIpf8dYcN4duzYMeVBq3Y7JCzbHq/3/oa/omHDmFVeulwAGhUAKMyEuC+j1myUSiXH6Vfdv6GSiQ0A+wB3O9Tc7GBRzoTieBuWbQ+oLtxVEX4LxHcHi6hgERUsooJFVLCIikB8dwRFIP6PBAUnQ8DJEHAyBJwMASdDwMkQcDIEnAwBJ0Og5fRHnSKmOQXgc4eXLs5Fo7N+Lrtt2yYR0xwHcL/Zz2cyGfzHlStNnaZVS8smI2KaAwDS1T93OppRzelAA6B+sEGV75NRfQZxrf/4r5eW8NebN12NLe6L1jEhvkzGuXD4/1577bU3K39/ZXAQ7/7mN89fv/33v+PW3bueluF0fqdl20+9jKl1MsKGcRLALfEQxoVz57Qd1gKARCKBQqEg/TxQyVA5nuNFvcMzgeoZTodyvE6I4rEpz78aIt/WMyr/MY0mZXNzE8lk0tXYupJQzZdfEz/4NQEiX75NwoYxBee1SBUXLdue1VeNOu4dF3BDTcDJEHAyBJwMASdDwMkQcDIEnAwBJ0PAyRBwdVzAZAg4GQJOhoCTIeBkCDgZAk6GgJMh4GQIOBkCToaAkyHgZAg4GQJOhoCTIeBkCDgZAk6GgJMh4GQIOBmCIJ5IP4/ybWAFGwDG56JRbWf2OWn7cZNmTqh3c7NmN9p5VcFTlO9H0oxYLJb66C9/+ReNJbV+Mmrdmvvs5CQOjo7W/ewnn36K5NoaACCdTmN9fV3rKZGtvMRCWtCpEydw8ic/afjZz774Ag9XVqSf677EwvcG6tQTfm0YGHn11Zqfuf7xx3iSli5N8Z2vyahOQ09PD869957je93eQr1QKCCRSDz/u450+JaM6ok49/776AmFXniPlwSIE6GLL5PR6OojrzfSLxaLnj5fi/bJqL6bmjgRup4mcP9+09f51aV1MsKG8ezAgQPP/677kQpAzetQrusYW/slFqOjo9izZ4+WMUW17koHBOyrNWwY45V/f/r0qfbJiMViKJVKtV7+g67l6Po1ef5LnMlkNA0J5HI5rK6u1n2PZduXdC3Pl2+TUqmEXbua3ztQvQ5Ri+6rkzxPhtOtMGOxWFMX7NW6TNOJH5dpeW6glWtZnV7r7e3F2NhY3c/fv3/f7XpDUzezVOHbpZw+0XrpZjVdPeM6gHc1jeXkimXb0z6OD0DvesYlAL/XMtgP3rZse0HzmDX5dSnnPOT9mCp86wcq2r4PNEh4qEDAyRBwMgScDAEnQ8DJEHAyBJwMASdDwMkQcDIEnAwBJ0PAyRBwMgScDAEnQ8DJEHAyBJwMASdDwMkQ8FABOeJvCTliMMgRg0GOGAxyxGCQIwaDHDEY5IjBIEcMBjliMMgRg0GOGAxyxGCQIwaDHDEY5IjBIEcMBjliMMgRg0GOGAxyxGCQIwaDHAXu1vPtVr7T8yXoucFYAsDUXDT6QMNYLbWjryup8fwDX33zzTfv/NdHH33cymU2Y8cEI2Ka0wAuN/PZHx8/joNjY3XvD1/t4eoqPltcdHxNuN3xYcu2HzRTk9+6NhgR05wC8LnKe/v7+nB2chKvDA5qraHevbOr7oXt6w08m9FVwYiY5gKAyUbva/R0CBWxeBy37t5FJptt6vMON0lftGx7ylNRGnV8MCKmaaHBiqLqs1Kqfb20hL/evNlsaXXVuHv+nyzbnvFlgS515FaJynOj3jx9Gq8fP640Xr31AT/UebbE7wEwGG412oqo9+ycilaHoNrKyopvT2DRqSOCETaM+SNHjpyv9YCDoxMTeOvMGcfX/vfGDdyLx/0sT1mNr49ACnQwwoYxDeByb2+v41MvnAIRi8fx5Y0brSlQkZsHTgRFYIMhPuthaGjI8T0Hyw/AEJ8yGCQNHsgj8eMpJM0K3FZJ2DCkrQy/Hinlh8rjL90KUiiAgAWj3hNhmnlmUKukUimkUqlmP56wbHtcYzlaBCYYjR4TFAqFcPjw4VaVU1exWNTyOMOgdQlRIIIRNowpKO6+bkfn2NzcRDKZ1DnkKcu2b+scULegrHyeVH1jZZPvyJEjnp7P56RUKiGZTGp9GGKVwB0TqSUQHQPw9sS5Xbt2YWhoCIN1DoLlcjnk8/nn/2yhwOzmdiMoHQMABgE09VTrUqmE9fX1prYGfHLRsu3ZdhfhRWA6RkXYMG4DeKPddbjUkkc+tlLggiEKYEg2AMxYtj3f7kL8FuhgqCpv1VT+AArnZAjuAHgKYAHAQiufcxpkXREM0o+XD5AjBoMcMRjkiMEgRwwGOWIwyBGDQY4YDHLEYJAjBoMcMRjkiMEgRwwGOWIwyBGDQY4YDHLEYJAjBoMcMRjkiMEgRwwGOWIwyBEvHyAJuwVJGAqSMBQkYShIwlCQhKEgCUNBEoaCJAwFSRgKkjAUJGEoSMJQkIShIAlDQRKGgiQMBUkYCpIwFCRhKEjCUJCEoSAJQ0EShoIkDAVJGAqSMBQkYShIwlCQhKEgCUNBEoaCJAwFSRgKkjAUJGEoSMJQkIShIAlDQRKGgiQMBUkYCpIwFCRhKEjCUJDk5XYXEHQR05wBEAYwqfD2RQCX5qJRy9+q/MVHO1SJmOY0gMuahrs4F43OahqrZRgKPO8Gf/RxEYm5aHTcx/G12rGhiJjmFAALwL5WLTOdTv/jP//85+OtWl6zdlwoIqY5D+B8u5a/vLwMAG9btr3Qrhoa2TGhiJjmAwCH3H5uZHgYPxoexsHRUbwyOKj0ma1iEZ/YNp6k09JruVwOq6urAHDHsu2Tbutpha4PhdswHJ2YwM9++lP0hEKel3356lXHn5e7BQBsWLY94HlBmnXtJmnENG8DeEPlvT8+fhw/O31a6/KTjx/XfC0UCqFYLALAvrBhPA1aMLquU0RMcxbAB43e19/Xh3ffeUdLR9gqFvH10hLu/fOfyGSzDd+fSqWQSqXEH120bHvWcyGadE2niJjmOID7jd43MjyMX//iF56WlclmcfvuXdyLx5v6fG9vb/WPPgAw66kojbqiU0RMcwEN9jh6DcPfbt7EV0tLTX9e5NApAGDRsu0pLQvwqKM7RcQ0BwDIq/hVzr3/vuuviUw2iy9v3EByba3Z8mrK5XJOP1bZjd4SHdspVPZCvnn6NF4/rr6vKJPN4rPFRcdNSZ2ErY9qpyzbvu3rwhV0ZKdQ2bK4cO6c8nifffEFHq6seC1LhxkA0+0uouNCETHNp6iza/rg2BjO/vznDceJxeP48sYNnaUpWakfvvNgKNyJmGbd77qzk5M4ODpad4xPPv3Ul/UEVfl8vm3LVtUxoWgUiHork1vFIj60LGxtbflSm6pYLNbW5avqiFD82y9/WTxy5EjN12utP2SyWXxoBeN8l1QqhVKp1O4ylAQ+FGHDeHbgwIGarzsFYqtYxNVr1/wsy5VCoeC0X8LJot+1qAh0KMKG8QwA+vv7HV93CsSHlqW0q7lVSqUSEomE6tsv+VmLqsCGImwYT+u9PjI8/MLfde5x1KVUKrlaj7BsOxDfdYEMRdgwGp4RVdmCCNJ6g0g4b0KVcjvxW+BCETaMKQDvqry31vkK7ZZMJrG5uen2Y4E54SZwoQDwebsL8CIWizWzlbFo2Xbdr8tWClQoGq1HBFkmk8GjR4+a+mxQjo5WBCYUYcOYQY31iEKhgN27d7e4InVNdocKtRM/WyhIlw3WPOLZ7G+g31ZWVrC8vOwlEBeC9LVREYhOETaM6Xqvl89nDIwmVySrXbdse15DOdoFIhRQ2GkTi8VQb1d3K2gKA7B9en9Yx0B+CEooGl6lVSqVkEqlMDQ01Ip6XlhuIpHQ2a02gnq9R0VQQqEklUohFAph7969vi8rnU5jfX1d97CBvQBI1FGhALZbeC6Xw8jIiPaxNzc3kUwmtY9bdsWy7Wm/Btep40IBbP/P29zcxKFDhzxtqhaLRaRSKV3rCfX8NijHNVQEJRTXobhrW1Q5+tjf34+BgQHs2bOn5ntzuRyy2Sw2NjZafV7DYBA3O+sJzNnclcPkXaRjvi6qBaVTAMAGWnivCB8F8qJhNwKzR7PTJ7LscDf8dwSpUwDbxwH8vRJHvw0AJy3bftDuQnQJzDpFRdgwlC4FDICOXWdoJHChqCgfD9F1lzpdrgCY6bStCbcCGwpRuXvMAJhCay/EvQ7gUpDvT+WHjghFPeXT98bLf6bgPjSLABYA3Aaw0O1dQEXHh4L0C8wmKQUHQ0EShoIkDAVJGAqSMBQkYShIwlCQhKEgCUNBEoaCJAwFSRgKkjAUJGEoSMJQkIShIAlDQRKGgiQMBUkYCpIwFCRhKEjCUJCEoSAJQ0EShoIkDAVJGAqSMBQkYShIwlCQhKEgCUNBEoaCJAwFSRgKkjAUJGEoSMJQkIShIAlDQRKGgiQMBUkYCpLwLv5EpITfIESkhM2CiJSwWRCREjYLIlLCZkFEStgsiEgJmwURKWGzICIlbBZEpITNgoiUsFkQkRI2CyJSwmZBRErYLIhICZsFESlhsyAiJWwWRKSEzYKIlLBZEJESNgsiUsJmQURK2CyISAmbBREpYbMgIiVsFkSkhM2CiJSwWRCREjYLIlLCZkFEStgsiEgJmwURKWGzICIlbBZEpITNgoiUsFkQkRI2CyJSwmZBRErYLIhICZsFESlhsyAiJWwWRKSEzYKIlLBZEJESNgsiUvJyuwug7hMxzQEAJwFU/imaEv59oeq1BQCYi0arf04B8NKzZ8/aXQN1kIhpTgEIY7sJTLZ48XcAWACsuWj0douXveOxWZAkYprj2G4I0wDeaGsxahYBXJqLRq12F9LN2Cx2sPLmQqUptHotwU8JALNz0eh8uwvpJmwWO0S5MUwDmAFwqL3VtEapVEI8Hn8WCoX+p1Ao/Ltl20/bXVMnY7PoUuV9C7No8xrDyPAwAKCnpwdDg4PKn9va2kIqnQYAZDIZZLLZpmtYWVlBPp+v/PVPlm3PND3YDsZm0SUipjmN7ebg61rDK4OD+NHwMF4ZHHz+p9W2ikVcvXbN1WcSiQQKhYL4ow0AU5Ztc0epIjaLDuVnc+jv68OhsTEcmZhoSzNQcf3jj/GkvOaholgs4v79+04vsWkoYrPoEOUjFPPQvFlxdGICB8fGcHB0VOew2mwVi3iSTuPJkyfIZLNIpdNIrq01NVYymcTm5matl+9Ytl19TggJ2CwCLGKaYQCXoGntYWR4GEcnJnBkYkLHcJ5lslkk19bwJJ3GN+V/+imdTmN9fb3R205xLcMZm0XARExzBtubF/u8jjUyPIxTJ05g5NVXPdfVjK1iEQ9XVpBcW8M3a2uedlLqkMlk8OjRI5W3vm3Z9oLP5XQcNosAKO9/uASPDaK/rw+nTpxo6ZqD2BASq6vY2tpq2bLdSqVSSKVSqm8/bNn2Ax/L6Ti8NqRNIqZ5EtunLnvaxBgZHsa/njmD/r4+PYXVkMlm8XBlBfficd83F/ySdlf3AoBxXwrpUFyzaKHyiVGXAJz3Mo6fDaKypvDV0lLHNgUn6+vrbpsFAPzBsu1LftTTibhm0QLltYgFeNjM6O/rw9nJSa2HMp+k04jF47gXjwd688GrTCbTTKMAtk+FZ7MoY7PwUXlfxGUvY7x5+jReP37ccy2ZbBa3794N/H4F3XK5nOpOTSfddL2MZ2wWPoiY5jw8bGp4XYuobErcunu37Ucg2knxUCkpYrPQ6He/+tV/DwwM/G5oaKipz48MD+Ps5CR6QiFXn6usNdyLx5tabjequh6ENGCz0CBsGPMAzu/duxfNNIqjExN468wZ5fezOdSWy+Wwurqqa7iEroG6AZuFB2HDmAHwRwDYtWsXRkZGXH1etUlsFYv4emkJXy0t7aj9DW6UL0dHqVTSOey8zsE6HQ+dNiFsGFMAPhd/NjQ0pLxW0dPTg/fC4bqbG8nHj3Hr7t2mr4PYKUqlElZWVqqvKNXCsu2XtA/awbhm4ULYMAawfQhUutVcb2+v8jg9oZBjo3i4uoovb9zg2oOCQqGAlZUV3WsSot/6NXCn4pqForBhzAL4oNbro6Oj2LNnj/J4PT09OFo+Lbvbz3PQaXNzE8lk0u/F8GQsB2wWDZTXJh6gwQlVbpsFqSsUCkgmk75saji4YNn2fCsW1Gm4GVKHuAOzkXw+z2ahUalUQjKZRCaTadUiNwCc5MVjtbFZ1BA2jAW4OINvc3OzqcOm9INisYhkMtmO8yOuW7YdbvVCOw03Q6qobnY4GRwcxP79+7XX1M0ymQzW19dRLBbbVQJvdqOIaxYCL40C2D69ePfu3di7d6/WurpJsVhEKpWqd3u7Vrli2fZ0u4voJGwWL5qHxxvQJJNJfP/99xgM6I1uWy1AzaHiDrZv0MtniLjEzZCysGGcBHBL13i9vb0YGxvTNVzHyOVySKVSQbwuYwPAOJtE87hm8QOtO7jy+TyWl5cxMjLStZslhUIB6XQamUzGz5OjvEoACHO/hHdsFj5LJpNIJpPYv39/x26alEql7aeClf90CG5uaMZm8YMF1DlD06v19XWsr68jFApheHg4kOdkFAoF5HI5ZDKZIG5GqLpo2fZsu4voRtxnIQgbxlNouAW/G729vdi3b5/vmyqlUgnffvst8vn886YQ4E0Ht+4AmOamhr+4ZvGiGXi8DZ5b+Xwe+Xy+5vUOoVAIL79c/3/Td999187zFNplA9v7IhbaXchOwTWLKo0uGKO2SmB7DWKh3YXsRGwWDsKGMY0Wr2FQTVcAzHBHZfuxWdRQ794V5KsrAGZ5QVfwsFk0wKbhqwS2n8sxzzWH4GOzcKF8O715aHqq+Q5zHduPa7TYGDoTm4UHYcMYx/aZn2EAJ9Hiw64BtIjttbAF7oTsPmwWLVDelDlZ/jMAYKr8Uqc88WoR21fjPsB2M3jAfQo7D5tFBypf9DbQ5Mf5i05NYbMgIiW72l0AEXUGNgsiUsJmQURK2CyISAmbBREpYbMgIiVsFkSkhM2CiJSwWRCREjYLIlLCZkFEStgsiEgJmwURKWGzICIlbBZEpITNgoiUsFkQkRI2CyJSwmZBRErYLIhICZsFESlhsyAiJWwWRKSEzYKIlLBZEJESNgsiUsJmQURK2CyISAmbBREpYbMgIiVsFkSkhM2CiJSwWRCREjYLIlLCZkFEStgsiEgJmwURKWGzICIlbBZEpITNgoiUsFkQkRI2CyJSwmZBRErYLIhIyf8DfNZhOOCdgwkAAAAASUVORK5CYII="
              }
              width={100}
              height={100}
              alt="folder"
              className="w-10 h-10 rounded-full border-[5px] border-[#A5E3BB] bg-white p-[5px] mr-2"
            />
            <h2 className="text-xl">{word.name}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <IconInfoCircle
              size={24}
              className="text-gray-500 dark:text-gray-300 cursor-pointer"
            />
            <IconBookmark
              size={24}
              className="text-gray-500 dark:text-gray-300 cursor-pointer"
            />
            {/* Close button */}
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-300 hover:rotate-180 transition-transform ease-in-out duration-300"
            >
              <IconX size={24} />
            </button>
          </div>
        </div>

        <hr className="border-t-2 border-gray-300 dark:border-gray-600 my-4" />
        <div>
          {/* Pronunciation with Volume Icon */}
          <div className="flex flex-col absolute top-20 left-5 gap-2">
            {word.phonetics.map((phonetic, index) => (
              <div key={index} className="flex">
                <button
                  onClick={() => speakWord(word.name)}
                  className="text-blue-500"
                >
                  <IconVolume2 size={20} />
                </button>
                <span className=" font-medium">
                  {index === 0 ? "US" : "UK"} {phonetic.text}
                </span>
              </div>
            ))}
          </div>

          {/* Thumbnail Image */}
          <div className="flex justify-center mt-4 mb-6">
            <img
              src={word.thumbnailUrl || "https://via.placeholder.com/50"}
              alt={word.name}
              className="w-36 h-36 border border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Additional options */}
          <div className="flex flex-col absolute top-20 right-5 gap-2">
            <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg">
              Đánh dấu đã biết
            </button>
            <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg">
              Thêm nghĩa của bạn
            </button>
          </div>
        </div>

        {/* Meaning and Definitions */}
        <div className="max-h-80 overflow-y-auto scrollbar-hide">
          {word.meanings.map((meaning, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 italic">
                {meaning.partOfSpeech}
              </h3>
              <ul className="list-disc list-inside ml-4">
                {meaning.definitions.map((def, defIndex) => (
                  <li
                    key={defIndex}
                    className="text-gray-700 dark:text-gray-200"
                  >
                    {def.definition}
                    {def.example && (
                      <p className="text-blue-500 mt-1">
                        Example: {def.example}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordDetailModal;
