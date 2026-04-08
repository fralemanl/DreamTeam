import React from "react";

// Mapeo de países a archivos de imágenes locales
const countryData = {
  // CONCACAF
  Mexico: "mx.png",
  "United States": "US.png",
  Canada: "CA.png",
  "Costa Rica": "CR.png", // Por clasificar
  Jamaica: "JM.png", // Por clasificar
  Panama: "PA.png",
  Honduras: "HN.png", // Por clasificar
  Haiti: "Ht.png",
  Curacao: "CW.png",

  // CONMEBOL
  Argentina: "AR.png",
  Brazil: "BR.png",
  Uruguay: "Uy.png",
  Colombia: "CO.png",
  Chile: "CL.png", // Por clasificar
  Ecuador: "EC.png",
  Peru: "PE.png", // Por clasificar
  Paraguay: "PY.png",
  Venezuela: "VE.png", // Por clasificar
  Bolivia: "BO.png", // Por clasificar

  // UEFA (Europa)
  Spain: "ES.png",
  Germany: "de.png",
  France: "FR.png",
  Italy: "IT.png", // Por clasificar
  England: "uk.png",
  Portugal: "Pt.png",
  Netherlands: "NL.png",
  Holland: "NL.png",
  Belgium: "BE.png",
  Croatia: "hr.png",
  Switzerland: "ch.png",
  Denmark: "DK.png", // Por clasificar
  Sweden: "SE.png", // Por clasificar
  Poland: "PL.png", // Por clasificar
  Austria: "AT.png",
  Serbia: "RS.png", // Por clasificar
  Ukraine: "UA.png", // Por clasificar
  Wales: "GB-WLS.png", // Por clasificar
  Scotland: "GB-SCT.png", // Por clasificar
  Norway: "NO.png",
  "Czech Republic": "CZ.png", // Por clasificar
  "Bosnia-Herzegovina": "BH.png", // Por clasificar
  Turkey: "TR.png", // Por clasificar

  // AFC (Asia)
  Japan: "JP.png",
  "South Korea": "KR.png",
  "Saudi Arabia": "SA.png",
  Iran: "IR.png",
  Australia: "AU.png",
  Qatar: "QA.png",
  Jordan: "JO.png",
  Uzbekistan: "UZ.png",

  // CAF (África)
  Morocco: "MA.png",
  Senegal: "SN.png",
  Tunisia: "TN.png",
  Ghana: "GH.png",
  Cameroon: "CM.png", // Por clasificar
  Nigeria: "NG.png", // Por clasificar
  Egypt: "EG.png",
  Algeria: "dz.png",
  "Côte d'Ivoire": "CI.png",
  "Cape Verde": "CV.png",
  "South Africa": "za.png",
  "Congo DR": "CD.png",
  Seychelles: "SC.png",
  Iraq: "IQ.png", // Por clasificar

  // OFC
  "New Zealand": "NZ.png",
};

function TeamFlag({team, size = 24, showName = true}) {
  if (!team) return null;

  // Normalizar size: convertir "24px" a 24, o dejar como número
  const numericSize = typeof size === "string" ? parseInt(size) : size;

  const flagFile = countryData[team];

  // Si no encuentra el país en el mapa, mostrar un ícono genérico
  if (!flagFile) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="text-gray-400" style={{fontSize: `${numericSize}px`}}>
          🏴
        </span>
        {showName && <span>{team}</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <img
        src={`/flags/${flagFile}`}
        width={numericSize}
        height={numericSize * 0.75} // Proporción típica de banderas (3:2)
        alt={`Bandera de ${team}`}
        className="inline-block object-cover shadow-sm"
        style={{minWidth: `${numericSize}px`}}
        onError={(e) => {
          // Fallback a emoji si falla la imagen
          e.target.style.display = "none";
          const fallback = document.createElement("span");
          fallback.textContent = "🏴";
          fallback.className = "text-gray-400";
          fallback.style.fontSize = `${numericSize}px`;
          e.target.parentNode.insertBefore(fallback, e.target);
        }}
      />
      {showName && <span>{team}</span>}
    </span>
  );
}

export default TeamFlag;
