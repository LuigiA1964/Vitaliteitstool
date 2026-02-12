'use strict';

/**
 * Stakeholder-Actoren module voor City Deal Vitaliteitstool
 * Gebaseerd op stakeholder-analyse voor gebiedsontwikkeling binnenstad
 *
 * Alle 24 stakeholder-types die betrokken zijn bij gebiedsontwikkeling in Nederlandse binnensteden.
 * Dit module ondersteunt multi-stakeholder-gespreksvoering en conflictanalyse.
 *
 * Bronnen:
 * - City Deal Dynamische Binnensteden (Ministerie BZK)
 * - Platform31 stakeholder-perspectievkaarten
 * - RIEC-LIEC wijkmonitor en gebieds-rapportages
 * - Goudappel Groep Vitaliteitsbenchmark
 * - Ondernemersnetwerk-interviews en -onderzoeken
 *
 * Elk actor-type is gemodelleerd met:
 * 1. Identificatie (id, naam, categorie)
 * 2. Perspectief (wat ze waarderen, belangen)
 * 3. Vooroordelen (blinde vlekken, aannames)
 * 4. Kwalificaties (expertise, middelen, mandaat)
 * 5. Risicogebied (hoe zij het proces kunnen blokkeren)
 * 6. Gesprekshandleiding (communicatie, framing)
 * 7. Collaboratie-matrix (bondgenoten, tegenstanders)
 */

// ==========================================
// CONSTANTEN - CATEGORIEËN EN TAGS
// ==========================================

const ACTOR_CATEGORIES = {
  ONDERNEMERS: 'ondernemers',
  VASTGOED: 'vastgoed',
  BEWONERS: 'bewoners',
  BEZOEKERS: 'bezoekers',
  OVERHEID: 'overheid',
  HANDHAVING_VEILIGHEID: 'handhaving_veiligheid',
  MAATSCHAPPELIJK: 'maatschappelijk'
};

const PERSPECTIVE_THEMES = {
  OMZET: 'omzet',
  LEEFBAARHEID: 'leefbaarheid',
  RENDEMENT: 'rendement',
  VEILIGHEID: 'veiligheid',
  BEREIKBAARHEID: 'bereikbaarheid',
  BELEVING: 'beleving',
  WERKGELEGENHEID: 'werkgelegenheid',
  PARTICIPATIE: 'participatie',
  IDENTITEIT: 'identiteit',
  VASTGOEDWAARDE: 'vastgoedwaarde',
  SFEER: 'sfeer',
  DIVERSITEIT: 'diversiteit'
};

const COMMUNICATION_CHANNELS = {
  DIRECT_MEETING: 'direct_gesprek',
  WRITTEN: 'schriftelijk',
  GROUP_SESSION: 'groepssessie',
  WORKSHOP: 'workshop',
  DATA_DASHBOARD: 'data_dashboard',
  SURVEY: 'enquête',
  TOWN_HALL: 'publieke_bijeenkomst',
  INFORMAL: 'informeel_overleg'
};

const COLLABORATION_RELATIONSHIP = {
  ALLY: 'bondgenoot',
  NEUTRAL: 'neutraal',
  OPPONENT: 'tegenstander',
  CONDITIONAL: 'voorwaardelijk_partner'
};

// ==========================================
// ACTOR DATA DEFINITIE
// ==========================================

const ACTORS = [
  // ===== ONDERNEMERS (7 actors) =====
  {
    id: 'WINKELIER',
    name: 'Winkelier / Detailhandelaar',
    category: ACTOR_CATEGORIES.ONDERNEMERS,
    subcategory: 'retail',
    order: 1,
    perspective: {
      primary: 'omzet, passantenstroom, bereikbaarheid, parkeren',
      themes: [
        PERSPECTIVE_THEMES.OMZET,
        PERSPECTIVE_THEMES.BEREIKBAARHEID,
        PERSPECTIVE_THEMES.IDENTITEIT
      ],
      description: 'Winkelier richt zich op dagelijkse bezoekersaantallen, gemiddelde bestedingswaarde per klant, en het aantrekkelijk houden van hun eigen winkelstraat. Parkeergelegenheid en voetgangersstroom zijn essentieel.'
    },
    perspectives: [
      'Omzetgeneratoring via passantenstroom',
      'Bereikbaarheid voor klanten',
      'Imago en uitstraling van de winkelstraat',
      'Parkeeroplossingen dicht bij winkel',
      'Bestrijding leegstand in direct omgeving'
    ],
    biases: [
      'Meer parkeerplaatsen automatis meer klanten (niet per se waar)',
      'Terrassen blokkeren doorloop (maar genereren ook dwell time)',
      'Leegstand is altijd slecht (kan ook ruimte voor transformatie zijn)',
      'Online retail is onze directe vijand (niet: complementair)',
      'De gemeente doet niets voor ondernemers (selectieve perceptie)'
    ],
    qualifications: [
      'Dagelijkse observatie van klantgedrag en winkelstraat-dynamiek',
      'Directe feedback op wat werkt en wat niet',
      'Straatbeeld en uitstallingenverantwoordelijkheid',
      'Buurtnetwerk en informele communicatiekanalen',
      'Signaalfunctie voor problemen (overlast, leegstand, veiligheid)'
    ],
    riskFactors: [
      'Kan verzet voeren tegen deelproject (terras, fietsenrek) dat hun straat verandert',
      'Weigeren deel te nemen aan collectieve initiatives (marketing, evenementen)',
      'Kan gemeente-plannen uit machtsbelang blokkeren',
      'Publieke kritiek op veranderingen waarvan impact onduidelijk is',
      'Dalen aantallen klanten kunnen worden geattribueerd aan gemeente-activiteiten'
    ],
    communicationGuide: {
      approach: 'Gegevensgestuurde communicatie over passantenstroom en omzet',
      language: 'Spreek in termen van omzetperspectief, klantwaarde, en directe voordelen',
      channels: [
        COMMUNICATION_CHANNELS.DIRECT_MEETING,
        COMMUNICATION_CHANNELS.DATA_DASHBOARD,
        COMMUNICATION_CHANNELS.WORKSHOP
      ],
      whatToAvoid: [
        'Beleidsjargon en abstracte doelen',
        'Aankondigingen zonder inzicht in impact',
        'Het negeren van hun dagelijkse expertise',
        'Te lange betrokkenheidsperioden zonder zichtbare vooruitgang'
      ],
      keyMessages: [
        'Dit plan verhoogt passantenstroom naar uw straat',
        'Deze verandering is getest met andere winkeliers elders',
        'U bent partner in het proces, niet slachtoffer van verandering',
        'Dit zorgt voor meer zitklantenvoet en dwell time'
      ],
      recommendedFraming: 'Presenteer transformatie als GROEI in klantbereik en omzetpotentieel, niet als verandering. Laat data zien van vergelijkbare straten. Betrek ze actief VOORDAT plannen vastliggen.'
    },
    collaborationMatrix: {
      allies: [
        'HORECA_ONDERNEMER',
        'DIENSTVERLENER',
        'WINKELIERSVERENIGING',
        'CENTRUMMANAGER'
      ],
      opponents: [
        'BEWONER_BINNENSTAD'
      ],
      conditional: [
        'AMBTENAAR_ECONOMIE',
        'PROJECTONTWIKKELAAR'
      ],
      tensions: [
        'Winkeliers willen bereikbaarheid (parkeren, auto), bewoners willen rustiger straat (minder auto)',
        'Winkeliers willen veel voetgangers (terrassen buiten), bewoners willen geen overlast (lawaai, veiligheid)',
        'Winkeliers willen stabiliteit, projectontwikkelaars willen transformatie'
      ]
    }
  },
  {
    id: 'HORECA_ONDERNEMER',
    name: 'Horeca-ondernemer / Café-eigenaar',
    category: ACTOR_CATEGORIES.ONDERNEMERS,
    subcategory: 'hospitality',
    order: 2,
    perspective: {
      primary: 'terrasruimte, openingstijden, regelgeving, sfeer, nachteconomie',
      themes: [
        PERSPECTIVE_THEMES.OMZET,
        PERSPECTIVE_THEMES.SFEER,
        PERSPECTIVE_THEMES.BELEVING
      ],
      description: 'Horecaondernemer richt zich op sfeeromgeving, terraspotentieel, regelgeving die hun bedrijfsvoering beperkt, en mogelijke evenementen die bezoekers trekken. Zij zijn sfeermakers van de binnenstad.'
    },
    perspectives: [
      'Terrasruimte en openingstijden',
      'Regelgeving rond exploitatie en geluid',
      'Evenementen die bezoekers genereren',
      'Sfeer en ambiance van hun zaak en omgeving',
      'Nachtleven-economie (avond- en weekendklandizie)'
    ],
    biases: [
      'Meer evenementen = automatisch meer omzet (niet altijd; kan ook overlast veroorzaken)',
      'Bewoners klagen altijd (maar sommige bezwaren zijn legitiem)',
      'Regelgeving is altijd te streng (maar dient ook publieke belangen)',
      'De binnenstad is vooral van ons (het is van iedereen)',
      'Terrassen genereren altijd meer omzet (hangt af van timing en type)'
    ],
    qualifications: [
      'Sfeermakers en trekkers van bezoekers',
      'Kennis van avond- en nachteconomie',
      'Ervaring met evenementenorganisatie en -sponsoring',
      'Sociale hub en ontmoetingsplek',
      'Dagelijkse zichtbaarheid en aanspreekbaarheid'
    ],
    riskFactors: [
      'Kan zich tegenstellend opzetten tegen regelgeving rondom terras/geluid/openingstijden',
      'Kan andere horeca-bedrijven mobiliseren tegen gemeente',
      'Publieke klachten over overlast kunnen campagne tegen transformatieplan triggeren',
      'Kunnen druk uitoefenen via hun klantenkring en evenementen-netwerk',
      'Evenementen kunnen gebruikt worden als drukmiddel (wel/niet meewerken)'
    ],
    communicationGuide: {
      approach: 'Betrek ze vroeg bij ruimte- en regelgevingsbesluiten. Erken hun bijdrage aan levendigheid.',
      language: 'Spreek in termen van sfeer, ambiance, bezoekersaantallen, en duurzame bedrijfsvoering',
      channels: [
        COMMUNICATION_CHANNELS.DIRECT_MEETING,
        COMMUNICATION_CHANNELS.WORKSHOP,
        COMMUNICATION_CHANNELS.INFORMAL
      ],
      whatToAvoid: [
        'Aannames over overlast-klachten',
        'Oneenzijdige regelgeving zonder overleg',
        'Negeren van evenementenkennis en netwerk',
        'Behandelen als probleem in plaats van partner'
      ],
      keyMessages: [
        'Een levendige binnenstad maakt uw zaak succesvoller',
        'Wij zoeken compromissen over openingstijden en geluid, niet verboden',
        'Uw evenementenervaring is cruciaal voor gebiedsplan',
        'Terrassen kunnen groeien als deel van ruimtelijk plan'
      ],
      recommendedFraming: 'Positioneer transformatie als LEVENDIGHEIDS-KANS. Erken dat sfeer en ambiance hun kernelementen zijn. Help ze zien hoe het plan HUN bedrijf sterker maakt.'
    },
    collaborationMatrix: {
      allies: [
        'WINKELIER',
        'AMBACHTELIJK_ONDERNEMER',
        'BEWONER_BINNENSTAD',
        'CENTRUMMANAGER'
      ],
      opponents: [
        'BEWONER_BINNENSTAD',
        'WETHOUDER_VEILIGHEID'
      ],
      conditional: [
        'POLITIE',
        'AMBTENAAR_ECONOMIE',
        'AMBTENAAR_RUIMTE'
      ],
      tensions: [
        'Horeca wil open tot laat, bewoners willen rust',
        'Horeca wil terrassen, voetgangers willen doorloopruimte',
        'Horeca ziet evenementen als groeikans, sommige bewoners als overlast'
      ]
    }
  },
  {
    id: 'DIENSTVERLENER',
    name: 'Dienstverlener / Kantoor & Praktijk',
    category: ACTOR_CATEGORIES.ONDERNEMERS,
    subcategory: 'services',
    order: 3,
    perspective: {
      primary: 'bereikbaarheid, parkeergelegenheid, representatieve omgeving, digitale infrastructuur',
      themes: [
        PERSPECTIVE_THEMES.BEREIKBAARHEID,
        PERSPECTIVE_THEMES.IDENTITEIT,
        PERSPECTIVE_THEMES.WERKGELEGENHEID
      ],
      description: 'Dienstverlener (advocaat, accountant, medisch, ICT) richt zich op professionele uitstraling, klanten- en werknemersbereikbaarheid, en digitale mogelijkheden. Ze zijn stabiele, langdurige huurders.'
    },
    perspectives: [
      'Bereikbaarheid voor klanten en bezoekers',
      'Parkeergelegenheid (patiënten, cliënten)',
      'Representatief pand en professionele uitstraling',
      'Digitale infrastructuur en snelheid',
      'Stabiliteit en duurzame huurrelatie'
    ],
    biases: [
      'De binnenstad is vooral een werklocatie (maar het is ook een belevings- en woongegied)',
      'Retail is aan het uitsterven (maar kan diversiteit creëren in transformatie)',
      'Wij hebben geen overlast (maar genereren wel parkeerdruk en verkeer)',
      'Transformatie raakt ons niet (maar kan prijzen/bereikbaarheid veranderen)',
      'Het centrum is alleen voor kantoor relevant (tunnel-visiebias)'
    ],
    qualifications: [
      'Stabiliteit en financiële draagkracht',
      'Werkgelegenheid in binnenstad',
      'Dagbezoek genereren voor andere functies',
      'Professioneel netwerk en zakelijke contacten',
      'Langetermijn commitment aan gebiedsontwikkeling'
    ],
    riskFactors: [
      'Kunnen verzet voeren tegen parkeerbeperkingen',
      'Kunnen zich terugtrekken uit binnenstad als bereikbaarheid verslechtert',
      'Onderbelicht in stakeholder-processen (omdat ze "onzichtbaarder" zijn dan winkeliers)',
      'Kunnen uit gebiedsproces stappen als transformatie hun bedrijf bedreigt',
      'Informatie komt indirect - niet altijd goed bereikt in consultatie'
    ],
    communicationGuide: {
      approach: 'Betrek ze via hun beroepsverenigingen en zakelijke netwerken. Zorg voor duidelijkheid over bereikbaarheid.',
      language: 'Spreek in termen van bedrijfszekerheid, klantenbereikbaarheid, en professionele omgeving',
      channels: [
        COMMUNICATION_CHANNELS.DIRECT_MEETING,
        COMMUNICATION_CHANNELS.WRITTEN,
        COMMUNICATION_CHANNELS.DATA_DASHBOARD
      ],
      whatToAvoid: [
        'Alleen focus op retail en horeca (vergeet diensten)',
        'Vage informatie over bereikbaarheid-effecten',
        'Communicatie via retail-kanalen (ze lezen andere bronnen)',
        'Aannames dat transformatie hen niet raakt'
      ],
      keyMessages: [
        'Een vitaal centrum maakt uw bedrijf aantrekkelijker voor personeel',
        'Bereikbaarheid blijft gewaarborgd in de transformatie',
        'Zakelijke omgeving wordt sterker met mixed-use functies',
        'U bent essentieel voor dagbezoek-economie'
      ],
      recommendedFraming: 'Positioneer plan als STABILISERING VAN BINNENSTAD. Laat zien dat mixed-use sterker is dan mono-functioneel. Zorg voor duidelijke bereikbaarheid-garanties.'
    },
    collaborationMatrix: {
      allies: [
        'AMBTENAAR_ECONOMIE',
        'PROJECTONTWIKKELAAR',
        'GROTE_VASTGOEDBELEGGER'
      ],
      opponents: [],
      conditional: [
        'WINKELIER',
        'AMBTENAAR_RUIMTE'
      ],
      tensions: [
        'Dienstverleners willen parkeren, bewoners willen autoluw',
        'Dienstverleners willen kantoren, plannen willen woningmix',
        'Dienstverleners willen duidelijkheid, transformatie brengt onzekerheid'
      ]
    }
  },
  {
    id: 'AMBACHTELIJK_ONDERNEMER',
    name: 'Ambachtelijk ondernemer / Creatief MKB',
    category: ACTOR_CATEGORIES.ONDERNEMERS,
    subcategory: 'craft_creative',
    order: 4,
    perspective: {
      primary: 'authentieke uitstraling, onderscheidend aanbod, toerisme, lokale identiteit, community',
      themes: [
        PERSPECTIVE_THEMES.IDENTITEIT,
        PERSPECTIVE_THEMES.BELEVING,
        PERSPECTIVE_THEMES.DIVERSITEIT,
        PERSPECTIVE_THEMES.OMZET
      ],
      description: 'Ambachtelijk ondernemer (brouwerij, bakkerij, kunstenaar, designstudio) richt zich op authentieke uitstraling, onderscheidend aanbod, toeristische trekking, en lokale identiteit. Ze zijn identiteitsdragers van het gebied.'
    },
    perspectives: [
      'Authentieke en onderscheidende uitstraling van het gebied',
      'Lokale identiteit en erfgoed',
      'Toeristische aantrekkingskracht',
      'Community en sociale verbinding',
      'Mogelijkheid tot groei zonder massa'
    ],
    biases: [
      'Ketens zijn onze vijanden (maar kunnen ook complementair zijn)',
      'De gemeente moet ons beschermen (maar moet vooral faciliteren)',
      'Groei is niet altijd beter (waar, maar stagnatie ook risico)',
      'Authenticiteit is onweerstaanbaar (niet zonder good storytelling)',
      'Massificering vernietigt onze essence (soms waar, soms voordelig)'
    ],
    qualifications: [
      'Uniek aanbod en onderscheidende factor voor gebied',
      'Identiteitsdragers en erfgoedkenners',
      'Toeristische trekkers en attractie-generatoren',
      'Authenticiteitsbewakers',
      'Community-builders en netwerk-scheppers',
      'Innovators en experimenteerders'
    ],
    riskFactors: [
      'Kunnen ideologisch verzet voeren tegen commercialisering',
      'Kunnen zich isoleren in klein netwerk (niet participeren)',
      'Kunnen onderneming beëindigen als "massa-toerisme" komt',
      'Kunnen andere ondernemers mobiliseren tegen transformatie',
      'Kunnen mediamacht gebruiken voor publieke mening-vorming'
    ],
    communicationGuide: {
      approach: 'Betrek ze als co-creators van identiteit. Erken hun rol in gebiedskarakter. Zorg dat groei niet gelijk staat aan massificering.',
      language: 'Spreek in termen van authentieke transformatie, community-building, en duurzame groei (niet exponentieel)',
      channels: [
        COMMUNICATION_CHANNELS.WORKSHOP,
        COMMUNICATION_CHANNELS.INFORMAL,
        COMMUNICATION_CHANNELS.DIRECT_MEETING
      ],
      whatToAvoid: [
        'Standardized templates en commerciële aanpak',
        'Alleen focus op economische groei',
        'Negeren van hun visie op gebiedsontwikkeling',
        'Druk zetten op groei en schaalvergroting'
      ],
      keyMessages: [
        'Dit plan versterkt de authentieke identiteit van het gebied',
        'Groei is geen massificering - wij faciliteren duurzame ontwikkeling',
        'Uw stem is cruciaal in het vormen van het gebiedskarakter',
        'Community-investering is net zo belangrijk als commerciële groei'
      ],
      recommendedFraming: 'Positioneer plan als IDENTITEITS-VERSTERKING, niet commercialisering. Betrek ze als co-creators, niet als implementeerders van gemeentelijk beleid. Help ze zien dat duurzame groei VOOR HUN VOORDEEL is.'
    },
    collaborationMatrix: {
      allies: [
        'BEWONER_BINNENSTAD',
        'WIJKRAAD_BUURTVERENIGING',
        'CENTRUMMANAGER'
      ],
      opponents: [
        'GROTE_VASTGOEDBELEGGER',
        'PROJECTONTWIKKELAAR'
      ],
      conditional: [
        'HORECA_ONDERNEMER',
        'AMBTENAAR_RUIMTE',
        'AMBTENAAR_ECONOMIE'
      ],
      tensions: [
        'Ambachtelijk wil authentieke groei, projectontwikkelaars willen schaal',
        'Ambachtelijk wil community, massatoerisme-aanpak vernietigt dat',
        'Ambachtelijk wil betrokkenheid, bureaucratie voelt als obstructie'
      ]
    }
  },

  // ===== VASTGOED (4 actors) =====
  {
    id: 'KLEINE_VASTGOEDONDERNEMER',
    name: 'Kleine vastgoedondernemer / Huiseigenaar',
    category: ACTOR_CATEGORIES.VASTGOED,
    subcategory: 'small_owner',
    order: 5,
    perspective: {
      primary: 'rendement, waardebehoud, huurinkomsten, onderhoud, flexibiliteit',
      themes: [
        PERSPECTIVE_THEMES.RENDEMENT,
        PERSPECTIVE_THEMES.VASTGOEDWAARDE
      ],
      description: 'Kleine vastgoedondernemer (eigenaar 1-5 panden, vaak lokaal betrokken) richt zich op huurinkomsten, onderhoud, waardebehoud, en flexibiliteit in verhuring. Ze zijn gevoelig voor leegstand.'
    },
    perspectives: [
      'Rendement op vastgoed-investering',
      'Waardebehoud van hun panden',
      'Stijging waarde door gebiedsontwikkeling',
      'Huurinkomsten',
      'Flexibiliteit in huurovereenkomsten en transformatie'
    ],
    biases: [
      'Hoge huur = goed rendement (maar leegstand kost meer)',
      'Transformatie is duur en risicovol (waar, maar kan ook rendement verhogen)',
      'De markt corrigeert zichzelf (niet altijd; struikelblokkenversterkende feedback)',
      'Verduurzaming kost alleen geld (maar genereert ook opbrengsten)',
      'Leegstand is tijdelijk (kan jaren duren, specultieve bias)'
    ],
    qualifications: [
      'Lokale vastgoedkennis',
      'Snelle besluitvorming',
      'Persoonlijke betrokkenheid en netwerk',
      'Flexibiliteit in huurovereenkomsten',
      'Lange-termijn betrokkenheid bij gebiedsontwikkeling'
    ],
    riskFactors: [
      'Kunnen voorkomen agressieve huurverlaging door speculatie op betere tijden',
      'Kunnen verzet voeren tegen verplichte transformatie',
      'Kunnen panden laten verwaarlozen als rendement laag is',
      'Kunnen informeel netwerk gebruiken om plannen tegen te houden',
      'Kunnen onwilling zijn om huurders te helpen met bedrijfsmigratie'
    ],
    communicationGuide: {
      approach: 'Spreek hun taal: rendement, ROI, langetermijnwaardebehoud. Laat zien dat leegstand duurder is dan investering.',
      language: 'Rendement, waardestijging, investeringsrendement, waardebon-potentieel, bewezen track records',
      channels: [
        COMMUNICATION_CHANNELS.DIRECT_MEETING,
        COMMUNICATION_CHANNELS.DATA_DASHBOARD,
        COMMUNICATION_CHANNELS.WRITTEN
      ],
      whatToAvoid: [
        'Vage beloften over waardestijging',
        'Eisen voor transformatie zonder financiële ondersteuning',
        'Negeren van rendement-realiteit',
        'Communicatie die speculatie aanmoedigt'
      ],
      keyMessages: [
        'Dit plan verhoogt de vastgoedwaarde op langermijn',
        'Leegstand kost meer dan investering in transformatie',
        'Hier is financieel ondersteuning beschikbaar voor verduurzaming',
        'Uw rendement groeit als het gebied vitaal is'
      ],
      recommendedFraming: 'Positioneer plan als WAARDEBEHOUD EN GROEI. Laat zien dat vitaal gebied = stijgende waarden. Help ze inzien dat speculatie niet werkt; investering wel.'
    },
    collaborationMatrix: {
      allies: [
        'GROTE_VASTGOEDBELEGGER',
        'AMBTENAAR_ECONOMIE'
      ],
      opponents: [
        'PROJECTONTWIKKELAAR'
      ],
      conditional: [
        'AMBTENAAR_RUIMTE',
        'BEWONER_BINNENSTAD'
      ],
      tensions: [
        'Kleine eigenaar wil flexibiliteit, projectontwikkelaar wil schaal',
        'Kleine eigenaar wil hoge huur, transformatie vraagt lagere huur',
        'Kleine eigenaar wil behoud, grote ontwikkelaars willen radicale verandering'
      ]
    }
  },
  {
    id: 'GROTE_VASTGOEDBELEGGER',
    name: 'Grote vastgoedbelegger / Institutionele belegger',
    category: ACTOR_CATEGORIES.VASTGOED,
    subcategory: 'large_investor',
    order: 6,
    perspective: {
      primary: 'rendement, ESG-scores, langetermijnwaarde, gebiedsontwikkeling, BREEAM/EPC certificering',
      themes: [
        PERSPECTIVE_THEMES.RENDEMENT,
        PERSPECTIVE_THEMES.VASTGOEDWAARDE,
        PERSPECTIVE_THEMES.IDENTITEIT
      ],
      description: 'Grote vastgoedbelegger (pensioenfonds, REIT, grote familie-office) richt zich op rendement (IRR/yield), ESG-compliance, langetermijn-vastgoedwaarde, en gebiedsontwikkeling als strategische tool.'
    },
    perspectives: [
      'Financieel rendement (IRR, yield, cap rate)',
      'ESG-compliancebeoordelingen',
      'Langetermijnwaardebehoud en -groei',
      'Gebiedsontwikkeling en -betrokkenheid',
      'BREEAM/EPC-certificering en groen-ambitie'
    ],
    biases: [
      'Schaal = efficiëntie (waar, maar kan ook lokale nuance verpletteren)',
      'Lokale kennis is anecdotisch (data importante, maar context ook)',
      'Data is altijd beter dan intuïtie (data interpreteren vergt context)',
      'De markt bepaalt de waarde (markt kan ook disfunctioneel zijn)',
      'ESG is compliance, geen strategie (maar kan wel beide zijn)'
    ],
    qualifications: [
      'Financiële slagkracht',
      'Professioneel management en governance',
      'Data-gedreven analyse en benchmarking',
      'Langetermijn-visie en geduld',
      'Internationaal perspectief en netwerkeffecten',
      'ESG- en duurzaamheidsexpertise'
    ],
    riskFactors: [
      'Kunnen zich terugtrekken als rendement onder water komt',
      'Kunnen bezit gebruiken als drukmiddel (aanpassing van plannen)',
      'Kunnen ongeduldig worden als transformatie langer duurt dan verwacht',
      'Kunnen externe pressie creëren via media/analysten',
      'Kunnen rendement optimaliseren door prijsstijging (niet werkgelegenheid/kwaliteit)'
    ],
    communicationGuide: {
      approach: 'Levering van data-gedreven analyse, scenario-modellen, en heldere business-cases. Spreek hun taal: IRR, yield, cap rate, ESG-scoring.',
      language: 'IRR, yield, cap rate, WACC, scenario-analyse, ESG-rating, BREEAM, risicodiversificatie, longvold opportunities',
      channels: [
        COMMUNICATION_CHANNELS.DATA_DASHBOARD,
        COMMUNICATION_CHANNELS.WRITTEN,
        COMMUNICATION_CHANNELS.DIRECT_MEETING
      ],
      whatToAvoid: [
        'Vague toezeggingen zonder data-onderbouwing',
        'Emotionele framing over economische realiteit',
        'Lange betrokkenheidsperioden zonder ROI-perspectief',
        'Negeren van hun ESG-ambities'
      ],
      keyMessages: [
        'Dit plan genereert aantoonbare rendementsstijging (IRR/yield)',
        'ESG-compliancerisico daalt met vitale gebieden',
        'Scenario-analyse toont upside potential',
        'Uw betrokkenheid accelereert waardeontwikkeling'
      ],
      recommendedFraming: "Positioneer plan als LANGETERMIJN WAARDECREATIE MET GEMITIGEERDE RISICO'S. Lever professionele scenarioanalyse. Maak risico's inzichtelijk maar beheersbaar."
    },
    collaborationMatrix: {
      allies: [
        'PROJECTONTWIKKELAAR',
        'AANDEELHOUDER_INVESTEERDER',
        'AMBTENAAR_ECONOMIE'
      ],
      opponents: [
        'AMBACHTELIJK_ONDERNEMER'
      ],
      conditional: [
        'KLEINE_VASTGOEDONDERNEMER',
        'AMBTENAAR_RUIMTE'
      ],
      tensions: [
        'Belegger wil rendement, gemeente wil sociale doelen',
        'Belegger wil schaal, ambachtelijk ondernemer wil community',
        'Belegger wil markt-driven, gemeente wil planning-driven'
      ]
    }
  },
  {
    id: 'PROJECTONTWIKKELAAR',
    name: 'Projectontwikkelaar / Developer',
    category: ACTOR_CATEGORIES.VASTGOED,
    subcategory: 'developer',
    order: 7,
    perspective: {
      primary: 'bouwvolume, bestemmingsplan, grondprijs, marktvraag, erfpachtcondities, realisatie',
      themes: [
        PERSPECTIVE_THEMES.RENDEMENT,
        PERSPECTIVE_THEMES.VASTGOEDWAARDE,
        PERSPECTIVE_THEMES.IDENTITEIT
      ],
      description: 'Projectontwikkelaar richt zich op bouw-realisatie, bestemmingsplannen, grondprijzen, marktvraag, en erfpachtvoorwaarden. Ze zijn uitvoerders van fysieke transformatie.'
    },
    perspectives: [
      'Bouwvolume en vloeroppervlak',
      'Bestemmingsplannen en regelgeving',
      'Grondprijs en -beschikbaarheid',
      'Marktvraag en mixed-use-potentieel',
      'Erfpachtcondities en grondregimes',
      'Financieringsmogelijkheden',
      'Bouwschema en realiseringstijd'
    ],
    biases: [
      'Meer vierkante meters = meer waarde (oppervlakte vs. kwaliteit)',
      'De gemeente is te traag (waar, maar procedures dienen doelen)',
      'Mixed-use is lastig te ontwikkelen (waar, maar ook op-te-lossen)',
      'Draagvlak kost tijd en geld (waar, maar spaart uiteindelijk)',
      'Dit is mijn project, niet van de gemeente (ze hebben beiden stakes)'
    ],
    qualifications: [
      'Realisatiekracht en projectmanagement',
      'Marktkennis en trendkennis',
      'Financieringsnetwerk en kredietwaardigheid',
      'Bestemmingsplan- en regelgevingskennis',
      'Samenwerking met architecten, ingenieurs, aannemer'
    ],
    riskFactors: [
      'Kunnen zich terugtrekken uit project als bestemmingsplan niet gunstig is',
      'Kunnen druk uitoefenen via media/politieke contacten',
      'Kunnen kostendeflatie voeren op kwaliteit of maatschappelijke doelen',
      'Kunnen betrokkenheid van bewoners gebruiken als drukmiddel',
      'Kunnen project verplaatsen naar andere gemeente als financiering niet volstaat'
    ],
    communicationGuide: {
      approach: 'Zorg voor duidelijkheid over kaders en verwachtingen. Koppel kwaliteitseisen aan vergunningsmogelijkheden. Behandel ze als partners, niet tegenstanders.',
      language: 'Business case, rendement, volumeperspectief, financieringskansen, regelgeving, planning-zekerheid',
      channels: [
        COMMUNICATION_CHANNELS.DIRECT_MEETING,
        COMMUNICATION_CHANNELS.WRITTEN,
        COMMUNICATION_CHANNELS.WORKSHOP
      ],
      whatToAvoid: [
        'Voortdurend veranderende kaders',
        'Onrealistische kwaliteitseisen zonder financiële draagkracht',
        'Gebrek aan duidelijkheid over bestemmingsplan',
        'Betrokkenheid van alle stakeholders zonder duidelijke autoriteit'
      ],
      keyMessages: [
        'Dit zijn de gemeentelijke kwaliteitskaders - dit maakt het project haalbaarder',
        'Dit volume is realistisch gezien marktvraag en rendement',
        'Dit zijn de financieringsmogelijkheden van gemeentevangen',
        'Uw project voegt waarde toe aan beide partijen'
      ],
      recommendedFraming: 'Positioneer plan als GELEGENHEID, niet beperking. Laat zien dat kwaliteitskaders TOEKOMST WAARBORGEN. Maak het een aantrekkelijke business case, niet een risicovol avontuur.'
    },
    collaborationMatrix: {
      allies: [
        'GROTE_VASTGOEDBELEGGER',
        'AMBTENAAR_RUIMTE',
        'AMBTENAAR_ECONOMIE'
      ],
      opponents: [
        'BEWONER_BINNENSTAD',
        'AMBACHTELIJK_ONDERNEMER'
      ],
      conditional: [
        'KLEINE_VASTGOEDONDERNEMER',
        'WIJKRAAD_BUURTVERENIGING'
      ],
      tensions: [
        'Developer wil hoogte/volume, bewoners willen kleinschaligheid',
        'Developer wil snelheid, gemeente wil proces',
        'Developer wil maximum rendement, gemeente wil maatschappelijke doelen'
      ]
    }
  },
  {
    id: 'AANDEELHOUDER_INVESTEERDER',
    name: 'Aandeelhouder / Private equity investeerder',
    category: ACTOR_CATEGORIES.VASTGOED,
    subcategory: 'equity',
    order: 8,
    perspective: {
      primary: 'rendement, risicoprofiel, ESG-compliance, exit-strategie, governance',
      themes: [
        PERSPECTIVE_THEMES.RENDEMENT,
        PERSPECTIVE_THEMES.VASTGOEDWAARDE
      ],
      description: 'Aandeelhouder (private equity, family office, high-net-worth individual) richt zich op rendement, risico-mitigation, ESG-governance, en exit-horizon. Ze zitten vaak niet direct aan tafel.'
    },
    perspectives: [
      'Financieel rendement',
      'Risicoprofiel en -diversificatie',
      'ESG-compliance en -rapportage',
      'Exit-mogelijkheden en -horizon',
      'Governance en toezicht',
      'Langetermijn-waarde vs. korttermijn-liquiditeit'
    ],
    biases: [
      'Vastgoed is altijd goede investering (marktcyclisch)',
      'Risico = locatie (risico is ook tijd, technologie, regelgeving)',
      'ESG is kostenpost (kan ook rendement verhogen)',
      'Transparantie is voldoende (maar kan ook druk veroorzaken)',
      'Wij bepalen strategie, niet operationeel management (soms beide)'
    ],
    qualifications: [
      'Kapitaal en financiële slagkracht',
      'Risico-analyse en -management',
      'Internationaal perspectief',
      'Geduld en lange-termijn-horizon',
      'Governance en bestuurservaring',
      'ESG- en sustainability-expertise'
    ],
    riskFactors: [
      'Kunnen zich terugtrekken uit project/fonds als rendement onder druk komt',
      'Kunnen via media/governance druk uitoefenen op operationeel management',
      'Kunnen ESG-ambities gebruiken als drukmiddel',
      'Kunnen exit-timing gebruiken als drukmiddel op gemeente',
      'Kunnen governance-eisen onrealistisch stellen'
    ],
    communicationGuide: {
      approach: 'Communicatie verloopt via operationeel management of financieel adviseur. Zorg voor professionele rapportages en data-gedreven analyses.',
      language: 'Rendement, risico, ESG-rating, marktsegmentatie, performance-benchmarking, liquiditeitsrisico',
      channels: [
        COMMUNICATION_CHANNELS.WRITTEN,
        COMMUNICATION_CHANNELS.DATA_DASHBOARD
      ],
      whatToAvoid: [
        'Rechtstreekse communicatie zonder tussenkomst operator',
        'Vage informatie of onzekerheidsmomenten',
        'ESG-promise zonder traceerbare compliance'
      ],
      keyMessages: [
        'Dit plan genereert terugkerende waardecreatie',
        'Risico is gemitigeerd door structurering',
        'ESG-doelen zijn ingebouwd, niet achteraf',
        'Exit-strategie is duidelijk en realistisch'
      ],
      recommendedFraming: "Positioneer plan als PROFESSIONELE INVESTERING met gemitigeerde risico's en aantoonbare waardecreatie. Lever heldere rapportages en governance."
    },
    collaborationMatrix: {
      allies: [
        'GROTE_VASTGOEDBELEGGER'
      ],
      opponents: [],
      conditional: [
        'PROJECTONTWIKKELAAR'
      ],
      tensions: [
        'Investeerder wil transparantie, operationeel management wil autonomie',
        'Investeerder wil rendement, gemeente wil sociale doelen',
        'Investeerder wil exit-mogelijkheid, gemeente wil continuïteit'
      ]
    }
  },

  // ===== BEWONERS (2 actors) =====
  {
    id: 'BEWONER_BINNENSTAD',
    name: 'Bewoner binnenstad / Innercity resident',
    category: ACTOR_CATEGORIES.BEWONERS,
    subcategory: 'inner_city',
    order: 9,
    perspective: {
      primary: 'leefbaarheid, geluid, verkeer, groen, veiligheid, voorzieningen, rust',
      themes: [
        PERSPECTIVE_THEMES.LEEFBAARHEID,
        PERSPECTIVE_THEMES.VEILIGHEID,
        PERSPECTIVE_THEMES.BEREIKBAARHEID,
        PERSPECTIVE_THEMES.BELEVING
      ],
      description: 'Binnenstad-bewoner richt zich op dagelijkse leefbaarheid, rust, veiligheid, voorzieningen, en sociale cohesie. Ze hebben lange-termijn ervaring en geheugen van veranderingen.'
    },
    perspectives: [
      'Leefbaarheid: rust, schoon, veiligheid',
      'Geluidsniveaus van verkeer en horeca',
      'Verkeersveiligheid en -intensiteit',
      'Groen en openbare ruimte',
      'Veiligheid: verlichtung, sociale controle, criminaliteit',
      'Voorzieningen: winkels, horeca, cultuur',
      'Sociale cohesie en buurtsamenhang'
    ],
    biases: [
      'Vroeger was het beter (nostalgie-bias)',
      'De gemeente luistert niet (ervaren onmacht)',
      'Toeristen zijn het probleem (culprit-bias)',
      'Meer horeca = meer overlast (waar, maar ook sfeer)',
      'Elk nieuw plan is een bedreiging (conservatisme-bias)',
      'Verandering betekent waardedaling (niet altijd waar)'
    ],
    qualifications: [
      'Dagelijkse ervaring en observatie',
      'Sociale controle en signaalfunctie',
      'Buurtnetwerk en informele communicatie',
      'Langetermijngeheugen van gebiedsdynamica',
      'Kennis van wat al eerder geprobeerd is',
      'Directe feedback op leefbaarheidsvragen'
    ],
    riskFactors: [
      'Kunnen zich organiserend tegen transformatieplannen',
      'Kunnen media gebruiken voor publieke campagne tegen plan',
      'Kunnen zich isoleren in eigen buurt-positie (niet naar bredere stad-belangen luisteren)',
      'Kunnen speculatieve zorgen uitvergoten naar feitelijke problemen',
      'Kunnen bestuurlijke processen blokkeren via participatie-fatigue'
    ],
    communicationGuide: {
      approach: 'Echt LUISTEREN. Erken hun zorgen voordat je oplossingen aandraagt. Maak ze partner in proces, niet slachtoffer. Zorg voor voelbare wins vroeg.',
      language: 'Leefbaarheid, veiligheid, sociale cohesie, kwalitatieve verbeteringen, participatie',
      channels: [
        COMMUNICATION_CHANNELS.INFORMAL,
        COMMUNICATION_CHANNELS.WORKSHOP,
        COMMUNICATION_CHANNELS.TOWN_HALL,
        COMMUNICATION_CHANNELS.DIRECT_MEETING
      ],
      whatToAvoid: [
        'Formele inspraakavonden (voelt als vlinderuitplukking)',
        'Beleidsjargon zonder vertaling',
        'Negeren van lokale zorgen in voorfase',
        'Te snelle omslag van klacht naar oplossing',
        'Centralistisch-bestuurlijke toon'
      ],
      keyMessages: [
        'Jullie kennis van de buurt is essentieel voor het plan',
        'Dit plan verbetert JULLIE leefbaarheid, niet ondermijnt het',
        'Wij gaan dit stap-voor-stap doen, niet in een klap',
        'Jullie feedback stuurt wat we gaan doen',
        'Dit creëert meer sociale interactie, niet minder'
      ],
      recommendedFraming: 'Positioneer plan als LEEFBAARHEIDS-INVESTERING, niet commercialisering. Betrek ze als co-creators van hun eigen buurt. Help hen voelen dat hun stem ECHT telt.'
    },
    collaborationMatrix: {
      allies: [
        'AMBACHTELIJK_ONDERNEMER',
        'WIJKRAAD_BUURTVERENIGING',
        'AMBTENAAR_SOCIAAL',
        'CENTRUMMANAGER'
      ],
      opponents: [
        'WINKELIER',
        'HORECA_ONDERNEMER',
        'PROJECTONTWIKKELAAR'
      ],
      conditional: [
        'HORECA_ONDERNEMER',
        'AMBTENAAR_RUIMTE',
        'BEWONER_RANDGEBIED'
      ],
      tensions: [
        'Bewoners willen rust, horeca wil sfeer',
        'Bewoners willen kleinschalig, developers willen volume',
        'Bewoners willen bestaande functies, transformatie brengt verandering',
        'Bewoners willen voorkomen overlast, ondernemers willen vrijheid'
      ]
    }
  },
  {
    id: 'BEWONER_RANDGEBIED',
    name: 'Bewoner randgebied / Peripheral resident',
    category: ACTOR_CATEGORIES.BEWONERS,
    subcategory: 'peripheral',
    order: 10,
    perspective: {
      primary: 'bereikbaarheid centrum, parkeren, eigen buurt-voorzieningen, waarde woning, verbinding',
      themes: [
        PERSPECTIVE_THEMES.BEREIKBAARHEID,
        PERSPECTIVE_THEMES.VASTGOEDWAARDE,
        PERSPECTIVE_THEMES.BELEVING
      ],
      description: 'Randgebied-bewoner richt zich op bereikbaarheid van het centrum, parkeren, voorzieningen in eigen buurt, huiswaarde, en voeling van verbondenheid.'
    },
    perspectives: [
      'Bereikbaarheid van het centrum',
      'Parkeeroplossingen voor eigen buurt en centrum',
      'Voorzieningen in eigen buurt',
      'Waarde van eigen woning',
      'Verbinding tussen randgebied en centrum',
      'Openbaar vervoer',
      'Afstand vs. voeling van betrokkenheid'
    ],
    biases: [
      'Het centrum krijgt alle aandacht (selectieve perceptie)',
      'Mijn buurt wordt vergeten (verdringings-gevoel)',
      'Veranderingen in centrum raken mij niet (maar raken wel bereikbaarheid)',
      'Ik hoef niets met binnenstad (maar kom er wel regelmatig)',
      'Wij zijn niet betrokken bij binnenstad-plannen (uit-positie-bias)'
    ],
    qualifications: [
      'Ander perspectief op bereikbaarheid en mobiliteit',
      'Potentiële centrum-bezoekers',
      'Kennis van wat werkt/niet werkt in randgebieden',
      'Objectiever oog op centrum-aanbod',
      'Grotere groep dan centrum-bewoners'
    ],
    riskFactors: [
      'Kunnen zich buitengesloten voelen door centrum-focus',
      'Kunnen zich passief niet-betrokken opstellen',
      'Kunnen prioriteit geven aan eigen buurt-problemen',
      'Kunnen kritisch zijn vanuit afstand',
      'Kunnen politieke oppositie voeren (als voelen zich vergeten)'
    ],
    communicationGuide: {
      approach: 'Betrek ze via bereikbaarheidsvraagstukken. Laat zien hoe een vitaal centrum hun hele gemeente ten goede komt.',
      language: 'Bereikbaarheid, waarde, verbinding, gemeentelijk welzijn, openbaar vervoer',
      channels: [
        COMMUNICATION_CHANNELS.SURVEY,
        COMMUNICATION_CHANNELS.WORKSHOP,
        COMMUNICATION_CHANNELS.DATA_DASHBOARD
      ],
      whatToAvoid: [
        'Alleen focus op binnenstad',
        'Vergeten dat randgebied-bewoners ook centrum gebruiken',
        'Communicatie die hun buurt als secondary behandelt'
      ],
      keyMessages: [
        'Een vitaal centrum maakt uw gemeente aantrekkelijker',
        'Dit plan verbetert bereikbaarheid naar het centrum',
        'Uw buurt profiteert van meer centrumbezoek (winkelen, cultuur)',
        'Wij plannen gelijk voor buurt EN centrum'
      ],
      recommendedFraming: 'Positioneer plan als GEMEENTE-BREDE WAARDECREATIE, niet alleen centrum-focus. Laat zien dat vitale centrum = betere gemeente voor iedereen.'
    },
    collaborationMatrix: {
      allies: [
        'BEWONER_BINNENSTAD',
        'AMBTENAAR_ECONOMIE'
      ],
      opponents: [],
      conditional: [
        'PROJECTONTWIKKELAAR',
        'CENTRUMMANAGER'
      ],
      tensions: [
        'Randgebied-bewoner kan voelen zich vergeten tegenover centrum-focus'
      ]
    }
  },

  // ===== BEZOEKERS (2 actors) =====
  {
    id: 'DAGJESTOERIST',
    name: 'Dagjestoerist / Day tripper',
    category: ACTOR_CATEGORIES.BEZOEKERS,
    subcategory: 'day_visitor',
    order: 11,
    perspective: {
      primary: 'beleving, horeca, winkelen, sfeer, bereikbaarheid, parkeren, prijs',
      themes: [
        PERSPECTIVE_THEMES.BELEVING,
        PERSPECTIVE_THEMES.BEREIKBAARHEID,
        PERSPECTIVE_THEMES.IDENTITEIT
      ],
      description: 'Dagjestoerist richt zich op beleving, horeca, winkelen, sfeer, en praktische bereikbaarheid. Lastig direct te betrekken, maar economisch belangrijk.'
    },
    perspectives: [
      'Aantrekkelijke beleving en sfeer',
      'Horeca en food-aanbod',
      'Winkelplezier en diversiteit',
      'Unieke identiteit van de plaats',
      'Bereikbaarheid en parkeren',
      'Prijsverhoudingen',
      'Sociale ervaring (met vrienden/familie)'
    ],
    biases: [
      'Gratis parkeren = gastvrijheid (maar kost gemeente veel)',
      'Meer evenementen = altijd beter (hangt af van type/kwaliteit)',
      'De stad is er voor mij (is ook voor andere groepen)',
      'Alles moet goedkoop zijn (maar kwaliteit kost geld)',
      'Winkelplezier is voornaam doel (terwijl ook andere redenen bestaan)'
    ],
    qualifications: [
      'Economische bestedingen',
      'Mond-tot-mondreclame en reputatie-effect',
      'Herhaalbezoek-potentieel',
      'Ongefiltreerde feedback op aantrekkelijkheid',
      'Inzicht in concurrentie (andere steden) uit directe ervaring'
    ],
    riskFactors: [
      'Kunnen negatieve mond-tot-mondreclame genereren',
      'Kunnen naar concurrerende steden uitwijken',
      'Kunnen teleurstelling uiten via sociale media',
      'Kunnen via reviews impact hebben op aantrekkelijkheid'
    ],
    communicationGuide: {
      approach: 'Moeilijk direct te betrekken. Gebruik bezoekersonderzoeken, passantencijfers, reviews. Focus op aantrekkelijkheidsmeting.',
      language: 'Beleving, sfeer, uniekheid, gezelligheid, diversiteit, kwaliteit',
      channels: [
        COMMUNICATION_CHANNELS.SURVEY,
        COMMUNICATION_CHANNELS.DATA_DASHBOARD
      ],
      whatToAvoid: [
        'Directe betrokkenheid verzoeken (ze zijn toerist)',
        'Te veel regels en normering',
        'Communicatie waarin hun bezoek als secundair voorkomen'
      ],
      keyMessages: [
        'Dit plan maakt uw volgende bezoek nog aantrekkelijker',
        'Wij luisteren naar uw feedback via reviews en onderzoeken',
        'Nieuwe elementen vergroten de unieke beleving'
      ],
      recommendedFraming: 'Positioneer plan als BELEVING-VERHOGING. Zorg dat transformatie VOELBAAR verbetert wat ze waarderen.'
    },
    collaborationMatrix: {
      allies: [
        'HORECA_ONDERNEMER',
        'CENTRUMMANAGER'
      ],
      opponents: [
        'BEWONER_BINNENSTAD'
      ],
      conditional: [],
      tensions: [
        'Toeristen willen parkeren dicht, bewoners willen minder auto'
      ]
    }
  },
  {
    id: 'TOERIST_INTERNATIONAAL',
    name: 'Internationale toerist',
    category: ACTOR_CATEGORIES.BEZOEKERS,
    subcategory: 'international_visitor',
    order: 12,
    perspective: {
      primary: 'authenticiteit, cultuur, toegankelijkheid, veiligheid, betaalmogelijkheden, uniekheid',
      themes: [
        PERSPECTIVE_THEMES.BELEVING,
        PERSPECTIVE_THEMES.IDENTITEIT,
        PERSPECTIVE_THEMES.BEREIKBAARHEID
      ],
      description: 'Internationale toerist richt zich op authenticiteit, culturele ervaring, en unieke kenmerken. Zelden direct betrokken bij gebiedsontwikkeling.'
    },
    perspectives: [
      'Authenticiteit en lokale kenmerken',
      'Culturele ervaring',
      'Toegankelijkheid voor reizigers',
      'Veiligheid',
      'Betaalmogelijkheden (creditcard, cash)',
      'Taalondersteuning',
      'Unieke ervaringen'
    ],
    biases: [
      'Nederland = Amsterdam (stereotypering)',
      'Alles is fiets-bereikbaar (gebaseerd op Amsterdam-ervaring)',
      'Alles spreekt Engels (niet altijd waar)',
      'Nederland is heel klein (geografische miscalculatie)',
      'Horeca is goedkoop (maar niet in toeristische gebieden)'
    ],
    qualifications: [
      'Internationale exposure en reputatie-effect',
      'Hogere bestedingen gemiddeld',
      'Culturele diversiteit en cross-cultural perspectief',
      'Reviews op internationale platforms (TripAdvisor etc)',
      'Potentieel voor herhaald bezoek en aanbeveling'
    ],
    riskFactors: [
      'Kunnen negatieve internationale reviews geven',
      'Kunnen authenticiteit-bezwaren uiten',
      'Kunnen uitwijken naar "authentiekere" alternatieven'
    ],
    communicationGuide: {
      approach: 'Bijna nooit direct betrokken. Gebruik VVV, tourism boards, internationale review-platforms. Focus op authenticiteit en culturele waarde.',
      language: 'Authenticity, culture, local experience, accessibility, safety',
      channels: [
        COMMUNICATION_CHANNELS.SURVEY,
        COMMUNICATION_CHANNELS.DATA_DASHBOARD
      ],
      whatToAvoid: [
        'Massatoerisme-beleving',
        'Standaardisering en ketens',
        'Negeren van authenticiteit'
      ],
      keyMessages: [
        'This plan preserves local authenticity',
        'Cultural richness increases with mixed-use development',
        'Your feedback shapes the authentic experience'
      ],
      recommendedFraming: 'Position plan as AUTHENTICITY PRESERVATION while enabling growth. Show how diverse functions maintain authentic character.'
    },
    collaborationMatrix: {
      allies: [
        'HORECA_ONDERNEMER',
        'AMBACHTELIJK_ONDERNEMER'
      ],
      opponents: [],
      conditional: [],
      tensions: []
    }
  },

  // ===== OVERHEID (6 actors) =====
  {
    id: 'WETHOUDER_ECONOMIE',
    name: 'Wethouder / Raadslid Economie',
    category: ACTOR_CATEGORIES.OVERHEID,
    subcategory: 'politician',
    order: 13,
    perspective: {
      primary: 'werkgelegenheid, vestigingsklimaat, ondernemersklimaat, leegstandbestrijding, politieke opbrengsten',
      themes: [
        PERSPECTIVE_THEMES.WERKGELEGENHEID,
        PERSPECTIVE_THEMES.IDENTITEIT,
        PERSPECTIVE_THEMES.BEREIKBAARHEID
      ],
      description: 'Wethouder economie richt zich op werkgelegenheid, vestigingsklimaat, media-zichtbaarheid, en politieke verdedigbaarheid van keuzes.'
    },
    perspectives: [
      'Werkgelegenheid en banengroei',
      'Vestigingsklimaat voor bedrijven',
      'Ondernemersklimaat en bureaucratie-reductie',
      'Leegstandbestrijding',
      'Zichtbare successen (mediagenic projects)',
      'Politieke verdedigbaarheid',
      'Volgende verkiezingen',
      'Coalitie-steun'
    ],
    biases: [
      'Meer bedrijven = altijd beter (kwaliteit > kwantiteit)',
      'Leegstand is altijd probleem (kan ook transformatiekans zijn)',
      'Ik moet iedereen tevreden houden (onmogelijk; keuzes nodig)',
      'De volgende verkiezingen bepalen mijn horizon (short-termisme)',
      'Media-aandacht = succes (zichtbaarheid ≠ effectiviteit)',
      'Mijn voorganger had ongelijk (confirmatie-bias)'
    ],
    qualifications: [
      'Politiek mandaat',
      'Netwerk en contacten',
      'Besluitvormingsmacht',
      'Agendasetting',
      'Coalitievorming en compromissenbereidheid',
      'Media- en PR-kennis',
      'Ondernemersnetwerk'
    ],
    riskFactors: [
      'Kunnen plan aanpassen voor politieke redenen',
      'Kunnen zich terugtrekken als media-aandacht negatief is',
      'Kunnen druk zetten op ambtelijke organisatie',
      'Kunnen oppositie mobiliseren tegen plan',
      'Kunnen gemakkelijk politiek kapot maken wat ze niet zelf bouwen',
      'Kunnen korte-termijn-wins prioriteren boven langdurige waardecreatie'
    ],
    communicationGuide: {
      approach: 'Lever onderbouwde analyses die POLITIEK VERDEDIGBAAR zijn. Bied meerdere opties, niet één advies. Help ze hun eigenaarschap claimen.',
      language: 'Werkgelegenheid, vestigingsklimaat, haalbare successen, coalitie-draagvlak, mediagenieke momenten',
      channels: [
        COMMUNICATION_CHANNELS.DIRECT_MEETING,
        COMMUNICATION_CHANNELS.WRITTEN,
        COMMUNICATION_CHANNELS.DATA_DASHBOARD
      ],
      whatToAvoid: [
        'Eénzijdige aanbevelingen',
        'Vage toezeggingen',
        'Negeren van politieke dynamiek',
        'Adviezen die hen alleen risico geven'
      ],
      keyMessages: [
        'Dit plan genereert aantoonbare werkgelegenheid',
        'Dit vestigingsklimaat verbetert',
        'Dit zijn de mediagenieke momenten in de timeline',
        'Dit is politiek verdedigbaar en biedt coalitie-steun'
      ],
      recommendedFraming: 'Positioneer plan als HAALBAARHEID-SUCCESS met ZICHTBARE MIJLPALEN. Help hem/haar eigenaarschap claimen. Geef alternatieven zodat politieke keuzes duidelijk zijn.'
    },
    collaborationMatrix: {
      allies: [
        'AMBTENAAR_ECONOMIE',
        'CENTRUMMANAGER',
        'PROJECTONTWIKKELAAR'
      ],
      opponents: [
        'BEWONER_BINNENSTAD'
      ],
      conditional: [
        'ALLE_ANDERE_WETHOUDERS',
        'RAAD'
      ],
      tensions: [
        'Wethouder wil snelle wins, transformatie vergt geduld',
        'Wethouder wil groeien, sommige groepen willen behouden',
        'Wethouder wil mediageniek, substantie is often niet-mediageniek'
      ]
    }
  },
  {
    id: 'WETHOUDER_VEILIGHEID',
    name: 'Wethouder / Raadslid Veiligheid',
    category: ACTOR_CATEGORIES.OVERHEID,
    subcategory: 'politician',
    order: 14,
    perspective: {
      primary: 'veiligheid, ondermijning, handhaving, toezicht, cameratoezicht, Bibob, beeldvorming',
      themes: [
        PERSPECTIVE_THEMES.VEILIGHEID,
        PERSPECTIVE_THEMES.IDENTITEIT
      ],
      description: 'Wethouder veiligheid richt zich op veiligheidsmetingen, ondermijning-bestrijding, handhaving-maatregelen, en media-beeldvorming van veiligheid.'
    },
    perspectives: [
      'Veiligheid en veiligheidsgevoel',
      'Ondermijningsbestrijding',
      'Handhaving en toezicht',
      'Cameratoezicht en technologie',
      'Bibob-screening',
      'RIEC-samenwerking',
      'Media-beeldvorming van veiligheid',
      'Politieke verdedigbaarheid'
    ],
    biases: [
      'Meer handhaving = veiliger (repressie ≠ preventie)',
      'Ondermijning zit overal (selectieve perceptie)',
      'Preventie is soft (kan ook zeer effectief zijn)',
      'Repressie werkt het best (maar is ook het duurste)',
      'Data is altijd objectief (data interpreteren vergt context)',
      'Cameratoezicht lost problemen op (technologie-fix-bias)'
    ],
    qualifications: [
      'Politiek mandaat',
      'Veiligheidsmandaat',
      'Politiecontact en samenwerking',
      'Bestuurlijke instrumenten (Bibob, sluiting, etc)',
      'RIEC-netwerk',
      'Media- en PR-kennis',
      'Ondernemersvertrouwen'
    ],
    riskFactors: [
      'Kunnen plan blokkeren op veiligheidsgronden',
      'Kunnen repressieve benadering dwingen',
      'Kunnen media-pressure creëren over veiligheid',
      'Kunnen bestuurshandelingen blokkeren/vertragen',
      'Kunnen transformatie als "soft on crime" framen'
    ],
    communicationGuide: {
      approach: 'Lever concrete signalen en data, geen vage vermoedens. Ondersteuning met gestructureerde analyse. Help preventie-inzichten normaliseren.',
      language: 'Veiligheid, ondermijning, gegevens-gedreven benadering, preventie-theorie, gebiedsanalyse, integrale aanpak',
      channels: [
        COMMUNICATION_CHANNELS.DIRECT_MEETING,
        COMMUNICATION_CHANNELS.WRITTEN,
        COMMUNICATION_CHANNELS.DATA_DASHBOARD
      ],
      whatToAvoid: [
        'Vage veiligheids-vermoedens',
        'Negeren van veiligheid in plan',
        'Alleen repressieve maatregelen aanbevelen',
        'Communicatie die onnodige angst creëert'
      ],
      keyMessages: [
        'Dit plan bevat duidelijke veiligheid-randvoorwaarden',
        'Dit zijn de gestructureerde risico-beveiligingen',
        'Vitale gebieden zijn veiliger dan lege gebieden (sociale controle)',
        'Dit plan integreert handhaving EN preventie'
      ],
      recommendedFraming: 'Positioneer plan als INTEGRAAL VEILIGHEID-PLAN met data-gestuurde maatregelen. Laat zien dat vitale gebieden preventief werken door sociale controle.'
    },
    collaborationMatrix: {
      allies: [
        'POLITIE',
        'BOA',
        'RIEC_LIEC'
      ],
      opponents: [],
      conditional: [
        'HORECA_ONDERNEMER',
        'AMBTENAAR_OOV'
      ],
      tensions: [
        'Veiligheid-focus kan horeca-activiteiten beperken',
        'Veiligheid wil preventie, handhaving denkt repressie'
      ]
    }
  },
  {
    id: 'AMBTENAAR_ECONOMIE',
    name: 'Ambtenaar Economische Zaken',
    category: ACTOR_CATEGORIES.OVERHEID,
    subcategory: 'civil_servant',
    order: 15,
    perspective: {
      primary: 'beleidsuitvoering, subsidies, ondernemerscontact, gebiedsmanagement, continuïteit',
      themes: [
        PERSPECTIVE_THEMES.WERKGELEGENHEID,
        PERSPECTIVE_THEMES.BEREIKBAARHEID
      ],
      description: 'Ambtenaar economie richt zich op beleidsuitvoering, subsidie-procedures, ondernemerscontact, en continuïteit over bestuursperioden heen.'
    },
    perspectives: [
      'Beleidsuitvoering en regeltoepassing',
      'Subsidies en subsidie-procedures',
      'Ondernemerscontact en -ondersteuning',
      'Gebiedsmanagement',
      'Continuïteit over politieke perioden',
      'Werkbelasting en capaciteit',
      'Effectiviteit van interventies',
      'Kennisopbouw'
    ],
    biases: [
      'Beleid = automatische uitvoering (context matters)',
      'Ondernemers moeten zelf initiatief nemen (maar facilitatie helpt)',
      'Ik heb te weinig capaciteit (waar, maar vereist resourceering)',
      'Dit hebben we al eerder geprobeerd (path dependency)',
      'Subsidies genereren altijd groei (hangt af van design)',
      'Procedures zijn vastgesteld (maar kunnen ook herformuleerd worden)'
    ],
    qualifications: [
      'Dossierkennis',
      'Ondernemersnetwerk',
      'Beleidskennis en -evaluatie',
      'Continuïteit over bestuursperioden',
      'Implementatie-expertise',
      'Bureaucratische kennis',
      'Lokale context-begrip'
    ],
    riskFactors: [
      'Kunnen plan vertragen via procedurele weergaven',
      'Kunnen capaciteits-belemmering invoeren',
      'Kunnen conservatief blijven vast aan bestaande procedures',
      'Kunnen zich terugtrekken via "niet mijn beleid"',
      'Kunnen ondernemers misinformatie geven (per ongeluk of intentioneel)'
    ],
    communicationGuide: {
      approach: 'Geef bruikbare tools, data, procedures, checklists. Verlicht werkdruk. Help contextualisering van beleid.',
      language: 'Implementatie, procedures, tools, ondernemersservice, capaciteit, resultaten',
      channels: [
        COMMUNICATION_CHANNELS.DIRECT_MEETING,
        COMMUNICATION_CHANNELS.WRITTEN,
        COMMUNICATION_CHANNELS.WORKSHOP
      ],
      whatToAvoid: [
        'Te veel aangeven zonder tools',
        'Onrealistische verwachtingen zonder resources',
        'Gebrek aan waardering voor hun werk',
        'Communicatie via hun werkgever zonder hun stem'
      ],
      keyMessages: [
        'Dit tool-kit vereenvoudigt uw werk',
        'Dit plan reduceert uiteindelijk uw werkdruk',
        'Dit ondernemersnetwerk is nu beter gestructureerd',
        'Jullie expertise is cruciaal voor succes'
      ],
      recommendedFraming: 'Positioneer plan als DRAAGBARE WERKVERLICHTING met duidelijke tools en ondersteuning. Erken hun cruciale rol in implementatie.'
    },
    collaborationMatrix: {
      allies: [
        'AMBTENAAR_RUIMTE',
        'AMBTENAAR_SOCIAAL',
        'CENTRUMMANAGER'
      ],
      opponents: [],
      conditional: [
        'WETHOUDER_ECONOMIE',
        'ONDERNEMERS'
      ],
      tensions: [
        'Ambtenaar wil uitvoering, politiek wil snelheid',
        'Ambtenaar wil aandacht, maar heeft ook andere dossiers',
        'Ambtenaar wil continuïteit, ambtsvoorgenoten veranderen'
      ]
    }
  },
  {
    id: 'AMBTENAAR_OOV',
    name: 'Ambtenaar Openbare Orde & Veiligheid',
    category: ACTOR_CATEGORIES.OVERHEID,
    subcategory: 'civil_servant',
    order: 16,
    perspective: {
      primary: 'veiligheid, ondermijning, vergunningen, toezicht, integriteit, risicobeheersing',
      themes: [
        PERSPECTIVE_THEMES.VEILIGHEID
      ],
      description: 'Ambtenaar OOV richt zich op veiligheid, ondermijning-bestrijding, vergunningen, toezicht, en integriteit-waarborging.'
    },
    perspectives: [
      'Veiligheid en veiligheidsgevoel',
      'Ondermijning en georganiseerde criminaliteit',
      'Vergunningsverlening en toezicht',
      'Handhaving',
      'Integriteit van bedrijven',
      'Informatiepositie en data-analyse',
      'RIEC-samenwerking',
      'Signaalverwerking'
    ],
    biases: [
      'Elke afwijking is verdacht (hypervigilantie)',
      'Data is altijd objectief (data interpreteren vergt context)',
      'Wij zien het complete plaatje (informatie-bias)',
      'Ondermijning is meer gegrond dan werkelijk (selectieve perceptie)',
      'Technische compliance = werkelijke integriteit (legal/moral difference)',
      'Risicocategorie = risicogroep (categorisatie-bias)'
    ],
    qualifications: [
      'Veiligheidsinformatie en informatiepositie',
      'Bestuurlijke handhaving',
      'RIEC-samenwerking',
      'Signaalverwerking',
      'Vergunning- en toezichtskennis',
      'Data-analyse',
      'Juridische kennis'
    ],
    riskFactors: [
      'Kunnen plan blokkeren op risico-gronden',
      'Kunnen vergunningsproces vertragen',
      'Kunnen informatie gebruiken als drukmiddel',
      'Kunnen hypervigilantie-benadering creëren',
      'Kunnen integriteits-eisen onrealistisch stellen'
    ],
    communicationGuide: {
      approach: 'Respecteer hun professionaliteit en informatiepositie. Help bij contextplaatsing van data. Introduceer preventie-inzichten naast handhaving.',
      language: 'Veiligheid, gegevens-analyse, integriteit, risico-gestuurde benadering, RIEC-samenwerking, gebiedsanalyse',
      channels: [
        COMMUNICATION_CHANNELS.DIRECT_MEETING,
        COMMUNICATION_CHANNELS.WRITTEN,
        COMMUNICATION_CHANNELS.DATA_DASHBOARD
      ],
      whatToAvoid: [
        'Negeren van veiligheid-informatie',
        'Communicatie die hen niet-professioneel behandelt',
        'Gebrek aan data-ondersteuning'
      ],
      keyMessages: [
        'Dit plan bevat duidelijke integriteits-waarborging',
        'Dit zijn de risicogebieden en preventie-maatregelen',
        'Dit informatie-systeem versterkt uw signaalverwerking',
        'RIEC-samenwerking is ingebouwd'
      ],
      recommendedFraming: 'Positioneer plan als INTEGRITEITS-VERSTERKING met data-gedreven maatregelen. Help zij zien dat vitaal gebied = beter zicht (social control) = meer preventie.'
    },
    collaborationMatrix: {
      allies: [
        'POLITIE',
        'RIEC_LIEC',
        'BOA'
      ],
      opponents: [],
      conditional: [
        'WETHOUDER_VEILIGHEID',
        'HORECA_ONDERNEMER'
      ],
      tensions: [
        'OOV wil toezicht, ondernemers willen vrijheid',
        'OOV wil data-gedreven, soms moeten intuïtie gebruiken'
      ]
    }
  },
  {
    id: 'AMBTENAAR_RUIMTE',
    name: 'Ambtenaar Ruimtelijke Planning / Stadsontwikkeling',
    category: ACTOR_CATEGORIES.OVERHEID,
    subcategory: 'civil_servant',
    order: 17,
    perspective: {
      primary: 'bestemmingsplannen, functiemenging, vergroening, mobiliteit, erfgoed, bouwvergunningen',
      themes: [
        PERSPECTIVE_THEMES.IDENTITEIT,
        PERSPECTIVE_THEMES.BEREIKBAARHEID,
        PERSPECTIVE_THEMES.BELEVING
      ],
      description: 'Ambtenaar ruimte richt zich op bestemmingsplannen, ruimtelijke ordening, erfgoed-bescherming, mobiliteit, en bouwkwaliteit.'
    },
    perspectives: [
      'Bestemmingsplannen en regelgeving',
      'Functiemenging en -diversiteit',
      'Vergroening en openbare ruimte',
      'Mobiliteit en verkeersstructuur',
      'Erfgoed-bescherming',
      'Bouwkwaliteit en architectuur',
      'Duurzaamheid en circulaire economie',
      'Lange-termijn ruimtelijke visie',
      'Juridische haalbaarheid'
    ],
    biases: [
      'Het bestemmingsplan is heilig (is instrument, kan veranderen)',
      'Functiemenging is altijd beter (hangt af van mix)',
      'Erfgoed moet behouden (waar, maar kan ook evolve)',
      'Verandering kost tijd (waar, maar kost ook niets als niet begonnen)',
      'Data is alles, design niets (beide nodig)',
      'Hogere dichtheid = beter (maar kwaliteit matters)'
    ],
    qualifications: [
      'Ruimtelijke expertise',
      'Vergunning- en bouwrechtkennis',
      'Bestemmingsplan- en regelgeving-kennis',
      'Erfgoedkennis',
      'Mobiliteitsplanning',
      'Duurzaamheidsexpertise',
      'Lange-termijn visie',
      'Jurisprudentie-kennis'
    ],
    riskFactors: [
      'Kunnen plan blokkeren via bestemmingsplan-procedure',
      'Kunnen perfectie-eisen stellen (nimble-ness voorkomen)',
      'Kunnen erfgoed-argumentatie gebruiken tegen transformatie',
      'Kunnen procedures vertragen',
      'Kunnen te conservatief blijven vast aan bestaande plannen'
    ],
    communicationGuide: {
      approach: 'Betrek ze VROEG bij transformatieplannen. Help hen denken in KANSEN, niet procedures. Lever ruimtelijke data en scenario-analyse.',
      language: 'Ruimtelijke ordening, functiemenging, erfgoed-compatibiliteit, duurzaamheid, mobiliteitseffecten, kwaliteitsverhoging',
      channels: [
        COMMUNICATION_CHANNELS.DIRECT_MEETING,
        COMMUNICATION_CHANNELS.WORKSHOP,
        COMMUNICATION_CHANNELS.DATA_DASHBOARD
      ],
      whatToAvoid: [
        'Lat veranderingen op tafel als bestemmingsplan vast is',
        'Négeren van erfgoed-aspecten',
        'Te veel regelgeving zonder flexibiliteit',
        'Communicatie zonder ruimtelijke ondersteuning'
      ],
      keyMessages: [
        'Dit plan versterkt langetermijn ruimtelijke visie',
        'Dit bestemmingsplan-wijziging faciliteert transformatie',
        'Dit behoedt erfgoed terwijl we toekomst creëren',
        'Dit verhoogt ruimtelijke kwaliteit, niet alleen dichtheid'
      ],
      recommendedFraming: 'Positioneer plan als RUIMTELIJKE KWALITEITS-VERHOGING. Help hen denken in mogelijkheden, niet beperkingen. Laat zien dat procedures ONDERSTEUNDEN waarde-creatie.'
    },
    collaborationMatrix: {
      allies: [
        'AMBTENAAR_ECONOMIE',
        'AMBTENAAR_SOCIAAL',
        'PROJECTONTWIKKELAAR'
      ],
      opponents: [],
      conditional: [
        'BEWONER_BINNENSTAD',
        'AMBACHTELIJK_ONDERNEMER'
      ],
      tensions: [
        'Ruimte wil bestemmingsplankader, developers willen flexibiliteit',
        'Ruimte wil erfgoed, transformatie raakt erfgoed soms',
        'Ruimte wil lange-termijn, politiek wil korte-termijn'
      ]
    }
  },
  {
    id: 'AMBTENAAR_SOCIAAL',
    name: 'Ambtenaar Sociale Zaken / Inclusie',
    category: ACTOR_CATEGORIES.OVERHEID,
    subcategory: 'civil_servant',
    order: 18,
    perspective: {
      primary: 'inclusiviteit, zorg, welzijn, participatie, kwetsbare groepen, armoede, samenhangende aanpak',
      themes: [
        PERSPECTIVE_THEMES.LEEFBAARHEID,
        PERSPECTIVE_THEMES.PARTICIPATIE,
        PERSPECTIVE_THEMES.IDENTITEIT
      ],
      description: 'Ambtenaar sociaal richt zich op inclusiviteit, zorg-voorzieningen, welzijn van kwetsbare groepen, participatie, en samenhangende aanpak.'
    },
    perspectives: [
      'Inclusiviteit en toegankelijkheid',
      'Zorgvoorzieningen',
      'Welzijn van kwetsbare groepen',
      'Participatie en inspraak',
      'Armoede-bestrijding',
      'Arbeidsintegratieproject',
      'Samenhangende integrale aanpak',
      'Sociale cohesie',
      'Gezondheid en leefbaarheidsindicatoren'
    ],
    biases: [
      'Economische groei gaat ten koste van kwetsbare groepen (niet per se)',
      'De binnenstad is niet voor iedereen (zelf-fulfilling prophecy)',
      'Wij worden altijd als laatste betrokken (klacht met basis)',
      'Transformatie verdringt armen (kan, maar kan ook voorkomen)',
      'Participatie is luxe, niet nodig (is essentieel)',
      'Mijn dossier is voorbij economisch beleidsdomein (maar is echt kerndomein)'
    ],
    qualifications: [
      'Kennis van kwetsbare groepen',
      'Sociaal netwerk en wijkteams',
      'Zorg- en welzijnsveldkennis',
      'Participatie-methodologie',
      'Gezondheid en leefbaarheid-indicators',
      'Samenhangende integrale aanpak',
      'Inclusiviteit-expertise'
    ],
    riskFactors: [
      'Kunnen plan blokkeren op inclusiviteits-gronden',
      'Kunnen zich voorbij economische domein opstellen',
      'Kunnen participatie-eisen onrealistisch stellen',
      'Kunnen social-drift voorkomen (gentrification-angst)',
      'Kunnen zorg-maatregelen marginaal houden'
    ],
    communicationGuide: {
      approach: 'Betrek ze vroeg in proces. Laat zien dat vitale binnensteden ook sociaal sterke binnensteden zijn. Koppel economische doelen aan sociale doelen.',
      language: 'Inclusiviteit, participatie, welzijn, leefbaarheid, samenhangende aanpak, sociale cohesie, kwetsbare groepen',
      channels: [
        COMMUNICATION_CHANNELS.DIRECT_MEETING,
        COMMUNICATION_CHANNELS.WORKSHOP,
        COMMUNICATION_CHANNELS.DATA_DASHBOARD
      ],
      whatToAvoid: [
        'Late betrokkenheid van sociaal domein',
        'Communicatie zonder inclusiviteits-framework',
        'Negeren van kwetsbare groepen',
        'Economische groei zonder sociale waarborg'
      ],
      keyMessages: [
        'Dit plan integreert economische en sociale doelen',
        'Kwetsbare groepen profiteren van vitaal binnenstad',
        'Participatie is ingebouwd in proces',
        'Inclusiviteit maakt plan sterker'
      ],
      recommendedFraming: 'Positioneer plan als INTEGRALE WAARDECREATIE waar economische en sociale doelen elkaar versterken. Betrek sociaal domein als co-creator, niet afterthought.'
    },
    collaborationMatrix: {
      allies: [
        'BEWONER_BINNENSTAD',
        'AMBTENAAR_ECONOMIE',
        'AMBTENAAR_RUIMTE'
      ],
      opponents: [
        'GROTE_VASTGOEDBELEGGER'
      ],
      conditional: [
        'PROJECTONTWIKKELAAR',
        'WETHOUDER_ECONOMIE'
      ],
      tensions: [
        'Sociaal wil inclusiviteit, markt wil rendement',
        'Sociaal wil participatie, politiek wil snelheid',
        'Sociaal wil waarborging, transformatie brengt onzekerheid'
      ]
    }
  },

  // ===== HANDHAVING & VEILIGHEID (3 actors) =====
  {
    id: 'POLITIE',
    name: 'Politie',
    category: ACTOR_CATEGORIES.HANDHAVING_VEILIGHEID,
    subcategory: 'enforcement',
    order: 19,
    perspective: {
      primary: 'criminaliteit, overlast, ondermijning, veiligheidsgevoel, informatiepositie, opsporing',
      themes: [
        PERSPECTIVE_THEMES.VEILIGHEID
      ],
      description: 'Politie richt zich op criminaliteit-bestrijding, overlast-aanpak, ondermijning, en informatiepositie. 24/7 aanwezigheid in straat.'
    },
    perspectives: [
      'Criminaliteit en misdrijven',
      'Overlast en verstoring',
      'Ondermijning en georganiseerde criminaliteit',
      'Veiligheidsgevoel',
      'Informatiepositie (kennis van straat)',
      'Operationele capaciteit',
      'Samenwerking met partners',
      'Opsporing'
    ],
    biases: [
      'Wij kennen de straat het best (waar, maar niet alles)',
      'De gemeente is te soft (maar moet ook legaal kunnen)',
      'Privacy gaat te ver (maar is ook fundamenteel)',
      'Repressie werkt beter dan preventie (onderzoeken zeggen anders)',
      'Data = kennis (maar context matters)',
      'Wij zijn autonoom en moeten het zelf doen (samenwerking is beter)'
    ],
    qualifications: [
      'Straatkennis',
      'Informatiepositie',
      'Opsporingsbevoegdheden',
      '24/7 aanwezigheid',
      'Operationele professionaliteit',
      'Ordehandhaving-expertise',
      'Samenwerking-capaciteit (RIEC)',
      'Preventie-potentieel (via zichtbaarheid)'
    ],
    riskFactors: [
      'Kunnen plan blokkeren op veiligheidsgronden',
      'Kunnen capaciteits-belemmering invoeren',
      'Kunnen repressieve benadering dwingen',
      'Kunnen samenwerking weigeren',
      'Kunnen informatie als drukmiddel gebruiken',
      'Kunnen media-pressure creëren'
    ],
    communicationGuide: {
      approach: 'Respecteer hun expertise en informatiepositie. Deel data op een manier die zij kunnen gebruiken. Zoek SAMENWERKING, niet afhankelijkheid.',
      language: 'Veiligheid, informatie-deling, samenwerking, operationele ondersteuning, preventie',
      channels: [
        COMMUNICATION_CHANNELS.DIRECT_MEETING,
        COMMUNICATION_CHANNELS.DATA_DASHBOARD,
        COMMUNICATION_CHANNELS.WORKSHOP
      ],
      whatToAvoid: [
        'Negeren van hun straatkennis',
        'One-way communicatie',
        'Afhankelijkheid creëren zonder wederkerigheid',
        'Communicatie via politieke kanalen'
      ],
      keyMessages: [
        'Dit plan ondersteunt uw operationele taak',
        'Dit informatiesysteem versterkt uw signaalverwerking',
        'Samenwerking maakt ons beiden sterker',
        'Dit plan bevat preventie-elementen naast handhaving'
      ],
      recommendedFraming: 'Positioneer plan als PARTNERSHIP waar vitaal gebied = beter sociale controle = makkelijker preventie. Help hen zien dat hun straatkennis essentieel is.'
    },
    collaborationMatrix: {
      allies: [
        'RIEC_LIEC',
        'BOA',
        'WETHOUDER_VEILIGHEID',
        'AMBTENAAR_OOV'
      ],
      opponents: [],
      conditional: [
        'HORECA_ONDERNEMER',
        'TOERIST_INTERNATIONAAL'
      ],
      tensions: [
        'Politie wil handhaving, horeca wil vrijheid',
        'Politie wil data-deling, privacy-belangen zijn belangrijk'
      ]
    }
  },
  {
    id: 'BOA',
    name: 'BOA / Handhaver',
    category: ACTOR_CATEGORIES.HANDHAVING_VEILIGHEID,
    subcategory: 'enforcement',
    order: 20,
    perspective: {
      primary: 'dagelijks straattoezicht, overlast, handhaving, zichtbaarheid, buurttoezicht',
      themes: [
        PERSPECTIVE_THEMES.VEILIGHEID,
        PERSPECTIVE_THEMES.LEEFBAARHEID
      ],
      description: 'BOA richt zich op dagelijks straattoezicht, overlasthandhaving, zichtbaarheid, en buurt-feedback. Ogen en oren van gemeente.'
    },
    perspectives: [
      'Dagelijks straattoezicht',
      'Overlasthandhaving',
      'Zichtbaarheid van toezicht',
      'Buurttoezicht en signalen',
      'Naleving van regelgeving',
      'Operationele capaciteit',
      'Feedback-verwerking'
    ],
    biases: [
      'Meer bevoegdheden = beter handhaven (hangt af van inzet)',
      'De burger werkt niet mee (soms waar, soms niet)',
      'De politie neemt ons niet serieus (onderwaardeerging)',
      'Overlast is altijd probleem (soms voorbijgaan)',
      'Zichtbaarheid = veiligheid (waar, maar niet volledig)'
    ],
    qualifications: [
      'Dagelijks straattoezicht',
      'Directe observatie van dynamica',
      'Signaalfunctie voor problemen',
      'Inzicht in buurt-gevoelens',
      'Feedback op handhaving-effecten',
      'Zichtbare aanwezigheid',
      'Eerste-lijn-contact met ondernemers'
    ],
    riskFactors: [
      'Kunnen zich beroepen op capaciteits-grenzen',
      'Kunnen selectief handhaven',
      'Kunnen feedback niet goed communiceren',
      'Kunnen zichtbaarheid gebruiken als drukmiddel',
      'Kunnen ondernemers-relatie beschadigen'
    ],
    communicationGuide: {
      approach: 'Waardeer hun dagelijkse observaties. Betrek ze actief in feedback-loops. Zorg voor erkenning van hun rol.',
      language: 'Toezicht, overlast, signalen, feedback, waardering, observatie',
      channels: [
        COMMUNICATION_CHANNELS.DIRECT_MEETING,
        COMMUNICATION_CHANNELS.INFORMAL,
        COMMUNICATION_CHANNELS.WORKSHOP
      ],
      whatToAvoid: [
        'Negeren van hun observaties',
        'Ongerechtvaardige kritiek',
        'Toezichtseisen zonder capaciteit',
        'Communicatie die hen demoraleert'
      ],
      keyMessages: [
        'Jullie observaties zijn cruciaal voor gebiedsplan',
        'Dit plan versterkt jullie rol',
        'Jullie feedback stuurt wat we doen',
        'Jullie dagelijkse zichtbaarheid maakt verschil'
      ],
      recommendedFraming: 'Positioneer BOA als EYEBALLS & EARS van gebiedsplan. Erken hun rol in preventie. Help hen voelen dat hun stem echt telt.'
    },
    collaborationMatrix: {
      allies: [
        'POLITIE',
        'RIEC_LIEC',
        'AMBTENAAR_OOV'
      ],
      opponents: [],
      conditional: [
        'HORECA_ONDERNEMER',
        'WINKELIER'
      ],
      tensions: [
        'BOA wil handhaven, horeca wil vrijheid',
        'BOA wil zichtbaarheid, transformatie kan onzichtbaarheid creëren'
      ]
    }
  },
  {
    id: 'RIEC_LIEC',
    name: 'RIEC / LIEC (Regionale / Lokale Informatie Expertise Centrum)',
    category: ACTOR_CATEGORIES.HANDHAVING_VEILIGHEID,
    subcategory: 'enforcement',
    order: 21,
    perspective: {
      primary: 'ondermijning, informatie-uitwisseling, integrale handhaving, barrièremodel, casusregie',
      themes: [
        PERSPECTIVE_THEMES.VEILIGHEID
      ],
      description: 'RIEC/LIEC richt zich op ondermijnings-bestrijding, informatie-uitwisseling tussen partners, integrale handhaving, en casusregie.'
    },
    perspectives: [
      'Ondermijning-bestrijding',
      'Informatie-uitwisseling tussen partners',
      'Integrale handhaving',
      'Barrièremodel-aanpak',
      'Casusregie',
      'Multi-agency-samenwerking',
      'Gebiedsanalyse',
      'Risicobeheersing'
    ],
    biases: [
      'Alles hangt met alles samen (connectie-bias)',
      'Meer informatie = betere bestrijding (hangt af van use)',
      'De gemeente doet te weinig (niet altijd waar)',
      'Data = volledige plaatje (maar ook slechtste plaatje)',
      'Integrale aanpak is altijd beter (kan ook inflexibel zijn)',
      'Wij bepalen aanpak (maar moet samen)'
    ],
    qualifications: [
      'Ondermijningsexpertise',
      'Integrale analyse',
      'Multi-agency samenwerking',
      'Barrièremodel-methodologie',
      'Informatie-synthese',
      'Casusregie-ervaring',
      'Risicobeheersing',
      'Gebiedsanalyse'
    ],
    riskFactors: [
      'Kunnen plan blokkeren op ondermijningsgronden',
      'Kunnen onrealistische integrale-eisen stellen',
      'Kunnen informatie-deling weigeren (privacy)',
      'Kunnen casusregie te dominant voeren',
      'Kunnen gemeente-rol ondermijnen'
    ],
    communicationGuide: {
      approach: 'Lever gestructureerde gebiedsinformatie. Help casusregie-teams denken in voorkomen, niet alleen repressie. Werk in partnership.',
      language: 'Ondermijning, gegevens-analyse, integrale aanpak, barrièremodel, casusregie, informatie-synthese',
      channels: [
        COMMUNICATION_CHANNELS.DIRECT_MEETING,
        COMMUNICATION_CHANNELS.WRITTEN,
        COMMUNICATION_CHANNELS.DATA_DASHBOARD
      ],
      whatToAvoid: [
        'Vage informatie of speculatie',
        'Negeren van hun integrale-benadering',
        'One-way informatieverstrekking',
        'Communicatie zonder data-ondersteuning'
      ],
      keyMessages: [
        'Dit plan bevat ondermijnings-waarborging',
        'Dit informatiesysteem ondersteunt uw casusregie',
        'Dit gebiedsplan reducet ondermijnings-risico preventief',
        'Samenwerking maakt ons beiden sterker'
      ],
      recommendedFraming: 'Positioneer plan als PREVENTIEVE ONDERMIJNINGS-BESTRIJDING via vitaal gebied. Help zij zien dat hun role cruciaal is in voorkomen, niet alleen reactie.'
    },
    collaborationMatrix: {
      allies: [
        'POLITIE',
        'BOA',
        'AMBTENAAR_OOV',
        'WETHOUDER_VEILIGHEID'
      ],
      opponents: [],
      conditional: [
        'AMBTENAAR_ECONOMIE'
      ],
      tensions: [
        'RIEC wil casusregie, gemeente wil autonomie',
        'RIEC wil integraliteit, praktijk is vaak fragmentarisch'
      ]
    }
  },

  // ===== MAATSCHAPPELIJK (4 actors) =====
  {
    id: 'WINKELIERSVERENIGING',
    name: 'Winkeliers- / Ondernemersvereiniging',
    category: ACTOR_CATEGORIES.MAATSCHAPPELIJK,
    subcategory: 'association',
    order: 22,
    perspective: {
      primary: 'collectieve belangen, collectief marketing, evenementen, BIZ, collectieve lobbying',
      themes: [
        PERSPECTIVE_THEMES.OMZET,
        PERSPECTIVE_THEMES.IDENTITEIT,
        PERSPECTIVE_THEMES.BEREIKBAARHEID
      ],
      description: 'Ondernemersvereeniging richt zich op collectieve belangen, gezamenlijke marketing, evenementen, en lobbykracht.'
    },
    perspectives: [
      'Collectieve belangen van ondernemers',
      'Collectieve marketing en promotie',
      'Evenementenorganisatie',
      'BIZ-beheer (Bedrijvenindelingzone)',
      'Lobbykracht',
      'Sectorale vertegenwoordiging',
      'Netwerk en samenwerking',
      'Collectieve investeringen'
    ],
    biases: [
      'Wij vertegenwoordigen alle ondernemers (niet per se)',
      'De gemeente moet betalen (BIZ betaalt meer)',
      'Meer evenementen = meer bezoekers (hangt af van type/timing)',
      'Wij zijn de stem van binnenstad (maar zijn slechts een groep)',
      'Collectief is altijd sterker (kan ook contraproductief zijn)'
    ],
    qualifications: [
      'Collectieve organisatiekracht',
      'Evenementen-ervaring',
      'Lobbykracht en netwerk',
      'Gecombineerde financiële draagkracht',
      'Marketing- en PR-kennis',
      'BIZ-beheer (waar relevant)',
      'Sectorale representatie'
    ],
    riskFactors: [
      'Kunnen plan blokkeren als niet-representatief voelen',
      'Kunnen lobby-campagne voeren tegen plan',
      'Kunnen interne conflicten externaaliseren naar gemeente',
      'Kunnen onevenredig veel invloed claimen',
      'Kunnen leden manipuleren tegen plan'
    ],
    communicationGuide: {
      approach: 'Werk samen maar check of ze representatief zijn. Help ze professionaliseren. Zorg voor duidelijkheid over hun rol.',
      language: 'Collectieve belangen, samenwerking, marketing, evenementen, BIZ, representativiteit',
      channels: [
        COMMUNICATION_CHANNELS.DIRECT_MEETING,
        COMMUNICATION_CHANNELS.WORKSHOP,
        COMMUNICATION_CHANNELS.INFORMAL
      ],
      whatToAvoid: [
        'Aannemen dat ze alle ondernemers vertegenwoordigen',
        'One-way communicatie',
        'Afspraken via voorzitter zonder lederconsultatie',
        'Communicatie die dissidenten negeert'
      ],
      keyMessages: [
        'Jullie collectieve kracht is essentieel voor succes',
        'Dit plan versterkt jullie rol als aanjager',
        'Jullie evenementen zijn kernpunt van vitaliteit',
        'Jullie feedback stuurt de implementatie'
      ],
      recommendedFraming: 'Positioneer plan als PARTNERSHIP waar ondernemersvereiniging medeopbouwer is. Help hen zien dat hun collectieve inzet hun macht versterkt.'
    },
    collaborationMatrix: {
      allies: [
        'WINKELIER',
        'HORECA_ONDERNEMER',
        'CENTRUMMANAGER'
      ],
      opponents: [],
      conditional: [
        'AMBTENAAR_ECONOMIE',
        'BEWONER_BINNENSTAD'
      ],
      tensions: [
        'Vereniging wil representatie, leden hebben diverse belangen',
        'Vereniging wil lobby-kracht, gemeente wil consensus'
      ]
    }
  },
  {
    id: 'WIJKRAAD_BUURTVERENIGING',
    name: 'Wijkraad / Buurtvereniging',
    category: ACTOR_CATEGORIES.MAATSCHAPPELIJK,
    subcategory: 'association',
    order: 23,
    perspective: {
      primary: 'leefbaarheid, participatie, voorzieningen, veiligheid, groen, collectieve stem',
      themes: [
        PERSPECTIVE_THEMES.LEEFBAARHEID,
        PERSPECTIVE_THEMES.PARTICIPATIE,
        PERSPECTIVE_THEMES.IDENTITEIT
      ],
      description: 'Wijkraad/buurtvereniging richt zich op leefbaarheid, participatie, voorzieningen, en collectieve stem van buurt.'
    },
    perspectives: [
      'Leefbaarheid',
      'Participatie en inspraak',
      'Voorzieningen (winkels, horeca, cultuur)',
      'Veiligheid',
      'Groen en openbare ruimte',
      'Sociale cohesie',
      'Buurt-identiteit',
      'Collectieve stem'
    ],
    biases: [
      'Wij spreken namens de buurt (niet altijd; oververtegenwoordiging hogere SES)',
      'Vroeger was het beter (nostalgie)',
      'De gemeente luistert niet (ervaren onmacht)',
      'Elke verandering is bedreigend (conservatisme)',
      'Wij bepalen wat goed is voor de buurt (paternalisme)',
      'Participatie is altijd beter (kan ook vertragen)'
    ],
    qualifications: [
      'Buurtkennis',
      'Signaalfunctie',
      'Organisatiekracht',
      'Historisch geheugen',
      'Sociale netwerken',
      'Directe feedback',
      'Buurt-representatie'
    ],
    riskFactors: [
      'Kunnen plan blokkeren via participatie-proces',
      'Kunnen media gebruiken voor publieke campagne',
      'Kunnen zich isoleren in alleen-mijn-buurt-denken',
      'Kunnen oververtegenwoordiging voelen gelegitimeerd',
      'Kunnen veto-macht gebruiken tegen plan',
      'Kunnen NIMBY-mentaliteit hanteren'
    ],
    communicationGuide: {
      approach: 'Neem serieus maar check representativiteit. Zoek ook stille stemmen. Betrek vroeg en voortdurend.',
      language: 'Leefbaarheid, participatie, buurtbelangen, collectieve stem, vertegenwoordiging',
      channels: [
        COMMUNICATION_CHANNELS.DIRECT_MEETING,
        COMMUNICATION_CHANNELS.WORKSHOP,
        COMMUNICATION_CHANNELS.INFORMAL,
        COMMUNICATION_CHANNELS.TOWN_HALL
      ],
      whatToAvoid: [
        'Late betrokkenheid',
        'Aannemen dat zij de hele buurt vertegenwoordigen',
        'Negeren van minderheids-meningen',
        'Beleidsjargon zonder vertaling',
        'Inspraak zonder echte invloed'
      ],
      keyMessages: [
        'Jullie stem is essentieel in dit proces',
        'Wij gaan samenwerken, niet tegen jullie',
        'Jullie buurtkennis stuurt wat we doen',
        'Dit plan maakt JULLIE buurt beter, niet slechter'
      ],
      recommendedFraming: 'Positioneer plan als BUURT-VERSTERKING waar wijkraad medeopbouwer is. Help hen voelen dat hun participatie echt telt en invloed heeft.'
    },
    collaborationMatrix: {
      allies: [
        'BEWONER_BINNENSTAD',
        'AMBACHTELIJK_ONDERNEMER',
        'AMBTENAAR_SOCIAAL'
      ],
      opponents: [
        'PROJECTONTWIKKELAAR',
        'GROTE_VASTGOEDBELEGGER'
      ],
      conditional: [
        'WINKELIER',
        'HORECA_ONDERNEMER'
      ],
      tensions: [
        'Wijkraad wil behoud, transformatie brengt verandering',
        'Wijkraad wil participatie, politiek wil snelheid',
        'Wijkraad vertegenwoordigt niet iedereen in buurt'
      ]
    }
  },
  {
    id: 'CENTRUMMANAGER',
    name: 'Centrummanager / City Manager',
    category: ACTOR_CATEGORIES.MAATSCHAPPELIJK,
    subcategory: 'manager',
    order: 24,
    perspective: {
      primary: 'gebiedsontwikkeling, marketing, samenwerking, data, kwaliteitsverhoging, netwerk',
      themes: [
        PERSPECTIVE_THEMES.IDENTITEIT,
        PERSPECTIVE_THEMES.BELEVING,
        PERSPECTIVE_THEMES.BEREIKBAARHEID
      ],
      description: 'Centrummanager is verbinder tussen alle stakeholders, draagt gebiedsverantwoordelijkheid, en faciliteert samenwerking.'
    },
    perspectives: [
      'Gebiedsontwikkeling',
      'Gebiedsmarketing',
      'Samenwerking tussen stakeholders',
      'Data en monitoring',
      'Kwaliteitsverhoging',
      'Netwerk-vorming',
      'Evenementenondersteuning',
      'Gebiedsdiagnose'
    ],
    biases: [
      'Ik ben de verbinder (ben ook soms obstructie)',
      'Meer geld = betere binnenstad (niet per se)',
      'Data is de oplossing (data informeert, maar verandert niet)',
      'Iedereen moet samenwerken (soms ook moeilijk)',
      'Mijn rol is cruciaal (belangrijk, maar niet exclusief)',
      'Marketing lost problemen op (communicatie ≠ transformatie)'
    ],
    qualifications: [
      'Overzicht van alle stakeholders',
      'Gebiedsnetwerk en contacten',
      'Gebiedskennis',
      'Marketing-expertise',
      'Samenwerking-faciliteering',
      'Data-analyse en monitoring',
      'Verbindende rol',
      'Gebiedsgevoel'
    ],
    riskFactors: [
      'Kunnen zich zelf positioneren als sleutelactor',
      'Kunnen conflicten mediëren maar ook neutraliteit verliezen',
      'Kunnen data gebruiken als drukmiddel',
      'Kunnen samenwerking-eisen te hardnekkig stellen',
      'Kunnen stakeholder-proces saboteren via selectieve informatieuitwisseling'
    ],
    communicationGuide: {
      approach: 'Behandel als strategische partner. Deel data, inzichten, en mondaine voortgang. Help hen hun verbindende rol uit te breiden.',
      language: 'Gebiedsontwikkeling, samenwerking, data, marketing, netwerk, kwaliteit',
      channels: [
        COMMUNICATION_CHANNELS.DIRECT_MEETING,
        COMMUNICATION_CHANNELS.DATA_DASHBOARD,
        COMMUNICATION_CHANNELS.WORKSHOP,
        COMMUNICATION_CHANNELS.INFORMAL
      ],
      whatToAvoid: [
        'Bypass van centrummanager',
        'Informatieverstrekking die hen buitensluit',
        'Eisen zonder hun rol in acht te nemen',
        'Communicatie die hun positionering ondermijnt'
      ],
      keyMessages: [
        'Jij bent sleutel-partner in gebiedsplan',
        'Dit data-systeem versterkt jouw rol',
        'Dit gebiedsplan is jouw gebiedsplan',
        'Jouw netwerk is ons allergrootste middel'
      ],
      recommendedFraming: 'Positioneer plan als CENTRUMMANAGER-BEFAAMDE PROJECTIE. Help hun voelen dat hun netwerk & verbindende rol onmisbaar is.'
    },
    collaborationMatrix: {
      allies: [
        'AMBTENAAR_ECONOMIE',
        'WINKELIER',
        'HORECA_ONDERNEMER',
        'ALLE_ONDERNEMERS',
        'WIJKRAAD_BUURTVERENIGING'
      ],
      opponents: [],
      conditional: [
        'PROJECTONTWIKKELAAR',
        'GROTE_VASTGOEDBELEGGER'
      ],
      tensions: [
        'Centrummanager wil consensus, soms onvermijdelijk conflict',
        'Centrummanager wil data, soms te veel nadruk op data'
      ]
    }
  }
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get all actors, optionally filtered by category
 * @param {string} category - Optional category to filter by (ACTOR_CATEGORIES)
 * @returns {object[]} Array of actors
 */
function getAllActors(category = null) {
  if (!category) {
    return ACTORS;
  }
  return ACTORS.filter(a => a.category === category);
}

/**
 * Get a specific actor by ID
 * @param {string} actorId - Actor ID
 * @returns {object|null} Actor object or null if not found
 */
function getActorById(actorId) {
  return ACTORS.find(a => a.id === actorId) || null;
}

/**
 * Get all actors in a specific category
 * @param {string} category - Category code
 * @returns {object[]} Array of actors in that category
 */
function getActorsByCategory(category) {
  return ACTORS.filter(a => a.category === category);
}

/**
 * Get communication guide for an actor
 * @param {string} actorId - Actor ID
 * @returns {object|null} Communication guide object
 */
function getCommunicationGuide(actorId) {
  const actor = getActorById(actorId);
  return actor ? actor.communicationGuide : null;
}

/**
 * Get collaboration matrix for an actor
 * @param {string} actorId - Actor ID
 * @returns {object|null} Collaboration matrix with allies/opponents
 */
function getCollaborationMatrix(actorId) {
  const actor = getActorById(actorId);
  return actor ? actor.collaborationMatrix : null;
}

/**
 * Generate a meeting preparation brief for a specific actor
 * @param {string} actorId - Actor ID
 * @param {string} topic - Topic of discussion (e.g., 'leegstand', 'veiligheid')
 * @returns {object} Brief with perspective, biases, recommended framing, pitfalls
 */
function generateMeetingBrief(actorId, topic) {
  const actor = getActorById(actorId);
  if (!actor) return null;

  return {
    actor: {
      id: actor.id,
      name: actor.name,
      category: actor.category
    },
    topic: topic,
    theirPerspective: actor.perspective.description,
    theirPriorities: actor.perspectives,
    biasesToBeAwareOf: actor.biases,
    whatTheyBring: actor.qualifications,
    riskFactors: actor.riskFactors,
    recommendedApproach: actor.communicationGuide.approach,
    recommendedLanguage: actor.communicationGuide.language,
    recommendedChannels: actor.communicationGuide.channels,
    keyMessagesForTopic: actor.communicationGuide.keyMessages,
    recommendedFraming: actor.communicationGuide.recommendedFraming,
    pitfallsToAvoid: actor.communicationGuide.whatToAvoid,
    allies: actor.collaborationMatrix.allies,
    opponents: actor.collaborationMatrix.opponents,
    conditionalPartners: actor.collaborationMatrix.conditional,
    tensions: actor.collaborationMatrix.tensions
  };
}

/**
 * Get all actors relevant to a specific topic
 * @param {string} topic - Topic (e.g., 'leegstand', 'veiligheid', 'bereikbaarheid')
 * @returns {object[]} Array of relevant actors with relevance indication
 */
function getActorsForTopic(topic) {
  const topicLower = topic.toLowerCase();
  const relevanceMap = {
    'leegstand': ['WINKELIER', 'AMBACHTELIJK_ONDERNEMER', 'KLEINE_VASTGOEDONDERNEMER', 'PROJECTONTWIKKELAAR', 'AMBTENAAR_ECONOMIE', 'CENTRUMMANAGER'],
    'veiligheid': ['POLITIE', 'BOA', 'RIEC_LIEC', 'WETHOUDER_VEILIGHEID', 'AMBTENAAR_OOV', 'BEWONER_BINNENSTAD', 'HORECA_ONDERNEMER'],
    'bereikbaarheid': ['WINKELIER', 'DIENSTVERLENER', 'BEWONER_BINNENSTAD', 'BEWONER_RANDGEBIED', 'DAGJESTOERIST', 'AMBTENAAR_RUIMTE', 'PROJECTONTWIKKELAAR'],
    'economie': ['WINKELIER', 'HORECA_ONDERNEMER', 'AMBACHTELIJK_ONDERNEMER', 'WETHOUDER_ECONOMIE', 'AMBTENAAR_ECONOMIE', 'GROTE_VASTGOEDBELEGGER', 'PROJECTONTWIKKELAAR'],
    'sociale_cohesie': ['BEWONER_BINNENSTAD', 'AMBACHTELIJK_ONDERNEMER', 'WIJKRAAD_BUURTVERENIGING', 'AMBTENAAR_SOCIAAL', 'HORECA_ONDERNEMER'],
    'transformatie': ['PROJECTONTWIKKELAAR', 'AMBTENAAR_RUIMTE', 'GROTE_VASTGOEDBELEGGER', 'KLEINE_VASTGOEDONDERNEMER', 'BEWONER_BINNENSTAD', 'WIJKRAAD_BUURTVERENIGING'],
    'identiteit': ['AMBACHTELIJK_ONDERNEMER', 'BEWONER_BINNENSTAD', 'HORECA_ONDERNEMER', 'CENTRUMMANAGER', 'WIJKRAAD_BUURTVERENIGING', 'TOERIST_INTERNATIONAAL']
  };

  const relevantIds = relevanceMap[topicLower] || [];
  return relevantIds.map(id => getActorById(id)).filter(a => a !== null);
}

/**
 * Generate conflict analysis between two actors on a specific topic
 * @param {string} actorId1 - First actor ID
 * @param {string} actorId2 - Second actor ID
 * @param {string} topic - Topic of potential conflict
 * @returns {object} Conflict analysis
 */
function analyzeConflict(actorId1, actorId2, topic) {
  const actor1 = getActorById(actorId1);
  const actor2 = getActorById(actorId2);

  if (!actor1 || !actor2) return null;

  const matrix1 = actor1.collaborationMatrix;
  const relationship = matrix1.allies.includes(actorId2)
    ? COLLABORATION_RELATIONSHIP.ALLY
    : matrix1.opponents.includes(actorId2)
    ? COLLABORATION_RELATIONSHIP.OPPONENT
    : matrix1.conditional.includes(actorId2)
    ? COLLABORATION_RELATIONSHIP.CONDITIONAL
    : COLLABORATION_RELATIONSHIP.NEUTRAL;

  return {
    actor1: { id: actor1.id, name: actor1.name },
    actor2: { id: actor2.id, name: actor2.name },
    topic: topic,
    relationship: relationship,
    actor1_perspective: actor1.perspective.description,
    actor2_perspective: actor2.perspective.description,
    actor1_priorities: actor1.perspectives,
    actor2_priorities: actor2.perspectives,
    potentialAreas_agreement: [],
    potentialAreas_conflict: matrix1.tensions || [],
    recommendedApproach: `Acknowledge ${actor1.name}'s view on ${topic}, then bridge to ${actor2.name}'s concerns. Find shared interests (e.g., vibrant center benefits both). Avoid zero-sum framing.`
  };
}

/**
 * Generate stakeholder map - who has power, who has interest, for a given topic
 * Returns actors positioned in a power/interest matrix
 * @param {string} topic - Topic for mapping
 * @returns {object} Power/interest matrix with actors positioned
 */
function generateStakeholderMap(topic) {
  const relevantActors = getActorsForTopic(topic);

  const powerMap = {
    'WETHOUDER_ECONOMIE': 'high',
    'WETHOUDER_VEILIGHEID': 'high',
    'PROJECTONTWIKKELAAR': 'high',
    'GROTE_VASTGOEDBELEGGER': 'high',
    'AMBTENAAR_ECONOMIE': 'medium',
    'AMBTENAAR_RUIMTE': 'medium',
    'POLITIE': 'medium',
    'WINKELIER': 'medium',
    'HORECA_ONDERNEMER': 'medium',
    'WIJKRAAD_BUURTVERENIGING': 'medium',
    'BEWONER_BINNENSTAD': 'low',
    'DAGJESTOERIST': 'low',
    'TOERIST_INTERNATIONAAL': 'low'
  };

  const interestMap = {
    'BEWONER_BINNENSTAD': 'high',
    'HORECA_ONDERNEMER': 'high',
    'WINKELIER': 'high',
    'PROJECTONTWIKKELAAR': 'high',
    'WETHOUDER_ECONOMIE': 'high',
    'WETHOUDER_VEILIGHEID': 'high',
    'WIJKRAAD_BUURTVERENIGING': 'high',
    'AMBACHTELIJK_ONDERNEMER': 'high',
    'CENTRUMMANAGER': 'high',
    'AMBTENAAR_ECONOMIE': 'medium',
    'AMBTENAAR_RUIMTE': 'medium',
    'AMBTENAAR_SOCIAAL': 'medium',
    'GROTE_VASTGOEDBELEGGER': 'medium',
    'POLITIE': 'medium',
    'BEWONER_RANDGEBIED': 'low',
    'DAGJESTOERIST': 'low'
  };

  const quadrants = {
    highPowerHighInterest: [],
    highPowerLowInterest: [],
    lowPowerHighInterest: [],
    lowPowerLowInterest: []
  };

  relevantActors.forEach(actor => {
    const power = powerMap[actor.id] || 'low';
    const interest = interestMap[actor.id] || 'low';

    if (power === 'high' && interest === 'high') {
      quadrants.highPowerHighInterest.push(actor);
    } else if (power === 'high' && interest !== 'high') {
      quadrants.highPowerLowInterest.push(actor);
    } else if (power !== 'high' && interest === 'high') {
      quadrants.lowPowerHighInterest.push(actor);
    } else {
      quadrants.lowPowerLowInterest.push(actor);
    }
  });

  return {
    topic: topic,
    matrix: quadrants,
    strategies: {
      highPowerHighInterest: 'Manage Closely - Key stakeholders. Involve early, keep satisfied.',
      highPowerLowInterest: 'Keep Satisfied - Have influence but limited stake. Communicate selectively, ensure no opposition.',
      lowPowerHighInterest: 'Keep Informed - Engaged but less power. Provide information, facilitate voice.',
      lowPowerLowInterest: 'Monitor - Limited influence/interest. Track but minimal involvement needed.'
    }
  };
}

/**
 * Get the risk profile of an actor (how they might obstruct)
 * @param {string} actorId - Actor ID
 * @returns {object} Risk profile
 */
function getRiskProfile(actorId) {
  const actor = getActorById(actorId);
  if (!actor) return null;

  return {
    actor: { id: actor.id, name: actor.name },
    riskFactors: actor.riskFactors,
    mitigation_strategies: [
      'Involve early - give agency before opposition hardens',
      'Address concerns directly - acknowledge before proposing solutions',
      'Provide tangible wins - show progress early',
      'Maintain two-way communication - listen, not just tell',
      'Build coalition - find allies to balance power dynamics',
      'Make stakes clear - show what they gain/lose',
      'Offer choices - avoid one-way directives'
    ]
  };
}

// ==========================================
// EXPORTS
// ==========================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ACTOR_CATEGORIES,
    PERSPECTIVE_THEMES,
    COMMUNICATION_CHANNELS,
    COLLABORATION_RELATIONSHIP,
    ACTORS,
    getAllActors,
    getActorById,
    getActorsByCategory,
    getCommunicationGuide,
    getCollaborationMatrix,
    generateMeetingBrief,
    getActorsForTopic,
    analyzeConflict,
    generateStakeholderMap,
    getRiskProfile
  };
}

// Browser global
if (typeof window !== 'undefined') {
  window.StakeholderActoren = {
    ACTOR_CATEGORIES,
    PERSPECTIVE_THEMES,
    COMMUNICATION_CHANNELS,
    COLLABORATION_RELATIONSHIP,
    ACTORS,
    getAllActors,
    getActorById,
    getActorsByCategory,
    getCommunicationGuide,
    getCollaborationMatrix,
    generateMeetingBrief,
    getActorsForTopic,
    analyzeConflict,
    generateStakeholderMap,
    getRiskProfile
  };
}
