const MAKE_WEBSITES = {
  ACURA: "https://www.acura.com",
  "ALFA ROMEO": "https://www.alfaromeousa.com",
  AUDI: "https://www.audi.com",
  "ASTON MARTIN": "https://www.astonmartin.com",
  BENTLEY: "https://www.bentleymotors.com",
  BMW: "https://www.bmw.com",
  BUGATTI: "https://www.bugatti.com",
  BUICK: "https://www.buick.com",
  CADILLAC: "https://www.cadillac.com",
  CHEVROLET: "https://www.chevrolet.com",
  CHRYSLER: "https://www.chrysler.com",
  DODGE: "https://www.dodge.com",
  FERRARI: "https://www.ferrari.com",
  FIAT: "https://www.fiat.com",
  FORD: "https://www.ford.com",
  GENESIS: "https://www.genesis.com",
  GMC: "https://www.gmc.com",
  HONDA: "https://www.honda.com",
  HYUNDAI: "https://www.hyundai.com",
  INFINITI: "https://www.infiniti.com",
  ISUZU: "https://www.isuzu.com",
  JAGUAR: "https://www.jaguar.com",
  KIA: "https://www.kia.com",
  LAMBORGHINI: "https://www.lamborghini.com",
  "LAND ROVER": "https://www.landrover.com",
  LEXUS: "https://www.lexus.com",
  LINCOLN: "https://www.lincoln.com",
  LOTUS: "https://www.lotuscars.com",
  LUCID: "https://www.lucidmotors.com",
  MASERATI: "https://www.maserati.com",
  MAYBACH: "https://www.mercedes-benz.com",
  MAZDA: "https://www.mazda.com",
  MCLAREN: "https://cars.mclaren.com",
  "MERCEDES-BENZ": "https://www.mercedes-benz.com",
  MERCURY: "https://www.ford.com",
  MINI: "https://www.mini.com",
  MITSUBISHI: "https://www.mitsubishicars.com",
  NISSAN: "https://www.nissan-global.com",
  OLDSMOBILE: "https://www.gm.com",
  OPEL: "https://www.opel.com",
  PAGANI: "https://www.pagani.com",
  PEUGEOT: "https://www.peugeot.com",
  PLYMOUTH: "https://www.stellantis.com",
  POLESTAR: "https://www.polestar.com",
  PONTIAC: "https://www.gm.com",
  PORSCHE: "https://www.porsche.com",
  RENAULT: "https://www.renault.com",
  "ROLLS-ROYCE": "https://www.rolls-roycemotorcars.com",
  SAAB: "https://saab.com",
  SATURN: "https://www.gm.com",
  SMART: "https://smart.com",
  SUBARU: "https://www.subaru.com",
  SUZUKI: "https://www.globalsuzuki.com",
  TESLA: "https://www.tesla.com",
  TOYOTA: "https://www.toyota.com",
  VOLKSWAGEN: "https://www.vw.com",
  VOLVO: "https://www.volvocars.com"
};

function getLogoUrl(website) {
  if (!website) {
    return null;
  }

  return `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(website)}`;
}

function getMakeAssetData(makeName) {
  const normalizedName = String(makeName || "").trim().toUpperCase();
  const website = MAKE_WEBSITES[normalizedName] || null;

  return {
    website,
    logoUrl: getLogoUrl(website)
  };
}

export { getMakeAssetData };
