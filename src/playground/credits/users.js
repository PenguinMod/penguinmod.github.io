const shuffle = list => {
    for (let i = list.length - 1; i > 0; i--) {
        const random = Math.floor(Math.random() * (i + 1));
        const tmp = list[i];
        list[i] = list[random];
        list[random] = tmp;
    }
    return list;
};

const fromHardcoded = ({ userId, username, name }) => ({
    image: `https://trampoline.turbowarp.org/avatars/${userId}`,
    href: `https://scratch.mit.edu/users/${username}/`,
    text: name || username
});

const fromHardcodedGithub = username => ({
    image: `https://github.com/${username}.png`,
    href: `https://github.com/${username}/`,
    text: username
});
const fromHardcodedNamed = username => ({
    image: `https://penguinmod.com/unknown_user.png`,
    href: "https://studio.penguinmod.com/credits.html#",
    text: username
});

const addonDevelopers = [
    {
        userId: '34018398',
        username: 'Jeffalo'
    },
    {
        userId: '64184234',
        username: 'ErrorGamer2000'
    },
    {
        userId: '41616512',
        username: 'pufferfish101007'
    },
    {
        userId: '61409215',
        username: 'TheColaber'
    },
    {
        userId: '1882674',
        username: 'griffpatch'
    },
    {
        userId: '10817178',
        username: 'apple502j'
    },
    {
        userId: '16947341',
        username: '--Explosion--'
    },
    {
        userId: '14880401',
        username: 'Sheep_maker'
    },
    {
        userId: '9981676',
        username: 'NitroCipher'
    },
    {
        userId: '2561680',
        username: 'lisa_wolfgang'
    },
    {
        userId: '60000111',
        username: 'GDUcrash'
    },
    {
        userId: '4648559',
        username: 'World_Languages'
    },
    {
        userId: '17340565',
        username: 'GarboMuffin'
    },
    {
        userId: '5354974',
        username: 'Chrome_Cat'
    },
    {
        // actual ID is 34455896 but their avatar is the wrong resolution and looks really weird
        userId: '0',
        username: 'summerscar'
    },
    {
        userId: '55742784',
        username: 'RedGuy7'
    },
    {
        userId: '9636514',
        username: 'Tacodiva7729'
    },
    {
        userId: '14792872',
        username: '_nix'
    },
    {
        userId: '30323614',
        username: 'BarelySmooth'
    },
    {
        userId: '64691048',
        username: 'CST1229'
    },
    {
        userId: '12498592',
        username: 'LilyMakesThings'
    }
].map(fromHardcoded);

const pmDevelopers = [
    'enderhacker',
    'FreshPenguin112',
    'Ianyourgod',
    'JoshAtticus',
    'JeremyGamer13',
    'jwklong',
    'tnix100',
    'RedMan13',
    'SharkPool-SP',
    'showierdata9978'
].map(fromHardcodedGithub);

const pmPullRequestDevelopers = [ // these people made a PR that got merged, or got a dev to add something they made
    {
        text: 'NexusKitten',
        image: `https://github.com/NexusKitten.png`,
        href: `https://github.com/NexusKitten/`,
    },
    {
        text: 'LilyMakesThings',
        image: `https://github.com/LilyMakesThings.png`,
        href: `https://github.com/LilyMakesThings/`,
    },
    {
        text: 'MikeDev101',
        image: `https://github.com/MikeDev101.png`,
        href: `https://github.com/MikeDev101/`,
    },
    {
        text: 'kokofixcomputers',
        image: `https://github.com/kokofixcomputers.png`,
        href: `https://github.com/kokofixcomputers/`,
    },
    {
        text: 'PPPDUD',
        image: `https://github.com/PPPDUD.png`,
        href: `https://github.com/PPPDUD/`,
    },
    {
        text: 'qbjl',
        image: `https://github.com/qbjl.png`,
        href: `https://github.com/qbjl/`,
    },
    {
        text: 'minidogg',
        image: `https://github.com/minidogg.png`,
        href: `https://github.com/minidogg/`,
    },
    {
        text: 'concertalyis',
        image: `https://github.com/concertalyis.png`,
        href: `https://github.com/concertalyis/`,
    },
    {
        text: 'Steve0Greatness',
        image: `https://github.com/Steve0Greatness.png`,
        href: `https://github.com/Steve0Greatness/`,
    },
    {
        text: 'ilikecoding-197',
        image: `https://github.com/ilikecoding-197.png`,
        href: `https://github.com/ilikecoding-197/`,
    },
    {
        text: 'NotEmbin',
        image: `https://github.com/NotEmbin.png`,
        href: `https://github.com/NotEmbin/`,
    },
    {  // rx or ry single fix
        text: 'NotCryptid',
        image: `https://penguinmod.com/unknown_user.png`,
        href: `https://github.com/NotCryptid/`,
    },
    {
        text: 'DogeisCut',
        image: `https://github.com/DogeisCut.png`,
        href: `https://github.com/Dogeiscut/`,
    },
    {
        text: 'BiglyDerv',
        image: `https://github.com/biglyderv.png`,
        href: `https://github.com/biglyderv/`,
    }
    // list could be missing some people, but theres not really a way to tell
];

const pmApiDevelopers = [
    'JeremyGamer13',
    'RedMan13',
    'tnix100',
    'Ianyourgod',
    'Jwklong'
].map(fromHardcodedGithub);

const pmTranslators = [
    {
        text: 'Mildanner',
        image: `https://avatars.githubusercontent.com/u/179844994`,
        href: "https://github.com/mildannerofc",
    },
    {
        text: 'kolikiscool',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'n0name',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'onetoanother',
        image: `https://trampoline.turbowarp.org/avatars/by-username/onetoanother`,
        href: `https://scratch.mit.edu/users/onetoanother/`,
    },
    {
        text: 'NamelessCat',
        image: `https://projects.penguinmod.com/api/v1/users/getpfp?username=cat`,
        href: "https://penguinmod.com/profile?user=cat",
    },
    {
        text: 'Just-Noone',
        image: `https://trampoline.turbowarp.org/avatars/by-username/Just-Noone`,
        href: `https://scratch.mit.edu/users/Just-Noone/`,
    },
    {
        text: 'goose_but_smart',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'Le_Blob77',
        image: `https://trampoline.turbowarp.org/avatars/by-username/Le_Blob77`,
        href: `https://scratch.mit.edu/users/Le_Blob77/`,
    },
    {
        text: 'MrRedstonia',
        image: `https://projects.penguinmod.com/api/v1/users/getpfp?username=mrredstonia`,
        href: "https://penguinmod.com/profile?user=mrredstonia",
    },
    {
        text: 'TheShovel',
        image: `https://projects.penguinmod.com/api/v1/users/getpfp?username=TheShovel`,
        href: "https://penguinmod.com/profile?user=TheShovel",
    },
    {
        text: 'SmolBoi37',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'GigantTech',
        image: `https://projects.penguinmod.com/api/v1/users/getpfp?username=GigantTech`,
        href: "https://penguinmod.com/profile?user=GigantTech",
    },
    {
        text: 'hacker_anonimo',
        image: `https://trampoline.turbowarp.org/avatars/by-username/hacker_anonimo`,
        href: `https://scratch.mit.edu/users/hacker_anonimo/`,
    },
    {
        text: 'zaaxd52',
        image: `https://trampoline.turbowarp.org/avatars/by-username/zaaxd52`,
        href: `https://scratch.mit.edu/users/zaaxd52/`,
    },
    {
        text: 'G1nX',
        image: `https://trampoline.turbowarp.org/avatars/by-username/G1nX`,
        href: `https://scratch.mit.edu/users/G1nX/`,
    },
    {
        text: 'FNFFortune',
        image: `https://trampoline.turbowarp.org/avatars/by-username/FNFFortune`,
        href: `https://scratch.mit.edu/users/FNFFortune/`,
    },
    {
        text: 'Gabberythethughunte',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'keriyo',
        image: `https://trampoline.turbowarp.org/avatars/by-username/keriyo`,
        href: `https://scratch.mit.edu/users/keriyo/`,
    },
    {
        text: 'DenPlayTS',
        image: `https://projects.penguinmod.com/api/v1/users/getpfp?username=denplayts`,
        href: "https://penguinmod.com/profile?user=denplayts",
    },
    {
        text: 'Tsalbre',
        image: `https://trampoline.turbowarp.org/avatars/by-username/Tsalbre`,
        href: `https://scratch.mit.edu/users/Tsalbre/`,
    },
    {
        text: 'MubiLop',
        image: `https://projects.penguinmod.com/api/v1/users/getpfp?username=MubiLop`,
        href: "https://penguinmod.com/profile?user=MubiLop",
    },
    {
        text: 'TLP136',
        image: `https://trampoline.turbowarp.org/avatars/by-username/TLP136`,
        href: `https://scratch.mit.edu/users/TLP136/`,
    },
    {
        text: 'Cymock',
        image: `https://trampoline.turbowarp.org/avatars/by-username/Cymock`,
        href: `https://scratch.mit.edu/users/Cymock/`,
    },
    {
        text: 'ItzzEndr',
        image: `https://trampoline.turbowarp.org/avatars/by-username/ItzzEndr`,
        href: `https://scratch.mit.edu/users/ItzzEndr/`,
    },
    {
        text: 'Capysussa',
        image: `https://trampoline.turbowarp.org/avatars/by-username/Capysussa`,
        href: `https://scratch.mit.edu/users/Capysussa/`,
    },
    {
        text: 'con-zie',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'ImNotScratchY_lolol',
        image: `https://projects.penguinmod.com/api/v1/users/getpfp?username=ImNotScratchY_lolol`,
        href: "https://penguinmod.com/profile?user=ImNotScratchY_lolol",
    },
    {
        text: 'justablock',
        image: `https://trampoline.turbowarp.org/avatars/by-username/justablock`,
        href: `https://scratch.mit.edu/users/justablock/`,
    },
    {
        text: 'inventionpro',
        image: `https://projects.penguinmod.com/api/v1/users/getpfp?username=inventionpro`,
        href: "https://penguinmod.com/profile?user=inventionpro",
    },
    {
        text: 'SkyBuilder1717',
        image: `https://projects.penguinmod.com/api/v1/users/getpfp?username=SkyBuilder1717`,
        href: "https://penguinmod.com/profile?user=SkyBuilder1717",
    },
    {
        text: 'Parham1258',
        image: `https://avatars.githubusercontent.com/u/95162943?v=4`,
        href: "https://github.com/Parham1258",
    },
    {
        text: 'lem0n0fficial',
        image: `https://trampoline.turbowarp.org/avatars/by-username/lem0n0fficial`,
        href: `https://scratch.mit.edu/users/lem0n0fficial/`,
    },
    {
        text: 'Oldcoinmania',
        image: `https://projects.penguinmod.com/api/v1/users/getpfp?username=Oldcoinmania`,
        href: "https://penguinmod.com/profile?user=Oldcoinmania",
    },
    {
        text: 'mariocraft987',
        image: `https://avatars.githubusercontent.com/u/154646419?v=4`,
        href: "https://github.com/mariocraft987",
    },
    {
        text: 'Chip',
        image: `https://avatars.githubusercontent.com/u/116580105?s=96&v=4`,
        href: "https://github.com/triisdang",
    },
    {
        text: 'enduh',
        image: `https://projects.penguinmod.com/api/v1/users/getpfp?username=enduh`,
        href: "https://penguinmod.com/profile?user=enduh",
    },
    {
        text: 'riwataNOUVEAU',
        image: `https://projects.penguinmod.com/api/v1/users/getpfp?username=riwataNOUVEAU`,
        href: "https://penguinmod.com/profile?user=riwataNOUVEAU",
    },
    {
        text: 'Prode',
        image: `https://projects.penguinmod.com/api/v1/users/getpfp?username=Prode`,
        href: "https://penguinmod.com/profile?user=Prode",
    },
];

const pmCostumeSubmittors = [
    // accounts
    {
        text: 'budc123',
        image: `https://github.com/budc123.png`,
        href: `https://github.com/budc123/`,
    },
    {
        text: 'concertalyis',
        image: `https://github.com/concertalyis.png`,
        href: `https://github.com/concertalyis/`,
    },
    {
        text: 'WojtekCodesToday',
        image: `https://github.com/WojtekCodesToday.png`,
        href: `https://github.com/WojtekCodesToday/`,
    },
    {
        text: 'ddededodediamante',
        image: `https://github.com/ddededodediamante.png`,
        href: `https://github.com/ddededodediamante/`,
    },
    {
        text: 'G1nX',
        image: `https://trampoline.turbowarp.org/avatars/by-username/G1nX`,
        href: `https://scratch.mit.edu/users/G1nX/`,
    },
    // unknown
    {
        text: 'maroonmball',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'eviepepsi',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: '1340073',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'cubeycreator',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'novaspiderultra',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'poundpound0209',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'gdplayer1035',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'cognitixsammy',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'thebusyman',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'skyglide5',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'cxnnie09',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'hoveras',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'blockgamer904',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: "Anonygoose's Dog (Max)",
        image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=anonygoosedog",
        href: "https://penguinmod.com/profile?user=anonygoosedog",
    },
    {
        text: 'mildannerofc',
        image: `https://github.com/mildannerofc.png`,
        href: `https://github.com/mildannerofc/`,
    },
    {
        text: 'bonemaster96',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'phicicle',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'ron027257',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'fur1na__',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: '00ee8a',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'alf2003_14729',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'pedrotheawsomeguy',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'david342013',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
];
const pmSoundSubmittors = [
    // accounts
    {
        text: 'ddededodediamante',
        image: `https://github.com/ddededodediamante.png`,
        href: `https://github.com/ddededodediamante/`,
    },
    {
        text: 'concertalyis',
        image: `https://github.com/concertalyis.png`,
        href: `https://github.com/concertalyis/`,
    },
    {
        text: 'G1nX',
        image: `https://trampoline.turbowarp.org/avatars/by-username/G1nX`,
        href: `https://scratch.mit.edu/users/G1nX/`,
    },
    // unknown
    {
        text: 'maroonmball',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'jn567',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'lukepuke311',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'ma_01',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'poundpound0209',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'cognitixsammy',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'mememaster9000',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'rydia_theawesome',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'jackunavailable',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'hammouda101010',
        image: `https://github.com/hammouda101010.png`,
        href: `https://github.com/hammouda101010/`,
    },
    {
        text: 'gdplayer1035',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
];

const extensionDevelopers = [
    'GarboMuffin',
    'griffpatch',
    'DT-is-not-available',
    'Xeltalliv',
    'MikeDev101',
    'LilyMakesThings'
].map(fromHardcodedGithub);
const pmExtensionDevelopers = [
    'qbjl',
    'NexusKitten',
    'Gen1x-ALT',
    'SharkPool-SP',
    'DogeisCut', // listed as a collaborator on a SharkPool extension
    'David-Orangemoon',
    'pooiod',
    'WAYLIVES',
    'MrRedstonia',
    'MikeDev101',
    'liablelua',
    'AlexSchoolOH',
    'Monochromasity',
    'LilyMakesThings',
    'TheShovel',
    'skyhigh173',
    'Ruby-Devs',
    'oc9x97',
    'lego7set',
    'mariocraft987',
    'AshimeeAlt'
].map(fromHardcodedGithub);

const pmCodeUsedFrom = [
    {
        text: "Gandi-IDE",
        image: `https://github.com/Gandi-IDE.png`,
        href: `https://github.com/Gandi-IDE/`,
    },
    {
        text: "TurboWarp",
        image: `https://github.com/TurboWarp.png`,
        href: `https://github.com/TurboWarp/`,
    },
    {
        text: "scratchfoundation",
        image: `https://github.com/scratchfoundation.png`,
        href: `https://github.com/scratchfoundation/`,
    },
    {
        text: "Nitro-Bolt",
        image: `https://github.com/Nitro-Bolt.png`,
        href: `https://github.com/Nitro-Bolt/`,
    },
    // TODO: There are 1000% more projects we've used some stuff from but I don't remember
];

export default {
    addonDevelopers: shuffle(addonDevelopers),
    pmDevelopers: shuffle(pmDevelopers),
    extensionDevelopers: shuffle(extensionDevelopers),
    pmExtensionDevelopers: shuffle(pmExtensionDevelopers),
    pmApiDevelopers: shuffle(pmApiDevelopers),
    pmTranslators: shuffle(pmTranslators),
    pmSoundSubmittors: shuffle(pmSoundSubmittors),
    pmCostumeSubmittors: shuffle(pmCostumeSubmittors),
    pmPullRequestDevelopers: shuffle(pmPullRequestDevelopers),
    pmCodeUsedFrom: shuffle(pmCodeUsedFrom),
};
