'use strict';

/**
 * Branchekwalificatietabel Vitaliteitstool
 * Gebaseerd op officiële Locatus brancheclassificatie (april 2010+)
 * 
 * Kwetsbaarheidscores zijn gebaseerd op:
 * - RIEC/LIEC jaarverslagen en casuïstiek
 * - Wet Bibob toepassingspraktijk bij gemeenten
 * - Onderzoek Politie & Wetenschap (Mehlbaum et al.)
 * - Kamerbrieven kwetsbare branches (Minister JenV)
 * - Gemeentelijk Bibob-beleid (G4, Tilburg, Roermond e.a.)
 * 
 * Kwaliteitsscores zijn gebaseerd op:
 * - Vitaliteitsbenchmark Centrumgebieden (Goudappel)
 * - City Deal Dynamische Binnensteden
 * - Platform31 onderzoek binnenstadsvitaliteit
 * - CBS/PBL analyses detailhandel en functiemix
 * 
 * Scores: 1-10 schaal
 * Kwaliteit: 1 = geen bijdrage aan vitaliteit, 10 = maximale bijdrage
 * Kwetsbaarheid: 1 = niet kwetsbaar, 10 = zeer kwetsbaar voor ondermijning
 */

const QUALITY_TAGS = {
  TOURISM: 'toerisme',
  NIGHTLIFE: 'avondleven',
  CULTURE: 'cultuur',
  DAILY_NEEDS: 'dagelijkse_behoeften',
  SHOPPING: 'winkelplezier',
  FAMILY: 'gezinsvriendelijk',
  EMPLOYMENT: 'werkgelegenheid',
  FOOT_TRAFFIC: 'passantenflow',
  IDENTITY: 'gebiedsidentiteit',
  SOCIAL: 'sociale_cohesie',
  HEALTH: 'gezondheid',
  SERVICES: 'dienstverlening',
  LEISURE: 'vrije_tijd',
  ANCHOR: 'ankerfunctie',
  AMENITY: 'voorziening'
};

const VULNERABILITY_TYPES = {
  MONEY_LAUNDERING: 'witwassen',
  DRUG_TRADE: 'drugshandel',
  HUMAN_TRAFFICKING: 'mensenhandel',
  EXPLOITATION: 'uitbuiting',
  TAX_FRAUD: 'belastingfraude',
  ILLEGAL_GAMBLING: 'illegaal_gokken',
  FENCING: 'heling',
  FRONT_BUSINESS: 'dekmantelonderneming',
  CASH_INTENSIVE: 'contant_geld_intensief',
  LOW_BARRIER: 'lage_toetredingsdrempel',
  OPAQUE_REVENUE: 'ondoorzichtige_omzet',
  LABOR_EXPLOITATION: 'arbeidsuitbuiting'
};

const ACTION_TYPES = {
  BIBOB: 'bibob_screening',
  MONITORING: 'monitoring',
  ENFORCEMENT: 'handhaving',
  COOPERATION: 'samenwerking',
  LICENSING: 'vergunningplicht',
  INSPECTION: 'controle',
  NONE: 'geen_actie_nodig'
};

/**
 * Gelegenheidsstructuren (Ministerie van Justitie en Veiligheid)
 *
 * Gebaseerd op het JenV-kader voor criminogene gelegenheidsstructuren.
 * Onderscheid tussen situationele en sociale gelegenheidsstructuren
 * die criminaliteit faciliteren in commerciële omgevingen.
 *
 * Bronnen:
 * - Kamerbrieven aanpak ondermijning (Minister JenV)
 * - RIEC-LIEC methodologie bestuurlijke aanpak
 * - CCV Barrièremodel (barrieremodellen.nl)
 * - Handboek Bestuurlijke Aanpak Georganiseerde Criminaliteit
 */
const OPPORTUNITY_FACTORS = {
  // Situationele gelegenheidsstructuren
  CASH_FLOW_OPACITY: 'cashflow_ondoorzichtigheid',
  LOW_ENTRY_BARRIER: 'lage_toetredingsdrempel',
  WEAK_ADMINISTRATION: 'zwakke_administratie',
  HIGH_VALUE_GOODS: 'hoge_waarde_goederen',
  ANONYMOUS_CUSTOMERS: 'anonieme_klanten',
  FLEXIBLE_PRICING: 'flexibele_prijszetting',
  SEASONAL_PATTERNS: 'seizoensgebonden_patronen',
  EXTENDED_HOURS: 'ruime_openingstijden',
  CROSS_BORDER: 'grensoverschrijdend',
  SUPPLY_CHAIN_COMPLEXITY: 'complexe_toeleveringsketen',
  // Sociale gelegenheidsstructuren
  CLOSED_COMMUNITY: 'gesloten_gemeenschap',
  FAMILY_NETWORKS: 'familienetwerken',
  INFORMAL_ECONOMY: 'informele_economie',
  LABOR_DEPENDENCY: 'arbeidsafhankelijkheid',
  TRUST_EXPLOITATION: 'vertrouwensmisbruik'
};

/**
 * Omgevingsrisico's (CCV — Centrum voor Criminaliteitspreventie en Veiligheid)
 *
 * Gebaseerd op het CCV-platform voor omgevingsrisicobeoordeling.
 * Combinatie van CPTED-principes (Crime Prevention Through Environmental Design)
 * met Nederlandse situationele criminaliteitspreventie.
 *
 * Bronnen:
 * - CCV Veilig Ondernemen toolkit
 * - CCV Barrièremodel methodiek
 * - NEN-CEN/TS 14383-2:2022 (CPTED standaard)
 * - Politiekeurmerk Veilig Wonen / Keurmerk Veilig Ondernemen
 */
const ENVIRONMENTAL_RISK_FACTORS = {
  // Ruimtelijke factoren
  LOW_VISIBILITY: 'lage_zichtbaarheid',
  POOR_LIGHTING: 'slechte_verlichting',
  ESCAPE_ROUTES: 'vluchtroutes',
  HIDDEN_SPACES: 'verborgen_ruimtes',
  POOR_MAINTENANCE: 'slecht_onderhoud',
  // Sociale controle factoren
  LOW_SOCIAL_CONTROL: 'lage_sociale_controle',
  LOW_FOOT_TRAFFIC: 'lage_passantenfrequentie',
  ANONYMITY: 'anonimiteit',
  TRANSIENT_POPULATION: 'wisselende_bevolking',
  // Functionele factoren
  MONO_FUNCTION: 'monofunctioneel',
  NO_RESIDENTIAL: 'geen_woonfunctie',
  VACANCY_CLUSTER: 'leegstandscluster',
  POOR_MIX: 'slechte_functiemix',
  // Toegankelijkheidsfactoren
  HIGHWAY_PROXIMITY: 'nabijheid_snelweg',
  BORDER_PROXIMITY: 'nabijheid_grens',
  TRANSIT_HUB: 'vervoersknooppunt',
  PARKING_HIDDEN: 'verborgen_parkeerplaats'
};

/**
 * CCV Barrièremodel — Fasering crimineel proces
 * Elke fase kent gelegenheden, signalen, faciliteerders en barrières.
 * Per branche worden relevante fasen en signalen geïdentificeerd.
 */
const BARRIER_MODEL_PHASES = {
  PREPARATION: {
    code: 'voorbereiding',
    name: 'Voorbereiding',
    description: 'Oriëntatie en planning van criminele activiteiten',
    signals: [
      'Onverklaarbare financieringsbronnen bij vestiging',
      'Registratie op naam van katvanger',
      'Onduidelijk ondernemingsplan',
      'Geen branchervaring bij ondernemer'
    ]
  },
  ESTABLISHMENT: {
    code: 'vestiging',
    name: 'Vestiging',
    description: 'Opzetten van de onderneming als dekmantel of facilitator',
    signals: [
      'Overname tegen afwijkende prijs',
      'Snelle eigenaarswisseling (<12 maanden)',
      'Ongebruikelijk hoge huurprijs geaccepteerd',
      'Onverklaarbare verbouwingskosten'
    ]
  },
  OPERATIONS: {
    code: 'operatie',
    name: 'Operationele fase',
    description: 'Dagelijkse bedrijfsvoering die criminele activiteiten faciliteert',
    signals: [
      'Omzet inconsistent met klantenstroom',
      'Afwijkende openingstijden',
      'Ongebruikelijk personeelsbestand',
      'Contante transacties boven verwachting'
    ]
  },
  ACCUMULATION: {
    code: 'accumulatie',
    name: 'Geldaccumulatie',
    description: 'Ophoping van criminele opbrengsten',
    signals: [
      'Grote contante stortingen',
      'Omzetcijfers inconsistent met branchegemiddelde',
      'Meerdere bankrekeningen',
      'Onverklaarbaarbare vermogensgroei'
    ]
  },
  CONCEALMENT: {
    code: 'verhulling',
    name: 'Verhulling',
    description: 'Verbergen van criminele herkomst van gelden',
    signals: [
      'Complexe bedrijfsstructuren',
      'Buitenlandse rechtspersonen in eigendomsketen',
      'ABC-transacties in vastgoed',
      'Ongebruikelijke handelspatronen'
    ]
  },
  INTEGRATION: {
    code: 'integratie',
    name: 'Integratie',
    description: 'Investering van witgewassen gelden in legale economie',
    signals: [
      'Vastgoedinvesteringen zonder aanwijsbare financieringsbron',
      'Uitbreiding naar meerdere branches',
      'Investering in luxe goederen',
      'Politieke of maatschappelijke betrokkenheid'
    ]
  }
};

/**
 * Winkelgebiedtypes voor filtering
 * Gebaseerd op Locatus winkelgebiedtypologie
 */
const SHOPPING_AREA_TYPES = {
  BINNENSTAD_GROOT: 'binnenstad_groot',
  BINNENSTAD_MIDDELGROOT: 'binnenstad_middelgroot',
  BINNENSTAD_KLEIN: 'binnenstad_klein',
  KERNVERZORGEND: 'kernverzorgend',
  WIJKCENTRUM: 'wijkcentrum',
  BUURTCENTRUM: 'buurtcentrum',
  STADSDEELCENTRUM: 'stadsdeelcentrum',
  PERIFEER: 'perifeer',
  SPECIAAL: 'speciaal',
  VERSPREIDE_BEWINKELING: 'verspreide_bewinkeling'
};

/**
 * Hoofdstructuur: groepen → hoofdbranches → branches
 * Elke branche heeft:
 * - code: Locatus branchecode
 * - name: Nederlandse naam
 * - qualityScore: 1-10
 * - vulnerabilityScore: 1-10
 * - qualityTags: array van QUALITY_TAGS
 * - qualityDescription: beschrijving kwaliteiten
 * - vulnerabilityTypes: array van VULNERABILITY_TYPES
 * - vulnerabilityDescription: beschrijving kwetsbaarheden
 * - actionPerspective: handelingsperspectief tekst
 * - actionTypes: array van ACTION_TYPES
 * - monocultureRisk: boolean - draagt bij aan monocultuurrisico bij clustering
 * - monocultureCategory: string - categorie voor monocultuurdetectie
 * - opportunityFactors: array van OPPORTUNITY_FACTORS - JenV gelegenheidsstructuren
 * - opportunityScore: 1-10 - mate waarin branche criminogene gelegenheden biedt
 * - barrierModelPhases: array van BARRIER_MODEL_PHASES codes - relevante fasen
 * - environmentalSensitivity: 1-10 - gevoeligheid voor omgevingsrisico's (CCV)
 */

const BRANCH_GROUPS = [
  {
    code: '00',
    name: 'Leegstand',
    branches: [
      {
        code: '00.000.000',
        name: 'Leegstand',
        qualityScore: 1,
        vulnerabilityScore: 6,
        qualityTags: [],
        qualityDescription: 'Leegstand draagt negatief bij aan de vitaliteit. Leegstaande panden verlagen de aantrekkelijkheid, verminderen passantenstromen en kunnen verloedering in de hand werken.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.FRONT_BUSINESS, VULNERABILITY_TYPES.DRUG_TRADE],
        vulnerabilityDescription: 'Langdurig leegstaande panden zijn kwetsbaar voor kraak, illegale bewoning, hennepkwekerijen en opslag van illegale goederen. Ze kunnen ook worden opgekocht door criminelen tegen onderwaardering.',
        actionPerspective: 'Actief leegstandsbeheer voeren. Leegstandsverordening toepassen. Tijdelijke invulling stimuleren (pop-up, broedplaats). Bij langdurige leegstand: onderzoek naar eigendomsverhoudingen en mogelijke criminele betrokkenheid. Transformatiemogelijkheden onderzoeken (wonen, werken, maatschappelijk).',
        actionTypes: [ACTION_TYPES.MONITORING, ACTION_TYPES.ENFORCEMENT],
        monocultureRisk: true,
        monocultureCategory: 'leegstand'
      }
    ]
  },
  {
    code: '11',
    name: 'Dagelijks',
    branches: [
      {
        code: '11.010.005',
        name: 'Diepvriesartikelen',
        qualityScore: 4,
        vulnerabilityScore: 2,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS],
        qualityDescription: 'Basisvoorziening voor dagelijkse boodschappen. Beperkte bijdrage aan beleving en passantenflow.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Beperkt kwetsbaar. Gespecialiseerde niche met duidelijke omzetpatronen.',
        actionPerspective: 'Geen bijzondere aandacht vereist. Reguliere controle volstaat.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'dagelijks_food'
      },
      {
        code: '11.010.012',
        name: 'Groente & Fruit',
        qualityScore: 6,
        vulnerabilityScore: 3,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS, QUALITY_TAGS.FOOT_TRAFFIC, QUALITY_TAGS.HEALTH],
        qualityDescription: 'Versspeciaalzaak die bijdraagt aan dagelijkse boodschappenfunctie en levendigheid. Trekt passanten en versterkt het marktkarakter van een winkelgebied.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.TAX_FRAUD],
        vulnerabilityDescription: 'Overwegend contante transacties. Risico op omzetmanipulatie, maar relatief transparant bedrijfsmodel.',
        actionPerspective: 'Let op clustering van gelijksoortige zaken (monocultuurrisico). Bij onverklaarbaar hoge omzetcijfers: nader onderzoek. Reguliere fiscale controle.',
        actionTypes: [ACTION_TYPES.MONITORING],
        monocultureRisk: true,
        monocultureCategory: 'dagelijks_food'
      },
      {
        code: '11.010.111',
        name: 'Bakker',
        qualityScore: 7,
        vulnerabilityScore: 2,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS, QUALITY_TAGS.FOOT_TRAFFIC, QUALITY_TAGS.IDENTITY, QUALITY_TAGS.TOURISM],
        qualityDescription: 'Ambachtelijke bakker is een publiekstrekker en draagt bij aan gebiedsidentiteit. Vers brood trekt dagelijks passanten. Ambachtelijke bakkers zijn toeristische trekkers.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Nauwelijks kwetsbaar. Vakmanschap vereist, transparant bedrijfsmodel.',
        actionPerspective: 'Koesteren als onderdeel van lokale identiteit. Stimuleren in acquisitiebeleid bij leegstand.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'dagelijks_food'
      },
      {
        code: '11.010.112',
        name: 'Vlaaien',
        qualityScore: 5,
        vulnerabilityScore: 2,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS, QUALITY_TAGS.IDENTITY, QUALITY_TAGS.TOURISM],
        qualityDescription: 'Regionale specialiteit (met name Limburg). Draagt bij aan streekidentiteit en toerisme.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Nauwelijks kwetsbaar.',
        actionPerspective: 'Geen bijzondere aandacht vereist.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'dagelijks_food'
      },
      {
        code: '11.010.120',
        name: 'Buitenlandse Levensmiddelen Overig',
        qualityScore: 5,
        vulnerabilityScore: 5,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS, QUALITY_TAGS.SOCIAL],
        qualityDescription: 'Voorziet in behoefte van diverse bevolkingsgroepen. Kan bijdragen aan multiculturele identiteit van een gebied.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.FRONT_BUSINESS, VULNERABILITY_TYPES.LOW_BARRIER],
        vulnerabilityDescription: 'Lage toetredingsdrempel, veel contante betalingen, moeilijk verifieerbare omzetcijfers. Bij clustering kan sprake zijn van monocultuur die leefbaarheid aantast. Soms dekmantel voor andere activiteiten.',
        actionPerspective: 'Let op concentratie in specifieke straten. Bij meer dan 3 gelijksoortige zaken in één straat: monocultuuronderzoek. Integrale controles (brandveiligheid, hygiëne, arbeidsomstandigheden) inzetten. Bij signalen: Bibob-screening overwegen.',
        actionTypes: [ACTION_TYPES.MONITORING, ACTION_TYPES.INSPECTION, ACTION_TYPES.BIBOB],
        monocultureRisk: true,
        monocultureCategory: 'buitenlandse_food'
      },
      {
        code: '11.010.123',
        name: 'Toko',
        qualityScore: 5,
        vulnerabilityScore: 5,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS, QUALITY_TAGS.SOCIAL, QUALITY_TAGS.IDENTITY],
        qualityDescription: 'Oriëntaals-Aziatische levensmiddelenwinkel. Voorziet in specifieke behoefte en draagt bij aan culturele diversiteit.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.LOW_BARRIER, VULNERABILITY_TYPES.FRONT_BUSINESS],
        vulnerabilityDescription: 'Vergelijkbaar risicoprofiel als buitenlandse levensmiddelen overig. Lage toetredingsdrempel, contant geld intensief.',
        actionPerspective: 'Reguliere monitoring. Let op monocultuur bij clustering. Integrale controles bij signalen.',
        actionTypes: [ACTION_TYPES.MONITORING, ACTION_TYPES.INSPECTION],
        monocultureRisk: true,
        monocultureCategory: 'buitenlandse_food'
      },
      {
        code: '11.010.132',
        name: 'Chocolaterie',
        qualityScore: 7,
        vulnerabilityScore: 1,
        qualityTags: [QUALITY_TAGS.TOURISM, QUALITY_TAGS.SHOPPING, QUALITY_TAGS.IDENTITY],
        qualityDescription: 'Specialty shop met hoge belevingswaarde. Trekt toeristen en draagt bij aan premium uitstraling van het winkelgebied.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Niet kwetsbaar. Specialisatie vereist vakmanschap en investering.',
        actionPerspective: 'Koesteren. Stimuleren in acquisitiebeleid.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'dagelijks_food'
      },
      {
        code: '11.010.137',
        name: 'Koffie & Thee',
        qualityScore: 7,
        vulnerabilityScore: 2,
        qualityTags: [QUALITY_TAGS.TOURISM, QUALITY_TAGS.SHOPPING, QUALITY_TAGS.IDENTITY, QUALITY_TAGS.FOOT_TRAFFIC],
        qualityDescription: 'Specialty shop met hoge belevingswaarde. Trekt kwaliteitsbewuste consumenten en toeristen. Past in trend van beleveniseconomie.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Beperkt kwetsbaar. Relatief hoge investering in kennis en assortiment.',
        actionPerspective: 'Geen bijzondere aandacht vereist.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'dagelijks_food'
      },
      {
        code: '11.010.141',
        name: 'Delicatessen',
        qualityScore: 7,
        vulnerabilityScore: 2,
        qualityTags: [QUALITY_TAGS.TOURISM, QUALITY_TAGS.SHOPPING, QUALITY_TAGS.IDENTITY, QUALITY_TAGS.FOOT_TRAFFIC],
        qualityDescription: 'Draagt bij aan premium positionering van het winkelgebied. Toeristische aantrekkingskracht.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Beperkt kwetsbaar.',
        actionPerspective: 'Koesteren als kwaliteitsindicator.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'dagelijks_food'
      },
      {
        code: '11.010.261',
        name: 'Kaaswinkel',
        qualityScore: 8,
        vulnerabilityScore: 1,
        qualityTags: [QUALITY_TAGS.TOURISM, QUALITY_TAGS.IDENTITY, QUALITY_TAGS.FOOT_TRAFFIC, QUALITY_TAGS.SHOPPING],
        qualityDescription: 'Icoon van Nederlands erfgoed. Sterke toeristische trekker, hoge belevingswaarde. Draagt bij aan authentieke gebiedsidentiteit.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Niet kwetsbaar.',
        actionPerspective: 'Koesteren. Stimuleren als onderdeel van toeristisch profiel.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'dagelijks_food'
      },
      {
        code: '11.010.309',
        name: 'Minisuper',
        qualityScore: 4,
        vulnerabilityScore: 6,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS],
        qualityDescription: 'Basisvoorziening. Beperkte bijdrage aan beleving. Kan wel avondvoorziening bieden.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.FRONT_BUSINESS, VULNERABILITY_TYPES.LOW_BARRIER, VULNERABILITY_TYPES.TAX_FRAUD],
        vulnerabilityDescription: 'Lage toetredingsdrempel, ondoorzichtige omzetpatronen, veel contante betalingen. Kan fungeren als dekmantel. Clustering is indicator voor monocultuurproblematiek.',
        actionPerspective: 'Alert bij clustering (>2 in één postcode). Integrale controles uitvoeren. Bij signalen: Bibob-screening. Let op verhouding omzet/personeel/openingstijden.',
        actionTypes: [ACTION_TYPES.MONITORING, ACTION_TYPES.INSPECTION, ACTION_TYPES.BIBOB],
        monocultureRisk: true,
        monocultureCategory: 'minisuper'
      },
      {
        code: '11.010.350',
        name: 'Nachtwinkel',
        qualityScore: 3,
        vulnerabilityScore: 7,
        qualityTags: [QUALITY_TAGS.NIGHTLIFE],
        qualityDescription: 'Voorziet in avond/nachtbehoefte. Beperkte bijdrage aan overige vitaliteit. Kan overlast genereren.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.FRONT_BUSINESS, VULNERABILITY_TYPES.DRUG_TRADE, VULNERABILITY_TYPES.LOW_BARRIER, VULNERABILITY_TYPES.ILLEGAL_GAMBLING],
        vulnerabilityDescription: 'Hoge kwetsbaarheid: nachtelijke openingstijden bemoeilijken toezicht, lage toetredingsdrempel, veel contante transacties, risico op illegale verkoop (alcohol, drugs). Bekend als potentiële dekmantel.',
        actionPerspective: 'Exploitatievergunning vereisen. Bibob-screening bij nieuwe aanvragen. Regelmatige integrale controles (APV, Alcoholwet, Opiumwet). Cameratoezicht in omgeving overwegen.',
        actionTypes: [ACTION_TYPES.BIBOB, ACTION_TYPES.LICENSING, ACTION_TYPES.INSPECTION, ACTION_TYPES.ENFORCEMENT],
        monocultureRisk: true,
        monocultureCategory: 'avondwinkel'
      },
      {
        code: '11.010.399',
        name: 'Poelier',
        qualityScore: 6,
        vulnerabilityScore: 2,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS, QUALITY_TAGS.IDENTITY],
        qualityDescription: 'Ambachtelijke versspecialist. Draagt bij aan compleet voorzieningenniveau.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Beperkt kwetsbaar. Vakmanschap vereist.',
        actionPerspective: 'Geen bijzondere aandacht.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'dagelijks_food'
      },
      {
        code: '11.010.423',
        name: 'Reformwinkel',
        qualityScore: 5,
        vulnerabilityScore: 1,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS, QUALITY_TAGS.HEALTH],
        qualityDescription: 'Gezondheidsbewuste winkel. Trekt specifiek publiek. Past in trend van gezond leven.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Niet kwetsbaar.',
        actionPerspective: 'Geen bijzondere aandacht.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'dagelijks_food'
      },
      {
        code: '11.010.471',
        name: 'Slagerij',
        qualityScore: 6,
        vulnerabilityScore: 2,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS, QUALITY_TAGS.FOOT_TRAFFIC, QUALITY_TAGS.IDENTITY],
        qualityDescription: 'Ambachtelijke versspecialist. Ankerfunctie voor dagelijkse boodschappen.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.CASH_INTENSIVE],
        vulnerabilityDescription: 'Beperkt kwetsbaar. Vakkennis vereist, transparant bedrijfsmodel.',
        actionPerspective: 'Geen bijzondere aandacht.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'dagelijks_food'
      },
      {
        code: '11.010.477',
        name: 'Slijterij',
        qualityScore: 4,
        vulnerabilityScore: 4,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS],
        qualityDescription: 'Dagelijkse voorziening. Beperkte belevingswaarde tenzij specialty (wijnspeciaalzaak).',
        vulnerabilityTypes: [VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.TAX_FRAUD],
        vulnerabilityDescription: 'Matig kwetsbaar. Drank- en horecavergunning vereist, wat enige drempel opwerpt. Wel contant intensief.',
        actionPerspective: 'Reguliere vergunningscontrole (Alcoholwet). Let op openingstijden en naleving.',
        actionTypes: [ACTION_TYPES.LICENSING, ACTION_TYPES.MONITORING],
        monocultureRisk: false,
        monocultureCategory: 'dagelijks_food'
      },
      {
        code: '11.010.519',
        name: 'Supermarkt',
        qualityScore: 8,
        vulnerabilityScore: 1,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS, QUALITY_TAGS.ANCHOR, QUALITY_TAGS.FOOT_TRAFFIC, QUALITY_TAGS.EMPLOYMENT],
        qualityDescription: 'Belangrijkste ankerfunctie voor dagelijks winkelgebied. Trekt grote passantenstromen. Genereert substantiële werkgelegenheid. Essentieel voor leefbaarheid.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Niet kwetsbaar. Hoge toetredingsdrempel, transparante ketens, gereguleerde sector.',
        actionPerspective: 'Koesteren als anker. Stimuleren van vestiging in gebieden met onvoldoende dagelijkse voorzieningen.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'dagelijks_food'
      },
      {
        code: '11.010.522',
        name: 'Tabak & Lectuur',
        qualityScore: 3,
        vulnerabilityScore: 5,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS],
        qualityDescription: 'Traditionele voorziening met afnemend belang. Beperkte bijdrage aan vitaliteit.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.LOW_BARRIER, VULNERABILITY_TYPES.FRONT_BUSINESS],
        vulnerabilityDescription: 'Matig kwetsbaar. Veel contante transacties, dalende branche maakt verdienmodel verdacht bij nieuwe vestigingen.',
        actionPerspective: 'Nieuwe vestigingen kritisch beoordelen (waarom in een krimpbranche?). Bij signalen: nader onderzoek.',
        actionTypes: [ACTION_TYPES.MONITORING],
        monocultureRisk: true,
        monocultureCategory: 'tabak_lectuur'
      },
      {
        code: '11.010.555',
        name: 'Tabak Speciaalzaak',
        qualityScore: 3,
        vulnerabilityScore: 4,
        qualityTags: [],
        qualityDescription: 'Nichewinkel met beperkte bijdrage aan vitaliteit.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.CASH_INTENSIVE],
        vulnerabilityDescription: 'Matig kwetsbaar door contante transacties.',
        actionPerspective: 'Reguliere monitoring.',
        actionTypes: [ACTION_TYPES.MONITORING],
        monocultureRisk: false,
        monocultureCategory: 'tabak_lectuur'
      },
      {
        code: '11.010.588',
        name: 'Viswinkel',
        qualityScore: 6,
        vulnerabilityScore: 2,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS, QUALITY_TAGS.IDENTITY, QUALITY_TAGS.TOURISM],
        qualityDescription: 'Ambachtelijke versspecialist. Toeristische aantrekkingskracht (haringtentjes). Draagt bij aan gebiedsidentiteit.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Beperkt kwetsbaar. Vakmanschap vereist.',
        actionPerspective: 'Koesteren.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'dagelijks_food'
      },
      {
        code: '11.010.657',
        name: 'Zoetwaren',
        qualityScore: 5,
        vulnerabilityScore: 2,
        qualityTags: [QUALITY_TAGS.SHOPPING, QUALITY_TAGS.FAMILY, QUALITY_TAGS.TOURISM],
        qualityDescription: 'Belevingswinkel, aantrekkelijk voor gezinnen en toeristen.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Beperkt kwetsbaar.',
        actionPerspective: 'Geen bijzondere aandacht.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'dagelijks_food'
      },
      {
        code: '11.010.912',
        name: 'Ziekenhuiswinkel',
        qualityScore: 3,
        vulnerabilityScore: 1,
        qualityTags: [QUALITY_TAGS.AMENITY],
        qualityDescription: 'Specifieke locatiegebonden voorziening.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Niet kwetsbaar.',
        actionPerspective: 'Geen bijzondere aandacht.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'overig'
      },
      {
        code: '11.010.950',
        name: 'Levensmiddelen Overig',
        qualityScore: 4,
        vulnerabilityScore: 4,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS],
        qualityDescription: 'Diverse levensmiddelenwinkels. Bijdrage afhankelijk van specifiek type.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.LOW_BARRIER],
        vulnerabilityDescription: 'Matig kwetsbaar. Let op type en clustering.',
        actionPerspective: 'Monitoring bij clustering. Integrale controle bij signalen.',
        actionTypes: [ACTION_TYPES.MONITORING],
        monocultureRisk: true,
        monocultureCategory: 'dagelijks_food'
      },
      // Persoonlijke Verzorging
      {
        code: '11.020.024',
        name: 'Apotheek',
        qualityScore: 6,
        vulnerabilityScore: 1,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS, QUALITY_TAGS.HEALTH, QUALITY_TAGS.AMENITY],
        qualityDescription: 'Essentiële basisvoorziening. Draagt bij aan zorginfrastructuur en leefbaarheid.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Niet kwetsbaar. Sterk gereguleerde sector met hoge toetredingseisen.',
        actionPerspective: 'Koesteren als basisvoorziening.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'gezondheid'
      },
      {
        code: '11.020.156',
        name: 'Drogist',
        qualityScore: 5,
        vulnerabilityScore: 1,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS, QUALITY_TAGS.FOOT_TRAFFIC],
        qualityDescription: 'Dagelijkse voorziening met passantentrekkende werking.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Niet kwetsbaar. Voornamelijk ketens met transparant bedrijfsmodel.',
        actionPerspective: 'Geen bijzondere aandacht.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'dagelijks_nonfood'
      },
      {
        code: '11.020.393',
        name: 'Parfumerie',
        qualityScore: 6,
        vulnerabilityScore: 2,
        qualityTags: [QUALITY_TAGS.SHOPPING, QUALITY_TAGS.TOURISM],
        qualityDescription: 'Draagt bij aan premium winkelgebied. Toeristische aantrekkingskracht.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Beperkt kwetsbaar.',
        actionPerspective: 'Geen bijzondere aandacht.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'dagelijks_nonfood'
      },
      {
        code: '11.020.395',
        name: 'Haarproducten',
        qualityScore: 3,
        vulnerabilityScore: 5,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS],
        qualityDescription: 'Nichewinkel. Beperkte bijdrage aan vitaliteit.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.LOW_BARRIER, VULNERABILITY_TYPES.FRONT_BUSINESS],
        vulnerabilityDescription: 'Kwetsbaar door lage toetredingsdrempel en ondoorzichtig verdienmodel. Clustering kan wijzen op dekmantelactiviteiten.',
        actionPerspective: 'Alert bij clustering. Bij signalen: integrale controle.',
        actionTypes: [ACTION_TYPES.MONITORING, ACTION_TYPES.INSPECTION],
        monocultureRisk: true,
        monocultureCategory: 'persoonlijke_verzorging'
      },
      {
        code: '11.020.950',
        name: 'Persoonlijke Verzorging Overig',
        qualityScore: 4,
        vulnerabilityScore: 3,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS],
        qualityDescription: 'Bijdrage afhankelijk van specifiek type.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.LOW_BARRIER],
        vulnerabilityDescription: 'Licht kwetsbaar.',
        actionPerspective: 'Reguliere monitoring.',
        actionTypes: [ACTION_TYPES.MONITORING],
        monocultureRisk: false,
        monocultureCategory: 'persoonlijke_verzorging'
      }
    ]
  },
  {
    code: '22',
    name: 'Mode & Luxe',
    branches: [
      {
        code: '22.030.618',
        name: 'Warenhuis',
        qualityScore: 9,
        vulnerabilityScore: 1,
        qualityTags: [QUALITY_TAGS.ANCHOR, QUALITY_TAGS.FOOT_TRAFFIC, QUALITY_TAGS.SHOPPING, QUALITY_TAGS.TOURISM, QUALITY_TAGS.EMPLOYMENT],
        qualityDescription: 'Topankerfunctie. Grootste passantentrekker, substantiële werkgelegenheid. Bepalend voor het functioneren van een binnenstad.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Niet kwetsbaar. Grote ketens met volledig transparant bedrijfsmodel.',
        actionPerspective: 'Koesteren. Verlies van warenhuis is ernstig signaal voor vitaliteit.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'mode_luxe'
      },
      {
        code: '22.040.135',
        name: 'Damesmode',
        qualityScore: 6,
        vulnerabilityScore: 2,
        qualityTags: [QUALITY_TAGS.SHOPPING, QUALITY_TAGS.FOOT_TRAFFIC],
        qualityDescription: 'Kernbranche voor vergelijkend winkelen. Trekt passanten en verlengt verblijftijd.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.FENCING],
        vulnerabilityDescription: 'Beperkt kwetsbaar. Soms risico op verkoop van namaakgoederen.',
        actionPerspective: 'Reguliere controle op namaak.',
        actionTypes: [ACTION_TYPES.MONITORING],
        monocultureRisk: false,
        monocultureCategory: 'mode_luxe'
      },
      {
        code: '22.040.138',
        name: 'Dames & Heren Mode',
        qualityScore: 6,
        vulnerabilityScore: 2,
        qualityTags: [QUALITY_TAGS.SHOPPING, QUALITY_TAGS.FOOT_TRAFFIC],
        qualityDescription: 'Brede modezaak. Vergelijkend winkelen, passantengeneratie.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.FENCING],
        vulnerabilityDescription: 'Beperkt kwetsbaar.',
        actionPerspective: 'Reguliere controle.',
        actionTypes: [ACTION_TYPES.MONITORING],
        monocultureRisk: false,
        monocultureCategory: 'mode_luxe'
      },
      {
        code: '22.040.216',
        name: 'Herenmode',
        qualityScore: 6,
        vulnerabilityScore: 2,
        qualityTags: [QUALITY_TAGS.SHOPPING, QUALITY_TAGS.FOOT_TRAFFIC],
        qualityDescription: 'Modezaak voor vergelijkend winkelen.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Beperkt kwetsbaar.',
        actionPerspective: 'Geen bijzondere aandacht.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'mode_luxe'
      },
      {
        code: '22.040.258',
        name: 'Kindermode',
        qualityScore: 6,
        vulnerabilityScore: 1,
        qualityTags: [QUALITY_TAGS.SHOPPING, QUALITY_TAGS.FAMILY],
        qualityDescription: 'Gezinsvriendelijke voorziening. Trekt gezinnen naar winkelgebied.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Niet kwetsbaar.',
        actionPerspective: 'Geen bijzondere aandacht.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'mode_luxe'
      },
      {
        code: '22.040.330',
        name: 'Lingerie',
        qualityScore: 5,
        vulnerabilityScore: 2,
        qualityTags: [QUALITY_TAGS.SHOPPING],
        qualityDescription: 'Specialty modezaak.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Beperkt kwetsbaar.',
        actionPerspective: 'Geen bijzondere aandacht.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'mode_luxe'
      },
      {
        code: '22.040.360',
        name: 'Mode-accessoires',
        qualityScore: 5,
        vulnerabilityScore: 3,
        qualityTags: [QUALITY_TAGS.SHOPPING],
        qualityDescription: 'Aanvullend op modeaanbod.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.FENCING],
        vulnerabilityDescription: 'Licht kwetsbaar. Risico op namaakgoederen.',
        actionPerspective: 'Let op namaak.',
        actionTypes: [ACTION_TYPES.MONITORING],
        monocultureRisk: false,
        monocultureCategory: 'mode_luxe'
      },
      {
        code: '22.040.543',
        name: 'Textielsuper',
        qualityScore: 4,
        vulnerabilityScore: 2,
        qualityTags: [QUALITY_TAGS.SHOPPING, QUALITY_TAGS.DAILY_NEEDS],
        qualityDescription: 'Breed textielaanbod, meer functioneel dan belevingsgericht.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Beperkt kwetsbaar. Ketens met transparant model.',
        actionPerspective: 'Geen bijzondere aandacht.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'mode_luxe'
      },
      {
        code: '22.040.546',
        name: 'Modewarenhuis',
        qualityScore: 7,
        vulnerabilityScore: 1,
        qualityTags: [QUALITY_TAGS.SHOPPING, QUALITY_TAGS.ANCHOR, QUALITY_TAGS.FOOT_TRAFFIC],
        qualityDescription: 'Belangrijke trekker voor vergelijkend winkelen.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Niet kwetsbaar.',
        actionPerspective: 'Koesteren als trekker.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'mode_luxe'
      },
      // Schoenen & Lederwaren
      {
        code: '22.050.453',
        name: 'Schoenen',
        qualityScore: 5,
        vulnerabilityScore: 2,
        qualityTags: [QUALITY_TAGS.SHOPPING, QUALITY_TAGS.FOOT_TRAFFIC],
        qualityDescription: 'Standaard winkelaanbod voor vergelijkend winkelen.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Beperkt kwetsbaar.',
        actionPerspective: 'Geen bijzondere aandacht.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'mode_luxe'
      },
      // Juwelier & Optiek
      {
        code: '22.060.252',
        name: 'Juwelier',
        qualityScore: 6,
        vulnerabilityScore: 7,
        qualityTags: [QUALITY_TAGS.SHOPPING, QUALITY_TAGS.TOURISM, QUALITY_TAGS.IDENTITY],
        qualityDescription: 'Premium winkel die bijdraagt aan uitstraling van het winkelgebied. Toeristische trekker.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.FENCING, VULNERABILITY_TYPES.CASH_INTENSIVE],
        vulnerabilityDescription: 'Hoog kwetsbaar. RIEC-onderzoek bevestigt specifieke kwetsbaarheid van de juwelierssector. Geschikt voor witwassen (hoge waarde, compacte goederen), heling van gestolen sieraden, en contante transacties van hoge waarde. Moeilijk verifieerbare marges.',
        actionPerspective: 'Bibob-screening bij nieuwe vestigingen. Samenwerking met politie voor helingcontroles. Let op: onverklaarbare herkomst van goederen, afwijkende omzetpatronen, hoge contante transacties. RIEC casuïstiek beschikbaar voor benchmark.',
        actionTypes: [ACTION_TYPES.BIBOB, ACTION_TYPES.INSPECTION, ACTION_TYPES.COOPERATION],
        monocultureRisk: false,
        monocultureCategory: 'juwelier_optiek'
      },
      {
        code: '22.060.770',
        name: 'Optiek',
        qualityScore: 5,
        vulnerabilityScore: 1,
        qualityTags: [QUALITY_TAGS.HEALTH, QUALITY_TAGS.SERVICES],
        qualityDescription: 'Paramedische dienstverlening, basisvoorziening.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Niet kwetsbaar. Gereguleerde sector.',
        actionPerspective: 'Geen bijzondere aandacht.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'juwelier_optiek'
      },
      // Huishoudelijke & Luxe Artikelen
      {
        code: '22.070.264',
        name: 'Cadeau-artikelen',
        qualityScore: 5,
        vulnerabilityScore: 3,
        qualityTags: [QUALITY_TAGS.SHOPPING, QUALITY_TAGS.TOURISM],
        qualityDescription: 'Belevingswinkel. Kan toeristische trekker zijn. Draagt bij aan diversiteit.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.LOW_BARRIER, VULNERABILITY_TYPES.FRONT_BUSINESS],
        vulnerabilityDescription: 'Licht kwetsbaar. Bij clustering: toeristenwinkels problematiek (zoals in Amsterdam binnenstad).',
        actionPerspective: 'Let op clustering en monocultuur (toeristenwinkels). Bij signalen: nader onderzoek.',
        actionTypes: [ACTION_TYPES.MONITORING],
        monocultureRisk: true,
        monocultureCategory: 'souvenirs_cadeau'
      },
      {
        code: '22.070.288',
        name: 'Kookwinkel',
        qualityScore: 7,
        vulnerabilityScore: 1,
        qualityTags: [QUALITY_TAGS.SHOPPING, QUALITY_TAGS.IDENTITY, QUALITY_TAGS.TOURISM],
        qualityDescription: 'Specialty shop met hoge belevingswaarde. Past in culinaire trend.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Niet kwetsbaar.',
        actionPerspective: 'Koesteren.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'huishoudelijk'
      },
      // Antiek & Kunst
      {
        code: '22.080.021',
        name: 'Antiek',
        qualityScore: 6,
        vulnerabilityScore: 4,
        qualityTags: [QUALITY_TAGS.TOURISM, QUALITY_TAGS.CULTURE, QUALITY_TAGS.IDENTITY],
        qualityDescription: 'Draagt bij aan culturele identiteit en toeristische aantrekkingskracht.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.FENCING],
        vulnerabilityDescription: 'Matig kwetsbaar. Moeilijk te taxeren waarden, geschikt voor witwassen en heling. Cash intensief.',
        actionPerspective: 'Alert bij ongewone transactiepatronen. Samenwerking met Wwft-toezichthouders.',
        actionTypes: [ACTION_TYPES.MONITORING, ACTION_TYPES.COOPERATION],
        monocultureRisk: false,
        monocultureCategory: 'kunst_antiek'
      },
      {
        code: '22.080.312',
        name: 'Kunsthandel',
        qualityScore: 7,
        vulnerabilityScore: 5,
        qualityTags: [QUALITY_TAGS.CULTURE, QUALITY_TAGS.TOURISM, QUALITY_TAGS.IDENTITY],
        qualityDescription: 'Versterkt cultureel profiel van het winkelgebied. Trekt cultureel geïnteresseerd publiek en toeristen.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.OPAQUE_REVENUE],
        vulnerabilityDescription: 'Kwetsbaar. Subjectieve waardering van kunstwerken maakt witwassen via overgewaardeerde transacties mogelijk. Wwft-plichtig boven drempelwaarde.',
        actionPerspective: 'Wwft-toezicht. Alert bij transacties boven meldgrens. Samenwerking met FIU-Nederland.',
        actionTypes: [ACTION_TYPES.MONITORING, ACTION_TYPES.COOPERATION],
        monocultureRisk: false,
        monocultureCategory: 'kunst_antiek'
      }
    ]
  },
  {
    code: '59',
    name: 'Leisure',
    branches: [
      // Horeca
      {
        code: '59.210.123',
        name: 'Café',
        qualityScore: 7,
        vulnerabilityScore: 7,
        qualityTags: [QUALITY_TAGS.NIGHTLIFE, QUALITY_TAGS.SOCIAL, QUALITY_TAGS.TOURISM, QUALITY_TAGS.IDENTITY],
        qualityDescription: 'Essentieel voor avondleven en sociale cohesie. Ontmoetingsplek, identiteitsdrager. Bruisende caféscene trekt toeristen.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.DRUG_TRADE, VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.ILLEGAL_GAMBLING],
        vulnerabilityDescription: 'Hoog kwetsbaar. Horeca is de meest onderzochte sector in Bibob-verband. Contant geld intensief, fictieve omzetverhoging voor witwassen, drugshandel (met name cocaïne), illegaal gokken. Wisselingen in eigendom zijn signaal.',
        actionPerspective: 'Exploitatie- en Alcoholwetvergunning verplicht. Bibob-screening standaard bij aanvraag en overdracht. Integrale controles (politie, brandweer, belastingdienst). Bij mutatiesignalen: direct onderzoek.',
        actionTypes: [ACTION_TYPES.BIBOB, ACTION_TYPES.LICENSING, ACTION_TYPES.INSPECTION, ACTION_TYPES.ENFORCEMENT],
        monocultureRisk: true,
        monocultureCategory: 'horeca_drank'
      },
      {
        code: '59.210.127',
        name: 'Koffiehuis',
        qualityScore: 5,
        vulnerabilityScore: 7,
        qualityTags: [QUALITY_TAGS.SOCIAL, QUALITY_TAGS.NIGHTLIFE],
        qualityDescription: 'Ontmoetingsplek. Minder bijdrage aan brede vitaliteit dan reguliere horeca.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.DRUG_TRADE, VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.ILLEGAL_GAMBLING, VULNERABILITY_TYPES.FRONT_BUSINESS],
        vulnerabilityDescription: 'Hoog kwetsbaar. Traditioneel koffiehuis kent vergelijkbare risicos als café. Extra risico: kan fungeren als ontmoetingsplaats voor criminele netwerken, illegaal gokken.',
        actionPerspective: 'Exploitatievergunning vereisen. Bibob-screening. Integrale controles. Let op: ongebruikelijke openingstijden, afwijkend klantenpatroon.',
        actionTypes: [ACTION_TYPES.BIBOB, ACTION_TYPES.LICENSING, ACTION_TYPES.INSPECTION],
        monocultureRisk: true,
        monocultureCategory: 'horeca_koffie'
      },
      {
        code: '59.210.150',
        name: 'Discotheek',
        qualityScore: 6,
        vulnerabilityScore: 8,
        qualityTags: [QUALITY_TAGS.NIGHTLIFE, QUALITY_TAGS.LEISURE, QUALITY_TAGS.TOURISM],
        qualityDescription: 'Belangrijke nachtlevenvoorziening. Trekt jong publiek en toeristen. Cultureel relevant.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.DRUG_TRADE, VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.EXPLOITATION],
        vulnerabilityDescription: 'Zeer kwetsbaar. Hoge omzetten in contant geld, drugsgebruik en -handel, risico op uitbuiting van personeel (zwartwerk). Nachtelijke setting bemoeilijkt toezicht.',
        actionPerspective: 'Verplichte Bibob-screening. Strikte handhaving Alcoholwet en Opiumwet. Doorlopend toezicht. Samenwerking met politie en FIOD.',
        actionTypes: [ACTION_TYPES.BIBOB, ACTION_TYPES.LICENSING, ACTION_TYPES.ENFORCEMENT, ACTION_TYPES.COOPERATION],
        monocultureRisk: false,
        monocultureCategory: 'horeca_nacht'
      },
      {
        code: '59.210.155',
        name: 'Seks/Nachtclubs',
        qualityScore: 2,
        vulnerabilityScore: 10,
        qualityTags: [QUALITY_TAGS.NIGHTLIFE],
        qualityDescription: 'Beperkte bijdrage aan brede vitaliteit. Kan overlast genereren en andere functies verdringen.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.HUMAN_TRAFFICKING, VULNERABILITY_TYPES.EXPLOITATION, VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.DRUG_TRADE, VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.LABOR_EXPLOITATION],
        vulnerabilityDescription: 'Maximaal kwetsbaar. Hoogste risico op mensenhandel en uitbuiting. Witwassen via fictieve omzetten. Drugshandel. Arbeidsuitbuiting. Verplichte Bibob-sector per wet.',
        actionPerspective: 'Verplichte vergunning en Bibob-screening (wettelijk verankerd). Frequent toezicht door politie en gemeente. Samenwerking met CoMensha en RIEC voor signalen mensenhandel. Actief toezicht op arbeidsomstandigheden.',
        actionTypes: [ACTION_TYPES.BIBOB, ACTION_TYPES.LICENSING, ACTION_TYPES.ENFORCEMENT, ACTION_TYPES.COOPERATION, ACTION_TYPES.INSPECTION],
        monocultureRisk: true,
        monocultureCategory: 'seks_industrie'
      },
      {
        code: '59.210.171',
        name: 'Fastfood',
        qualityScore: 4,
        vulnerabilityScore: 5,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS, QUALITY_TAGS.NIGHTLIFE],
        qualityDescription: 'Basisvoorziening, met name avond/nacht. Beperkte bijdrage aan kwaliteitsbeleving.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.LOW_BARRIER, VULNERABILITY_TYPES.FRONT_BUSINESS, VULNERABILITY_TYPES.TAX_FRAUD],
        vulnerabilityDescription: 'Matig kwetsbaar. Lage toetredingsdrempel, veel contante transacties. Bij clustering: monocultuurrisico en mogelijke dekmantelactiviteiten.',
        actionPerspective: 'Alert bij clustering. Exploitatievergunning. Integrale controles bij signalen.',
        actionTypes: [ACTION_TYPES.LICENSING, ACTION_TYPES.MONITORING, ACTION_TYPES.INSPECTION],
        monocultureRisk: true,
        monocultureCategory: 'horeca_fastfood'
      },
      {
        code: '59.210.180',
        name: 'Bezorgen/Afhalen',
        qualityScore: 3,
        vulnerabilityScore: 6,
        qualityTags: [],
        qualityDescription: 'Minimale bijdrage aan straatbeeld en passantenflow. Genereert bezorgverkeer.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.LOW_BARRIER, VULNERABILITY_TYPES.FRONT_BUSINESS, VULNERABILITY_TYPES.LABOR_EXPLOITATION],
        vulnerabilityDescription: 'Kwetsbaar. Geen zichtbare klantenstroom maakt omzetcontrole lastig. Lage drempel, risico op uitbuiting bezorgers en zwartwerk.',
        actionPerspective: 'Exploitatievergunning. Alert bij concentratie. Arbeidsinspectie inschakelen bij signalen van uitbuiting.',
        actionTypes: [ACTION_TYPES.LICENSING, ACTION_TYPES.MONITORING, ACTION_TYPES.INSPECTION],
        monocultureRisk: true,
        monocultureCategory: 'horeca_fastfood'
      },
      {
        code: '59.210.215',
        name: 'Grillroom/Shoarma',
        qualityScore: 4,
        vulnerabilityScore: 7,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS, QUALITY_TAGS.NIGHTLIFE],
        qualityDescription: 'Basishorecavoorziening. Bij clustering: monocultuurproblematiek.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.LOW_BARRIER, VULNERABILITY_TYPES.FRONT_BUSINESS, VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.TAX_FRAUD, VULNERABILITY_TYPES.LABOR_EXPLOITATION],
        vulnerabilityDescription: 'Hoog kwetsbaar. Klassiek voorbeeld van kwetsbare branche in RIEC-casuïstiek. Lage drempel, contant intensief, geschikt voor witwassen via omzetmanipulatie. Risico op arbeidsuitbuiting. Clustering is sterk signaal.',
        actionPerspective: 'Exploitatievergunning verplicht. Bibob-screening bij aanvraag en overdracht. Integrale controles. Bij clustering (>2 in één straat): monocultuuronderzoek en versterkt toezicht.',
        actionTypes: [ACTION_TYPES.BIBOB, ACTION_TYPES.LICENSING, ACTION_TYPES.INSPECTION, ACTION_TYPES.ENFORCEMENT],
        monocultureRisk: true,
        monocultureCategory: 'horeca_fastfood'
      },
      {
        code: '59.210.234',
        name: 'Hotel',
        qualityScore: 7,
        vulnerabilityScore: 4,
        qualityTags: [QUALITY_TAGS.TOURISM, QUALITY_TAGS.EMPLOYMENT, QUALITY_TAGS.FOOT_TRAFFIC],
        qualityDescription: 'Toeristische infrastructuur. Genereert werkgelegenheid en bezoekers voor omliggende voorzieningen.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.HUMAN_TRAFFICKING, VULNERABILITY_TYPES.MONEY_LAUNDERING],
        vulnerabilityDescription: 'Matig kwetsbaar. Risico op mensenhandel (met name bij goedkope hotels). Witwassen via fictieve boekingen.',
        actionPerspective: 'Reguliere controle. Bij signalen mensenhandel: samenwerking met politie en RIEC.',
        actionTypes: [ACTION_TYPES.MONITORING, ACTION_TYPES.COOPERATION],
        monocultureRisk: false,
        monocultureCategory: 'horeca_verblijf'
      },
      {
        code: '59.210.235',
        name: 'Hotel-Restaurant',
        qualityScore: 8,
        vulnerabilityScore: 3,
        qualityTags: [QUALITY_TAGS.TOURISM, QUALITY_TAGS.EMPLOYMENT, QUALITY_TAGS.FOOT_TRAFFIC, QUALITY_TAGS.IDENTITY],
        qualityDescription: 'Toeristische trekker. Combinatie van verblijf en culinaire beleving. Werkgelegenheid.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING],
        vulnerabilityDescription: 'Licht kwetsbaar. Doorgaans grotere, meer transparante bedrijven.',
        actionPerspective: 'Reguliere monitoring.',
        actionTypes: [ACTION_TYPES.MONITORING],
        monocultureRisk: false,
        monocultureCategory: 'horeca_verblijf'
      },
      {
        code: '59.210.246',
        name: 'IJssalon',
        qualityScore: 7,
        vulnerabilityScore: 3,
        qualityTags: [QUALITY_TAGS.TOURISM, QUALITY_TAGS.FAMILY, QUALITY_TAGS.LEISURE, QUALITY_TAGS.IDENTITY],
        qualityDescription: 'Hoge belevingswaarde. Gezinsvriendelijk, toeristische trekker. Versterkt de verblijfskwaliteit.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.CASH_INTENSIVE],
        vulnerabilityDescription: 'Licht kwetsbaar door seizoensgebonden contante omzet.',
        actionPerspective: 'Geen bijzondere aandacht.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'horeca_light'
      },
      {
        code: '59.210.333',
        name: 'Lunchroom',
        qualityScore: 7,
        vulnerabilityScore: 4,
        qualityTags: [QUALITY_TAGS.SOCIAL, QUALITY_TAGS.FOOT_TRAFFIC, QUALITY_TAGS.TOURISM],
        qualityDescription: 'Daghoreca die bijdraagt aan verblijfskwaliteit en levendigheid overdag.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.LOW_BARRIER],
        vulnerabilityDescription: 'Matig kwetsbaar door lage drempel en contante omzet.',
        actionPerspective: 'Reguliere monitoring. Exploitatievergunning.',
        actionTypes: [ACTION_TYPES.LICENSING, ACTION_TYPES.MONITORING],
        monocultureRisk: false,
        monocultureCategory: 'horeca_light'
      },
      {
        code: '59.210.434',
        name: 'Restaurant',
        qualityScore: 8,
        vulnerabilityScore: 5,
        qualityTags: [QUALITY_TAGS.TOURISM, QUALITY_TAGS.NIGHTLIFE, QUALITY_TAGS.CULTURE, QUALITY_TAGS.IDENTITY, QUALITY_TAGS.EMPLOYMENT],
        qualityDescription: 'Kernelement van binnenstadsvitaliteit. Trekt avondpubliek, toeristen. Culinaire diversiteit versterkt gebiedsidentiteit. Werkgelegenheid.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.TAX_FRAUD, VULNERABILITY_TYPES.LABOR_EXPLOITATION],
        vulnerabilityDescription: 'Kwetsbaar. Horeca is per definitie Bibob-sector. Contant intensief, mogelijkheid tot omzetmanipulatie, risico op zwartwerk en arbeidsuitbuiting.',
        actionPerspective: 'Exploitatie- en Alcoholwetvergunning. Bibob bij aanvraag/overdracht. Reguliere integrale controles. Samenwerking met belastingdienst en arbeidsinspectie.',
        actionTypes: [ACTION_TYPES.BIBOB, ACTION_TYPES.LICENSING, ACTION_TYPES.INSPECTION],
        monocultureRisk: false,
        monocultureCategory: 'horeca_restaurant'
      },
      {
        code: '59.210.430',
        name: 'Café-Restaurant',
        qualityScore: 7,
        vulnerabilityScore: 6,
        qualityTags: [QUALITY_TAGS.NIGHTLIFE, QUALITY_TAGS.SOCIAL, QUALITY_TAGS.TOURISM],
        qualityDescription: 'Combinatie van eet- en drinkgelegenheid. Draagt bij aan levendigheid dag en avond.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.DRUG_TRADE],
        vulnerabilityDescription: 'Kwetsbaar. Vergelijkbaar risicoprofiel als café met toevoeging van keukenomzet die manipuleerbaar is.',
        actionPerspective: 'Bibob-screening. Exploitatievergunning. Integrale controles.',
        actionTypes: [ACTION_TYPES.BIBOB, ACTION_TYPES.LICENSING, ACTION_TYPES.INSPECTION],
        monocultureRisk: false,
        monocultureCategory: 'horeca_restaurant'
      },
      {
        code: '59.210.465',
        name: 'Partycentrum',
        qualityScore: 4,
        vulnerabilityScore: 5,
        qualityTags: [QUALITY_TAGS.SOCIAL, QUALITY_TAGS.LEISURE],
        qualityDescription: 'Evenementenlocatie. Bijdrage aan sociale functie.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.CASH_INTENSIVE],
        vulnerabilityDescription: 'Matig kwetsbaar.',
        actionPerspective: 'Exploitatievergunning. Reguliere controle.',
        actionTypes: [ACTION_TYPES.LICENSING, ACTION_TYPES.MONITORING],
        monocultureRisk: false,
        monocultureCategory: 'horeca_overig'
      },
      {
        code: '59.210.950',
        name: 'Horeca Overig',
        qualityScore: 5,
        vulnerabilityScore: 6,
        qualityTags: [QUALITY_TAGS.SOCIAL, QUALITY_TAGS.LEISURE],
        qualityDescription: 'Diverse horecaconcepten. Bijdrage afhankelijk van type.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.LOW_BARRIER],
        vulnerabilityDescription: 'Kwetsbaar als onderdeel van horecasector. Shisha-lounges specifiek hoog risico.',
        actionPerspective: 'Exploitatievergunning. Bibob bij aanvraag. Let specifiek op shisha-lounges (apart Bibob-beleid overwegen).',
        actionTypes: [ACTION_TYPES.BIBOB, ACTION_TYPES.LICENSING, ACTION_TYPES.INSPECTION],
        monocultureRisk: true,
        monocultureCategory: 'horeca_overig'
      },
      // Cultuur
      {
        code: '59.220.075',
        name: 'Bibliotheek',
        qualityScore: 8,
        vulnerabilityScore: 1,
        qualityTags: [QUALITY_TAGS.CULTURE, QUALITY_TAGS.SOCIAL, QUALITY_TAGS.FAMILY, QUALITY_TAGS.AMENITY, QUALITY_TAGS.FOOT_TRAFFIC],
        qualityDescription: 'Maatschappelijke ankerfunctie. Ontmoetingsplaats, educatief, sociaal inclusief. Trekt breed publiek incl. gezinnen. Versterkt sociale cohesie enorm.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Niet kwetsbaar.',
        actionPerspective: 'Koesteren als maatschappelijk anker. Verlies van bibliotheek is ernstig signaal.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'cultuur'
      },
      {
        code: '59.220.081',
        name: 'Bioscoop',
        qualityScore: 8,
        vulnerabilityScore: 2,
        qualityTags: [QUALITY_TAGS.CULTURE, QUALITY_TAGS.NIGHTLIFE, QUALITY_TAGS.FAMILY, QUALITY_TAGS.LEISURE, QUALITY_TAGS.ANCHOR, QUALITY_TAGS.FOOT_TRAFFIC],
        qualityDescription: 'Grote publiekstrekker dag en avond. Genereert bezoekers voor omliggende horeca en winkels. Ankerfunctie.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Nauwelijks kwetsbaar. Doorgaans ketens met transparant model.',
        actionPerspective: 'Koesteren als trekker.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'cultuur'
      },
      {
        code: '59.220.198',
        name: 'Galerie',
        qualityScore: 7,
        vulnerabilityScore: 5,
        qualityTags: [QUALITY_TAGS.CULTURE, QUALITY_TAGS.TOURISM, QUALITY_TAGS.IDENTITY],
        qualityDescription: 'Versterkt cultureel profiel. Trekt cultureel geïnteresseerd publiek. Draagt bij aan creatieve identiteit.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.OPAQUE_REVENUE],
        vulnerabilityDescription: 'Kwetsbaar. Subjectieve waardering kunstwerken maakt witwassen mogelijk.',
        actionPerspective: 'Wwft-toezicht. Alert bij hoge transacties.',
        actionTypes: [ACTION_TYPES.MONITORING],
        monocultureRisk: false,
        monocultureCategory: 'cultuur'
      },
      {
        code: '59.220.369',
        name: 'Museum',
        qualityScore: 9,
        vulnerabilityScore: 1,
        qualityTags: [QUALITY_TAGS.CULTURE, QUALITY_TAGS.TOURISM, QUALITY_TAGS.IDENTITY, QUALITY_TAGS.FAMILY, QUALITY_TAGS.ANCHOR, QUALITY_TAGS.FOOT_TRAFFIC, QUALITY_TAGS.EMPLOYMENT],
        qualityDescription: 'Topankerfunctie voor cultuurtoerisme. Trekt breed publiek, internationale bezoekers. Genereert werkgelegenheid en spillover naar horeca en winkels.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Niet kwetsbaar.',
        actionPerspective: 'Koesteren. Musea zijn de sterkste aanjagers van binnenstadsvitaliteit.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'cultuur'
      },
      {
        code: '59.220.549',
        name: 'Theater',
        qualityScore: 9,
        vulnerabilityScore: 1,
        qualityTags: [QUALITY_TAGS.CULTURE, QUALITY_TAGS.NIGHTLIFE, QUALITY_TAGS.TOURISM, QUALITY_TAGS.IDENTITY, QUALITY_TAGS.ANCHOR, QUALITY_TAGS.FOOT_TRAFFIC, QUALITY_TAGS.EMPLOYMENT],
        qualityDescription: 'Topankerfunctie voor avondeconomie en cultuurtoerisme. Genereert avondbezoek dat horeca stimuleert. Werkgelegenheid.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Niet kwetsbaar.',
        actionPerspective: 'Koesteren. Theater is essentieel voor avondeconomie.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'cultuur'
      },
      // Ontspanning
      {
        code: '59.230.018',
        name: 'Amusementshal',
        qualityScore: 3,
        vulnerabilityScore: 8,
        qualityTags: [QUALITY_TAGS.LEISURE],
        qualityDescription: 'Beperkte bijdrage aan kwaliteitsvitaliteit. Kan overlast genereren.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.ILLEGAL_GAMBLING, VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.FRONT_BUSINESS],
        vulnerabilityDescription: 'Zeer kwetsbaar. Kansspelen zijn per wet Bibob-plichtig. Geschikt voor witwassen via muntenomloop. Illegaal gokken. Dekmantel voor criminele netwerken.',
        actionPerspective: 'Wettelijk verplichte Bibob-screening (Wet op de kansspelen). Strikt vergunningenstelsel. Frequente controles. Let op illegale gokkasten.',
        actionTypes: [ACTION_TYPES.BIBOB, ACTION_TYPES.LICENSING, ACTION_TYPES.ENFORCEMENT, ACTION_TYPES.INSPECTION],
        monocultureRisk: true,
        monocultureCategory: 'gokken_amusement'
      },
      {
        code: '59.230.028',
        name: 'Casino',
        qualityScore: 4,
        vulnerabilityScore: 7,
        qualityTags: [QUALITY_TAGS.NIGHTLIFE, QUALITY_TAGS.TOURISM, QUALITY_TAGS.LEISURE],
        qualityDescription: 'Toeristische trekker voor specifiek publiek. Genereert avondbezoek.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.ILLEGAL_GAMBLING, VULNERABILITY_TYPES.CASH_INTENSIVE],
        vulnerabilityDescription: 'Hoog kwetsbaar. Kansspelen zijn inherent gevoelig voor witwassen. Holland Casino is gereguleerd, maar illegale casinos zijn maximaal risicovol.',
        actionPerspective: 'Strikt vergunningenstelsel. Bibob-screening. Wwft-toezicht door Kansspelautoriteit.',
        actionTypes: [ACTION_TYPES.BIBOB, ACTION_TYPES.LICENSING, ACTION_TYPES.ENFORCEMENT],
        monocultureRisk: false,
        monocultureCategory: 'gokken_amusement'
      },
      {
        code: '59.230.200',
        name: 'Fitness',
        qualityScore: 5,
        vulnerabilityScore: 4,
        qualityTags: [QUALITY_TAGS.HEALTH, QUALITY_TAGS.LEISURE],
        qualityDescription: 'Gezondheidsvoorziening. Trekt regelmatige bezoekers naar gebied.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.LOW_BARRIER],
        vulnerabilityDescription: 'Matig kwetsbaar. Abonnementsmodel kan worden misbruikt voor witwassen (spookleden). Lage toetredingsdrempel.',
        actionPerspective: 'Let op spookabonnementen (hoge ledenaantallen zonder bijbehorend bezoek). Reguliere controle.',
        actionTypes: [ACTION_TYPES.MONITORING],
        monocultureRisk: false,
        monocultureCategory: 'sport_leisure'
      },
      {
        code: '59.230.600',
        name: 'Wedkantoor',
        qualityScore: 2,
        vulnerabilityScore: 9,
        qualityTags: [],
        qualityDescription: 'Minimale bijdrage aan vitaliteit. Kan verloedering in de hand werken.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.ILLEGAL_GAMBLING, VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.FRONT_BUSINESS],
        vulnerabilityDescription: 'Zeer kwetsbaar. Gokkantoren zijn een van de meest risicovolle branches. Witwassen, illegaal gokken, dekmantel voor criminele netwerken.',
        actionPerspective: 'Vergunningplicht via APV. Bibob-screening verplicht. Frequente controles. Overweeg branchebeperkend beleid.',
        actionTypes: [ACTION_TYPES.BIBOB, ACTION_TYPES.LICENSING, ACTION_TYPES.ENFORCEMENT, ACTION_TYPES.INSPECTION],
        monocultureRisk: true,
        monocultureCategory: 'gokken_amusement'
      },
      {
        code: '59.230.660',
        name: 'Zonnebank',
        qualityScore: 2,
        vulnerabilityScore: 6,
        qualityTags: [],
        qualityDescription: 'Minimale bijdrage aan vitaliteit.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.FRONT_BUSINESS, VULNERABILITY_TYPES.LOW_BARRIER],
        vulnerabilityDescription: 'Kwetsbaar. Lage drempel, moeilijk verifieerbare klantenstroom, contant intensief. Bekend als dekmantel.',
        actionPerspective: 'Alert bij nieuwe vestigingen. Integrale controles. Bij signalen: Bibob-screening.',
        actionTypes: [ACTION_TYPES.MONITORING, ACTION_TYPES.INSPECTION, ACTION_TYPES.BIBOB],
        monocultureRisk: true,
        monocultureCategory: 'persoonlijke_verzorging'
      }
    ]
  },
  {
    code: '65',
    name: 'Diensten',
    branches: [
      // Ambacht
      {
        code: '65.260.230',
        name: 'Kapper',
        qualityScore: 4,
        vulnerabilityScore: 7,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS, QUALITY_TAGS.SERVICES],
        qualityDescription: 'Basisvoorziening. Individueel beperkte bijdrage aan vitaliteit.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.LOW_BARRIER, VULNERABILITY_TYPES.FRONT_BUSINESS, VULNERABILITY_TYPES.LABOR_EXPLOITATION],
        vulnerabilityDescription: 'Hoog kwetsbaar. Kapperszaken zijn een van de bekendste voorbeelden van kwetsbare branches (NOS/Politie & Wetenschap onderzoek). Lage drempel, contant intensief, moeilijk verifieerbare omzet. "Kapsalon zonder klanten" is symbool voor dekmanteleconomie. Risico op arbeidsuitbuiting.',
        actionPerspective: 'Alert bij clustering (monocultuur). Exploitatievergunning overwegen in risicogebieden. Integrale controles (arbeidsinspectie, belastingdienst). Bij signalen: Bibob-screening. NB: avondkappers zijn extra kwetsbaar.',
        actionTypes: [ACTION_TYPES.MONITORING, ACTION_TYPES.INSPECTION, ACTION_TYPES.BIBOB, ACTION_TYPES.LICENSING],
        monocultureRisk: true,
        monocultureCategory: 'kapper'
      },
      {
        code: '65.260.235',
        name: 'Tatoeage/Piercing',
        qualityScore: 4,
        vulnerabilityScore: 4,
        qualityTags: [QUALITY_TAGS.LEISURE, QUALITY_TAGS.IDENTITY],
        qualityDescription: 'Niche. Kan bijdragen aan creatieve identiteit van een gebied.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.LOW_BARRIER],
        vulnerabilityDescription: 'Matig kwetsbaar. Contant intensief, lage drempel.',
        actionPerspective: 'Reguliere monitoring. GGD-toezicht op hygiëne.',
        actionTypes: [ACTION_TYPES.MONITORING, ACTION_TYPES.INSPECTION],
        monocultureRisk: false,
        monocultureCategory: 'ambacht'
      },
      {
        code: '65.260.240',
        name: 'Schoonheidssalon',
        qualityScore: 4,
        vulnerabilityScore: 6,
        qualityTags: [QUALITY_TAGS.SERVICES],
        qualityDescription: 'Persoonlijke dienstverlening. Beperkte bijdrage aan brede vitaliteit.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.LOW_BARRIER, VULNERABILITY_TYPES.FRONT_BUSINESS, VULNERABILITY_TYPES.HUMAN_TRAFFICKING, VULNERABILITY_TYPES.LABOR_EXPLOITATION],
        vulnerabilityDescription: 'Kwetsbaar. Lage drempel, contant intensief. Extra risico bij massagesalons: mensenhandel en seksuele uitbuiting (expliciet benoemd in wetgeving). Clustering is signaal.',
        actionPerspective: 'Alert bij clustering. Specifieke aandacht voor massagesalons (apart beleid). Bij signalen: politie inschakelen voor controle op mensenhandel.',
        actionTypes: [ACTION_TYPES.MONITORING, ACTION_TYPES.INSPECTION, ACTION_TYPES.COOPERATION, ACTION_TYPES.BIBOB],
        monocultureRisk: true,
        monocultureCategory: 'persoonlijke_verzorging'
      },
      {
        code: '65.260.462',
        name: 'Drukwerk/Copy',
        qualityScore: 3,
        vulnerabilityScore: 3,
        qualityTags: [QUALITY_TAGS.SERVICES],
        qualityDescription: 'Zakelijke dienstverlening. Beperkte bijdrage aan consumentenvitaliteit.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.LOW_BARRIER],
        vulnerabilityDescription: 'Licht kwetsbaar.',
        actionPerspective: 'Geen bijzondere aandacht.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'diensten'
      },
      // Financiële Instelling
      {
        code: '65.280.063',
        name: 'Bank',
        qualityScore: 5,
        vulnerabilityScore: 1,
        qualityTags: [QUALITY_TAGS.SERVICES, QUALITY_TAGS.AMENITY, QUALITY_TAGS.FOOT_TRAFFIC],
        qualityDescription: 'Basisvoorziening. Genereert passanten. Verlies van bankfilialen is signaal voor afnemende vitaliteit.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Niet kwetsbaar. Maximaal gereguleerde sector.',
        actionPerspective: 'Koesteren als basisvoorziening.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'financieel'
      },
      {
        code: '65.280.030',
        name: 'Financieel Intermediair',
        qualityScore: 3,
        vulnerabilityScore: 5,
        qualityTags: [QUALITY_TAGS.SERVICES],
        qualityDescription: 'Beperkte bijdrage aan consumentenvitaliteit.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.TAX_FRAUD],
        vulnerabilityDescription: 'Kwetsbaar. Geldwisselkantoren en money transfers zijn specifiek kwetsbaar voor witwassen (underground banking). Wwft-plichtig.',
        actionPerspective: 'Wwft-toezicht. Alert bij geldtransferkantoren. Samenwerking met FIU en DNB.',
        actionTypes: [ACTION_TYPES.MONITORING, ACTION_TYPES.COOPERATION],
        monocultureRisk: false,
        monocultureCategory: 'financieel'
      },
      // Particuliere Dienstverlening
      {
        code: '65.290.073',
        name: 'Bellen/Internet',
        qualityScore: 2,
        vulnerabilityScore: 8,
        qualityTags: [],
        qualityDescription: 'Minimale bijdrage aan vitaliteit. Verouderd concept. Clustering is sterk signaal voor dekmantelproblematiek.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.FRONT_BUSINESS, VULNERABILITY_TYPES.DRUG_TRADE, VULNERABILITY_TYPES.ILLEGAL_GAMBLING, VULNERABILITY_TYPES.LOW_BARRIER],
        vulnerabilityDescription: 'Zeer kwetsbaar. Belwinkels/internetcafés zijn expliciet benoemd in wetgeving als kwetsbare branche. Dekmantel voor witwassen, drugshandel, illegaal gokken. In meerdere gemeenten is exploitatievergunningplicht ingevoerd.',
        actionPerspective: 'Exploitatievergunning verplichten via APV. Bibob-screening bij alle aanvragen. Frequente integrale controles. Bij clustering: direct ingrijpen. Branchebeperkend beleid overwegen.',
        actionTypes: [ACTION_TYPES.BIBOB, ACTION_TYPES.LICENSING, ACTION_TYPES.ENFORCEMENT, ACTION_TYPES.INSPECTION],
        monocultureRisk: true,
        monocultureCategory: 'belwinkel'
      },
      {
        code: '65.290.340',
        name: 'Makelaardij',
        qualityScore: 4,
        vulnerabilityScore: 3,
        qualityTags: [QUALITY_TAGS.SERVICES],
        qualityDescription: 'Zakelijke dienstverlening.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING],
        vulnerabilityDescription: 'Licht kwetsbaar. Kan faciliteren bij vastgoedwitwassen maar is gereguleerde sector.',
        actionPerspective: 'Reguliere monitoring via Wwft.',
        actionTypes: [ACTION_TYPES.MONITORING],
        monocultureRisk: false,
        monocultureCategory: 'diensten'
      },
      {
        code: '65.290.865',
        name: 'Reisbureau',
        qualityScore: 5,
        vulnerabilityScore: 4,
        qualityTags: [QUALITY_TAGS.SERVICES, QUALITY_TAGS.TOURISM],
        qualityDescription: 'Dienstverlening. Kan bijdragen aan toeristisch profiel.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.CASH_INTENSIVE],
        vulnerabilityDescription: 'Matig kwetsbaar. Contante boekingen kunnen dienen voor witwassen. Underground banking via tickets.',
        actionPerspective: 'Let op patroon van contante boekingen. Wwft-verplichtingen.',
        actionTypes: [ACTION_TYPES.MONITORING],
        monocultureRisk: false,
        monocultureCategory: 'diensten'
      },
      {
        code: '65.290.878',
        name: 'Uitzendbureau',
        qualityScore: 3,
        vulnerabilityScore: 6,
        qualityTags: [QUALITY_TAGS.SERVICES, QUALITY_TAGS.EMPLOYMENT],
        qualityDescription: 'Arbeidsmarktdienstverlening.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.LABOR_EXPLOITATION, VULNERABILITY_TYPES.HUMAN_TRAFFICKING, VULNERABILITY_TYPES.TAX_FRAUD],
        vulnerabilityDescription: 'Kwetsbaar. Malafide uitzendbureaus faciliteren arbeidsuitbuiting, mensenhandel en belastingfraude. Lage drempel voor oprichting.',
        actionPerspective: 'Controle op SNA-certificering. Samenwerking met arbeidsinspectie. Bij signalen: RIEC inschakelen.',
        actionTypes: [ACTION_TYPES.MONITORING, ACTION_TYPES.INSPECTION, ACTION_TYPES.COOPERATION],
        monocultureRisk: false,
        monocultureCategory: 'diensten'
      },
      {
        code: '65.290.624',
        name: 'Stomerij/Wassalon',
        qualityScore: 3,
        vulnerabilityScore: 5,
        qualityTags: [QUALITY_TAGS.SERVICES, QUALITY_TAGS.DAILY_NEEDS],
        qualityDescription: 'Basisdienstverlening.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.FRONT_BUSINESS],
        vulnerabilityDescription: 'Kwetsbaar. Contant intensief, moeilijk verifieerbare omzet (aantal wasbeurten). Bekende dekmantelbranche.',
        actionPerspective: 'Reguliere monitoring. Bij signalen: nader onderzoek naar omzetpatronen.',
        actionTypes: [ACTION_TYPES.MONITORING],
        monocultureRisk: false,
        monocultureCategory: 'diensten'
      }
    ]
  },
  {
    code: '38',
    name: 'Detailhandel Overig',
    branches: [
      {
        code: '38.200.003',
        name: 'Tweedehands Diversen',
        qualityScore: 4,
        vulnerabilityScore: 5,
        qualityTags: [QUALITY_TAGS.SHOPPING],
        qualityDescription: 'Kan bijdragen aan diversiteit en duurzaam imago.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.FENCING, VULNERABILITY_TYPES.CASH_INTENSIVE, VULNERABILITY_TYPES.LOW_BARRIER],
        vulnerabilityDescription: 'Kwetsbaar voor heling. Lage drempel, contant intensief.',
        actionPerspective: 'Digitaal opkopersregister handhaven. Reguliere politiecontroles.',
        actionTypes: [ACTION_TYPES.MONITORING, ACTION_TYPES.INSPECTION],
        monocultureRisk: false,
        monocultureCategory: 'tweedehands'
      },
      {
        code: '38.200.451',
        name: 'Growshop',
        qualityScore: 1,
        vulnerabilityScore: 9,
        qualityTags: [],
        qualityDescription: 'Geen bijdrage aan vitaliteit. Negatief effect op uitstraling en leefbaarheid.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.DRUG_TRADE, VULNERABILITY_TYPES.FRONT_BUSINESS, VULNERABILITY_TYPES.MONEY_LAUNDERING],
        vulnerabilityDescription: 'Maximaal kwetsbaar. Direct gerelateerd aan hennepteelt/drugsproductie. Faciliteren van strafbare feiten.',
        actionPerspective: 'Maximaal toezicht. Samenwerking met politie en OM. Bibob-screening. Branchebeperkend beleid via bestemmingsplan.',
        actionTypes: [ACTION_TYPES.BIBOB, ACTION_TYPES.ENFORCEMENT, ACTION_TYPES.COOPERATION, ACTION_TYPES.LICENSING],
        monocultureRisk: true,
        monocultureCategory: 'growshop_headshop'
      },
      {
        code: '38.200.468',
        name: 'Erotica',
        qualityScore: 2,
        vulnerabilityScore: 7,
        qualityTags: [],
        qualityDescription: 'Beperkte bijdrage aan vitaliteit. Kan andere functies verdringen.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.HUMAN_TRAFFICKING, VULNERABILITY_TYPES.EXPLOITATION, VULNERABILITY_TYPES.FRONT_BUSINESS],
        vulnerabilityDescription: 'Hoog kwetsbaar. Verband met seksindustrie, risico op uitbuiting.',
        actionPerspective: 'Vergunningplicht. Bibob-screening. Controle op arbeidsomstandigheden.',
        actionTypes: [ACTION_TYPES.BIBOB, ACTION_TYPES.LICENSING, ACTION_TYPES.INSPECTION],
        monocultureRisk: true,
        monocultureCategory: 'seks_industrie'
      },
      {
        code: '38.200.610',
        name: 'Souvenirs',
        qualityScore: 5,
        vulnerabilityScore: 5,
        qualityTags: [QUALITY_TAGS.TOURISM],
        qualityDescription: 'Toeristische functie. Bij clustering: "Nutellawinkels-problematiek" (Amsterdam).',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.FRONT_BUSINESS, VULNERABILITY_TYPES.LOW_BARRIER],
        vulnerabilityDescription: 'Kwetsbaar bij clustering. Toeristenwinkels in Amsterdam zijn expliciet benoemd als ondermijningsprobleem. Dekmantel voor witwassen.',
        actionPerspective: 'Brancheringsbeleid in bestemmingsplan. Alert bij clustering. Exploitatievergunning in toeristische gebieden overwegen.',
        actionTypes: [ACTION_TYPES.MONITORING, ACTION_TYPES.LICENSING],
        monocultureRisk: true,
        monocultureCategory: 'souvenirs_cadeau'
      },
      {
        code: '38.200.905',
        name: 'Odd-Shops',
        qualityScore: 3,
        vulnerabilityScore: 5,
        qualityTags: [QUALITY_TAGS.SHOPPING],
        qualityDescription: 'Diverse nicheconcepten. Bijdrage afhankelijk van type.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.FRONT_BUSINESS, VULNERABILITY_TYPES.LOW_BARRIER],
        vulnerabilityDescription: 'Kwetsbaar. Onduidelijk verdienmodel, lage drempel.',
        actionPerspective: 'Monitoring bij onduidelijk concept.',
        actionTypes: [ACTION_TYPES.MONITORING],
        monocultureRisk: false,
        monocultureCategory: 'overig'
      }
    ]
  },
  {
    code: '35',
    name: 'Vrije Tijd',
    branches: [
      {
        code: '35.100.492',
        name: 'Sportzaak',
        qualityScore: 5,
        vulnerabilityScore: 2,
        qualityTags: [QUALITY_TAGS.SHOPPING, QUALITY_TAGS.LEISURE, QUALITY_TAGS.HEALTH],
        qualityDescription: 'Belevingswinkel. Draagt bij aan sportief imago.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Beperkt kwetsbaar. Vaak ketens.',
        actionPerspective: 'Geen bijzondere aandacht.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'vrije_tijd'
      },
      {
        code: '35.100.486',
        name: 'Speelgoed',
        qualityScore: 6,
        vulnerabilityScore: 1,
        qualityTags: [QUALITY_TAGS.FAMILY, QUALITY_TAGS.SHOPPING, QUALITY_TAGS.LEISURE],
        qualityDescription: 'Gezinsvriendelijke belevingswinkel. Trekt gezinnen naar winkelgebied.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Niet kwetsbaar.',
        actionPerspective: 'Koesteren als gezinsvriendelijke voorziening.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'vrije_tijd'
      },
      {
        code: '35.120.090',
        name: 'Boekhandel',
        qualityScore: 7,
        vulnerabilityScore: 1,
        qualityTags: [QUALITY_TAGS.CULTURE, QUALITY_TAGS.IDENTITY, QUALITY_TAGS.TOURISM, QUALITY_TAGS.SHOPPING],
        qualityDescription: 'Culturele trekker. Draagt bij aan intellectueel profiel van het gebied. Toeristische aantrekkingskracht.',
        vulnerabilityTypes: [],
        vulnerabilityDescription: 'Niet kwetsbaar.',
        actionPerspective: 'Koesteren als culturele voorziening.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'cultuur'
      }
    ]
  },
  {
    code: '37',
    name: 'In/Om Huis',
    branches: [
      {
        code: '37.130.087',
        name: 'Bloemen & Planten',
        qualityScore: 6,
        vulnerabilityScore: 2,
        qualityTags: [QUALITY_TAGS.DAILY_NEEDS, QUALITY_TAGS.TOURISM, QUALITY_TAGS.IDENTITY, QUALITY_TAGS.FOOT_TRAFFIC],
        qualityDescription: 'Sfeermaker in het straatbeeld. Toeristische aantrekkingskracht (bloemenmarkt). Dagelijkse passanten.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.CASH_INTENSIVE],
        vulnerabilityDescription: 'Beperkt kwetsbaar. Contant intensief maar transparant.',
        actionPerspective: 'Geen bijzondere aandacht.',
        actionTypes: [ACTION_TYPES.NONE],
        monocultureRisk: false,
        monocultureCategory: 'in_om_huis'
      },
      {
        code: '37.150.537',
        name: 'Telecom',
        qualityScore: 4,
        vulnerabilityScore: 4,
        qualityTags: [QUALITY_TAGS.SERVICES, QUALITY_TAGS.DAILY_NEEDS],
        qualityDescription: 'Dagelijkse dienstverlening. Clustering verlaagt vitaliteit.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.FENCING, VULNERABILITY_TYPES.MONEY_LAUNDERING],
        vulnerabilityDescription: 'Matig kwetsbaar. Heling van gestolen telefoons. Prepaid SIM-kaarten voor crimineel gebruik.',
        actionPerspective: 'Alert bij clustering. Opkopersregister handhaven.',
        actionTypes: [ACTION_TYPES.MONITORING],
        monocultureRisk: true,
        monocultureCategory: 'telecom'
      },
      {
        code: '37.160.039',
        name: 'Automaterialen',
        qualityScore: 2,
        vulnerabilityScore: 6,
        qualityTags: [],
        qualityDescription: 'Niet passend in binnenstadsfunctie.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.FENCING, VULNERABILITY_TYPES.FRONT_BUSINESS],
        vulnerabilityDescription: 'Kwetsbaar. Autobranche is bekend kwetsbare branche. Heling van gestolen auto-onderdelen.',
        actionPerspective: 'Opkopersregister. Bij vestiging in binnenstad: bestemmingsplancontrole.',
        actionTypes: [ACTION_TYPES.MONITORING, ACTION_TYPES.INSPECTION],
        monocultureRisk: false,
        monocultureCategory: 'automotive'
      }
    ]
  },
  {
    code: '45',
    name: 'Transport & Brandstoffen',
    branches: [
      {
        code: '45.203.242',
        name: 'Autodealer',
        qualityScore: 3,
        vulnerabilityScore: 6,
        qualityTags: [QUALITY_TAGS.SERVICES],
        qualityDescription: 'Niet passend in binnenstadsfunctie.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.MONEY_LAUNDERING, VULNERABILITY_TYPES.FENCING, VULNERABILITY_TYPES.TAX_FRAUD],
        vulnerabilityDescription: 'Kwetsbaar. Autohandel is specifiek benoemd als kwetsbare branche door RIEC. Geschikt voor witwassen via overgewaardeerde voertuigen. Export naar buitenland bemoeilijkt controle.',
        actionPerspective: 'Bibob-screening bij vestigingsvergunning. Samenwerking met RDW en belastingdienst. RIEC casuïstiek beschikbaar.',
        actionTypes: [ACTION_TYPES.BIBOB, ACTION_TYPES.MONITORING, ACTION_TYPES.COOPERATION],
        monocultureRisk: false,
        monocultureCategory: 'automotive'
      },
      {
        code: '45.203.270',
        name: 'Garagebedrijf',
        qualityScore: 2,
        vulnerabilityScore: 5,
        qualityTags: [QUALITY_TAGS.SERVICES],
        qualityDescription: 'Niet passend in binnenstadsfunctie.',
        vulnerabilityTypes: [VULNERABILITY_TYPES.FENCING, VULNERABILITY_TYPES.FRONT_BUSINESS, VULNERABILITY_TYPES.CASH_INTENSIVE],
        vulnerabilityDescription: 'Kwetsbaar. Heling van auto-onderdelen, dekmantel, contant intensief.',
        actionPerspective: 'Reguliere controle. Bij vestiging in woongebied: extra aandacht.',
        actionTypes: [ACTION_TYPES.MONITORING, ACTION_TYPES.INSPECTION],
        monocultureRisk: false,
        monocultureCategory: 'automotive'
      }
    ]
  }
];

/**
 * Afgeleide gelegenheidsstructuur-profielen per branche
 *
 * Op basis van het JenV-kader worden per branche de relevante
 * gelegenheidsstructuren afgeleid uit de bestaande kwetsbaarheidsindicatoren.
 * Dit voorkomt dubbele data-entry en garandeert consistentie.
 *
 * De opportunityScore wordt berekend als gewogen som van:
 * - Aanwezigheid van gelegenheidsstructuren (60%)
 * - Kwetsbaarheidsscore (25%)
 * - Monocultuurrisico (15%)
 *
 * De environmentalSensitivity wordt afgeleid uit:
 * - Passantenafhankelijkheid
 * - Zichtbaarheidsbehoeften
 * - Openingstijdenpatronen
 */

/**
 * Leidt gelegenheidsstructuren af uit vulnerability types van een branche
 */
function deriveOpportunityFactors(branch) {
  const factors = [];
  const vulns = branch.vulnerabilityTypes || [];

  if (vulns.includes(VULNERABILITY_TYPES.CASH_INTENSIVE)) {
    factors.push(OPPORTUNITY_FACTORS.CASH_FLOW_OPACITY);
  }
  if (vulns.includes(VULNERABILITY_TYPES.LOW_BARRIER)) {
    factors.push(OPPORTUNITY_FACTORS.LOW_ENTRY_BARRIER);
  }
  if (vulns.includes(VULNERABILITY_TYPES.FRONT_BUSINESS)) {
    factors.push(OPPORTUNITY_FACTORS.WEAK_ADMINISTRATION);
  }
  if (vulns.includes(VULNERABILITY_TYPES.MONEY_LAUNDERING)) {
    factors.push(OPPORTUNITY_FACTORS.FLEXIBLE_PRICING);
  }
  if (vulns.includes(VULNERABILITY_TYPES.FENCING)) {
    factors.push(OPPORTUNITY_FACTORS.HIGH_VALUE_GOODS);
  }
  if (vulns.includes(VULNERABILITY_TYPES.OPAQUE_REVENUE)) {
    factors.push(OPPORTUNITY_FACTORS.ANONYMOUS_CUSTOMERS);
  }
  if (vulns.includes(VULNERABILITY_TYPES.LABOR_EXPLOITATION)) {
    factors.push(OPPORTUNITY_FACTORS.LABOR_DEPENDENCY);
  }
  if (vulns.includes(VULNERABILITY_TYPES.HUMAN_TRAFFICKING)) {
    factors.push(OPPORTUNITY_FACTORS.CLOSED_COMMUNITY);
    factors.push(OPPORTUNITY_FACTORS.TRUST_EXPLOITATION);
  }
  if (vulns.includes(VULNERABILITY_TYPES.DRUG_TRADE)) {
    factors.push(OPPORTUNITY_FACTORS.EXTENDED_HOURS);
    factors.push(OPPORTUNITY_FACTORS.ANONYMOUS_CUSTOMERS);
  }
  if (vulns.includes(VULNERABILITY_TYPES.TAX_FRAUD)) {
    factors.push(OPPORTUNITY_FACTORS.WEAK_ADMINISTRATION);
  }
  if (vulns.includes(VULNERABILITY_TYPES.ILLEGAL_GAMBLING)) {
    factors.push(OPPORTUNITY_FACTORS.CASH_FLOW_OPACITY);
    factors.push(OPPORTUNITY_FACTORS.CLOSED_COMMUNITY);
  }

  // Dedupliceer
  return [...new Set(factors)];
}

/**
 * Berekent de opportunity score op basis van afgeleide factoren en kwetsbaarheidsprofiel
 */
function calculateOpportunityScore(branch) {
  const factors = deriveOpportunityFactors(branch);
  const factorWeight = Math.min(factors.length / 6, 1) * 10; // max 6 factoren = max score
  const vulnContribution = branch.vulnerabilityScore * 0.25;
  const monoContribution = branch.monocultureRisk ? 1.5 : 0;

  const raw = (factorWeight * 0.6) + vulnContribution + monoContribution;
  return Math.max(1, Math.min(10, Math.round(raw * 10) / 10));
}

/**
 * Leidt relevante barrièremodelfasen af voor een branche
 */
function deriveBarrierPhases(branch) {
  const phases = [];
  const vulns = branch.vulnerabilityTypes || [];

  // Voorbereiding is altijd relevant bij kwetsbare branches
  if (branch.vulnerabilityScore >= 5) {
    phases.push(BARRIER_MODEL_PHASES.PREPARATION.code);
  }

  // Vestiging bij lage drempel of dekmantel
  if (vulns.includes(VULNERABILITY_TYPES.LOW_BARRIER) ||
      vulns.includes(VULNERABILITY_TYPES.FRONT_BUSINESS)) {
    phases.push(BARRIER_MODEL_PHASES.ESTABLISHMENT.code);
  }

  // Operatie bij contant/ondoorzichtig
  if (vulns.includes(VULNERABILITY_TYPES.CASH_INTENSIVE) ||
      vulns.includes(VULNERABILITY_TYPES.OPAQUE_REVENUE)) {
    phases.push(BARRIER_MODEL_PHASES.OPERATIONS.code);
  }

  // Accumulatie bij witwassen
  if (vulns.includes(VULNERABILITY_TYPES.MONEY_LAUNDERING)) {
    phases.push(BARRIER_MODEL_PHASES.ACCUMULATION.code);
    phases.push(BARRIER_MODEL_PHASES.CONCEALMENT.code);
    phases.push(BARRIER_MODEL_PHASES.INTEGRATION.code);
  }

  return phases;
}

/**
 * Berekent omgevingsgevoeligheid op basis van branchekenmerken
 * Hoge score = branche is zeer gevoelig voor omgevingsfactoren (CCV)
 */
function calculateEnvironmentalSensitivity(branch) {
  let score = 3; // baseline
  const tags = branch.qualityTags || [];
  const vulns = branch.vulnerabilityTypes || [];

  // Passantenafhankelijke branches zijn gevoeliger voor omgeving
  if (tags.includes(QUALITY_TAGS.FOOT_TRAFFIC)) score += 1;
  if (tags.includes(QUALITY_TAGS.TOURISM)) score += 1;
  if (tags.includes(QUALITY_TAGS.NIGHTLIFE)) score += 2;

  // Kwetsbare branches profiteren van slechte omgeving
  if (vulns.includes(VULNERABILITY_TYPES.DRUG_TRADE)) score += 2;
  if (vulns.includes(VULNERABILITY_TYPES.FRONT_BUSINESS)) score += 1;
  if (vulns.includes(VULNERABILITY_TYPES.HUMAN_TRAFFICKING)) score += 2;

  // Ankerfuncties zijn minder omgevingsgevoelig
  if (tags.includes(QUALITY_TAGS.ANCHOR)) score -= 1;

  return Math.max(1, Math.min(10, score));
}

/**
 * Helper functies voor het werken met de branchekwalificatietabel
 */

/**
 * Geeft een platte lijst van alle branches terug, verrijkt met afgeleide
 * gelegenheidsstructuren (JenV) en omgevingsgevoeligheid (CCV)
 */
function getAllBranches() {
  const branches = [];
  for (const group of BRANCH_GROUPS) {
    for (const branch of group.branches) {
      const enriched = {
        ...branch,
        groupCode: group.code,
        groupName: group.name,
        opportunityFactors: deriveOpportunityFactors(branch),
        opportunityScore: calculateOpportunityScore(branch),
        barrierModelPhases: deriveBarrierPhases(branch),
        environmentalSensitivity: calculateEnvironmentalSensitivity(branch)
      };
      branches.push(enriched);
    }
  }
  return branches;
}

/**
 * Zoekt een branche op code
 */
function findBranchByCode(code) {
  for (const group of BRANCH_GROUPS) {
    const branch = group.branches.find(b => b.code === code);
    if (branch) {
      return { ...branch, groupCode: group.code, groupName: group.name };
    }
  }
  return null;
}

/**
 * Zoekt branches op naam (case-insensitive, partial match)
 */
function searchBranches(query) {
  const q = query.toLowerCase();
  return getAllBranches().filter(b =>
    b.name.toLowerCase().includes(q) ||
    b.groupName.toLowerCase().includes(q)
  );
}

/**
 * Geeft alle branches met kwetsbaarheid >= drempel
 */
function getVulnerableBranches(threshold = 6) {
  return getAllBranches().filter(b => b.vulnerabilityScore >= threshold);
}

/**
 * Geeft alle branches met monocultuurrisico
 */
function getMonocultureRiskBranches() {
  return getAllBranches().filter(b => b.monocultureRisk);
}

/**
 * Berekent monocultuurindex voor een set branches in een PC6-gebied
 * Hoge index = meer monocultuur = minder diversiteit
 * Gebaseerd op Shannon Diversity Index (omgekeerd)
 */
function calculateMonocultureIndex(branchCodes) {
  if (!branchCodes || branchCodes.length === 0) return 0;

  const allBranches = getAllBranches();
  const categories = {};

  for (const code of branchCodes) {
    const branch = allBranches.find(b => b.code === code);
    if (branch) {
      const cat = branch.monocultureCategory;
      categories[cat] = (categories[cat] || 0) + 1;
    }
  }

  const total = branchCodes.length;
  const categoryCount = Object.keys(categories).length;

  if (categoryCount <= 1) return 10; // Maximale monocultuur

  // Shannon Diversity Index
  let shannonIndex = 0;
  for (const count of Object.values(categories)) {
    const proportion = count / total;
    if (proportion > 0) {
      shannonIndex -= proportion * Math.log(proportion);
    }
  }

  // Normaliseer naar 1-10 schaal (omgekeerd: hoge diversiteit = lage monocultuur)
  const maxShannon = Math.log(categoryCount);
  const normalizedDiversity = maxShannon > 0 ? shannonIndex / maxShannon : 0;

  // Omdraaien: 10 = maximale monocultuur, 1 = maximale diversiteit
  return Math.round((1 - normalizedDiversity) * 9 + 1);
}

/**
 * Detecteert monocultuurclusters in een PC6-gebied
 * Retourneert array van categorieën die te sterk vertegenwoordigd zijn
 */
function detectMonocultureClusters(branchCodes, threshold = 3) {
  const allBranches = getAllBranches();
  const riskCategories = {};

  for (const code of branchCodes) {
    const branch = allBranches.find(b => b.code === code);
    if (branch && branch.monocultureRisk) {
      const cat = branch.monocultureCategory;
      riskCategories[cat] = (riskCategories[cat] || 0) + 1;
    }
  }

  return Object.entries(riskCategories)
    .filter(([, count]) => count >= threshold)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Berekent de gemiddelde kwaliteits- en kwetsbaarheidsscore voor een PC6-gebied
 */
function calculateAreaScores(branchCodes) {
  const branches = branchCodes
    .map(code => findBranchByCode(code))
    .filter(Boolean);

  if (branches.length === 0) {
    return { qualityScore: 0, vulnerabilityScore: 0, count: 0 };
  }

  const totalQuality = branches.reduce((sum, b) => sum + b.qualityScore, 0);
  const totalVulnerability = branches.reduce((sum, b) => sum + b.vulnerabilityScore, 0);

  return {
    qualityScore: Math.round((totalQuality / branches.length) * 10) / 10,
    vulnerabilityScore: Math.round((totalVulnerability / branches.length) * 10) / 10,
    count: branches.length
  };
}

/**
 * Berekent het gelegenheidsstructuurprofiel voor een PC6-gebied (JenV)
 * Aggregeert alle gelegenheidsstructuren van de aanwezige branches
 * en detecteert concentraties van criminogene factoren
 */
function calculateAreaOpportunityProfile(branchCodes) {
  const allBranches = getAllBranches();
  const factorCounts = {};
  let totalOpportunityScore = 0;
  let count = 0;

  for (const code of branchCodes) {
    const branch = allBranches.find(b => b.code === code);
    if (branch) {
      totalOpportunityScore += branch.opportunityScore;
      count++;
      for (const factor of branch.opportunityFactors) {
        factorCounts[factor] = (factorCounts[factor] || 0) + 1;
      }
    }
  }

  // Sorteer factoren op frequentie
  const dominantFactors = Object.entries(factorCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([factor, frequency]) => ({ factor, frequency }));

  // Bereken concentratiescore: hoger = meer geconcentreerde gelegenheidsstructuren
  const uniqueFactors = Object.keys(factorCounts).length;
  const totalFactors = Object.values(factorCounts).reduce((s, v) => s + v, 0);
  const concentrationIndex = uniqueFactors > 0
    ? Math.round((totalFactors / uniqueFactors) * 10) / 10
    : 0;

  return {
    averageOpportunityScore: count > 0
      ? Math.round((totalOpportunityScore / count) * 10) / 10
      : 0,
    dominantFactors: dominantFactors.slice(0, 5),
    concentrationIndex,
    totalFactorInstances: totalFactors,
    uniqueFactorCount: uniqueFactors
  };
}

/**
 * Berekent omgevingsrisicoscore voor een PC6-gebied (CCV)
 *
 * Combineert de omgevingsgevoeligheid van aanwezige branches met
 * structurele gebiedskenmerken. Hogere score = hoger omgevingsrisico.
 *
 * @param {string[]} branchCodes - Branchecodes in het gebied
 * @param {Object} areaContext - Optionele gebiedskenmerken
 * @param {number} areaContext.leegstandsPercentage - Percentage leegstand (0-100)
 * @param {boolean} areaContext.avondeconomie - Heeft het gebied een avondeconomie
 * @param {boolean} areaContext.nabijheidSnelweg - Is er een snelweg in de buurt
 * @param {boolean} areaContext.nabijheidGrens - Is er een landsgrens in de buurt
 * @param {boolean} areaContext.vervoersknooppunt - Is er een OV-knooppunt
 * @param {number} areaContext.woonfunctieAandeel - Percentage woonfunctie (0-100)
 */
function calculateEnvironmentalRisk(branchCodes, areaContext = {}) {
  const allBranches = getAllBranches();
  let totalSensitivity = 0;
  let count = 0;
  const riskFactors = [];

  for (const code of branchCodes) {
    const branch = allBranches.find(b => b.code === code);
    if (branch) {
      totalSensitivity += branch.environmentalSensitivity;
      count++;
    }
  }

  const avgSensitivity = count > 0 ? totalSensitivity / count : 5;
  let riskScore = avgSensitivity;

  // Gebiedscontext meewegen
  if (areaContext.leegstandsPercentage > 15) {
    riskScore += 1.5;
    riskFactors.push(ENVIRONMENTAL_RISK_FACTORS.VACANCY_CLUSTER);
  } else if (areaContext.leegstandsPercentage > 8) {
    riskScore += 0.5;
  }

  if (areaContext.woonfunctieAandeel !== undefined && areaContext.woonfunctieAandeel < 20) {
    riskScore += 1;
    riskFactors.push(ENVIRONMENTAL_RISK_FACTORS.NO_RESIDENTIAL);
    riskFactors.push(ENVIRONMENTAL_RISK_FACTORS.LOW_SOCIAL_CONTROL);
  }

  if (areaContext.avondeconomie) {
    riskScore += 0.5;
    riskFactors.push(ENVIRONMENTAL_RISK_FACTORS.LOW_VISIBILITY);
  }

  if (areaContext.nabijheidSnelweg) {
    riskScore += 0.5;
    riskFactors.push(ENVIRONMENTAL_RISK_FACTORS.ESCAPE_ROUTES);
  }

  if (areaContext.nabijheidGrens) {
    riskScore += 0.5;
    riskFactors.push(ENVIRONMENTAL_RISK_FACTORS.ESCAPE_ROUTES);
  }

  if (areaContext.vervoersknooppunt) {
    riskScore += 0.3;
    riskFactors.push(ENVIRONMENTAL_RISK_FACTORS.TRANSIT_HUB);
    riskFactors.push(ENVIRONMENTAL_RISK_FACTORS.TRANSIENT_POPULATION);
  }

  // Branche-mix evaluatie
  const vulnBranches = branchCodes
    .map(c => allBranches.find(b => b.code === c))
    .filter(b => b && b.vulnerabilityScore >= 6);

  if (vulnBranches.length > 0) {
    const vulnRatio = vulnBranches.length / Math.max(count, 1);
    if (vulnRatio > 0.5) {
      riskScore += 1;
      riskFactors.push(ENVIRONMENTAL_RISK_FACTORS.POOR_MIX);
    }
  }

  return {
    riskScore: Math.max(1, Math.min(10, Math.round(riskScore * 10) / 10)),
    riskFactors: [...new Set(riskFactors)],
    averageSensitivity: Math.round(avgSensitivity * 10) / 10,
    vulnerableBranchRatio: count > 0
      ? Math.round((vulnBranches.length / count) * 100)
      : 0
  };
}

/**
 * Genereert een integraal barrièremodel-profiel voor een PC6-gebied (CCV)
 * Identificeert in welke fasen van het criminele proces het gebied kwetsbaar is
 */
function generateBarrierProfile(branchCodes) {
  const allBranches = getAllBranches();
  const phaseCounts = {};

  for (const code of branchCodes) {
    const branch = allBranches.find(b => b.code === code);
    if (branch) {
      const phases = deriveBarrierPhases(branch);
      for (const phase of phases) {
        phaseCounts[phase] = (phaseCounts[phase] || 0) + 1;
      }
    }
  }

  // Koppel aan volledige fase-informatie
  const phaseProfiles = Object.entries(phaseCounts)
    .map(([phaseCode, count]) => {
      const phaseInfo = Object.values(BARRIER_MODEL_PHASES)
        .find(p => p.code === phaseCode);
      return phaseInfo ? { ...phaseInfo, branchCount: count } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.branchCount - a.branchCount);

  return {
    activePhases: phaseProfiles,
    totalPhaseExposure: Object.values(phaseCounts).reduce((s, v) => s + v, 0),
    mostVulnerablePhase: phaseProfiles.length > 0 ? phaseProfiles[0] : null
  };
}

/**
 * Geeft alle branches gefilterd op meerdere criteria
 * @param {Object} filters - Filterobject
 * @param {string} filters.groupCode - Hoofdbranchecode (bijv. '11', '22')
 * @param {string} filters.branchCode - Specifieke branchecode
 * @param {string} filters.searchQuery - Zoektekst (naam of groepsnaam)
 * @param {number} filters.minQuality - Minimale kwaliteitsscore
 * @param {number} filters.maxQuality - Maximale kwaliteitsscore
 * @param {number} filters.minVulnerability - Minimale kwetsbaarheidsscore
 * @param {number} filters.maxVulnerability - Maximale kwetsbaarheidsscore
 * @param {string[]} filters.qualityTags - Vereiste quality tags (OR-logica)
 * @param {string[]} filters.vulnerabilityTypes - Vereiste vulnerability types (OR-logica)
 * @param {boolean} filters.monocultureRiskOnly - Alleen branches met monocultuurrisico
 * @param {string[]} filters.opportunityFactors - Vereiste opportunity factors (OR-logica)
 * @param {string[]} filters.actionTypes - Vereiste action types (OR-logica)
 */
function getFilteredBranches(filters = {}) {
  let branches = getAllBranches();

  if (filters.groupCode) {
    branches = branches.filter(b => b.groupCode === filters.groupCode);
  }

  if (filters.branchCode) {
    branches = branches.filter(b => b.code === filters.branchCode);
  }

  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    branches = branches.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.groupName.toLowerCase().includes(q) ||
      b.code.includes(q)
    );
  }

  if (filters.minQuality !== undefined) {
    branches = branches.filter(b => b.qualityScore >= filters.minQuality);
  }

  if (filters.maxQuality !== undefined) {
    branches = branches.filter(b => b.qualityScore <= filters.maxQuality);
  }

  if (filters.minVulnerability !== undefined) {
    branches = branches.filter(b => b.vulnerabilityScore >= filters.minVulnerability);
  }

  if (filters.maxVulnerability !== undefined) {
    branches = branches.filter(b => b.vulnerabilityScore <= filters.maxVulnerability);
  }

  if (filters.qualityTags && filters.qualityTags.length > 0) {
    branches = branches.filter(b =>
      filters.qualityTags.some(tag => b.qualityTags.includes(tag))
    );
  }

  if (filters.vulnerabilityTypes && filters.vulnerabilityTypes.length > 0) {
    branches = branches.filter(b =>
      filters.vulnerabilityTypes.some(type => b.vulnerabilityTypes.includes(type))
    );
  }

  if (filters.monocultureRiskOnly) {
    branches = branches.filter(b => b.monocultureRisk);
  }

  if (filters.opportunityFactors && filters.opportunityFactors.length > 0) {
    branches = branches.filter(b =>
      filters.opportunityFactors.some(f => b.opportunityFactors.includes(f))
    );
  }

  if (filters.actionTypes && filters.actionTypes.length > 0) {
    branches = branches.filter(b =>
      filters.actionTypes.some(t => b.actionTypes.includes(t))
    );
  }

  return branches;
}

// Export voor gebruik in zowel browser als Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    QUALITY_TAGS,
    VULNERABILITY_TYPES,
    ACTION_TYPES,
    OPPORTUNITY_FACTORS,
    ENVIRONMENTAL_RISK_FACTORS,
    BARRIER_MODEL_PHASES,
    SHOPPING_AREA_TYPES,
    BRANCH_GROUPS,
    getAllBranches,
    findBranchByCode,
    searchBranches,
    getVulnerableBranches,
    getMonocultureRiskBranches,
    getFilteredBranches,
    calculateMonocultureIndex,
    detectMonocultureClusters,
    calculateAreaScores,
    calculateAreaOpportunityProfile,
    calculateEnvironmentalRisk,
    generateBarrierProfile,
    deriveOpportunityFactors,
    calculateOpportunityScore,
    deriveBarrierPhases,
    calculateEnvironmentalSensitivity
  };
}

// Browser global
if (typeof window !== 'undefined') {
  window.BranchQualifications = {
    QUALITY_TAGS,
    VULNERABILITY_TYPES,
    ACTION_TYPES,
    OPPORTUNITY_FACTORS,
    ENVIRONMENTAL_RISK_FACTORS,
    BARRIER_MODEL_PHASES,
    SHOPPING_AREA_TYPES,
    BRANCH_GROUPS,
    getAllBranches,
    findBranchByCode,
    searchBranches,
    getVulnerableBranches,
    getMonocultureRiskBranches,
    getFilteredBranches,
    calculateMonocultureIndex,
    detectMonocultureClusters,
    calculateAreaScores,
    calculateAreaOpportunityProfile,
    calculateEnvironmentalRisk,
    generateBarrierProfile,
    deriveOpportunityFactors,
    calculateOpportunityScore,
    deriveBarrierPhases,
    calculateEnvironmentalSensitivity
  };
}
