'use strict';

/**
 * Import Specifications for Dutch City Deal Vitaliteitstool
 *
 * This module defines all 27 dataset import specifications for the City Deal platform.
 * Each dataset includes exact column mappings matching the expected Excel file structure,
 * validation functions, and geographic aggregation capabilities.
 *
 * Architecture:
 * - Dataset categories: EXTERN (external), INTERN (internal municipal), EMBEDDED (BigQuery)
 * - Status: BASE (always required), OPTIONAL (conditionally loaded), EMBEDDED (read from BQ)
 * - Link levels: PC6, PC5, PC4, STRAAT (street), BUURT (neighborhood), BRANCHE (branch)
 * - Sensitivity: PUBLIC, INTERNAL, SENSITIVE (requires DPIA)
 *
 * Sources:
 * - Excel "Overzicht velden uit datasets"
 * - Municipal data dictionaries (KvK, KAM, Leegstand, etc.)
 * - CBS (Centraal Bureau voor de Statistiek)
 * - External providers (Enable U, CCV)
 */

// ============================================================================
// CONSTANTS - Dataset Categories
// ============================================================================

const DATASET_CATEGORIES = {
  EXTERN: 'extern',
  INTERN: 'intern',
  EMBEDDED: 'embedded'
};

const DATASET_STATUS = {
  BASE: 'base',
  OPTIONAL: 'optional',
  EMBEDDED: 'embedded'
};

const LINK_LEVELS = {
  PC6: 'pc6',
  PC5: 'pc5',
  PC4: 'pc4',
  STRAAT: 'straat',
  BUURT: 'buurt',
  BRANCHE: 'branche'
};

const SENSITIVITY_LEVELS = {
  PUBLIC: 'public',
  INTERNAL: 'internal',
  SENSITIVE: 'sensitive'
};

const AGGREGATION_LEVELS = {
  PC6: 'pc6',
  PC5: 'pc5',
  PC4: 'pc4',
  STRAAT: 'straat',
  BUURT: 'buurt',
  GEMEENTE: 'gemeente'
};

// ============================================================================
// COLUMN TYPE DEFINITIONS
// ============================================================================

const COLUMN_TYPES = {
  STRING: 'string',
  NUMBER: 'number',
  INTEGER: 'integer',
  DECIMAL: 'decimal',
  DATE: 'date',
  DATETIME: 'datetime',
  BOOLEAN: 'boolean',
  COORDINATES: 'coordinates'
};

// ============================================================================
// DATASET DEFINITIONS - All 27 Datasets
// ============================================================================

const DATASET_DEFINITIONS = [
  /**
   * 1. LOCATUS_ONLINE - Basis ondernemingsregister
   * Foundational dataset: PC6-linked business register with contact, location, classification data
   */
  {
    id: 'LOCATUS_ONLINE',
    name: 'LOCATUS Online',
    category: DATASET_CATEGORIES.EXTERN,
    status: DATASET_STATUS.BASE,
    source: 'LOCATUS (commerciële database)',
    sourceType: 'Extern',
    responsibleDepartment: 'Economische Zaken',
    responsiblePerson: 'Datastyling LOCATUS',
    dpiaRequired: false,
    dpiaStatus: 'Niet nodig',
    sensitivity: SENSITIVITY_LEVELS.INTERNAL,
    description: 'Basisregister met ondernemingsgegevens gekoppeld aan PC6-adressen. Bevat contactgegevens, classificatie, branche, passantencijfers, en BAG-gegevens.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'naamOnderneming', excelHeader: 'Naam onderneming', type: COLUMN_TYPES.STRING, required: true, description: 'Official business name' },
      { key: 'straat', excelHeader: 'Straat', type: COLUMN_TYPES.STRING, required: true, description: 'Street name' },
      { key: 'huisnummer', excelHeader: 'Huisnummer', type: COLUMN_TYPES.INTEGER, required: true, description: 'House number' },
      { key: 'huisletter', excelHeader: 'Huisletter', type: COLUMN_TYPES.STRING, required: false, description: 'House letter (A, B, C)' },
      { key: 'huisnummertoevoeging', excelHeader: 'Huisnummertoevoeging', type: COLUMN_TYPES.STRING, required: false, description: 'House number suffix' },
      { key: 'gemeente', excelHeader: 'Gemeente', type: COLUMN_TYPES.STRING, required: true, description: 'Municipality name' },
      { key: 'aantalInwoners', excelHeader: 'Aantal inwoners', type: COLUMN_TYPES.INTEGER, required: false, description: 'Population count at address' },
      { key: 'inwonerKlasse', excelHeader: 'InwonerKlasse', type: COLUMN_TYPES.STRING, required: false, description: 'Population class (e.g., 0-10, 10-25)' },
      { key: 'winkelgebied', excelHeader: 'Winkelgebied', type: COLUMN_TYPES.STRING, required: false, description: 'Shopping area designation' },
      { key: 'winkelgebiedHoofdtype', excelHeader: 'WinkelgebiedHoofdType', type: COLUMN_TYPES.STRING, required: false, description: 'Shopping area main type' },
      { key: 'winkelgebiedTypering', excelHeader: 'Winkelgebiedtypering', type: COLUMN_TYPES.STRING, required: false, description: 'Shopping area classification' },
      { key: 'wijkBuurt', excelHeader: 'Wijk/Buurt', type: COLUMN_TYPES.STRING, required: false, description: 'Neighborhood/district code' },
      { key: 'groep', excelHeader: 'Groep', type: COLUMN_TYPES.STRING, required: false, description: 'Business group classification' },
      { key: 'hoofdbranche', excelHeader: 'Hoofdbranche', type: COLUMN_TYPES.STRING, required: true, description: 'Main branch/sector' },
      { key: 'branche', excelHeader: 'Branche', type: COLUMN_TYPES.STRING, required: true, description: 'Specific branch classification (SBI code)' },
      { key: 'wvo', excelHeader: 'WVO', type: COLUMN_TYPES.STRING, required: false, description: 'Business type classification' },
      { key: 'veldwerkdatum', excelHeader: 'Veldwerkdatum', type: COLUMN_TYPES.DATE, required: false, description: 'Field survey date' },
      { key: 'passanten', excelHeader: 'Passanten', type: COLUMN_TYPES.INTEGER, required: false, description: 'Foot traffic count' },
      { key: 'passantenKlasse', excelHeader: 'Passantenklasse', type: COLUMN_TYPES.STRING, required: false, description: 'Foot traffic class' },
      { key: 'bronWvo', excelHeader: 'BRONWVO', type: COLUMN_TYPES.STRING, required: false, description: 'WVO data source' },
      { key: 'xCoordinaat', excelHeader: 'x-coordinaat', type: COLUMN_TYPES.DECIMAL, required: false, description: 'X coordinate (RD)' },
      { key: 'yCoordinaat', excelHeader: 'y-coordinaat', type: COLUMN_TYPES.DECIMAL, required: false, description: 'Y coordinate (RD)' },
      { key: 'postcode6', excelHeader: 'Postcode 6', type: COLUMN_TYPES.STRING, required: true, description: '6-digit postal code' },
      { key: 'bagBouwijaar', excelHeader: 'BAG bouwjaar', type: COLUMN_TYPES.INTEGER, required: false, description: 'Building construction year (BAG)' },
      { key: 'bagOppervlakte', excelHeader: 'BAG oppervlakte', type: COLUMN_TYPES.INTEGER, required: false, description: 'Building floor area in m² (BAG)' },
      { key: 'inw5Min', excelHeader: 'INW5MIN', type: COLUMN_TYPES.INTEGER, required: false, description: 'Population within 5 minutes' },
      { key: 'inw10Min', excelHeader: 'INW10MIN', type: COLUMN_TYPES.INTEGER, required: false, description: 'Population within 10 minutes' },
      { key: 'inw15Min', excelHeader: 'INW15MIN', type: COLUMN_TYPES.INTEGER, required: false, description: 'Population within 15 minutes' },
      { key: 'inw20Min', excelHeader: 'INW20MIN', type: COLUMN_TYPES.INTEGER, required: false, description: 'Population within 20 minutes' },
      { key: 'postcode4', excelHeader: 'Postcode 4', type: COLUMN_TYPES.STRING, required: false, description: '4-digit postal code' },
      { key: 'googleMapsLink', excelHeader: 'verwijzing Google maps', type: COLUMN_TYPES.STRING, required: false, description: 'Google Maps reference link' },
      { key: 'opmerking', excelHeader: 'Opmerkingen', type: COLUMN_TYPES.STRING, required: false, description: 'Remarks/notes' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        naamOnderneming: row['Naam onderneming'],
        straat: row['Straat'],
        huisnummer: parseInt(row['Huisnummer']) || null,
        huisletter: row['Huisletter'] || '',
        huisnummertoevoeging: row['Huisnummertoevoeging'] || '',
        gemeente: row['Gemeente'],
        postcode6: row['Postcode 6'],
        branche: row['Branche'],
        xCoordinaat: parseFloat(row['x-coordinaat']) || null,
        yCoordinaat: parseFloat(row['y-coordinaat']) || null
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Naam onderneming']) errors.push('Naam onderneming is required');
      if (!row['Postcode 6']) errors.push('Postcode 6 is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 2. KVK - Chamber of Commerce Register
   * External source: official business registrations with address validation
   */
  {
    id: 'KVK',
    name: 'KvK Register',
    category: DATASET_CATEGORIES.EXTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'Enable U (KvK gateway)',
    sourceType: 'Extern',
    responsibleDepartment: 'Economische Zaken',
    responsiblePerson: 'Enable U leverancier',
    dpiaRequired: false,
    dpiaStatus: 'Niet nodig',
    sensitivity: SENSITIVITY_LEVELS.INTERNAL,
    description: 'Officieel KvK-register met ondernemingsgegevens en vestigingsadressen. Gebruikt voor validatie en actualisering.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'naamOnderneming', excelHeader: 'Naam onderneming', type: COLUMN_TYPES.STRING, required: true, description: 'Business name from KvK' },
      { key: 'straat', excelHeader: 'Straat (bezoekadres)', type: COLUMN_TYPES.STRING, required: true, description: 'Street address' },
      { key: 'huisletter', excelHeader: 'Huisletter (bezoekadres)', type: COLUMN_TYPES.STRING, required: false, description: 'House letter' },
      { key: 'huisnummertoevoeging', excelHeader: 'Huisnummertoevoeging (bezoekadres)', type: COLUMN_TYPES.STRING, required: false, description: 'House suffix' },
      { key: 'gemeenteInschrijving', excelHeader: 'Gemeente van inschrijving', type: COLUMN_TYPES.STRING, required: true, description: 'Registration municipality' },
      { key: 'registrationsPerStraat', excelHeader: 'Aantal registraties per straat', type: COLUMN_TYPES.INTEGER, required: false, description: 'Count registrations per street' },
      { key: 'registrationsPerBuurt', excelHeader: 'Aantal registraties per buurt', type: COLUMN_TYPES.INTEGER, required: false, description: 'Count registrations per neighborhood' },
      { key: 'registrationsPerGemeente', excelHeader: 'Aantal registraties per gemeente', type: COLUMN_TYPES.INTEGER, required: false, description: 'Count registrations per municipality' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        naamOnderneming: row['Naam onderneming'],
        straat: row['Straat (bezoekadres)'],
        gemeente: row['Gemeente van inschrijving']
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Naam onderneming']) errors.push('Naam onderneming is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 3. KWALITEITEN - Business Quality Indicators
   * Embedded dataset: read from BigQuery, branche-linked qualities
   */
  {
    id: 'KWALITEITEN',
    name: 'Kwaliteiten Ondernemingen',
    category: DATASET_CATEGORIES.EMBEDDED,
    status: DATASET_STATUS.EMBEDDED,
    source: 'BigQuery (branch-qualifications.js)',
    sourceType: 'Embedded',
    responsibleDepartment: 'Economische Zaken',
    responsiblePerson: 'City Deal Vitaliteitsteam',
    dpiaRequired: false,
    dpiaStatus: 'Niet nodig',
    sensitivity: SENSITIVITY_LEVELS.INTERNAL,
    description: 'Embedded kwaliteitstabel per branche, gebaseerd op vitaliteitsbijdrage van ondernemingstypes.',
    linkLevel: LINK_LEVELS.BRANCHE,
    aggregationLevels: [AGGREGATION_LEVELS.BRANCHE, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT],
    requiredColumns: [
      { key: 'branchCode', excelHeader: 'Branche SBI Code', type: COLUMN_TYPES.STRING, required: true, description: 'SBI branch code' },
      { key: 'kwaliteitPerOnderneming', excelHeader: 'Kwaliteit per onderneming', type: COLUMN_TYPES.INTEGER, required: true, description: 'Quality score (1-10) for business type' },
      { key: 'kwaliteitPerStraat', excelHeader: 'Kwaliteit per straat', type: COLUMN_TYPES.INTEGER, required: false, description: 'Street-level quality impact' },
      { key: 'uitlegKwaliteit', excelHeader: 'Uitleg kwaliteit', type: COLUMN_TYPES.STRING, required: false, description: 'Quality explanation' },
      { key: 'aantalPerStraat', excelHeader: 'Aantal per straat', type: COLUMN_TYPES.INTEGER, required: false, description: 'Count per street' },
      { key: 'aantalPerBuurt', excelHeader: 'Aantal per buurt', type: COLUMN_TYPES.INTEGER, required: false, description: 'Count per neighborhood' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        branchCode: row['Branche SBI Code'],
        qualityScore: parseInt(row['Kwaliteit per onderneming']) || 0
      };
    },
    validateRow: function(row) {
      return { valid: true, errors: [] };
    }
  },

  /**
   * 4. KWETSBAARHEDEN - Vulnerability Assessment per Branch
   * Embedded dataset: vulnerability scores and risk indicators
   */
  {
    id: 'KWETSBAARHEDEN',
    name: 'Kwetsbaarheden Ondernemingen',
    category: DATASET_CATEGORIES.EMBEDDED,
    status: DATASET_STATUS.EMBEDDED,
    source: 'BigQuery (branch-qualifications.js)',
    sourceType: 'Embedded',
    responsibleDepartment: 'Veiligheid & Handhaving',
    responsiblePerson: 'City Deal Vitaliteitsteam',
    dpiaRequired: false,
    dpiaStatus: 'Niet nodig',
    sensitivity: SENSITIVITY_LEVELS.INTERNAL,
    description: 'Kwetsbaarheidsscores per branche voor risico\'s als witwassen, drugshandel, arbeidsuitbuiting.',
    linkLevel: LINK_LEVELS.BRANCHE,
    aggregationLevels: [AGGREGATION_LEVELS.BRANCHE, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT],
    requiredColumns: [
      { key: 'volgnummer', excelHeader: 'Volgnummer', type: COLUMN_TYPES.INTEGER, required: true, description: 'Sequence number' },
      { key: 'branchCode', excelHeader: 'Branche SBI Code', type: COLUMN_TYPES.STRING, required: true, description: 'SBI branch code' },
      { key: 'kwetsbaarheid', excelHeader: 'Kwetsbaarheid', type: COLUMN_TYPES.INTEGER, required: true, description: 'Vulnerability score (1-10)' },
      { key: 'uitleg', excelHeader: 'Uitleg', type: COLUMN_TYPES.STRING, required: false, description: 'Explanation of vulnerability' },
      { key: 'aantalPerStraat', excelHeader: 'Aantal per straat', type: COLUMN_TYPES.INTEGER, required: false, description: 'Count per street' },
      { key: 'aantalPerBuurt', excelHeader: 'Aantal per buurt', type: COLUMN_TYPES.INTEGER, required: false, description: 'Count per neighborhood' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        branchCode: row['Branche SBI Code'],
        vulnerabilityScore: parseInt(row['Kwetsbaarheid']) || 0
      };
    },
    validateRow: function(row) {
      return { valid: true, errors: [] };
    }
  },

  /**
   * 5. OMGEVINGSRISICO - Environmental Risk Factors (CCV)
   * Embedded dataset: environmental crime prevention risk assessment
   */
  {
    id: 'OMGEVINGSRISICO',
    name: 'Omgevingsrisico\'s (CCV)',
    category: DATASET_CATEGORIES.EMBEDDED,
    status: DATASET_STATUS.EMBEDDED,
    source: 'CCV via BigQuery',
    sourceType: 'Embedded',
    responsibleDepartment: 'Veiligheid & Handhaving',
    responsiblePerson: 'CCV/City Deal Team',
    dpiaRequired: false,
    dpiaStatus: 'Niet nodig',
    sensitivity: SENSITIVITY_LEVELS.INTERNAL,
    description: 'Omgevingsrisico\'s op straatcode-niveau volgens CCV barrièremodel (zichtlijnen, verlichting, sociale controle).',
    linkLevel: LINK_LEVELS.STRAAT,
    aggregationLevels: [AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'volgnummer', excelHeader: 'Volgnummer', type: COLUMN_TYPES.INTEGER, required: true, description: 'Sequence number' },
      { key: 'straatCode', excelHeader: 'Straatcode', type: COLUMN_TYPES.STRING, required: true, description: 'Street code' },
      { key: 'risico', excelHeader: 'Risico (CCV)', type: COLUMN_TYPES.STRING, required: true, description: 'Environmental risk category' },
      { key: 'uitlegRisico', excelHeader: 'Uitleg risico', type: COLUMN_TYPES.STRING, required: false, description: 'Risk explanation' },
      { key: 'categorie', excelHeader: 'Categorie', type: COLUMN_TYPES.STRING, required: false, description: 'Risk category (spatial, social, accessibility)' },
      { key: 'aantalPerStraat', excelHeader: 'Aantal per straat', type: COLUMN_TYPES.INTEGER, required: false, description: 'Risk count per street' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        straatCode: row['Straatcode'],
        risico: row['Risico (CCV)']
      };
    },
    validateRow: function(row) {
      return { valid: true, errors: [] };
    }
  },

  /**
   * 6. LEEGSTAND - Vacant Properties
   * Internal municipal source: property vacancy tracking and duration
   */
  {
    id: 'LEEGSTAND',
    name: 'Leegstandsregistratie',
    category: DATASET_CATEGORIES.INTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'Gemeente interne belastingen',
    sourceType: 'Intern',
    responsibleDepartment: 'Belastingen/Economische Zaken',
    responsiblePerson: 'Belastingdienst',
    dpiaRequired: false,
    dpiaStatus: 'Nee',
    sensitivity: SENSITIVITY_LEVELS.INTERNAL,
    description: 'Registratie van leegstaande panden: ingangsdatum, type leegstand, duur.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'ddIngang', excelHeader: 'DDIngang_Object', type: COLUMN_TYPES.STRING, required: true, description: 'Property identifier' },
      { key: 'straat', excelHeader: 'Straat', type: COLUMN_TYPES.STRING, required: true, description: 'Street name' },
      { key: 'huisnummer', excelHeader: 'Huisnummer', type: COLUMN_TYPES.INTEGER, required: true, description: 'House number' },
      { key: 'huisletter', excelHeader: 'Huisletter', type: COLUMN_TYPES.STRING, required: false, description: 'House letter' },
      { key: 'huisnummertoevoeging', excelHeader: 'Huisnummertoevoeging', type: COLUMN_TYPES.STRING, required: false, description: 'House suffix' },
      { key: 'ddIngang_Leegstand', excelHeader: 'DDIngang Leegstand', type: COLUMN_TYPES.DATE, required: true, description: 'Vacancy start date' },
      { key: 'ddEinde_Leegstand', excelHeader: 'DDEinde leegstand', type: COLUMN_TYPES.DATE, required: false, description: 'Vacancy end date' },
      { key: 'aantalDagen', excelHeader: 'Aantal dagen leegstand', type: COLUMN_TYPES.INTEGER, required: false, description: 'Days vacant' },
      { key: 'typeLeegstand', excelHeader: 'Type leegstand', type: COLUMN_TYPES.STRING, required: false, description: 'Vacancy type (retail, residential, mixed)' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        ddIngang: row['DDIngang_Object'],
        straat: row['Straat'],
        huisnummer: parseInt(row['Huisnummer']) || null,
        ddIngang_Leegstand: row['DDIngang Leegstand'],
        typeLeegstand: row['Type leegstand']
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['DDIngang_Object']) errors.push('DDIngang_Object is required');
      if (!row['DDIngang Leegstand']) errors.push('DDIngang Leegstand is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 7. LISA_LIJSTEN - Business Establishment List
   * External source: detailed business and employment information
   */
  {
    id: 'LISA_LIJSTEN',
    name: 'LISA Lijsten',
    category: DATASET_CATEGORIES.EXTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'Extern economie',
    sourceType: 'Extern',
    responsibleDepartment: 'Economische Zaken',
    responsiblePerson: 'Economie leverancier',
    dpiaRequired: false,
    dpiaStatus: 'Niet nodig',
    sensitivity: SENSITIVITY_LEVELS.INTERNAL,
    description: 'LISA-registratie met vestigingsnummer, SBI-code, aantal werkzame personen, BAG-gegevens.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'vestigingsnummer', excelHeader: 'Vestigingsnummer', type: COLUMN_TYPES.STRING, required: true, description: 'Establishment number' },
      { key: 'straat', excelHeader: 'Straat', type: COLUMN_TYPES.STRING, required: true, description: 'Street name' },
      { key: 'huisnummer', excelHeader: 'Huisnummer', type: COLUMN_TYPES.INTEGER, required: true, description: 'House number' },
      { key: 'huisletter', excelHeader: 'Huisletter', type: COLUMN_TYPES.STRING, required: false, description: 'House letter' },
      { key: 'huisnummertoevoeging', excelHeader: 'Huisnummertoevoeging', type: COLUMN_TYPES.STRING, required: false, description: 'House suffix' },
      { key: 'gemeente', excelHeader: 'Gemeente', type: COLUMN_TYPES.STRING, required: true, description: 'Municipality' },
      { key: 'sbiSectie', excelHeader: 'SBI sectie', type: COLUMN_TYPES.STRING, required: false, description: 'SBI section' },
      { key: 'sbiAfdeling', excelHeader: 'SBI afdeling', type: COLUMN_TYPES.STRING, required: false, description: 'SBI department' },
      { key: 'sbiCode', excelHeader: 'SBI Code', type: COLUMN_TYPES.STRING, required: true, description: 'SBI classification code' },
      { key: 'sbiOmschrijving', excelHeader: 'SBI Omschrijving', type: COLUMN_TYPES.STRING, required: false, description: 'SBI description' },
      { key: 'aantalWerkzamen', excelHeader: 'aantal werkzame personen', type: COLUMN_TYPES.INTEGER, required: false, description: 'Number of employees' },
      { key: 'datumStart', excelHeader: 'Datum start onderneming', type: COLUMN_TYPES.DATE, required: false, description: 'Business start date' },
      { key: 'wijzeStart', excelHeader: 'Wijze van Start onderneming', type: COLUMN_TYPES.STRING, required: false, description: 'Start method (new/acquisition)' },
      { key: 'bagGebruik', excelHeader: 'BAG gebruik', type: COLUMN_TYPES.STRING, required: false, description: 'BAG building use' },
      { key: 'bagIdNA', excelHeader: 'BAG-ID (na)', type: COLUMN_TYPES.STRING, required: false, description: 'BAG numbering object ID' },
      { key: 'bagOppervlakte', excelHeader: 'BAG oppervlakte', type: COLUMN_TYPES.INTEGER, required: false, description: 'BAG building area in m²' },
      { key: 'bagIdVO', excelHeader: 'BAG ID (vo)', type: COLUMN_TYPES.STRING, required: false, description: 'BAG building object ID' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        vestigingsnummer: row['Vestigingsnummer'],
        sbiCode: row['SBI Code'],
        aantalWerkzamen: parseInt(row['aantal werkzame personen']) || null
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Vestigingsnummer']) errors.push('Vestigingsnummer is required');
      if (!row['SBI Code']) errors.push('SBI Code is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 8. MEERVOUDIGE_KAMERBEWONING - Multiple Occupancy Properties
   * Internal source: properties with multiple rooms/occupants
   */
  {
    id: 'MEERVOUDIGE_KAMERBEWONING',
    name: 'Meervoudige Kamerbewoning',
    category: DATASET_CATEGORIES.INTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'Gemeente interne Bouw- en woningtoezicht',
    sourceType: 'Intern',
    responsibleDepartment: 'Bouw & Woningtoezicht',
    responsiblePerson: 'Woningtoezicht',
    dpiaRequired: false,
    dpiaStatus: 'Nee',
    sensitivity: SENSITIVITY_LEVELS.INTERNAL,
    description: 'Registratie van panden met meervoudige kamerbewoning, legalisatiestatus, en onderzoeksstatus.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'omschrijving', excelHeader: 'Omschrijving', type: COLUMN_TYPES.STRING, required: true, description: 'Property description' },
      { key: 'straat', excelHeader: 'Straat', type: COLUMN_TYPES.STRING, required: true, description: 'Street name' },
      { key: 'huisnummer', excelHeader: 'Huisnummer', type: COLUMN_TYPES.INTEGER, required: true, description: 'House number' },
      { key: 'huisletter', excelHeader: 'Huisletter', type: COLUMN_TYPES.STRING, required: false, description: 'House letter' },
      { key: 'huisnummertoevoeging', excelHeader: 'Huisnummertoevoeging', type: COLUMN_TYPES.STRING, required: false, description: 'House suffix' },
      { key: 'categorie', excelHeader: 'Categorie', type: COLUMN_TYPES.STRING, required: false, description: 'Property category' },
      { key: 'gelegaliseerd', excelHeader: 'Gelegaliseerd J/N', type: COLUMN_TYPES.BOOLEAN, required: false, description: 'Legalized (Y/N)' },
      { key: 'bijzonderheden', excelHeader: 'Bijzonderheden', type: COLUMN_TYPES.STRING, required: false, description: 'Remarks/special characteristics' },
      { key: 'adresOnderzoek', excelHeader: 'Adres in onderzoek J/N', type: COLUMN_TYPES.BOOLEAN, required: false, description: 'Under investigation (Y/N)' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        straat: row['Straat'],
        huisnummer: parseInt(row['Huisnummer']) || null,
        gelegaliseerd: row['Gelegaliseerd J/N'] === 'J',
        adresOnderzoek: row['Adres in onderzoek J/N'] === 'J'
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Straat']) errors.push('Straat is required');
      if (!row['Huisnummer']) errors.push('Huisnummer is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 9. MELDINGEN_ONDERMIJNING - Undermining Reports
   * Internal source: reports of criminal activity undermining (money laundering, trafficking, etc.)
   * SENSITIVE: DPIA required
   */
  {
    id: 'MELDINGEN_ONDERMIJNING',
    name: 'Meldingen Ondermijning',
    category: DATASET_CATEGORIES.INTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'Gemeente interne OOV',
    sourceType: 'Intern',
    responsibleDepartment: 'Veiligheid & Handhaving',
    responsiblePerson: 'OOV Coördinator',
    dpiaRequired: true,
    dpiaStatus: 'Ja - gevoelige persoonsgegevens',
    sensitivity: SENSITIVITY_LEVELS.SENSITIVE,
    description: 'Meldingen van vermoeden van ondermijning (witwassen, drugshandel, mensenhandel). Bevat vertrouwelijke en gevoelige informatie.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT],
    requiredColumns: [
      { key: 'datum', excelHeader: 'Datum', type: COLUMN_TYPES.DATE, required: true, description: 'Report date' },
      { key: 'thema', excelHeader: 'Thema', type: COLUMN_TYPES.STRING, required: true, description: 'Theme (witwassen, drugshandel, etc.)' },
      { key: 'bron', excelHeader: 'Bron', type: COLUMN_TYPES.STRING, required: false, description: 'Report source (politie, burger, inspectie)' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        datum: row['Datum'],
        thema: row['Thema'],
        bron: row['Bron']
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Datum']) errors.push('Datum is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 10. MILIEUCONTROLE - Environmental Inspections
   * Internal source: environmental compliance inspections and violations
   */
  {
    id: 'MILIEUCONTROLE',
    name: 'Milieucontroles',
    category: DATASET_CATEGORIES.INTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'Gemeente interne Milieutoezicht',
    sourceType: 'Intern',
    responsibleDepartment: 'Toezicht & Handhaving',
    responsiblePerson: 'Milieutoezicht',
    dpiaRequired: false,
    dpiaStatus: 'Nee/niet bekend',
    sensitivity: SENSITIVITY_LEVELS.INTERNAL,
    description: 'Registratie van milieucontroles, aantal overtredingen, controledata.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'naamOnderneming', excelHeader: 'Naam onderneming', type: COLUMN_TYPES.STRING, required: true, description: 'Business name' },
      { key: 'straat', excelHeader: 'Straat', type: COLUMN_TYPES.STRING, required: true, description: 'Street name' },
      { key: 'huisnummer', excelHeader: 'Huisnummer', type: COLUMN_TYPES.INTEGER, required: true, description: 'House number' },
      { key: 'huisletter', excelHeader: 'Huisletter', type: COLUMN_TYPES.STRING, required: false, description: 'House letter' },
      { key: 'huisnummertoevoeging', excelHeader: 'Huisnummertoevoeging', type: COLUMN_TYPES.STRING, required: false, description: 'House suffix' },
      { key: 'aantalControles', excelHeader: 'Aantal Controles', type: COLUMN_TYPES.INTEGER, required: false, description: 'Number of inspections' },
      { key: 'aantalOvertredingen', excelHeader: 'aantal overtredingen', type: COLUMN_TYPES.INTEGER, required: false, description: 'Number of violations' },
      { key: 'opmerking', excelHeader: 'Opmerkingen', type: COLUMN_TYPES.STRING, required: false, description: 'Remarks' },
      { key: 'controleData', excelHeader: 'Controledatum', type: COLUMN_TYPES.DATE, required: false, description: 'Inspection date' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        naamOnderneming: row['Naam onderneming'],
        aantalControles: parseInt(row['Aantal Controles']) || 0,
        aantalOvertredingen: parseInt(row['aantal overtredingen']) || 0
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Naam onderneming']) errors.push('Naam onderneming is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 11. OPENBARE_ORDE_CAMERAS - Public Order Surveillance Cameras
   * Internal source: CCTV camera locations and footage
   * SENSITIVE: DPIA required
   */
  {
    id: 'OPENBARE_ORDE_CAMERAS',
    name: 'Openbare Orde Camerabewaking',
    category: DATASET_CATEGORIES.INTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'Gemeente interne OOV',
    sourceType: 'Intern',
    responsibleDepartment: 'Veiligheid & Handhaving',
    responsiblePerson: 'OOV Coördinator',
    dpiaRequired: true,
    dpiaStatus: 'Wel aanwezig - camerabewaking',
    sensitivity: SENSITIVITY_LEVELS.SENSITIVE,
    description: 'Registratie van CCTV-camera\'s met locaties, feitcodes, en mutatiegegevens. Gevoelige beveiligingsgegevens.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT],
    requiredColumns: [
      { key: 'cameranummer', excelHeader: 'Cameranummer', type: COLUMN_TYPES.STRING, required: true, description: 'Camera number/ID' },
      { key: 'straat', excelHeader: 'Straat', type: COLUMN_TYPES.STRING, required: true, description: 'Street location' },
      { key: 'datum', excelHeader: 'Datum', type: COLUMN_TYPES.DATE, required: true, description: 'Event date' },
      { key: 'tijdstip', excelHeader: 'Tijdstip', type: COLUMN_TYPES.STRING, required: false, description: 'Event time' },
      { key: 'feitcode', excelHeader: 'Feitcode', type: COLUMN_TYPES.STRING, required: false, description: 'Police incident code' },
      { key: 'mutatietekst', excelHeader: 'Mutatietekst', type: COLUMN_TYPES.STRING, required: false, description: 'Incident description' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        cameranummer: row['Cameranummer'],
        straat: row['Straat'],
        datum: row['Datum']
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Cameranummer']) errors.push('Cameranummer is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 12. VERGUNNINGEN - Permits and Licenses
   * Internal source: permit/license applications and processing status
   */
  {
    id: 'VERGUNNINGEN',
    name: 'Vergunningen & Ontheffingen',
    category: DATASET_CATEGORIES.INTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'Gemeente interne zaaksysteem',
    sourceType: 'Intern',
    responsibleDepartment: 'Vergunningen & Toezicht',
    responsiblePerson: 'Vergunningenbeheerder',
    dpiaRequired: false,
    dpiaStatus: 'Nee/niet bekend',
    sensitivity: SENSITIVITY_LEVELS.INTERNAL,
    description: 'Registratie van vergunningsprocedures: zaaknummer, type, afhandelstatus, doorlooptijd.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'zaaknummer', excelHeader: 'Zaaknummer', type: COLUMN_TYPES.STRING, required: true, description: 'Case number' },
      { key: 'zaaktype', excelHeader: 'Zaaktype', type: COLUMN_TYPES.STRING, required: true, description: 'Type of permit (horeca, bouw, etc.)' },
      { key: 'streefAfhandeldatum', excelHeader: 'Streef afhandeldatum', type: COLUMN_TYPES.DATE, required: false, description: 'Target handling date' },
      { key: 'aantalDagenResterend', excelHeader: 'Aantal dagen resterend', type: COLUMN_TYPES.INTEGER, required: false, description: 'Days remaining for processing' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        zaaknummer: row['Zaaknummer'],
        zaaktype: row['Zaaktype']
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Zaaknummer']) errors.push('Zaaknummer is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 13. PROSTITUTIECONTROLES - Prostitution Site Inspections
   * Internal source: checks and enforcement at prostitution establishments
   * SENSITIVE: DPIA on process
   */
  {
    id: 'PROSTITUTIECONTROLES',
    name: 'Prostitutiecontroles',
    category: DATASET_CATEGORIES.INTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'Gemeente interne T&H (Toezicht & Handhaving)',
    sourceType: 'Intern',
    responsibleDepartment: 'Veiligheid & Handhaving',
    responsiblePerson: 'T&H Coördinator',
    dpiaRequired: true,
    dpiaStatus: 'Wel op proces - mensenhandel, uitbuiting',
    sensitivity: SENSITIVITY_LEVELS.SENSITIVE,
    description: 'Controleregistratie van prostitutiebedrijven met bevindingen en genomen maatregelen.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT],
    requiredColumns: [
      { key: 'zaaknummer', excelHeader: 'Zaaknummer', type: COLUMN_TYPES.STRING, required: true, description: 'Case number' },
      { key: 'straat', excelHeader: 'Straat', type: COLUMN_TYPES.STRING, required: true, description: 'Street location' },
      { key: 'huisnummer', excelHeader: 'Huisnummer', type: COLUMN_TYPES.INTEGER, required: true, description: 'House number' },
      { key: 'huisletter', excelHeader: 'Huisletter', type: COLUMN_TYPES.STRING, required: false, description: 'House letter' },
      { key: 'huisnummertoevoeging', excelHeader: 'Huisnummertoevoeging', type: COLUMN_TYPES.STRING, required: false, description: 'House suffix' },
      { key: 'datumControle', excelHeader: 'Datum controle', type: COLUMN_TYPES.DATE, required: true, description: 'Inspection date' },
      { key: 'aantalSekswerkers', excelHeader: 'Aantal aangetroffen sekswerkers', type: COLUMN_TYPES.INTEGER, required: false, description: 'Number of sex workers found' },
      { key: 'bestuumatregelen', excelHeader: 'Bestuurlijke maatregelen', type: COLUMN_TYPES.STRING, required: false, description: 'Administrative measures taken' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        zaaknummer: row['Zaaknummer'],
        straat: row['Straat'],
        datumControle: row['Datum controle']
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Zaaknummer']) errors.push('Zaaknummer is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 14. INTERVENTIES_ONDERMIJNING - Undermining Interventions
   * Internal source: summary of interventions to address undermining/criminal activity
   */
  {
    id: 'INTERVENTIES_ONDERMIJNING',
    name: 'Interventies Ondermijning',
    category: DATASET_CATEGORIES.INTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'Gemeente interne OOV',
    sourceType: 'Intern',
    responsibleDepartment: 'Veiligheid & Handhaving',
    responsiblePerson: 'OOV Coördinator',
    dpiaRequired: false,
    dpiaStatus: 'Nee',
    sensitivity: SENSITIVITY_LEVELS.INTERNAL,
    description: 'Teller van genomen interventies per straat tegen ondermijning.',
    linkLevel: LINK_LEVELS.STRAAT,
    aggregationLevels: [AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'volgnummer', excelHeader: 'Volgnummer', type: COLUMN_TYPES.INTEGER, required: true, description: 'Sequence number' },
      { key: 'straatCode', excelHeader: 'Straatcode', type: COLUMN_TYPES.STRING, required: true, description: 'Street code' },
      { key: 'aantalInterventies', excelHeader: 'Aantal interventies per straat', type: COLUMN_TYPES.INTEGER, required: true, description: 'Count of interventions per street' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        straatCode: row['Straatcode'],
        aantalInterventies: parseInt(row['Aantal interventies per straat']) || 0
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Straatcode']) errors.push('Straatcode is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 15. STATISTIEK_DEMOGRAFIE_BUURT - Demographic Statistics at Neighborhood Level
   * External source: CBS demographic data aggregated by neighborhood
   */
  {
    id: 'STATISTIEK_DEMOGRAFIE_BUURT',
    name: 'Demografische Statistieken (Buurt)',
    category: DATASET_CATEGORIES.EXTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'CBS via OpenInfo.nl',
    sourceType: 'Extern',
    responsibleDepartment: 'Economische Zaken / Onderzoek',
    responsiblePerson: 'CBS/OpenInfo',
    dpiaRequired: false,
    dpiaStatus: 'Niet nodig',
    sensitivity: SENSITIVITY_LEVELS.PUBLIC,
    description: 'Buurt-niveau demografische statistieken van CBS: inwonertal, leeftijdsgroepen, adreskwaliteit.',
    linkLevel: LINK_LEVELS.BUURT,
    aggregationLevels: [AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'buurtcode', excelHeader: 'Buurtcode', type: COLUMN_TYPES.STRING, required: true, description: 'Neighborhood code' },
      { key: 'buurtnaam', excelHeader: 'Buurtnaam', type: COLUMN_TYPES.STRING, required: true, description: 'Neighborhood name' },
      { key: 'gemeentenaam', excelHeader: 'Gemeentenaam', type: COLUMN_TYPES.STRING, required: true, description: 'Municipality name' },
      { key: 'aantalAdressen', excelHeader: 'Aantal adressen', type: COLUMN_TYPES.INTEGER, required: false, description: 'Number of addresses' },
      { key: 'aantalAdressenMetPostcode', excelHeader: 'Aantal adressen met postcode', type: COLUMN_TYPES.INTEGER, required: false, description: 'Addresses with postal code' },
      { key: 'aantalAdressenWoonfunctie', excelHeader: 'Aantal adressen met woonfunctie', type: COLUMN_TYPES.INTEGER, required: false, description: 'Residential addresses' },
      { key: 'aantalPanden', excelHeader: 'Aantal panden', type: COLUMN_TYPES.INTEGER, required: false, description: 'Number of buildings' },
      { key: 'aantalPercelen', excelHeader: 'Aantal percelen', type: COLUMN_TYPES.INTEGER, required: false, description: 'Number of land parcels' },
      { key: 'aantalWoningen', excelHeader: 'Aantal woningen', type: COLUMN_TYPES.INTEGER, required: false, description: 'Number of dwellings' },
      { key: 'aantalInwoners', excelHeader: 'Aantal inwoners', type: COLUMN_TYPES.INTEGER, required: false, description: 'Population total' },
      { key: 'inwoners0_15', excelHeader: 'Aantal inwoners 0/15', type: COLUMN_TYPES.INTEGER, required: false, description: 'Population age 0-15' },
      { key: 'inwoners15_25', excelHeader: 'Aantal inwoners 15/25', type: COLUMN_TYPES.INTEGER, required: false, description: 'Population age 15-25' },
      { key: 'inwoners25_45', excelHeader: 'Aantal inwoners 25/45', type: COLUMN_TYPES.INTEGER, required: false, description: 'Population age 25-45' },
      { key: 'inwoners45_60', excelHeader: 'Aantal inwoners 45/60', type: COLUMN_TYPES.INTEGER, required: false, description: 'Population age 45-60' },
      { key: 'inwoners65plus', excelHeader: 'Aantal inwoners >65', type: COLUMN_TYPES.INTEGER, required: false, description: 'Population age 65+' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        buurtcode: row['Buurtcode'],
        buurtnaam: row['Buurtnaam'],
        aantalInwoners: parseInt(row['Aantal inwoners']) || 0
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Buurtcode']) errors.push('Buurtcode is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 16. HANDHAVING_ALCOHOL - Alcohol License Enforcement
   * Internal source: enforcement actions on alcohol license violations
   */
  {
    id: 'HANDHAVING_ALCOHOL',
    name: 'Handhaving Alcoholgebruik',
    category: DATASET_CATEGORIES.INTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'Gemeente interne T&H',
    sourceType: 'Intern',
    responsibleDepartment: 'Veiligheid & Handhaving',
    responsiblePerson: 'T&H Coördinator',
    dpiaRequired: false,
    dpiaStatus: 'Nee/niet bekend',
    sensitivity: SENSITIVITY_LEVELS.INTERNAL,
    description: 'Registratie van handhavingsacties op alcoholwetgeving met zaakgegevens.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'zaaknummer', excelHeader: 'Zaaknummer', type: COLUMN_TYPES.STRING, required: true, description: 'Case number' },
      { key: 'zaakonderwerp', excelHeader: 'Zaakonderwerp (adres en overtreding)', type: COLUMN_TYPES.STRING, required: true, description: 'Case subject with address and violation' },
      { key: 'streefAfhandeldatum', excelHeader: 'Streef afhandeldatum', type: COLUMN_TYPES.DATE, required: false, description: 'Target closing date' },
      { key: 'aantalDagenResterend', excelHeader: 'Aantal dagen resterend', type: COLUMN_TYPES.INTEGER, required: false, description: 'Days remaining' },
      { key: 'verbalisant', excelHeader: 'Verbalisant', type: COLUMN_TYPES.STRING, required: false, description: 'Officer name' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        zaaknummer: row['Zaaknummer'],
        zaakonderwerp: row['Zaakonderwerp (adres en overtreding)']
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Zaaknummer']) errors.push('Zaaknummer is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 17. EXPLOITATIE_HORECAVERGUNNINGEN - Horeca Permit Applications
   * Internal source: restaurant/bar/cafe license applications and status
   */
  {
    id: 'EXPLOITATIE_HORECAVERGUNNINGEN',
    name: 'Exploitatie Horecavergunningen',
    category: DATASET_CATEGORIES.INTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'Gemeente interne Vergunningen',
    sourceType: 'Intern',
    responsibleDepartment: 'Vergunningen & Toezicht',
    responsiblePerson: 'Horeca Vergunningenbeheerder',
    dpiaRequired: false,
    dpiaStatus: 'Nee/niet bekend',
    sensitivity: SENSITIVITY_LEVELS.INTERNAL,
    description: 'Registratie van horecavergunningsprocedures met zaakgegevens en aanvrager.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'zaaknummer', excelHeader: 'Zaaknummer', type: COLUMN_TYPES.STRING, required: true, description: 'Case number' },
      { key: 'zaakonderwerp', excelHeader: 'Zaakonderwerp', type: COLUMN_TYPES.STRING, required: true, description: 'Case subject' },
      { key: 'streefAfhandeldatum', excelHeader: 'Streef afhandeldatum', type: COLUMN_TYPES.DATE, required: false, description: 'Target closing date' },
      { key: 'aantalDagenResterend', excelHeader: 'Aantal dagen resterend', type: COLUMN_TYPES.INTEGER, required: false, description: 'Days remaining' },
      { key: 'naamAanvrager', excelHeader: 'Naam aanvrager', type: COLUMN_TYPES.STRING, required: false, description: 'Applicant name' },
      { key: 'straatEnHuisnummer', excelHeader: 'Straat en huisnummer', type: COLUMN_TYPES.STRING, required: false, description: 'Street and house number' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        zaaknummer: row['Zaaknummer'],
        naamAanvrager: row['Naam aanvrager']
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Zaaknummer']) errors.push('Zaaknummer is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 18. VIB_VEILIGHEID_IN_BEELD - Safety in Vision Database
   * External source: police crime/incident database with geographic detail
   * SENSITIVE: WPG/AVG privacy measures applied
   */
  {
    id: 'VIB_VEILIGHEID_IN_BEELD',
    name: 'VIB - Veiligheid in Beeld',
    category: DATASET_CATEGORIES.EXTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'Bureau RVS/RIEC MN',
    sourceType: 'Extern',
    responsibleDepartment: 'Veiligheid & Handhaving',
    responsiblePerson: 'RIEC/Politie Coördinator',
    dpiaRequired: true,
    dpiaStatus: 'WPG/AVG toegepast',
    sensitivity: SENSITIVITY_LEVELS.SENSITIVE,
    description: 'VIB-database met geselecteerde politie-incidenten op adres- en wijkniveau. Vertrouwelijk en gevoelig.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'feitcode', excelHeader: 'Feitcode', type: COLUMN_TYPES.STRING, required: true, description: 'Police offense code' },
      { key: 'feitomschrijving', excelHeader: 'Feitomschrijving', type: COLUMN_TYPES.STRING, required: false, description: 'Offense description' },
      { key: 'datum', excelHeader: 'Datum', type: COLUMN_TYPES.DATE, required: true, description: 'Incident date' },
      { key: 'dag', excelHeader: 'Dag', type: COLUMN_TYPES.STRING, required: false, description: 'Day of week' },
      { key: 'maand', excelHeader: 'maand', type: COLUMN_TYPES.INTEGER, required: false, description: 'Month number' },
      { key: 'jaar', excelHeader: 'Jaar', type: COLUMN_TYPES.INTEGER, required: false, description: 'Year' },
      { key: 'wijkcode', excelHeader: 'Wijkcode', type: COLUMN_TYPES.STRING, required: false, description: 'District code' },
      { key: 'buurtcode', excelHeader: 'Buurtcode', type: COLUMN_TYPES.STRING, required: false, description: 'Neighborhood code' },
      { key: 'wijk', excelHeader: 'Wijk', type: COLUMN_TYPES.STRING, required: false, description: 'District name' },
      { key: 'buurt', excelHeader: 'Buurt', type: COLUMN_TYPES.STRING, required: false, description: 'Neighborhood name' },
      { key: 'straat', excelHeader: 'Straat', type: COLUMN_TYPES.STRING, required: false, description: 'Street name' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        feitcode: row['Feitcode'],
        datum: row['Datum'],
        straat: row['Straat']
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Datum']) errors.push('Datum is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 19. BRP - Population Register (Basic Register Persons)
   * Internal source: official resident population count by address
   */
  {
    id: 'BRP',
    name: 'BRP (Basisregistratie Personen)',
    category: DATASET_CATEGORIES.INTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'Gemeente interne Pinc Roccade',
    sourceType: 'Intern',
    responsibleDepartment: 'Burgerzaken',
    responsiblePerson: 'BRP Beheerder',
    dpiaRequired: false,
    dpiaStatus: 'Niet nodig (teller only)',
    sensitivity: SENSITIVITY_LEVELS.INTERNAL,
    description: 'Aantal inwonerstellingen per adres uit de BRP (aggregated, no personal data).',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'aantalInwoners', excelHeader: 'Aantal inwoners per adres', type: COLUMN_TYPES.INTEGER, required: true, description: 'Number of residents per address' },
      { key: 'straat', excelHeader: 'Straat', type: COLUMN_TYPES.STRING, required: true, description: 'Street name' },
      { key: 'huisnummer', excelHeader: 'Huisnummer', type: COLUMN_TYPES.INTEGER, required: true, description: 'House number' },
      { key: 'huisletter', excelHeader: 'Huisletter', type: COLUMN_TYPES.STRING, required: false, description: 'House letter' },
      { key: 'huisnummertoevoeging', excelHeader: 'Huisnummertoevoeging', type: COLUMN_TYPES.STRING, required: false, description: 'House suffix' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        straat: row['Straat'],
        huisnummer: parseInt(row['Huisnummer']) || null,
        aantalInwoners: parseInt(row['Aantal inwoners per adres']) || 0
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Straat']) errors.push('Straat is required');
      if (!row['Huisnummer']) errors.push('Huisnummer is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 20. KADASTER - Land Registry Data
   * Internal source: property ownership and parcel information
   */
  {
    id: 'KADASTER',
    name: 'Kadaster (BRK)',
    category: DATASET_CATEGORIES.INTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'Gemeente interne BRK',
    sourceType: 'Intern',
    responsibleDepartment: 'Vastgoed',
    responsiblePerson: 'Kadaster Coördinator',
    dpiaRequired: false,
    dpiaStatus: 'Nee/niet bekend',
    sensitivity: SENSITIVITY_LEVELS.INTERNAL,
    description: 'Kadastrale gegevens: omschrijving, eigendom, perceel informatie.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'kadalomschrijving', excelHeader: 'Kadastrale omschrijving', type: COLUMN_TYPES.STRING, required: true, description: 'Cadastral description' },
      { key: 'straat', excelHeader: 'Straat', type: COLUMN_TYPES.STRING, required: true, description: 'Street name' },
      { key: 'huisnummer', excelHeader: 'Huisnummer', type: COLUMN_TYPES.INTEGER, required: true, description: 'House number' },
      { key: 'huisletter', excelHeader: 'Huisletter', type: COLUMN_TYPES.STRING, required: false, description: 'House letter' },
      { key: 'huisnummertoevoeging', excelHeader: 'Huisnummertoevoeging', type: COLUMN_TYPES.STRING, required: false, description: 'House suffix' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        kadalomschrijving: row['Kadastrale omschrijving'],
        straat: row['Straat'],
        huisnummer: parseInt(row['Huisnummer']) || null
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Kadastrale omschrijving']) errors.push('Kadastrale omschrijving is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 21. HUISVERBODEN - House Bans/Entry Prohibitions
   * Internal source: court-ordered prohibitions on entering/accessing properties
   * SENSITIVE: DPIA required
   */
  {
    id: 'HUISVERBODEN',
    name: 'Huisverboden',
    category: DATASET_CATEGORIES.INTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'Gemeente interne OOV',
    sourceType: 'Intern',
    responsibleDepartment: 'Veiligheid & Handhaving',
    responsiblePerson: 'OOV Coördinator',
    dpiaRequired: true,
    dpiaStatus: 'Ja - persoonsgegevens/bewoning',
    sensitivity: SENSITIVITY_LEVELS.SENSITIVE,
    description: 'Registratie van huisverboden (entry bans), met datums.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT],
    requiredColumns: [
      { key: 'datum', excelHeader: 'Datum', type: COLUMN_TYPES.DATE, required: true, description: 'Ban date' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        datum: row['Datum']
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Datum']) errors.push('Datum is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 22. CRISISMAATREGELEN - Crisis Measures
   * Internal source: emergency/crisis intervention orders and details
   * SENSITIVE: DPIA required
   */
  {
    id: 'CRISISMAATREGELEN',
    name: 'Crisismaatregelen',
    category: DATASET_CATEGORIES.INTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'Gemeente interne OOV',
    sourceType: 'Intern',
    responsibleDepartment: 'Veiligheid & Handhaving',
    responsiblePerson: 'OOV Coördinator',
    dpiaRequired: true,
    dpiaStatus: 'Ja - crisisinterventies',
    sensitivity: SENSITIVITY_LEVELS.SENSITIVE,
    description: 'Registratie van crisismaatregelen (sluitingen, aanhoudingen) met datum en soort maatregel.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT],
    requiredColumns: [
      { key: 'datum', excelHeader: 'Datum', type: COLUMN_TYPES.DATE, required: true, description: 'Measure date' },
      { key: 'opgelegneMaatregel', excelHeader: 'Opgelegde maatregel', type: COLUMN_TYPES.STRING, required: true, description: 'Type of measure (closure, seizure, etc.)' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        datum: row['Datum'],
        opgelegneMaatregel: row['Opgelegde maatregel']
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Datum']) errors.push('Datum is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 23. SCORETABEL_ONDERNEMING - Business Quality Score Table
   * Internal source: physical inspection scores per business
   */
  {
    id: 'SCORETABEL_ONDERNEMING',
    name: 'Scoretabel Ondernemingen',
    category: DATASET_CATEGORIES.INTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'Fysieke schouw OOV',
    sourceType: 'Intern',
    responsibleDepartment: 'Veiligheid & Handhaving',
    responsiblePerson: 'Schouwmeester OOV',
    dpiaRequired: false,
    dpiaStatus: 'Nee',
    sensitivity: SENSITIVITY_LEVELS.INTERNAL,
    description: 'Scoretabel met ondernemingsscores op basis van fysieke inspectie met indicators.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'datum', excelHeader: 'Datum', type: COLUMN_TYPES.DATE, required: true, description: 'Inspection date' },
      { key: 'scorePerOnderneming', excelHeader: 'Score per onderneming', type: COLUMN_TYPES.INTEGER, required: true, description: 'Business quality score (1-10)' },
      { key: 'naamOnderneming', excelHeader: 'Naam onderneming', type: COLUMN_TYPES.STRING, required: true, description: 'Business name' },
      { key: 'straat', excelHeader: 'Straat', type: COLUMN_TYPES.STRING, required: true, description: 'Street name' },
      { key: 'huisnummer', excelHeader: 'Huisnummer', type: COLUMN_TYPES.INTEGER, required: true, description: 'House number' },
      { key: 'huisnummertoevoeging', excelHeader: 'Huisnummertoevoeging', type: COLUMN_TYPES.STRING, required: false, description: 'House suffix' },
      { key: 'huisletter', excelHeader: 'huisletter', type: COLUMN_TYPES.STRING, required: false, description: 'House letter' },
      { key: 'indicator1', excelHeader: 'Indicator 1', type: COLUMN_TYPES.STRING, required: false, description: 'First quality indicator' },
      { key: 'indicator2', excelHeader: 'Indicator 2', type: COLUMN_TYPES.STRING, required: false, description: 'Second quality indicator' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        datum: row['Datum'],
        scorePerOnderneming: parseInt(row['Score per onderneming']) || 0,
        naamOnderneming: row['Naam onderneming']
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Datum']) errors.push('Datum is required');
      if (!row['Naam onderneming']) errors.push('Naam onderneming is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 24. SCORETABEL_PAND - Building Quality Score Table
   * Internal source: physical inspection scores per building/property
   */
  {
    id: 'SCORETABEL_PAND',
    name: 'Scoretabel Panden',
    category: DATASET_CATEGORIES.INTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'Fysieke schouw OOV',
    sourceType: 'Intern',
    responsibleDepartment: 'Veiligheid & Handhaving',
    responsiblePerson: 'Schouwmeester OOV',
    dpiaRequired: false,
    dpiaStatus: 'Niet nodig',
    sensitivity: SENSITIVITY_LEVELS.INTERNAL,
    description: 'Scoretabel met pandscores op basis van fysieke inspectie.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'datum', excelHeader: 'Datum', type: COLUMN_TYPES.DATE, required: true, description: 'Inspection date' },
      { key: 'naamOnderneming', excelHeader: 'Naam onderneming', type: COLUMN_TYPES.STRING, required: false, description: 'Business name (if applicable)' },
      { key: 'straat', excelHeader: 'Straat', type: COLUMN_TYPES.STRING, required: true, description: 'Street name' },
      { key: 'huisnummer', excelHeader: 'Huisnummer', type: COLUMN_TYPES.INTEGER, required: true, description: 'House number' },
      { key: 'huisnummertoevoeging', excelHeader: 'Huisnummertoevoeging', type: COLUMN_TYPES.STRING, required: false, description: 'House suffix' },
      { key: 'huisletter', excelHeader: 'huisletter', type: COLUMN_TYPES.STRING, required: false, description: 'House letter' },
      { key: 'indicator1', excelHeader: 'Indicator 1', type: COLUMN_TYPES.STRING, required: false, description: 'First building indicator' },
      { key: 'indicator2', excelHeader: 'Indicator 2', type: COLUMN_TYPES.STRING, required: false, description: 'Second building indicator' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        datum: row['Datum'],
        straat: row['Straat'],
        huisnummer: parseInt(row['Huisnummer']) || null
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Datum']) errors.push('Datum is required');
      if (!row['Straat']) errors.push('Straat is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 25. DEMOGRAFIE_PC6 - Demographics at PC6 Level
   * External source: CBS demographic aggregations at 6-digit postal code level
   */
  {
    id: 'DEMOGRAFIE_PC6',
    name: 'Demografische Statistieken (PC6)',
    category: DATASET_CATEGORIES.EXTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'CBS via OpenInfo.nl',
    sourceType: 'Extern',
    responsibleDepartment: 'Economische Zaken / Onderzoek',
    responsiblePerson: 'CBS/OpenInfo',
    dpiaRequired: false,
    dpiaStatus: 'Niet nodig',
    sensitivity: SENSITIVITY_LEVELS.PUBLIC,
    description: 'Demografische statistieken van CBS op PC6-niveau.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.PC5, AGGREGATION_LEVELS.PC4, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'postcode6', excelHeader: 'Postcode 6', type: COLUMN_TYPES.STRING, required: true, description: '6-digit postal code' },
      { key: 'aantalInwoners', excelHeader: 'Aantal inwoners', type: COLUMN_TYPES.INTEGER, required: false, description: 'Population total' },
      { key: 'aantalHuishoudens', excelHeader: 'Aantal huishoudens', type: COLUMN_TYPES.INTEGER, required: false, description: 'Number of households' },
      { key: 'aantalWoningen', excelHeader: 'Aantal woningen', type: COLUMN_TYPES.INTEGER, required: false, description: 'Number of dwellings' },
      { key: 'gemiddeldeLeeftijd', excelHeader: 'Gemiddelde leeftijd', type: COLUMN_TYPES.DECIMAL, required: false, description: 'Average age' },
      { key: 'bevolkingsdichtheid', excelHeader: 'Bevolkingsdichtheid', type: COLUMN_TYPES.DECIMAL, required: false, description: 'Population density' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        postcode6: row['Postcode 6'],
        aantalInwoners: parseInt(row['Aantal inwoners']) || 0
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Postcode 6']) errors.push('Postcode 6 is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 26. DEMOGRAFIE_PC5 - Demographics at PC5 Level
   * External source: CBS demographic aggregations at 5-digit postal code level
   */
  {
    id: 'DEMOGRAFIE_PC5',
    name: 'Demografische Statistieken (PC5)',
    category: DATASET_CATEGORIES.EXTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'CBS via OpenInfo.nl',
    sourceType: 'Extern',
    responsibleDepartment: 'Economische Zaken / Onderzoek',
    responsiblePerson: 'CBS/OpenInfo',
    dpiaRequired: false,
    dpiaStatus: 'Niet nodig',
    sensitivity: SENSITIVITY_LEVELS.PUBLIC,
    description: 'Demografische statistieken van CBS op PC5-niveau.',
    linkLevel: LINK_LEVELS.PC5,
    aggregationLevels: [AGGREGATION_LEVELS.PC5, AGGREGATION_LEVELS.PC4, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'postcode5', excelHeader: 'Postcode 5', type: COLUMN_TYPES.STRING, required: true, description: '5-digit postal code' },
      { key: 'aantalInwoners', excelHeader: 'Aantal inwoners', type: COLUMN_TYPES.INTEGER, required: false, description: 'Population total' },
      { key: 'aantalHuishoudens', excelHeader: 'Aantal huishoudens', type: COLUMN_TYPES.INTEGER, required: false, description: 'Number of households' },
      { key: 'aantalWoningen', excelHeader: 'Aantal woningen', type: COLUMN_TYPES.INTEGER, required: false, description: 'Number of dwellings' },
      { key: 'gemiddeldeLeeftijd', excelHeader: 'Gemiddelde leeftijd', type: COLUMN_TYPES.DECIMAL, required: false, description: 'Average age' },
      { key: 'bevolkingsdichtheid', excelHeader: 'Bevolkingsdichtheid', type: COLUMN_TYPES.DECIMAL, required: false, description: 'Population density' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        postcode5: row['Postcode 5'],
        aantalInwoners: parseInt(row['Aantal inwoners']) || 0
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Postcode 5']) errors.push('Postcode 5 is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 27. DEMOGRAFIE_PC4 - Demographics at PC4 Level
   * External source: CBS demographic aggregations at 4-digit postal code level
   */
  {
    id: 'DEMOGRAFIE_PC4',
    name: 'Demografische Statistieken (PC4)',
    category: DATASET_CATEGORIES.EXTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'CBS via OpenInfo.nl',
    sourceType: 'Extern',
    responsibleDepartment: 'Economische Zaken / Onderzoek',
    responsiblePerson: 'CBS/OpenInfo',
    dpiaRequired: false,
    dpiaStatus: 'Niet nodig',
    sensitivity: SENSITIVITY_LEVELS.PUBLIC,
    description: 'Demografische statistieken van CBS op PC4-niveau.',
    linkLevel: LINK_LEVELS.PC4,
    aggregationLevels: [AGGREGATION_LEVELS.PC4, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      { key: 'postcode4', excelHeader: 'Postcode 4', type: COLUMN_TYPES.STRING, required: true, description: '4-digit postal code' },
      { key: 'aantalInwoners', excelHeader: 'Aantal inwoners', type: COLUMN_TYPES.INTEGER, required: false, description: 'Population total' },
      { key: 'aantalHuishoudens', excelHeader: 'Aantal huishoudens', type: COLUMN_TYPES.INTEGER, required: false, description: 'Number of households' },
      { key: 'aantalWoningen', excelHeader: 'Aantal woningen', type: COLUMN_TYPES.INTEGER, required: false, description: 'Number of dwellings' },
      { key: 'gemiddeldeLeeftijd', excelHeader: 'Gemiddelde leeftijd', type: COLUMN_TYPES.DECIMAL, required: false, description: 'Average age' },
      { key: 'bevolkingsdichtheid', excelHeader: 'Bevolkingsdichtheid', type: COLUMN_TYPES.DECIMAL, required: false, description: 'Population density' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        postcode4: row['Postcode 4'],
        aantalInwoners: parseInt(row['Aantal inwoners']) || 0
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Postcode 4']) errors.push('Postcode 4 is required');
      return { valid: errors.length === 0, errors };
    }
  },

  /**
   * 28. SCHOUWPLAATSEN - Inspectiedata van PWA schouw-app
   * Field inspection data: building condition, environment assessment, undermining risk indicators
   * Import format: JSON (exported from Progressive Web App)
   */
  {
    id: 'SCHOUWPLAATSEN',
    name: 'Schouwplaatsen (Inspectiedata)',
    category: DATASET_CATEGORIES.INTERN,
    status: DATASET_STATUS.OPTIONAL,
    source: 'PWA Schouw-app (veldwerk)',
    sourceType: 'Intern',
    fileType: 'JSON',
    responsibleDepartment: 'Openbare Orde en Veiligheid / Handhaving',
    responsiblePerson: 'Wijkcoördinator / Inspecteur',
    dpiaRequired: true,
    dpiaStatus: 'Vereist — locatiegebonden observaties in openbaar gebied',
    sensitivity: SENSITIVITY_LEVELS.SENSITIVE,
    description: 'Locatiegerichte inspectiedata vanuit de schouw-app (PWA). Omvat pandbeoordeling, omgevingsanalyse, ondermijningsindicatoren en situationele risicofactoren. Wordt geëxporteerd als JSON-bestand.',
    linkLevel: LINK_LEVELS.PC6,
    aggregationLevels: [AGGREGATION_LEVELS.PC6, AGGREGATION_LEVELS.STRAAT, AGGREGATION_LEVELS.BUURT, AGGREGATION_LEVELS.GEMEENTE],
    requiredColumns: [
      // === Identificatie & Locatie ===
      { key: 'schouwId', excelHeader: 'Schouw ID', type: COLUMN_TYPES.STRING, required: true, description: 'Uniek ID van de schouwsessie (UUID)' },
      { key: 'datum', excelHeader: 'Datum', type: COLUMN_TYPES.DATETIME, required: true, description: 'Datum en tijdstip van de inspectie (ISO 8601)' },
      { key: 'inspecteur', excelHeader: 'Inspecteur', type: COLUMN_TYPES.STRING, required: true, description: 'Naam of code van de inspecteur' },
      { key: 'postcode6', excelHeader: 'Postcode 6', type: COLUMN_TYPES.STRING, required: true, description: 'Exacte 6-positie postcode van de locatie' },
      { key: 'straat', excelHeader: 'Straat', type: COLUMN_TYPES.STRING, required: true, description: 'Straatnaam' },
      { key: 'huisnummer', excelHeader: 'Huisnummer', type: COLUMN_TYPES.INTEGER, required: true, description: 'Huisnummer' },
      { key: 'huisletter', excelHeader: 'Huisletter', type: COLUMN_TYPES.STRING, required: false, description: 'Huisletter (optioneel)' },
      { key: 'latitude', excelHeader: 'Latitude', type: COLUMN_TYPES.COORDINATES, required: false, description: 'GPS breedtegraad (WGS84)' },
      { key: 'longitude', excelHeader: 'Longitude', type: COLUMN_TYPES.COORDINATES, required: false, description: 'GPS lengtegraad (WGS84)' },

      // === Pandbeoordeling ===
      { key: 'pandConditie', excelHeader: 'Pand conditie', type: COLUMN_TYPES.INTEGER, required: true, description: 'Algemene conditie van het pand (1=slecht, 5=uitstekend)' },
      { key: 'pandGevel', excelHeader: 'Pand gevel', type: COLUMN_TYPES.INTEGER, required: true, description: 'Staat van de gevel (1=ernstig verwaarloosd, 5=goed onderhouden)' },
      { key: 'pandReclame', excelHeader: 'Pand reclame', type: COLUMN_TYPES.INTEGER, required: false, description: 'Kwaliteit reclame-uitingen (1=geen/verweerd, 5=professioneel)' },
      { key: 'pandVerlichting', excelHeader: 'Pand verlichting', type: COLUMN_TYPES.INTEGER, required: false, description: 'Verlichting (1=geen/kapot, 5=goed verlicht)' },
      { key: 'pandToegankelijkheid', excelHeader: 'Pand toegankelijkheid', type: COLUMN_TYPES.INTEGER, required: false, description: 'Toegankelijkheid entree (1=belemmerd, 5=goed bereikbaar)' },
      { key: 'pandVerdiepingen', excelHeader: 'Pand verdiepingen', type: COLUMN_TYPES.INTEGER, required: false, description: 'Aantal zichtbare verdiepingen' },
      { key: 'pandGebruikBoven', excelHeader: 'Pand gebruik boven', type: COLUMN_TYPES.STRING, required: false, description: 'Gebruik bovenverdieping(en): wonen/kantoor/leeg/onbekend' },
      { key: 'pandAfwijking', excelHeader: 'Pand afwijking', type: COLUMN_TYPES.BOOLEAN, required: false, description: 'Afwijkingen geconstateerd (bv. afgedekte ramen, camera\'s gericht op straat)' },
      { key: 'pandAfwijkingToelichting', excelHeader: 'Pand afwijking toelichting', type: COLUMN_TYPES.STRING, required: false, description: 'Toelichting op geconstateerde afwijkingen' },

      // === Omgevingsbeoordeling ===
      { key: 'omgevingSchoon', excelHeader: 'Omgeving schoon', type: COLUMN_TYPES.INTEGER, required: true, description: 'Schoonheid openbare ruimte (1=vuil/vervuild, 5=schoon)' },
      { key: 'omgevingGroen', excelHeader: 'Omgeving groen', type: COLUMN_TYPES.INTEGER, required: false, description: 'Aanwezigheid en staat van groen (1=geen/verwaarloosd, 5=goed onderhouden)' },
      { key: 'omgevingVerlichting', excelHeader: 'Omgeving verlichting', type: COLUMN_TYPES.INTEGER, required: true, description: 'Straatverlichting adequaat (1=donker/kapot, 5=goed verlicht)' },
      { key: 'omgevingSocialeControle', excelHeader: 'Omgeving sociale controle', type: COLUMN_TYPES.INTEGER, required: true, description: 'Mate van sociale controle/zichtbaarheid (1=geen, 5=hoog)' },
      { key: 'omgevingVerkeer', excelHeader: 'Omgeving verkeer', type: COLUMN_TYPES.INTEGER, required: false, description: 'Verkeersdruk en bereikbaarheid (1=slecht, 5=goed)' },
      { key: 'omgevingOverlast', excelHeader: 'Omgeving overlast', type: COLUMN_TYPES.BOOLEAN, required: false, description: 'Overlast waargenomen (geluid, afval, hangjongeren, etc.)' },
      { key: 'omgevingOverlastType', excelHeader: 'Omgeving overlast type', type: COLUMN_TYPES.STRING, required: false, description: 'Type overlast: geluid/afval/vervuiling/hanggedrag/drugsgebruik/anders' },

      // === Ondermijningsindicatoren ===
      { key: 'ondermijningVerdacht', excelHeader: 'Ondermijning verdacht', type: COLUMN_TYPES.BOOLEAN, required: true, description: 'Zijn er signalen van mogelijke ondermijning waargenomen?' },
      { key: 'ondermijningIndicatoren', excelHeader: 'Ondermijning indicatoren', type: COLUMN_TYPES.STRING, required: false, description: 'Geselecteerde indicatoren (kommagescheiden): afgedekte_ramen, contant_only, onlogische_openingstijden, weinig_klanten_veel_omzet, veel_contant_verkeer, camera_surveillance, snelle_wisselingen, luxe_auto_mismatch, onduidelijke_bedrijfsactiviteit, taalbarriere' },
      { key: 'ondermijningRisicoScore', excelHeader: 'Ondermijning risicoscore', type: COLUMN_TYPES.INTEGER, required: false, description: 'Geschatte risicoscore ondermijning door inspecteur (1=laag, 10=zeer hoog)' },
      { key: 'ondermijningBrancheRisico', excelHeader: 'Ondermijning brancherisico', type: COLUMN_TYPES.STRING, required: false, description: 'Inschatting branchegerelateerd risico: laag/gemiddeld/hoog/zeer_hoog' },

      // === Barrièremodel observaties ===
      { key: 'barriereVerhulling', excelHeader: 'Barrière verhulling', type: COLUMN_TYPES.INTEGER, required: false, description: 'Signalen van verhulling/afscherming (1=geen, 5=sterk)' },
      { key: 'barriereLogistiek', excelHeader: 'Barrière logistiek', type: COLUMN_TYPES.INTEGER, required: false, description: 'Opvallende logistieke activiteit (1=normaal, 5=afwijkend)' },
      { key: 'barriereFinancieel', excelHeader: 'Barrière financieel', type: COLUMN_TYPES.INTEGER, required: false, description: 'Financiële anomalieën zichtbaar (1=geen, 5=sterk)' },

      // === Totaalscores ===
      { key: 'totaalscorePand', excelHeader: 'Totaalscore pand', type: COLUMN_TYPES.DECIMAL, required: false, description: 'Berekende totaalscore pandbeoordeling (1.0-5.0)' },
      { key: 'totaalscoreOmgeving', excelHeader: 'Totaalscore omgeving', type: COLUMN_TYPES.DECIMAL, required: false, description: 'Berekende totaalscore omgevingsbeoordeling (1.0-5.0)' },
      { key: 'totaalscoreOndermijning', excelHeader: 'Totaalscore ondermijning', type: COLUMN_TYPES.DECIMAL, required: false, description: 'Berekende totaalscore ondermijningsrisico (1.0-10.0)' },

      // === Metadata ===
      { key: 'opmerkingen', excelHeader: 'Opmerkingen', type: COLUMN_TYPES.STRING, required: false, description: 'Vrije tekst opmerkingen van de inspecteur' },
      { key: 'fotoReferenties', excelHeader: 'Foto referenties', type: COLUMN_TYPES.STRING, required: false, description: 'Referenties naar bijgevoegde foto\'s (kommagescheiden bestandsnamen)' },
      { key: 'weersomstandigheden', excelHeader: 'Weersomstandigheden', type: COLUMN_TYPES.STRING, required: false, description: 'Weersomstandigheden tijdens inspectie: droog/regen/sneeuw/bewolkt' },
      { key: 'dagdeel', excelHeader: 'Dagdeel', type: COLUMN_TYPES.STRING, required: false, description: 'Dagdeel: ochtend/middag/avond/nacht' },
      { key: 'appVersie', excelHeader: 'App versie', type: COLUMN_TYPES.STRING, required: false, description: 'Versie van de schouw-app waarmee de data is verzameld' }
    ],
    optionalColumns: [],
    parseRow: function(row) {
      return {
        schouwId: row['Schouw ID'],
        datum: row['Datum'],
        inspecteur: row['Inspecteur'],
        postcode6: row['Postcode 6'],
        straat: row['Straat'],
        huisnummer: parseInt(row['Huisnummer']) || 0,
        pandConditie: parseInt(row['Pand conditie']) || null,
        pandGevel: parseInt(row['Pand gevel']) || null,
        omgevingSchoon: parseInt(row['Omgeving schoon']) || null,
        omgevingVerlichting: parseInt(row['Omgeving verlichting']) || null,
        omgevingSocialeControle: parseInt(row['Omgeving sociale controle']) || null,
        ondermijningVerdacht: row['Ondermijning verdacht'] === true || row['Ondermijning verdacht'] === 'true' || row['Ondermijning verdacht'] === 'ja',
        ondermijningRisicoScore: parseInt(row['Ondermijning risicoscore']) || null,
        totaalscorePand: parseFloat(row['Totaalscore pand']) || null,
        totaalscoreOmgeving: parseFloat(row['Totaalscore omgeving']) || null,
        totaalscoreOndermijning: parseFloat(row['Totaalscore ondermijning']) || null,
        opmerkingen: row['Opmerkingen'] || ''
      };
    },
    validateRow: function(row) {
      const errors = [];
      if (!row['Schouw ID']) errors.push('Schouw ID is verplicht');
      if (!row['Datum']) errors.push('Datum is verplicht');
      if (!row['Inspecteur']) errors.push('Inspecteur is verplicht');
      if (!row['Postcode 6']) errors.push('Postcode 6 is verplicht');
      if (!row['Straat']) errors.push('Straat is verplicht');
      if (!row['Huisnummer']) errors.push('Huisnummer is verplicht');
      const pc6 = String(row['Postcode 6'] || '');
      if (pc6 && !/^[0-9]{4}[A-Z]{2}$/.test(pc6.replace(/\s/g, '').toUpperCase())) {
        errors.push('Postcode 6 moet formaat 1234AB hebben');
      }
      const scoreFields = ['Pand conditie', 'Pand gevel', 'Omgeving schoon', 'Omgeving verlichting', 'Omgeving sociale controle'];
      for (const field of scoreFields) {
        const val = parseInt(row[field]);
        if (row[field] !== undefined && row[field] !== null && row[field] !== '' && (isNaN(val) || val < 1 || val > 5)) {
          errors.push(`${field} moet een score van 1-5 zijn`);
        }
      }
      return { valid: errors.length === 0, errors };
    }
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a dataset definition by ID
 * @param {string} datasetId - The dataset ID
 * @returns {Object|null} Dataset definition or null if not found
 */
function getDatasetById(datasetId) {
  return DATASET_DEFINITIONS.find(d => d.id === datasetId) || null;
}

/**
 * Get all optional datasets (not base or embedded)
 * @returns {Array} Array of optional dataset definitions
 */
function getOptionalDatasets() {
  return DATASET_DEFINITIONS.filter(d => d.status === DATASET_STATUS.OPTIONAL);
}

/**
 * Get all required base datasets
 * @returns {Array} Array of base dataset definitions
 */
function getRequiredDatasets() {
  return DATASET_DEFINITIONS.filter(d => d.status === DATASET_STATUS.BASE);
}

/**
 * Get all embedded datasets (read from BigQuery)
 * @returns {Array} Array of embedded dataset definitions
 */
function getEmbeddedDatasets() {
  return DATASET_DEFINITIONS.filter(d => d.status === DATASET_STATUS.EMBEDDED);
}

/**
 * Get all sensitive datasets requiring DPIA
 * @returns {Array} Array of sensitive dataset definitions
 */
function getSensitiveDatasets() {
  return DATASET_DEFINITIONS.filter(d => d.sensitivity === SENSITIVITY_LEVELS.SENSITIVE);
}

/**
 * Get datasets by category (extern, intern, embedded)
 * @param {string} category - Dataset category
 * @returns {Array} Array of datasets in category
 */
function getDatasetsByCategory(category) {
  return DATASET_DEFINITIONS.filter(d => d.category === category);
}

/**
 * Get datasets by link level
 * @param {string} linkLevel - Link level (PC6, PC5, PC4, STRAAT, BUURT, BRANCHE)
 * @returns {Array} Array of datasets with given link level
 */
function getDatasetsByLinkLevel(linkLevel) {
  return DATASET_DEFINITIONS.filter(d => d.linkLevel === linkLevel);
}

/**
 * Validate if Excel column headers match expected columns for a dataset
 * @param {string} datasetId - Dataset ID
 * @param {Array<string>} headers - Array of Excel column headers
 * @returns {Object} { valid: boolean, missingColumns: [], extraColumns: [], errors: [] }
 */
function validateDatasetColumns(datasetId, headers) {
  const dataset = getDatasetById(datasetId);
  if (!dataset) {
    return { valid: false, errors: ['Dataset not found: ' + datasetId] };
  }

  const requiredHeaders = dataset.requiredColumns
    .filter(c => c.required)
    .map(c => c.excelHeader);
  const allowedHeaders = dataset.requiredColumns
    .map(c => c.excelHeader)
    .concat(dataset.optionalColumns.map(c => c.excelHeader));

  const missing = requiredHeaders.filter(h => !headers.includes(h));
  const extra = headers.filter(h => !allowedHeaders.includes(h));

  return {
    valid: missing.length === 0,
    missingColumns: missing,
    extraColumns: extra,
    errors: missing.length > 0 ? ['Missing required columns: ' + missing.join(', ')] : []
  };
}

/**
 * Get column mapping (Excel header -> internal key) for a dataset
 * @param {string} datasetId - Dataset ID
 * @returns {Object} Column mapping object { excelHeader: internalKey }
 */
function getColumnMapping(datasetId) {
  const dataset = getDatasetById(datasetId);
  if (!dataset) return null;

  const mapping = {};
  dataset.requiredColumns.forEach(col => {
    mapping[col.excelHeader] = col.key;
  });
  dataset.optionalColumns.forEach(col => {
    mapping[col.excelHeader] = col.key;
  });
  return mapping;
}

/**
 * Generate import template headers for a dataset
 * @param {string} datasetId - Dataset ID
 * @returns {Array<string>} Array of expected Excel headers
 */
function generateImportTemplate(datasetId) {
  const dataset = getDatasetById(datasetId);
  if (!dataset) return null;

  return dataset.requiredColumns
    .map(c => c.excelHeader)
    .concat(dataset.optionalColumns.map(c => c.excelHeader));
}

/**
 * Get all dataset IDs
 * @returns {Array<string>} Array of dataset IDs
 */
function getAllDatasetIds() {
  return DATASET_DEFINITIONS.map(d => d.id);
}

/**
 * Get dataset count by status
 * @returns {Object} Count by status type
 */
function getDatasetCountByStatus() {
  return {
    base: DATASET_DEFINITIONS.filter(d => d.status === DATASET_STATUS.BASE).length,
    optional: DATASET_DEFINITIONS.filter(d => d.status === DATASET_STATUS.OPTIONAL).length,
    embedded: DATASET_DEFINITIONS.filter(d => d.status === DATASET_STATUS.EMBEDDED).length,
    total: DATASET_DEFINITIONS.length
  };
}

/**
 * Get dataset count by category
 * @returns {Object} Count by category
 */
function getDatasetCountByCategory() {
  return {
    extern: DATASET_DEFINITIONS.filter(d => d.category === DATASET_CATEGORIES.EXTERN).length,
    intern: DATASET_DEFINITIONS.filter(d => d.category === DATASET_CATEGORIES.INTERN).length,
    embedded: DATASET_DEFINITIONS.filter(d => d.category === DATASET_CATEGORIES.EMBEDDED).length
  };
}

// ============================================================================
// KOPPELSTRATEGIE — PC6 als primaire koppelkolom
// ============================================================================

/**
 * PC6 is ALTIJD de primaire koppelkolom. Datasets die niet direct op PC6 linken
 * worden via een fallback-strategie gekoppeld aan het Locatus-basisbestand.
 *
 * Koppelstrategieën per linkLevel:
 * - PC6:     Directe koppeling op Postcode 6 → geen conversie nodig
 * - STRAAT:  Koppeling via straatnaam → zoek alle PC6's in die straat via Locatus
 * - BUURT:   Koppeling via buurtcode → zoek alle PC6's in die buurt via Locatus
 * - BRANCHE: Koppeling via branchecode → match op branche in Locatus, levert PC6's
 * - PC5:     Koppeling via Postcode 5 → expandeer naar alle PC6's die beginnen met PC5
 * - PC4:     Koppeling via Postcode 4 → expandeer naar alle PC6's die beginnen met PC4
 */
const LINK_STRATEGIES = {
  [LINK_LEVELS.PC6]: {
    type: 'direct',
    description: 'Directe koppeling op Postcode 6',
    resolveToPC6: (record, locatusIndex) => {
      const pc6 = record.postcode6 || record.pc6 || record.postcode;
      if (!pc6) return [];
      const normalized = String(pc6).replace(/\s/g, '').toUpperCase();
      return locatusIndex.byPC6.has(normalized) ? [normalized] : [];
    }
  },
  [LINK_LEVELS.STRAAT]: {
    type: 'indirect',
    description: 'Koppeling via straatnaam → alle PC6\'s in die straat via Locatus',
    resolveToPC6: (record, locatusIndex) => {
      const straat = (record.straat || '').trim().toLowerCase();
      if (!straat) return [];
      return locatusIndex.byStraat.get(straat) || [];
    }
  },
  [LINK_LEVELS.BUURT]: {
    type: 'indirect',
    description: 'Koppeling via buurtcode → alle PC6\'s in die buurt via Locatus',
    resolveToPC6: (record, locatusIndex) => {
      const buurt = (record.buurtcode || record.buurt || '').trim().toLowerCase();
      if (!buurt) return [];
      return locatusIndex.byBuurt.get(buurt) || [];
    }
  },
  [LINK_LEVELS.BRANCHE]: {
    type: 'indirect',
    description: 'Koppeling via branchecode → alle PC6\'s met die branche via Locatus',
    resolveToPC6: (record, locatusIndex) => {
      const branche = (record.branche || record.branchCode || '').trim();
      if (!branche) return [];
      return locatusIndex.byBranche.get(branche) || [];
    }
  },
  [LINK_LEVELS.PC5]: {
    type: 'expand',
    description: 'Koppeling via Postcode 5 → expandeer naar alle PC6\'s',
    resolveToPC6: (record, locatusIndex) => {
      const pc5 = String(record.postcode5 || record.pc5 || '').replace(/\s/g, '').toUpperCase();
      if (!pc5 || pc5.length < 5) return [];
      return Array.from(locatusIndex.byPC6.keys()).filter(k => k.startsWith(pc5));
    }
  },
  [LINK_LEVELS.PC4]: {
    type: 'expand',
    description: 'Koppeling via Postcode 4 → expandeer naar alle PC6\'s',
    resolveToPC6: (record, locatusIndex) => {
      const pc4 = String(record.postcode4 || record.pc4 || '').replace(/\s/g, '').toUpperCase();
      if (!pc4 || pc4.length < 4) return [];
      return Array.from(locatusIndex.byPC6.keys()).filter(k => k.startsWith(pc4));
    }
  }
};

/**
 * Bouw een Locatus-index op voor snelle koppeling
 * @param {Array} locatusRecords - Array van Locatus-records met pc6, straat, buurt, branche
 * @returns {Object} Index met Maps per dimensie
 */
function buildLocatusIndex(locatusRecords) {
  const index = {
    byPC6: new Map(),
    byStraat: new Map(),
    byBuurt: new Map(),
    byBranche: new Map(),
    byPC5: new Map(),
    byPC4: new Map()
  };

  for (const record of locatusRecords) {
    const pc6 = String(record.postcode6 || record.pc6 || '').replace(/\s/g, '').toUpperCase();
    if (!pc6) continue;

    // PC6 index
    if (!index.byPC6.has(pc6)) {
      index.byPC6.set(pc6, record);
    }

    // Straat index (straat → Set van PC6's)
    const straat = (record.straat || '').trim().toLowerCase();
    if (straat) {
      if (!index.byStraat.has(straat)) index.byStraat.set(straat, []);
      const straatList = index.byStraat.get(straat);
      if (!straatList.includes(pc6)) straatList.push(pc6);
    }

    // Buurt index (buurt → Set van PC6's)
    const buurt = (record.wijkBuurt || record.buurt || '').trim().toLowerCase();
    if (buurt) {
      if (!index.byBuurt.has(buurt)) index.byBuurt.set(buurt, []);
      const buurtList = index.byBuurt.get(buurt);
      if (!buurtList.includes(pc6)) buurtList.push(pc6);
    }

    // Branche index (branche → Set van PC6's)
    const branche = (record.branche || '').trim();
    if (branche) {
      if (!index.byBranche.has(branche)) index.byBranche.set(branche, []);
      const brancheList = index.byBranche.get(branche);
      if (!brancheList.includes(pc6)) brancheList.push(pc6);
    }

    // PC5/PC4 deelsets (volgen automatisch uit PC6)
    if (pc6.length >= 5) {
      const pc5 = pc6.substring(0, 5);
      if (!index.byPC5.has(pc5)) index.byPC5.set(pc5, []);
      const pc5List = index.byPC5.get(pc5);
      if (!pc5List.includes(pc6)) pc5List.push(pc6);
    }
    if (pc6.length >= 4) {
      const pc4 = pc6.substring(0, 4);
      if (!index.byPC4.has(pc4)) index.byPC4.set(pc4, []);
      const pc4List = index.byPC4.get(pc4);
      if (!pc4List.includes(pc6)) pc4List.push(pc6);
    }
  }

  return index;
}

/**
 * Koppel een dataset-record aan PC6 via de juiste strategie
 * @param {Object} record - Dataset record
 * @param {string} datasetId - Dataset ID
 * @param {Object} locatusIndex - Locatus index (van buildLocatusIndex)
 * @returns {Array<string>} Gematchte PC6 codes
 */
function resolveRecordToPC6(record, datasetId, locatusIndex) {
  const dataset = getDatasetById(datasetId);
  if (!dataset) return [];

  const strategy = LINK_STRATEGIES[dataset.linkLevel];
  if (!strategy) return [];

  return strategy.resolveToPC6(record, locatusIndex);
}

// ============================================================================
// DEDUPLICATIE — Voorkomen van dubbele records
// ============================================================================

/**
 * Deduplicatiesleutels per dataset.
 * Elk record wordt geïdentificeerd door een combinatie van velden.
 * Als twee records dezelfde sleutel opleveren → duplicaat → verwijder de oudste.
 */
const DEDUP_KEYS = {
  LOCATUS_ONLINE: ['postcode6', 'huisnummer', 'huisletter', 'naamOnderneming'],
  KVK: ['naamOnderneming', 'straat', 'huisnummer'],
  LEEGSTAND: ['straat', 'huisnummer', 'huisletter', 'ddIngangLeegstand'],
  LISA_LIJSTEN: ['vestigingsnummer'],
  MEERVOUDIGE_KAMERBEWONING: ['straat', 'huisnummer', 'huisletter', 'categorie'],
  MELDINGEN_ONDERMIJNING: ['datum', 'thema', 'bron'],
  MILIEUCONTROLE: ['naamOnderneming', 'straat', 'huisnummer', 'controledatum'],
  OPENBARE_ORDE_CAMERAS: ['cameranummer', 'datum', 'tijdstip', 'feitcode'],
  VERGUNNINGEN: ['zaaknummer'],
  PROSTITUTIECONTROLES: ['zaaknummer'],
  INTERVENTIES_ONDERMIJNING: ['straat', 'volgnummer'],
  STATISTIEK_DEMOGRAFIE_BUURT: ['buurtcode'],
  HANDHAVING_ALCOHOL: ['zaaknummer'],
  EXPLOITATIE_HORECAVERGUNNINGEN: ['zaaknummer'],
  VIB_VEILIGHEID_IN_BEELD: ['feitcode', 'datum', 'straat'],
  BRP: ['straat', 'huisnummer', 'huisletter'],
  KADASTER: ['kadastraleOmschrijving', 'straat', 'huisnummer'],
  HUISVERBODEN: ['datum', 'postcode6'],
  CRISISMAATREGELEN: ['datum', 'opgelegdeMaatregel'],
  SCORETABEL_ONDERNEMING: ['naamOnderneming', 'straat', 'huisnummer', 'datum'],
  SCORETABEL_PAND: ['straat', 'huisnummer', 'datum'],
  DEMOGRAFIE_PC6: ['postcode6'],
  DEMOGRAFIE_PC5: ['postcode5'],
  DEMOGRAFIE_PC4: ['postcode4'],
  SCHOUWPLAATSEN: ['schouwId']
};

/**
 * Genereer een deduplicatiesleutel voor een record
 * @param {Object} record - Geparsed record
 * @param {string} datasetId - Dataset ID
 * @returns {string} Unieke sleutel voor deduplicatie
 */
function generateDedupKey(record, datasetId) {
  const keys = DEDUP_KEYS[datasetId];
  if (!keys) return JSON.stringify(record);

  return keys
    .map(k => String(record[k] || '').trim().toLowerCase())
    .join('|');
}

/**
 * Verwijder duplicaten uit een array van records
 * @param {Array} records - Array van geparsede records
 * @param {string} datasetId - Dataset ID
 * @returns {Object} { unique: Array, duplicateCount: number }
 */
function deduplicateRecords(records, datasetId) {
  const seen = new Set();
  const unique = [];
  let duplicateCount = 0;

  for (const record of records) {
    const key = generateDedupKey(record, datasetId);
    if (seen.has(key)) {
      duplicateCount++;
      continue;
    }
    seen.add(key);
    unique.push(record);
  }

  return { unique, duplicateCount };
}

// ============================================================================
// EXPORTS
// ============================================================================

const _exports = {
  // Constanten
  DATASET_CATEGORIES,
  DATASET_STATUS,
  LINK_LEVELS,
  SENSITIVITY_LEVELS,
  AGGREGATION_LEVELS,
  COLUMN_TYPES,
  LINK_STRATEGIES,
  DEDUP_KEYS,
  DATASET_DEFINITIONS,
  // Dataset opvragen
  getDatasetById,
  getOptionalDatasets,
  getRequiredDatasets,
  getEmbeddedDatasets,
  getSensitiveDatasets,
  getDatasetsByCategory,
  getDatasetsByLinkLevel,
  getAllDatasetIds,
  getDatasetCountByStatus,
  getDatasetCountByCategory,
  // Kolomvalidatie en mapping
  validateDatasetColumns,
  getColumnMapping,
  generateImportTemplate,
  // Koppelstrategie (PC6 als primair)
  buildLocatusIndex,
  resolveRecordToPC6,
  // Deduplicatie
  generateDedupKey,
  deduplicateRecords
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = _exports;
}

if (typeof window !== 'undefined') {
  window.ImportSpecifications = _exports;
}
