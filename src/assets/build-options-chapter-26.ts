import { BuildOptions } from '../types'

export default {
  killer: {
    characters: {
      Any: ['Any', 'None'],
      Artist: [
        'Any',
        'None',
        'Automatic Drawing',
        'Charcoal Stick',
        'Choclo Corn',
        'Darkest Ink',
        'Festering Carrion',
        'Garden of Rot',
        'Ink Egg',
        'Iridescent Feather',
        "Matias' Baby Shoes",
        'O Grief',
        'O Lover',
        'Oil Paints',
        'Severed Hands',
        'Severed Tongue',
        'Silver Bell',
        'Still Life Crow',
        'Thick Tar',
        'Thorny Nest',
        'Untitled Agony',
        'Velvet Fabric',
        'Vibrant Obituary',
      ],
      Blight: [
        'Any',
        'None',
        'Adrenaline Vial',
        "Alchemist's Ring",
        'Blighted Crow',
        'Blighted Rat',
        'Canker Thorn',
        'Chipped Monocle',
        'Compound Seven',
        'Compound Thirty-Three',
        'Compound Twenty-One',
        'Foxglove',
        'Iridescent Blight Tag',
        'Placebo Tablet',
        'Plague Bile',
        'Pustula Dust',
        'Rose Tonic',
        'Shredded Notes',
        'Soul Chemical',
        'Summoning Stone',
        'Umbra Salts',
        "Vigo's Journal",
      ],
      'Cannibal (Bubba)': [
        'Any',
        'None',
        'Award-winning Chilli',
        'Begrimed Chains',
        'Carburettor Tuning Guide',
        'Chainsaw File',
        'Chilli',
        'Depth Gauge Rake',
        'Grisly Chains',
        'Homemade Muffler',
        'Iridescent Flesh',
        'Knife Scratches',
        'Light Chassis',
        'Long Guide Bar',
        'Primer Bulb',
        'Rusted Chains',
        'Shop Lubricant',
        'Spark Plug',
        'Speed Limiter',
        "The Beast's Marks",
        'The Grease',
        'Vegetable Oil',
      ],
      'Cenobite (Pinhead)': [
        'Any',
        'None',
        'Bent Nail',
        'Burning Candle',
        "Chatterer's Tooth",
        "Engineer's Fang",
        'Flickering Television',
        "Frank's Heart",
        'Greasy Black Lens',
        'Impaling Wire',
        'Iridescent Lament Configuration',
        "Larry's Blood",
        "Larry's Remains",
        'Leather Strip',
        'Liquified Gore',
        'Lively Crickets',
        'Original Pain',
        'Skewered Rat',
        'Slice of Frank',
        'Spoiled Meal',
        'Torture Pillar',
        'Wriggling Maggots',
      ],
      Clown: [
        'Any',
        'None',
        'Bottle of Chloroform',
        'Cheap Gin Bottle',
        'Cigar Box',
        'Ether 15 Vol%',
        'Fingerless Parade Gloves',
        'Flask of Bleach',
        'Garish Make-Up Kit',
        'Kerosene Can',
        'Party Bottle',
        "Redhead's Pinkie Finger",
        'Robin Feather',
        'Smelly Inner Soles',
        'Solvent Jug',
        'Spirit of Hartshorn',
        'Starling Feather',
        'Sticky Soda Bottle',
        'Sulphuric Acid Vial',
        "Tattoo's Middle Finger",
        'Thick Cork Stopper',
        'VHS Porn',
      ],
      Deathslinger: [
        'Any',
        'None',
        'Barbed Wire',
        "Bayshore's Cigar",
        "Bayshore's Gold Tooth",
        'Chewing Tobacco',
        'Gold Creek Whiskey',
        'Hellshire Iron',
        'Honey Locust Thorn',
        'Iridescent Coin',
        'Jaw Smasher',
        "Marshal's Badge",
        'Modified Ammo Belt',
        'Poison Oak Leaves',
        'Prison Chain',
        'Rickety Chain',
        'Rusted Spike',
        'Snake Oil',
        'Spit Polish Rag',
        'Tin Oil Can',
        'Wanted Poster',
        "Warden's Keys",
      ],
      Demogorgon: [
        'Any',
        'None',
        "Barb's Glasses",
        'Black Heart',
        'Brass Case Lighter',
        'Deer Lung',
        "Eleven's Soda",
        'Leprose Lichen',
        'Lifeguard Whistle',
        "Mews' Guts",
        'Rat Liver',
        'Rat Tail',
        'Red Moss',
        'Rotten Green Tripe',
        'Rotten Pumpkin',
        'Sticky Lining',
        'Thorny Vines',
        'Unknown Egg',
        'Upside Down Resin',
        'Vermilion Webcap',
        'Violet Waxcap',
        'Viscous Webbing',
      ],
      Doctor: [
        'Any',
        'None',
        '"Calm" - Carter\'s Notes',
        '"Calm" - Class I',
        '"Calm" - Class II',
        '"Discipline" - Carter\'s Notes',
        '"Discipline" - Class II',
        '"Discipline" - Class III',
        '"Order" - Carter\'s Notes',
        '"Order" - Class I',
        '"Order" - Class II',
        '"Restraint" - Carter\'s Notes',
        '"Restraint" - Class II',
        '"Restraint" - Class III',
        'High Stimulus Electrode',
        'Interview Tape',
        'Iridescent King',
        'Iridescent Queen',
        'Maple Knight',
        'Mouldy Electrode',
        'Polished Electrode',
        'Scrapped Tape',
      ],
      Dredge: [
        'Any',
        'None',
        'Air Freshener',
        'Boat Key',
        'Broken Doll',
        'Burnt Letters',
        'Caffeine Tablets',
        'Destroyed Pillow',
        'Fallen Shingle',
        'Field Recorder',
        "Follower's Cowl",
        "Haddie's Calendar",
        'Iridescent Wooden Plank',
        'Lavalier Microphone',
        "Malthinker's Skull",
        'Mortar and Pestle',
        'Ottomarian Writing',
        'Sacrificial Knife',
        'Tilling Blade',
        'War Helmet',
        'Wooden Plank',
        'Worry Stone',
      ],
      'Executioner (Pyramid Head)': [
        'Any',
        'None',
        'Black Strap',
        'Burning Man Painting',
        'Cinderella Music Box',
        'Copper Ring',
        'Crimson Ceremony Book',
        'Dead Butterfly',
        'Forgotten Videotape',
        'Iridescent Seal of Metatron',
        'Lead Ring',
        'Leopard-Print Fabric',
        'Lost Memories Book',
        'Mannequin Foot',
        'Misty Day',
        'Obsidian Goblet',
        'Remains of Judgement',
        'Rust-Coloured Egg',
        'Scarlet Egg',
        'Spearhead',
        'Tablet of the Oppressor',
        'Valtiel Sect Photograph',
        'Wax Doll',
      ],
      'Ghost Face': [
        'Any',
        'None',
        '"Ghost Face Caught on Tape"',
        '"Philly"',
        'Cheap Cologne',
        'Chewed Pen',
        'Cinch Straps',
        "Driver's License",
        'Drop-Leg Knife Sheath',
        'Headline Cut-Outs',
        'Knife Belt Clip',
        'Lasting Perfume',
        'Leather Knife Sheath',
        'Marked Map',
        'Night Vision Monocular',
        "Olsen's Address Book",
        "Olsen's Journal",
        "Olsen's Wallet",
        'Outdoor Security Camera',
        'Telephoto Lens',
        "Victim's Detailed Routine",
        "Walleye's Matchbook",
      ],
      Hag: [
        'Any',
        'None',
        'Bloodied Mud',
        'Bloodied Water',
        'Bog Water',
        'Cracked Turtle Egg',
        'Cypress Necklet',
        'Dead Fly Mud',
        'Disfigured Ear',
        'Dragonfly Wings',
        'Dried Cicada',
        "Grandma's Heart",
        'Half Eggshell',
        'Mint Rag',
        'Powdered Eggshell',
        'Pussy Willow Catkins',
        'Rope Necklet',
        'Rusty Shackles',
        'Scarred Hand',
        'Swamp Orchid Necklet',
        'Waterlogged Shoe',
        'Willow Wreath',
      ],
      Hillbilly: [
        'Any',
        'None',
        'Apex Muffler',
        'Big Buckle',
        'Black Grease',
        "Dad's Boots",
        'Death Engravings',
        'Doom Engravings',
        'Heavy Clutch',
        'Iridescent Brick',
        'Junkyard Air Filter',
        'Leafy Mash',
        'LoPro Chains',
        'Low Kickback Chains',
        "Mother's Helpers",
        'Off-Brand Motor Oil',
        'Pighouse Gloves',
        'Punctured Muffler',
        'Speed Limiter',
        'Spiked Boots',
        'Steel Toe Boots',
        'Tuned Carburettor',
      ],
      Huntress: [
        'Any',
        'None',
        'Amanita Toxin',
        'Bandaged Haft',
        'Begrimed Head',
        'Coarse Stone',
        'Deerskin Gloves',
        'Flower Babushka',
        'Glowing Concoction',
        'Infantry Belt',
        'Iridescent Head',
        'Leather Loop',
        'Manna Grass Braid',
        'Oak Haft',
        'Rose Root',
        'Rusty Head',
        'Shiny Pin',
        "Soldier's Puttee",
        'Venomous Concoction',
        'Weighted Head',
        'Wooden Fox',
        'Yellowed Cloth',
      ],
      Knight: [
        'Battle Axe Head',
        "Blacksmith's Hammer",
        'Broken Hilt',
        'Call To Arms',
        'Chain Mail Fragment',
        'Cold Steel Manacles',
        'Dried Horsemeat',
        'Flint and Steel',
        'Grim Iron Mask',
        'Gritty Lump',
        'Healing Poultice',
        'Iridescent Company Banner',
        "Ironworker's Tongs",
        "Knight's Contract",
        'Lightweight Greaves',
        'Map of the Realm',
        'Pillaged Mead',
        'Tattered Tabard',
        "Town Watch's Torch",
        'Treated Blade',
      ],
      Legion: [
        'Any',
        'None',
        'BFFs',
        'Defaced Smiley Pin',
        'Etched Ruler',
        'Filthy Blade',
        "Frank's Mix Tape",
        'Friendship Bracelet',
        'Fuming Mix Tape',
        'Iridescent Button',
        "Joey's Mix Tape",
        "Julie's Mix Tape",
        'Mischief List',
        'Mural Sketch',
        'Never-Sleep Pills',
        'Scratched Ruler',
        'Smiley Face Pin',
        'Stab Wounds Study',
        'Stolen Sketch Book',
        'Stylish Sunglasses',
        "Susie's Mix Tape",
        'The Legion Pin',
      ],
      'Mastermind (Albert Wesker)': [
        'Any',
        'None',
        'Bullhorn',
        'Chalice (Gold)',
        'Dark Sunglasses',
        'Egg (Gold)',
        'Green Herb',
        'Helicopter Stick',
        'Iridescent Uroboros Vial',
        'Jewel Beetle',
        'Lab Photo',
        'Leather Gloves',
        'Lion Medallion',
        'Loose Crank',
        'Maiden Medallion',
        'Portable Safe',
        'R.P.D. Shoulder Walkie',
        'Red Herb',
        'Unicorn Medallion',
        'Uroboros Tendril',
        'Uroboros Virus',
        'Video Conference Device',
      ],
      Nemesis: [
        'Any',
        'None',
        'Admin Wristband',
        'Adrenaline Injector',
        "Brian's Intestine",
        'Broken Recovery Coin',
        'Damaged Syringe',
        'Depleted Ink Ribbon',
        'Iridescent Umbrella Badge',
        "Jill's Sandwich",
        'Licker Tongue',
        "Marvin's Blood",
        "Mikhail's Eye",
        'NE-a Parasite',
        'Plant 43 Vines',
        'S.T.A.R.S. Field Combat Manual',
        'Serotonin Injector',
        'Shattered S.T.A.R.S. Badge',
        'T-Virus Sample',
        'Tyrant Gore',
        'Visitor Wristband',
        'Zombie Heart',
      ],
      'Nightmare (Freddy Kruger)': [
        'Any',
        'None',
        '"Z" Block',
        'Black Box',
        'Blue Dress',
        'Cat Block',
        'Class Photo',
        'Garden Rake',
        'Green Dress',
        'Jump Rope',
        "Kid's Drawing",
        "Nancy's Masterpiece",
        "Nancy's Sketch",
        'Outdoor Rope',
        'Paint Thinner',
        'Pill Bottle',
        'Prototype Claws',
        'Red Paint Brush',
        'Sheep Block',
        'Swing Chains',
        'Unicorn Block',
        'Wool Shirt',
      ],
      Nurse: [
        'Any',
        'None',
        '"Bad Man\'s" Last Breath',
        'Anxious Gasp',
        'Ataxic Respiration',
        'Bad Man Keepsake',
        "Campbell's Last Breath",
        "Catatonic Boy's Treasure",
        'Dark Cincture',
        'Dull Bracelet',
        'Fragile Wheeze',
        'Heavy Panting',
        "Jenner's Last Breath",
        "Kavanagh's Last Breath",
        'Matchbox',
        'Metal Spoon',
        'Plaid Flannel',
        'Pocket Watch',
        'Spasmodic Breath',
        'Torn Bookmark',
        'White Nit Comb',
        'Wooden Horse',
      ],
      Oni: [
        'Any',
        'None',
        "Akito's Crutch",
        'Blackened Toenail',
        'Bloody Sash',
        "Child's Wooden Sword",
        'Chipped Saihai',
        'Cracked Sakazuki',
        'Ink Lion',
        'Iridescent Family Crest',
        'Kanai-Anzen Talisman',
        'Lion Fang',
        'Paper Lantern',
        'Polished Maedate',
        "Renjiro's Bloody Glove",
        'Rotting Rope',
        'Scalped Topknot',
        'Shattered Wakizashi',
        'Splintered Hull',
        'Tear Soaked Tenugui',
        'Wooden Oni Mask',
        'Yamaoka Sashimono',
      ],
      'Onryō (Sadako Yamamura)': [
        'Any',
        'None',
        'Bloody Fingernails',
        'Cabin Sign',
        'Clump of Hair',
        'Distorted Photo',
        'Iridescent Videotape',
        "Mother's Comb",
        "Mother's Mirror",
        'Old Newspaper',
        "Reiko's Watch",
        'Remote Control',
        'Rickety Pinwheel',
        'Ring Drawing',
        'Sea-Soaked Cloth',
        'Tape Editing Deck',
        'Telephone',
        'VCR',
        'Videotape Copy',
        'Well Stone',
        'Well Water',
        "Yoichi's Fishing Net",
      ],
      Pig: [
        'Any',
        'None',
        "Amanda's Letter",
        "Amanda's Secret",
        'Bag of Gears',
        'Combat Straps',
        'Crate of Gears',
        'Face Mask',
        'Interlocking Razor',
        "Jigsaw's Annotated Plan",
        "Jigsaw's Sketch",
        "John's Medical File",
        'Last Will',
        'Razor Wires',
        'Rules Set No.2',
        'Rusty Attachments',
        'Shattered Syringe',
        'Slow-Release Toxin',
        'Tampered Timer',
        'Utility Blades',
        'Video Tape',
        'Workshop Grease',
      ],
      Plague: [
        'Any',
        'None',
        'Ashen Apple',
        'Black Incense',
        'Blessed Apple',
        "Devotee's Amulet",
        'Emetic Potion',
        'Exorcism Amulet',
        'Haematite Seal',
        'Healing Salve',
        'Incensed Ointment',
        'Infected Emetic',
        'Iridescent Seal',
        'Limestone Seal',
        'Olibanum Incense',
        'Potent Tincture',
        'Prayer Tablet Fragment',
        'Prophylactic Amulet',
        'Rubbing Oil',
        'Severed Toe',
        'Vile Emetic',
        'Worship Tablet',
      ],
      'Shape (Michael Myers)': [
        'Any',
        'None',
        'Blond Hair',
        "Boyfriend's Memo",
        'Dead Rabbit',
        'Fragrant Tuft of Hair',
        'Glass Fragment',
        'Hair Bow',
        'Hair Brush',
        'J. Myers Memorial',
        'Jewellery Box',
        'Jewellery',
        "Judith's Journal",
        "Judith's Tombstone",
        'Lock of Hair',
        'Memorial Flower',
        'Mirror Shard',
        'Reflective Fragment',
        'Scratched Mirror',
        'Tacky Earrings',
        'Tombstone Piece',
        'Vanity Mirror',
      ],
      Spirit: [
        'Any',
        'None',
        'Dried Cherry Blossom',
        'Furin',
        'Gifted Bamboo Comb',
        'Juniper Bonsai',
        'Kaiun Talisman',
        'Katana Tsuba',
        'Kintsugi Teacup',
        'Mother-Daughter Ring',
        "Mother's Glasses",
        'Muddy Sports Day Cap',
        'Origami Crane',
        "Rin's Broken Watch",
        'Rusty Flute',
        'Senko Hanabi',
        'Shiawase Amulet',
        'Uchiwa',
        'Wakizashi Saya',
        'White Hair Ribbon',
        'Yakuyoke Amulet',
        'Zōri',
      ],
      Trapper: [
        'Any',
        'None',
        '4-Coil Spring Kit',
        'Bear Oil',
        'Bloody Coil',
        'Coffee Grounds',
        'Fastening Tools',
        'Honing Stone',
        'Iridescent Stone',
        'Lengthened Jaws',
        'Makeshift Wrap',
        'Oily Coil',
        'Padded Jaws',
        'Rusted Jaws',
        'Secondary Coil',
        'Serrated Jaws',
        'Tar Bottle',
        'Tension Spring',
        'Trapper Bag',
        'Trapper Gloves',
        'Trapper Sack',
        'Wax Brick',
      ],
      Trickster: [
        'Any',
        'None',
        'Bloody Boa',
        'Caged Heart Shoes',
        'Cut Thru U Single',
        'Death Throes Compilation',
        'Diamond Cufflinks',
        'Edge of Revival Album',
        'Fizz-Spin Soda',
        'Inferno Wires',
        'Iridescent Photocard',
        "Ji-Woon's Autograph",
        'Killing Part Chords',
        'Lucky Blade',
        'Melodious Murder',
        'Memento Blades',
        'On Target Single',
        'Ripper Brace',
        'Tequila Moonrock',
        'Trick Blades',
        'Trick Pouch',
        'Waiting For You Watch',
      ],
      Twins: [
        'Any',
        'None',
        'Baby Teeth',
        'Bloody Black Hood',
        'Cat Figurine',
        "Cat's Eye",
        'Ceremonial Candelabrum',
        'Drop of Perfume',
        'Forest Stew',
        'Iridescent Pendant',
        "Madeleine's Glove",
        "Madeleine's Scarf",
        'Rusted Needle',
        'Sewer Sludge',
        'Silencing Cloth',
        'Soured Milk',
        'Spinning Top',
        'Stale Biscuit',
        'Tiny Fingernail',
        'Toy Sword',
        "Victor's Soldier",
        'Weighty Rattle',
      ],
      Wraith: [
        'Any',
        'None',
        '"All Seeing" - Blood',
        '"All Seeing" - Spirit',
        '"Blind Warrior" - Mud',
        '"Blind Warrior" - White',
        '"Blink" - Mud',
        '"Blink" - White',
        '"Shadow Dance" - Blood',
        '"Shadow Dance" - White',
        '"Swift Hunt" - Blood',
        '"Swift Hunt" - Mud',
        '"Swift Hunt" - White',
        '"The Beast" - Soot',
        '"The Ghost" - Soot',
        '"The Hound" - Soot',
        '"The Serpent" - Soot',
        '"Windstorm" - Blood',
        '"Windstorm" - Mud',
        '"Windstorm" - White',
        'Bone Clapper',
        'Coxcombed Clapper',
      ],
    },
    offerings: [
      'Any',
      'None',
      'Ardent Raven Wreath',
      'Ardent Shrike Wreath',
      'Ardent Tanager Wreath',
      'Cypress Memento Mori',
      'Devout Raven Wreath',
      'Devout Shrike Wreath',
      'Devout Spotted Owl Wreath',
      'Devout Tanager Wreath',
      'Ebony Memento Mori',
      'Hollow Shell',
      'Ivory Memento Mori',
      'Raven Wreath',
      'Shrike Wreath',
      'Spotted Owl Wreath',
      'Survivor Pudding',
      'Tanager Wreath',
    ],
    perks: [
      'Any',
      'None',
      "A Nurse's Calling",
      'Agitation',
      'Awakened Awareness',
      'Bamboozle',
      'Barbecue & Chilli',
      'Beast of Prey',
      'Bitter Murmur',
      'Blood Echo',
      'Blood Warden',
      'Bloodhound',
      'Brutal Strength',
      'Call of Brine',
      'Claustrophobia',
      'Corrupt Intervention',
      'Coulrophobia',
      'Coup de Grâce',
      'Dark Devotion',
      'Darkness Revealed',
      "Dead Man's Switch",
      'Deadlock',
      'Deathbound',
      'Deerstalker',
      'Discordance',
      'Dissolution',
      'Distressing',
      "Dragon's Grip",
      'Dying Light',
      'Enduring',
      'Eruption',
      'Fearmonger',
      'Fire Up',
      'Forced Penance',
      "Franklin's Demise",
      'Furtive Chase',
      'Gearhead',
      'Grim Embrace',
      "Hangman's Trick",
      'Hex: Blood Favour',
      'Hex: Crowd Control',
      'Hex: Devour Hope',
      'Hex: Face the Darkness',
      'Hex: Haunted Ground',
      'Hex: Huntress Lullaby',
      'Hex: No One Escapes Death',
      'Hex: Pentimento',
      'Hex: Plaything',
      'Hex: Retribution',
      'Hex: Ruin',
      'Hex: The Third Seal',
      'Hex: Thrill of the Hunt',
      'Hex: Undying',
      'Hoarder',
      'Hubris',
      'Hysteria',
      "I'm All Ears",
      'Infectious Fright',
      'Insidious',
      'Iron Grasp',
      'Iron Maiden',
      'Jolt',
      'Knock Out',
      'Lethal Pursuer',
      'Lightborn',
      'Mad Grit',
      'Make Your Choice',
      'Merciless Storm',
      'Monitor & Abuse',
      'Nemesis',
      'No Way Out',
      'Nowhere to Hide',
      'Oppression',
      'Overcharge',
      'Overwhelming Presence',
      'Play with Your Food',
      'Pop Goes the Weasel',
      'Predator',
      'Rancor',
      'Remember Me',
      'Save the Best for Last',
      'Scourge Hook: Floods of Rage',
      'Scourge Hook: Gift of Pain',
      'Scourge Hook: Monstrous Shrine',
      'Scourge Hook: Pain Resonance',
      'Septic Touch',
      'Shadowborn',
      'Shattered Hope',
      'Sloppy Butcher',
      'Spies from the Shadows',
      'Spirit Fury',
      'Starstruck',
      'Stridor',
      'Superior Anatomy',
      'Surveillance',
      'Terminus',
      'Territorial Imperative',
      'Thanatophobia',
      'Thrilling Tremors',
      'Tinkerer',
      'Trail of Torment',
      'Unnerving Presence',
      'Unrelenting',
      'Whispers',
      'Zanshin Tactics',
    ],
  },
  survivor: {
    characters: [
      'Any',
      'Ace Visconti',
      'Ada Wong',
      'Adam Francis',
      'Ashley J. Williams',
      'Cheryl Mason',
      'Claudette Morel',
      'David King',
      'Detective David Tapp',
      'Dwight Fairfield',
      'Élodie Rakoto',
      'Felix Richter',
      'Feng Min',
      'Haddie Kaur',
      'Jake Park',
      'Jane Romero',
      'Jeffrey "Jeff" Johansen',
      'Jill Valentine',
      'Jonah Vasquez',
      'Kate Denson',
      'Laurie Strode',
      'Leon Scott Kennedy',
      'Meg Thomas',
      'Mikaela Reid',
      'Nancy Wheeler',
      'Nea Karlsson',
      'Quentin Smith',
      'Rebecca Chambers',
      'Steve Harrington',
      'Vittorio Toscano',
      'William "Bill" Overbeck',
      'Yoichi Asakawa',
      'Yui Kimura',
      'Yun-Jin Lee',
      'Zarina Kassir',
    ],
    items: {
      Any: ['Any', 'None'],
      Flashlight: [
        'Any',
        'None',
        'Battery',
        'Broken Bulb',
        'Focus Lens',
        'Heavy Duty Battery',
        'High-End Sapphire Lens',
        'Intense Halogen',
        'Leather Grip',
        'Long Life Battery',
        'Low Amp Filament',
        'Odd Bulb',
        'Power Bulb',
        'Rubber Grip',
        'TIR Optic',
        'Wide Lens',
      ],
      Key: [
        'Any',
        'None',
        'Blood Amber',
        'Eroded Token',
        'Gold Token',
        'Milky Glass',
        'Prayer Beads',
        'Prayer Rope',
        'Scratched Pearl',
        'Unique Wedding Ring',
        'Weaved Ring',
      ],
      Map: [
        'Any',
        'None',
        'Black Silk Cord',
        'Crystal Bead',
        'Glass Bead',
        'Map Addendum',
        'Odd Stamp',
        'Red Twine',
        'Retardant Jelly',
        'Unusual Stamp',
        'Yellow Wire',
      ],
      'Med-Kit': [
        'Any',
        'None',
        'Abdominal Dressing',
        'Anti-Haemorrhagic Syringe',
        'Bandages',
        'Butterfly Tape',
        'Gauze Roll',
        'Gel Dressings',
        'Medical Scissors',
        'Needle & Thread',
        'Refined Serum',
        'Rubber Gloves',
        'Self Adherent Wrap',
        'Sponge',
        'Styptic Agent',
        'Surgical Suture',
      ],
      Toolbox: [
        'Any',
        'None',
        'Brand New Part',
        'Clean Rag',
        'Cutting Wire',
        'Grip Wrench',
        'Hacksaw',
        'Instructions',
        'Protective Gloves',
        'Scraps',
        'Socket Swivels',
        'Spring Clamp',
        'Wire Spool',
      ],
      None: ['None'],
    },
    offerings: [
      'Any',
      'None',
      'Black Salt Statuette',
      'Bog Laurel Sachet',
      'Bound Envelope',
      'Chalk Pouch',
      'Cream Chalk Pouch',
      'Crispleaf Amaranth Sachet',
      'Escape Cake',
      'Fragrant Bog Laurel',
      'Fragrant Crispleaf Amaranth',
      'Fragrant Primrose Blossom',
      'Fragrant Sweet William',
      'Fresh Bog Laurel',
      'Fresh Crispleaf Amaranth',
      'Fresh Primrose Blossom',
      'Fresh Sweet William',
      'Ivory Chalk Pouch',
      'Primrose Blossom Sachet',
      'Salt Pouch',
      'Sealed Envelope',
      'Sweet William Sachet',
      "Vigo's Jar of Salty Lips",
    ],
    perks: [
      'Any',
      'None',
      'Ace in the Hole',
      'Adrenaline',
      'Aftercare',
      'Alert',
      'Any Means Necessary',
      'Appraisal',
      'Autodidact',
      'Balanced Landing',
      'Better than New',
      'Bite the Bullet',
      'Blast Mine',
      'Blood Pact',
      'Boil Over',
      'Bond',
      'Boon: Circle of Healing',
      'Boon: Dark Theory',
      'Boon: Exponential',
      'Boon: Shadow Step',
      'Borrowed Time',
      'Botany Knowledge',
      'Breakdown',
      'Breakout',
      'Buckle Up',
      'Built to Last',
      'Calm Spirit',
      'Clairvoyance',
      'Corrective Action',
      'Counterforce',
      'Dance With Me',
      'Dark Sense',
      'Dead Hard',
      'Deception',
      'Decisive Strike',
      'Déjà Vu',
      'Deliverance',
      'Desperate Measures',
      "Detective's Hunch",
      'Distortion',
      'Diversion',
      'Empathic Connection',
      'Empathy',
      'Fast Track',
      'Flashbang',
      'Flip-Flop',
      'Fogwise',
      'For the People',
      'Guardian',
      'Head On',
      'Hope',
      'Hyperfocus',
      'Inner Focus',
      'Inner Healing',
      'Iron Will',
      'Kindred',
      'Kinship',
      'Leader',
      'Left Behind',
      'Lightweight',
      'Lithe',
      'Low Profile',
      'Lucky Break',
      'Mettle of Man',
      'No Mither',
      'No One Left Behind',
      'Object of Obsession',
      'Off the Record',
      'Open-Handed',
      'Overcome',
      'Overzealous',
      'Parental Guidance',
      'Pharmacy',
      "Plunderer's Instinct",
      'Poised',
      'Potential Energy',
      'Power Struggle',
      'Premonition',
      'Prove Thyself',
      'Quick & Quiet',
      'Quick Gambit',
      'Reactive Healing',
      'Reassurance',
      'Red Herring',
      'Renewal',
      'Repressed Alliance',
      'Residual Manifest',
      'Resilience',
      'Resurgence',
      'Rookie Spirit',
      'Saboteur',
      'Self-Aware',
      'Self-Care',
      'Self-Preservation',
      'Situational Awareness',
      'Slippery Meat',
      'Small Game',
      'Smash Hit',
      'Sole Survivor',
      'Solidarity',
      'Soul Guard',
      'Spine Chill',
      'Sprint Burst',
      'Stake Out',
      'Streetwise',
      'Technician',
      'Tenacity',
      'This Is Not Happening',
      'Unbreakable',
      'Up the Ante',
      'Urban Evasion',
      'Vigil',
      'Visionary',
      'Wake Up!',
      "We'll Make It",
      "We're Gonna Live Forever",
      'Windows of Opportunity',
      'Wiretap',
    ],
  },
} as BuildOptions
