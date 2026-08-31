// Comprehensive Nigerian JAMB / UTME Question Bank across all major subjects
export const NIGERIAN_JAMB_SUBJECTS = [
  // Core & Languages
  { name: 'Use of English', category: 'Core (Mandatory)', isMandatory: true },
  { name: 'Literature in English', category: 'Arts & Humanities' },
  { name: 'Yoruba', category: 'Languages' },
  { name: 'Igbo', category: 'Languages' },
  { name: 'Hausa', category: 'Languages' },
  { name: 'French', category: 'Languages' },

  // Sciences
  { name: 'Mathematics', category: 'Sciences' },
  { name: 'Physics', category: 'Sciences' },
  { name: 'Chemistry', category: 'Sciences' },
  { name: 'Biology', category: 'Sciences' },
  { name: 'Agricultural Science', category: 'Sciences' },
  { name: 'Computer Studies', category: 'Sciences' },
  { name: 'Further Mathematics', category: 'Sciences' },

  // Commercial & Social Sciences
  { name: 'Economics', category: 'Commercial & Social Sciences' },
  { name: 'Commerce', category: 'Commercial & Social Sciences' },
  { name: 'Principles of Accounts', category: 'Commercial & Social Sciences' },
  { name: 'Government', category: 'Commercial & Social Sciences' },
  { name: 'Geography', category: 'Commercial & Social Sciences' },
  { name: 'Civic Education', category: 'Commercial & Social Sciences' },

  // Humanities & Religious Knowledge
  { name: 'Christian Religious Knowledge', category: 'Humanities & Religion' },
  { name: 'Islamic Religious Knowledge', category: 'Humanities & Religion' },
  { name: 'History', category: 'Humanities & Religion' },
  { name: 'Music', category: 'Humanities & Religion' },
  { name: 'Visual Arts', category: 'Humanities & Religion' },
];

export const POPULAR_COMBOS = [
  {
    title: 'Medicine / Surgery & Life Sciences',
    icon: '🩺',
    subjects: ['Use of English', 'Biology', 'Chemistry', 'Physics'],
    targetCutoff: '280+',
  },
  {
    title: 'Engineering & Technology / Computer Science',
    icon: '⚙️',
    subjects: ['Use of English', 'Mathematics', 'Physics', 'Chemistry'],
    targetCutoff: '260+',
  },
  {
    title: 'Law / International Studies & Humanities',
    icon: '⚖️',
    subjects: ['Use of English', 'Literature in English', 'Government', 'Christian Religious Knowledge'],
    targetCutoff: '270+',
  },
  {
    title: 'Accounting / Finance & Business Admin',
    icon: '💼',
    subjects: ['Use of English', 'Mathematics', 'Economics', 'Principles of Accounts'],
    targetCutoff: '240+',
  },
  {
    title: 'Economics / Mass Comm & Social Sciences',
    icon: '📊',
    subjects: ['Use of English', 'Mathematics', 'Economics', 'Government'],
    targetCutoff: '250+',
  },
  {
    title: 'Pharmacy & Agricultural Sciences',
    icon: '🌿',
    subjects: ['Use of English', 'Biology', 'Chemistry', 'Agricultural Science'],
    targetCutoff: '250+',
  },
];

export const jambQuestionBank = {
  'Use of English': [
    {
      q: 'Choose the option opposite in meaning to the underlined word: The manager delivered an <u>extempore</u> address to the shareholders.',
      options: ['A. Prepared and rehearsed', 'B. Immediate and brief', 'C. Eloquent and polished', 'D. Impromptu and sudden'],
      ans: 'A',
      topic: 'Antonyms & Vocabulary',
      explanation: '"Extempore" means spoken or done without preparation. The antonym is "Prepared and rehearsed".'
    },
    {
      q: 'Fill in the blank with the most appropriate option: Neither the head prefect nor the assistant prefects ______ available for the meeting yesterday.',
      options: ['A. was', 'B. were', 'C. is', 'D. has been'],
      ans: 'B',
      topic: 'Concord & Subject-Verb Agreement',
      explanation: 'In correlative conjunctions ("neither...nor"), the verb agrees with the closer subject ("assistant prefects" is plural, requiring "were").'
    },
    {
      q: 'Identify the word with the correct primary stress pattern:',
      options: ['A. PHO-to-graph-ic', 'B. pho-to-GRAPH-ic', 'C. pho-TO-graph-ic', 'D. pho-to-graph-IC'],
      ans: 'B',
      topic: 'Oral English (Stress Placement)',
      explanation: 'Words ending in "-ic" carry the primary stress on the penultimate (second-to-last) syllable: pho-to-GRAPH-ic.'
    },
    {
      q: 'Choose the option nearest in meaning to the underlined idiom: The commissioner decided to <u>throw in the towel</u> after the investigation.',
      options: ['A. Surrender or concede defeat', 'B. Clean up the office', 'C. Demand a fresh probe', 'D. Appeal to the public'],
      ans: 'A',
      topic: 'Idioms & Figurative Expressions',
      explanation: 'To "throw in the towel" means to admit defeat or quit an endeavor.'
    },
    {
      q: 'Select the option that best completes the sentence: She insisted on ______ her own tuition fees.',
      options: ['A. pay', 'B. paying', 'C. paid', 'D. to pay'],
      ans: 'B',
      topic: 'Prepositional Complementation & Gerunds',
      explanation: 'The preposition "on" takes a gerund ("paying"), hence "insisted on paying".'
    },
    {
      q: 'Identify the figure of speech in: "The Nigerian economy was an untamed stallion racing against high inflation."',
      options: ['A. Simile', 'B. Metaphor', 'C. Personification', 'D. Oxymoron'],
      ans: 'B',
      topic: 'Figures of Speech & Comprehension',
      explanation: 'A direct comparison without the use of "like" or "as" constitutes a Metaphor.'
    }
  ],

  'Mathematics': [
    {
      q: 'If 3^(2x - 1) = 81, find the value of x.',
      options: ['A. 2', 'B. 2.5', 'C. 3', 'D. 1.5'],
      ans: 'B',
      topic: 'Indices & Logarithms',
      explanation: '81 = 3^4. Therefore 2x - 1 = 4 => 2x = 5 => x = 2.5.'
    },
    {
      q: 'Evaluate log₁₀(25) + log₁₀(40) without using tables.',
      options: ['A. 2', 'B. 3', 'C. 4', 'D. 1'],
      ans: 'B',
      topic: 'Logarithmic Laws',
      explanation: 'log₁₀(25 * 40) = log₁₀(1000) = log₁₀(10^3) = 3.'
    },
    {
      q: 'A box contains 6 red, 4 blue, and 5 green balls. What is the probability of picking a blue ball at random?',
      options: ['A. 1/3', 'B. 4/15', 'C. 2/5', 'D. 1/5'],
      ans: 'B',
      topic: 'Probability & Combinatorics',
      explanation: 'Total balls = 6 + 4 + 5 = 15. Probability = 4 / 15.'
    },
    {
      q: 'Find the derivative of y = 3x³ - 5x² + 7x - 9 with respect to x.',
      options: ['A. 9x² - 10x + 7', 'B. 6x² - 10x + 7', 'C. 9x² - 5x + 7', 'D. 3x² - 10x'],
      ans: 'A',
      topic: 'Calculus (Differentiation)',
      explanation: 'dy/dx = 3(3)x² - 2(5)x + 7 = 9x² - 10x + 7.'
    },
    {
      q: 'If the 3rd term of an Arithmetic Progression (A.P.) is 10 and the 7th term is 22, find the common difference (d).',
      options: ['A. 2', 'B. 3', 'C. 4', 'D. 5'],
      ans: 'B',
      topic: 'Sequences & Series (A.P. & G.P.)',
      explanation: 'T_7 - T_3 = (a + 6d) - (a + 2d) = 4d = 22 - 10 = 12 => d = 3.'
    },
    {
      q: 'Solve for x in the quadratic equation 2x² - 7x + 3 = 0.',
      options: ['A. x = 3 or x = 1/2', 'B. x = -3 or x = -1/2', 'C. x = 2 or x = 3/2', 'D. x = 1 or x = 3'],
      ans: 'A',
      topic: 'Quadratic Equations',
      explanation: '(2x - 1)(x - 3) = 0 => 2x = 1 (x = 1/2) or x = 3.'
    }
  ],

  'Physics': [
    {
      q: 'A stone of mass 0.5kg is thrown vertically upwards with a velocity of 20m/s. Calculate the maximum height reached (g = 10m/s²).',
      options: ['A. 10 m', 'B. 20 m', 'C. 40 m', 'D. 15 m'],
      ans: 'B',
      topic: 'Motion & Kinematics',
      explanation: 'h = v² / (2g) = (20)² / (2 * 10) = 400 / 20 = 20m.'
    },
    {
      q: 'Which of the following electromagnetic radiations has the shortest wavelength and highest frequency?',
      options: ['A. Radio waves', 'B. Visible light', 'C. Ultraviolet rays', 'D. Gamma rays'],
      ans: 'D',
      topic: 'Electromagnetic Spectrum',
      explanation: 'Gamma rays possess the highest frequency and shortest wavelength in the electromagnetic spectrum.'
    },
    {
      q: 'An electric kettle rated 2.0 kW is used for 30 minutes. Calculate the electrical energy consumed in kilowatt-hours (kWh).',
      options: ['A. 1.0 kWh', 'B. 2.0 kWh', 'C. 0.5 kWh', 'D. 60 kWh'],
      ans: 'A',
      topic: 'Current Electricity & Power',
      explanation: 'Energy = Power (kW) * Time (hours) = 2.0 kW * 0.5 h = 1.0 kWh.'
    },
    {
      q: 'The phenomenon whereby light splits into its component spectral colors when passing through a triangular glass prism is called:',
      options: ['A. Refraction', 'B. Dispersion', 'C. Diffraction', 'D. Polarization'],
      ans: 'B',
      topic: 'Optics & Light Dispersion',
      explanation: 'The separation of white light into its constituent wavelengths through a prism is Dispersion.'
    },
    {
      q: 'A body submerged in a fluid experiences an upthrust equal to the weight of the fluid displaced. This principle is credited to:',
      options: ['A. Boyle', 'B. Pascal', 'C. Archimedes', 'D. Hooke'],
      ans: 'C',
      topic: 'Fluid Mechanics & Upthrust',
      explanation: 'Archimedes Principle states that the upward buoyant force is equal to the weight of the displaced fluid.'
    }
  ],

  'Chemistry': [
    {
      q: 'What is the oxidation state of Chromium in K₂Cr₂O₇?',
      options: ['A. +3', 'B. +6', 'C. +7', 'D. +4'],
      ans: 'B',
      topic: 'Redox Reactions & Oxidation States',
      explanation: '2(+1) + 2(Cr) + 7(-2) = 0 => 2 + 2Cr - 14 = 0 => 2Cr = 12 => Cr = +6.'
    },
    {
      q: 'Which of the following hydrocarbons will decolorize acidified KMnO₄ and bromine water rapidly?',
      options: ['A. Methane (CH₄)', 'B. Ethane (C₂H₆)', 'C. Ethene (C₂H₄)', 'D. Propane (C₃H₈)'],
      ans: 'C',
      topic: 'Organic Chemistry (Alkenes & Unsaturates)',
      explanation: 'Ethene contains a carbon-carbon double bond (unsaturated), reacting readily with bromine water and KMnO₄.'
    },
    {
      q: 'According to Le Chatelier’s principle, increasing the pressure in the reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g) will:',
      options: ['A. Shift equilibrium to the right (forward)', 'B. Shift equilibrium to the left (backward)', 'C. Have no effect on yield', 'D. Reduce the rate of reaction'],
      ans: 'A',
      topic: 'Chemical Equilibrium',
      explanation: 'The reactant side has 4 moles of gas while product side has 2 moles. Increased pressure shifts equilibrium toward fewer gas moles (forward).'
    },
    {
      q: 'The process of separating petroleum into its various fractions based on differences in boiling points is called:',
      options: ['A. Destructive distillation', 'B. Fractional distillation', 'C. Crystallization', 'D. Sublimation'],
      ans: 'B',
      topic: 'Petroleum & Separation Techniques',
      explanation: 'Fractional distillation separates crude petroleum components according to boiling point fractions.'
    },
    {
      q: 'Which of the following elements has the electronic configuration 1s² 2s² 2p⁶ 3s² 3p⁴?',
      options: ['A. Silicon', 'B. Phosphorus', 'C. Sulfur', 'D. Chlorine'],
      ans: 'C',
      topic: 'Atomic Structure & Periodic Table',
      explanation: 'Total electrons = 2 + 2 + 6 + 2 + 4 = 16, which corresponds to Sulfur (Atomic Number 16).'
    }
  ],

  'Biology': [
    {
      q: 'Which organelle is responsible for cellular respiration and ATP energy synthesis in eukaryotic cells?',
      options: ['A. Ribosome', 'B. Mitochondrion', 'C. Chloroplast', 'D. Golgi apparatus'],
      ans: 'B',
      topic: 'Cell Biology & Organelles',
      explanation: 'The mitochondrion is known as the powerhouse of the cell where ATP synthesis takes place through the Krebs cycle.'
    },
    {
      q: 'In humans, which chamber of the heart pumps oxygenated blood into the aorta for systemic circulation?',
      options: ['A. Right Atrium', 'B. Right Ventricle', 'C. Left Ventricle', 'D. Left Atrium'],
      ans: 'C',
      topic: 'Circulatory System & Physiology',
      explanation: 'The left ventricle has the thickest muscular wall and pumps oxygenated blood into the aorta.'
    },
    {
      q: 'A cross between a homozygous dominant tall pea plant (TT) and a homozygous recessive dwarf plant (tt) yields which F1 generation phenotype?',
      options: ['A. 100% Tall', 'B. 50% Tall, 50% Dwarf', 'C. 75% Tall, 25% Dwarf', 'D. 100% Dwarf'],
      ans: 'A',
      topic: 'Genetics & Mendelian Inheritance',
      explanation: 'All F1 offspring have genotype Tt (heterozygous) and exhibit the dominant Tall phenotype.'
    },
    {
      q: 'The structural and functional unit of the mammalian kidney responsible for ultrafiltration and osmoregulation is the:',
      options: ['A. Neuron', 'B. Nephron', 'C. Alveolus', 'D. Villi'],
      ans: 'B',
      topic: 'Excretory System & Kidney Physiology',
      explanation: 'The nephron filters blood and forms urine through ultrafiltration and selective reabsorption.'
    },
    {
      q: 'Which of the following associations is an example of mutualism?',
      options: ['A. Tapeworm in human intestine', 'B. Nitrogen-fixing bacteria in root nodules of legumes', 'C. Epiphytes on tree branches', 'D. Plasmodium in mosquito salivary glands'],
      ans: 'B',
      topic: 'Ecology & Symbiotic Relationships',
      explanation: 'Rhizobium bacteria provide fixed nitrogen while the legume plant supplies carbohydrates—both organisms benefit.'
    }
  ],

  'Economics': [
    {
      q: 'When the percentage change in quantity demanded is greater than the percentage change in price, demand is said to be:',
      options: ['A. Price inelastic', 'B. Price elastic', 'C. Unitary elastic', 'D. Perfectly inelastic'],
      ans: 'B',
      topic: 'Elasticity of Demand & Supply',
      explanation: 'When percentage change in quantity demanded exceeds percentage change in price, Elasticity > 1 (Elastic).'
    },
    {
      q: 'The central bank can curb demand-pull inflation by:',
      options: ['A. Lowering cash reserve ratios', 'B. Buying government bonds on the open market', 'C. Increasing the Monetary Policy Rate (MPR)', 'D. Reducing taxes on income'],
      ans: 'C',
      topic: 'Monetary Policy & Inflation Control',
      explanation: 'Raising the Monetary Policy Rate (interest rate) increases borrowing costs, contracting money supply and reducing inflation.'
    },
    {
      q: 'In a perfectly competitive market in the long run, firms earn:',
      options: ['A. Supernormal profit', 'B. Subnormal profit', 'C. Normal profit', 'D. Monopoly rent'],
      ans: 'C',
      topic: 'Market Structures & Price Theory',
      explanation: 'Free entry and exit of firms erode excess profits until each firm makes only normal profit in long-run equilibrium.'
    },
    {
      q: 'The law of diminishing marginal utility states that as consumption of a good increases:',
      options: ['A. Total utility decreases immediately', 'B. The additional satisfaction derived from each subsequent unit decreases', 'C. Price must increase', 'D. Consumer income doubles'],
      ans: 'B',
      topic: 'Theory of Consumer Behavior',
      explanation: 'Marginal utility declines with each extra unit of a commodity consumed during a given period.'
    }
  ],

  'Government': [
    {
      q: 'Which Nigerian constitution introduced the elective principle for the first time in 1922?',
      options: ['A. Clifford Constitution', 'B. Richards Constitution', 'C. Macpherson Constitution', 'D. Lyttelton Constitution'],
      ans: 'A',
      topic: 'Nigerian Constitutional Development',
      explanation: 'The Hugh Clifford Constitution of 1922 introduced the elective principle, establishing 4 elected legislative seats (3 for Lagos, 1 for Calabar).'
    },
    {
      q: 'A system of government in which constitutional power is divided between a central authority and constituent regional governments is:',
      options: ['A. Unitary system', 'B. Federal system', 'C. Confederal system', 'D. Monarchical system'],
      ans: 'B',
      topic: 'Forms of Government & Federalism',
      explanation: 'Federalism distributes supreme constitutional powers between national and federating sub-units.'
    },
    {
      q: 'The organ of government primarily charged with interpreting laws and administering justice is the:',
      options: ['A. Legislature', 'B. Executive', 'C. Judiciary', 'D. Civil Service Commission'],
      ans: 'C',
      topic: 'Separation of Powers & Organs of State',
      explanation: 'The Judiciary interprets statutes, resolves disputes, and enforces constitutional compliance.'
    },
    {
      q: 'The policy of Indirect Rule implemented in Northern Nigeria by Lord Lugard succeeded largely due to:',
      options: ['A. The absence of traditional rulers', 'B. The existing centralized Emirate system', 'C. Rapid industrial development', 'D. Direct democratic voting'],
      ans: 'B',
      topic: 'Colonial Administration & Indirect Rule',
      explanation: 'The pre-existing hierarchical, centralized Islamic Emirate system in the North allowed the British to rule through established Emirs.'
    }
  ],

  'Literature in English': [
    {
      q: 'The central character in a literary work whose struggle forms the main narrative action is termed the:',
      options: ['A. Antagonist', 'B. Protagonist', 'C. Foil', 'D. Narrator'],
      ans: 'B',
      topic: 'Literary Devices & Characterization',
      explanation: 'The protagonist is the leading or central character around whom the plot revolves.'
    },
    {
      q: 'In dramatic tragedy, the tragic flaw or fatal error of judgment leading to the hero’s downfall is known as:',
      options: ['A. Hubris', 'B. Hamartia', 'C. Catharsis', 'D. Anagnorisis'],
      ans: 'B',
      topic: 'Drama & Classical Tragedy Terms',
      explanation: 'Hamartia is the internal character flaw or error that precipitates the tragic hero’s ruin.'
    },
    {
      q: 'Identify the poetic device in: "The sun was a golden coin minted in the clear African sky."',
      options: ['A. Metaphor', 'B. Hyperbole', 'C. Apostrophe', 'D. Onomatopoeia'],
      ans: 'A',
      topic: 'Poetic Techniques & Imagery',
      explanation: 'Comparing the sun directly to a golden coin without "like" or "as" is a metaphor.'
    }
  ],

  'Principles of Accounts': [
    {
      q: 'Which of the following accounts normally carries a debit balance on the trial balance?',
      options: ['A. Capital Account', 'B. Purchases Account', 'C. Sales Account', 'D. Creditors / Accounts Payable'],
      ans: 'B',
      topic: 'Double Entry & Trial Balance',
      explanation: 'Purchases represent expenses/cost of stock, carrying a normal debit balance.'
    },
    {
      q: 'The accounting concept which assumes that a business entity will continue operating indefinitely into the foreseeable future is:',
      options: ['A. Prudence concept', 'B. Going Concern concept', 'C. Entity concept', 'D. Matching concept'],
      ans: 'B',
      topic: 'Accounting Concepts & Principles',
      explanation: 'Going Concern assumes the business has neither the intention nor the necessity of liquidation in the near future.'
    },
    {
      q: 'A credit purchase of office furniture for ₦250,000 should be debited to which account?',
      options: ['A. Purchases Account', 'B. Office Furniture (Fixed Asset) Account', 'C. Cash Account', 'D. Sales Account'],
      ans: 'B',
      topic: 'Fixed Assets & Capital Expenditure',
      explanation: 'Purchases of capital equipment for use (not resale) are debited to the specific Fixed Asset account.'
    }
  ],

  'Commerce': [
    {
      q: 'Which document is sent by a seller to a buyer to correct an undercharge on a previous commercial invoice?',
      options: ['A. Credit Note', 'B. Debit Note', 'C. Proforma Invoice', 'D. Consignment Note'],
      ans: 'B',
      topic: 'Trade Documents & Invoicing',
      explanation: 'A Debit Note is issued to increase the amount owed by the buyer (correcting an undercharge).'
    },
    {
      q: 'The commercial activity of holding goods in safe storage from the time of production until they are demanded by consumers is:',
      options: ['A. Insurance', 'B. Warehousing', 'C. Banking', 'D. Advertising'],
      ans: 'B',
      topic: 'Aids to Trade (Warehousing)',
      explanation: 'Warehousing bridges the time gap between production and consumption, preventing price fluctuations.'
    }
  ],

  'Agricultural Science': [
    {
      q: 'Which of the following soil types has the highest water retention capacity and smallest particle size?',
      options: ['A. Sandy soil', 'B. Loamy soil', 'C. Clay soil', 'D. Silt soil'],
      ans: 'C',
      topic: 'Soil Science & Properties',
      explanation: 'Clay soils have the finest microscopic particles and greatest water-holding capability.'
    },
    {
      q: 'The process of castrating male farm animals helps to:',
      options: ['A. Increase aggressive behavior', 'B. Improve meat quality and promote docility', 'C. Accelerate sexual maturity', 'D. Increase horn growth'],
      ans: 'B',
      topic: 'Animal Husbandry & Management',
      explanation: 'Castration makes livestock docile and improves carcass tenderness and fat distribution.'
    }
  ],

  'Geography': [
    {
      q: 'Lines drawn on a map connecting points of equal atmospheric pressure are called:',
      options: ['A. Isotherms', 'B. Isobars', 'C. Isohyets', 'D. Contours'],
      ans: 'B',
      topic: 'Map Work & Meteorological Elements',
      explanation: 'Isobars link areas experiencing identical atmospheric barometric pressure.'
    },
    {
      q: 'The highest mountain peak in Nigeria is situated along the Mambilla Plateau and is known as:',
      options: ['A. Mount Patti', 'B. Chappal Waddi (Gangirwal)', 'C. Olumo Rock', 'D. Idanre Hills'],
      ans: 'B',
      topic: 'Physical Geography of Nigeria',
      explanation: 'Chappal Waddi (2,419 meters) in Taraba State is Nigeria’s highest geographic elevation.'
    }
  ],

  'Christian Religious Knowledge': [
    {
      q: 'According to the gospel of Luke, which Roman Emperor issued the census decree when Jesus was born in Bethlehem?',
      options: ['A. Emperor Tiberius', 'B. Caesar Augustus', 'C. Emperor Nero', 'D. Pontius Pilate'],
      ans: 'B',
      topic: 'New Testament & Gospels',
      explanation: 'Luke 2:1 records that Caesar Augustus decreed a worldwide census, leading Joseph and Mary to Bethlehem.'
    },
    {
      q: 'On the day of Pentecost in Acts of the Apostles chapter 2, the disciples received:',
      options: ['A. The Holy Spirit with tongues of fire', 'B. A golden tablet from heaven', 'C. Deliverance from Roman soldiers', 'D. Immunity from taxation'],
      ans: 'A',
      topic: 'Acts of Apostles & Early Church',
      explanation: 'The Holy Spirit descended upon the disciples in Jerusalem with the sound of a rushing wind and tongues of fire.'
    }
  ],

  'Islamic Religious Knowledge': [
    {
      q: 'The second Pillar of Islam, which involves performing five mandatory daily prayers, is known in Arabic as:',
      options: ['A. Shahadah', 'B. Salah', 'C. Zakah', 'D. Sawm'],
      ans: 'B',
      topic: 'Pillars of Islam (Arkan al-Islam)',
      explanation: 'Salah is the formal ritual prayer performed five times daily facing the Qiblah in Makkah.'
    },
    {
      q: 'The Surah known as the "Heart of the Quran" is:',
      options: ['A. Surah Al-Baqarah', 'B. Surah Ya-Sin', 'C. Surah Al-Fatihah', 'D. Surah Al-Ikhlas'],
      ans: 'B',
      topic: 'Quranic Sciences & Exegesis',
      explanation: 'Prophet Muhammad (PBUH) designated Surah Ya-Sin (Surah 36) as the Heart of the Quran.'
    }
  ],

  'Civic Education': [
    {
      q: 'The agency established by the Federal Government of Nigeria to fight economic and financial crimes is:',
      options: ['A. NDLEA', 'B. EFCC', 'C. FRSC', 'D. NAFDAC'],
      ans: 'B',
      topic: 'Rule of Law & Anti-Corruption Institutions',
      explanation: 'The Economic and Financial Crimes Commission (EFCC) investigates and prosecutes financial crimes in Nigeria.'
    }
  ],

  'Computer Studies': [
    {
      q: 'Which component of the Central Processing Unit (CPU) executes arithmetic operations and logical comparisons?',
      options: ['A. Control Unit (CU)', 'B. Arithmetic and Logic Unit (ALU)', 'C. Registers', 'D. System Bus'],
      ans: 'B',
      topic: 'Computer Hardware & Architecture',
      explanation: 'The ALU performs all basic mathematical computations (+, -, *, /) and logical evaluations (AND, OR, NOT).'
    }
  ],

  'Further Mathematics': [
    {
      q: 'Evaluate the limit: lim (x → 2) of (x² - 4) / (x - 2).',
      options: ['A. 0', 'B. 2', 'C. 4', 'D. Undefined'],
      ans: 'C',
      topic: 'Pure Mathematics (Limits & Continuity)',
      explanation: 'Factor numerator: (x - 2)(x + 2) / (x - 2) = x + 2. As x → 2, limit = 2 + 2 = 4.'
    }
  ],

  'Yoruba': [
    {
      q: 'Kí ni àmì ohùn tó wà lórí fáwẹ́lì inú ọ̀rọ̀ "Bàbá"?',
      options: ['A. Àmì Òkè àti Àmì Ìsàlẹ̀', 'B. Àmì Ìsàlẹ̀ àti Àmì Òkè', 'C. Àmì Àárín àti Àmì Òkè', 'D. Àmì Ìsàlẹ̀ méjì'],
      ans: 'B',
      topic: 'Àmì Ohùn àti Ìró Èdè Yorùbá',
      explanation: '"Bà" gba àmì ìsàlẹ̀ (dò), nígbà tí "bá" gba àmì òkè (mí).'
    }
  ],

  'Igbo': [
    {
      q: 'Kedu akara ụdaume dị na mkpụrụokwu "Ọnụ"?',
      options: ['A. Ụdaelu na Ụdaala', 'B. Ụdaala na Ụdaelu', 'C. Ụdaala na Ụdaala', 'D. Ụdaelu na Ụdaelu'],
      ans: 'A',
      topic: 'Akara Ụdaume na Ụtọasụsụ Igbo',
      explanation: 'Mkpụrụokwu "Ọnụ" nwere ụdaelu na "Ọ" yana ụdaala na "nụ".'
    }
  ],

  'Hausa': [
    {
      q: 'Wane ne babban marubucin littafin "Ruwan Bagaja" a adabin Hausa?',
      options: ['A. Abubakar Imam', 'B. Sa\'adu Zungur', 'C. Bello Kagara', 'D. Shata Katsina'],
      ans: 'A',
      topic: 'Adabin Hausa da Marubuta',
      explanation: 'Alhaji Abubakar Imam ne ya rubuta fitaccen littafin "Ruwan Bagaja" a shekarar 1934.'
    }
  ],

  'French': [
    {
      q: 'Choisissez la bonne conjugaison: "Hier, nous ______ au marché central de Lagos."',
      options: ['A. allons', 'B. sommes allés', 'C. irons', 'D. aller'],
      ans: 'B',
      topic: 'French Grammar (Passé Composé)',
      explanation: 'The past tense of "aller" with subject "nous" takes auxiliary "être" -> "sommes allés".'
    }
  ],

  'History': [
    {
      q: 'The ancient Nok culture of central Nigeria is historically renowned for its pioneering:',
      options: ['A. Terracotta sculptures and early iron smelting', 'B. Pyramids of limestone', 'C. Sailing vessels', 'D. Paper manufacturing'],
      ans: 'A',
      topic: 'Pre-Colonial Nigerian Civilizations',
      explanation: 'The Nok civilization (c. 500 BC to 200 AD) produced world-famous terracotta artifacts and early iron technology.'
    }
  ],

  'Music': [
    {
      q: 'The traditional Yoruba talking drum that mimics the tonal inflections of human speech is the:',
      options: ['A. Gangan (Dùndún)', 'B. Ogene', 'C. Kakaki', 'D. Udu'],
      ans: 'A',
      topic: 'Indigenous Nigerian Musical Instruments',
      explanation: 'The Gangan is an hourglass-shaped pressure drum capable of reproducing the tonal pitches of the Yoruba language.'
    }
  ],

  'Visual Arts': [
    {
      q: 'The world-famous Benin bronze casting tradition employed which sophisticated metallurgical technique?',
      options: ['A. Sand casting', 'B. Lost-wax method (Cire Perdue)', 'C. Die casting', 'D. Clay baking'],
      ans: 'B',
      topic: 'Nigerian Art History & Metallurgy',
      explanation: 'Benin artists mastered the Cire Perdue (lost-wax) technique to create intricate bronze and brass sculptures.'
    }
  ]
};
