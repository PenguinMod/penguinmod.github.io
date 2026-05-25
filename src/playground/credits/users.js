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

// doing it like this for now since this is how we have it in the disc server
const pmSupportersText = `
jwklong (https://penguinmod.com/profile?user=jwklong)
lord cat (https://penguinmod.com/profile?user=lordcat) (discord: lordcat__)
qloak (discord: qloakalt)
bubasxd (https://penguinmod.com/profile?user=bubasxd) (discord: bubasgaming)
anonymous_cat1 (https://penguinmod.com/profile?user=anonymous_cat1)
silverstero
evilvowel_murdersscarykiller
jpsAR (https://penguinmod.com/profile?user=jpsar) (discord: jpsar_)
CarrotD1scord (https://penguinmod.com/profile?user=carrotp3nguin) (discord: carrotd1scord)
anonygoose (https://penguinmod.com/profile?user=anonygoose)
legume1
ianyourgod (https://penguinmod.com/profile?user=ianyourgod)
MubiLop (https://penguinmod.com/profile?user=mubilop)
thekeura (https://penguinmod.com/profile?user=thekeura) (discord: thekeura)
10000000_fireflies
adurrina
jeremygamer13 (https://penguinmod.com/profile?user=jeremygamer13)
glacialtemptation
camthekirby
redman13 (https://penguinmod.com/profile?user=redman13) (discord: godslayerakp)
joshatticus
krkika
mralien7893 (https://en.pronouns.page/@Mr.Alien7893) (discord: mr.alien)
gunner_the_bear
autoimi
.funkoid
tech_wizard72
koffeejava (https://penguinmod.com/profile?user=koffeejava)
MrRedstonia (https://mrredstonia.com/) (discord: mrredstonia)
vchi5332664 (https://penguinmod.com/profile?user=vchi5332664) (discord: vchidev2487)
windowsbuild3r
atomicoperations
joe (https://penguinmod.com/profile?user=joe) (discord: puzzlingggg)
algebruh_35
giganttech (https://penguinmod.com/profile?user=giganttech)
wwtv1 (https://penguinmod.com/profile?user=wwtv1) (discord: wwtv2346)
freshpenguin112 (https://penguinmod.com/profile?user=freshpenguin112)
stealpop_games
TPR (https://penguinmod.com/profile?user=tpr)
kypo
alpacalii (https://penguinmod.com/profile?user=alpacalii)
vedal (https://penguinmod.com/profile?user=vedal) (discord: itzkingfrfr)
TheShovel (https://penguinmod.com/profile?user=theshovel)
electricfuzzball_pm (https://www.youtube.com/@ElectricFuzzball_YT) (discord: electricfuzzball_official)
gug. [iamgugreal1939] (https://penguinmod.com/profile?user=kiwi) (discord: iamgugreal1939)
aubreymcleen (https://penguinmod.com/profile?user=aubreymcleen) (discord: 2faceaub)
kylomaskgamer (https://kylomaskgamer.ca/) (discord: kylomaskgamer)
dotun (https://penguinmod.com/profile?user=dotun) (discord: thedotun)
dillonr
UnbraveChimp (https://minerlegacy.net) (discord: UnbraveChimp)
rooonym (https://penguinmod.com/profile?user=rooonym)
DogeisCut (https://github.com/DogeisCut) (discord: dogeiscut)
`;
const pmSupporterImage = (username) => {
    switch (username) {
        case "mralien7893":
            return "https://projects.penguinmod.com/api/v1/users/getpfp?username=mralien7893";
        case "electricfuzzball_pm":
            return "https://projects.penguinmod.com/api/v1/users/getpfp?username=electricfuzzball_pm";
        case "kylomaskgamer":
            return "https://projects.penguinmod.com/api/v1/users/getpfp?username=kylomaskgamer";
        case "MrRedstonia":
            return "https://projects.penguinmod.com/api/v1/users/getpfp?username=mrredstonia";
        default:
            return `https://penguinmod.com/unknown_user.png`;
    }
};
const pmSupporterImageFromLine = (line) => {
    const match = line.match(/penguinmod\.com\/profile\?user=([a-zA-Z0-9_-]+)/);
    return match ? `https://projects.penguinmod.com/api/v1/users/getpfp?username=${match[1]}` : null;
};
const pmSupporters = pmSupportersText
    .replace(/\r/g, "")
    .split('\n')
    .map(line => line.trim())
    .filter(line => !!line)
    .map(line => {
        const bracketSection = line.indexOf(" [");
        const linkSection = line.indexOf(" (");

        // use full text if no "name [fullname]" or "name (link) (etc)"
        const username = linkSection === -1 && bracketSection === -1 ? line : line.slice(0, bracketSection === -1 ? linkSection : bracketSection);
        const image = pmSupporterImageFromLine(line) || pmSupporterImage(username);

        // getting url has ( at the start with this regex
        const linkMatch = line.match(/\(([^\)]+)/gm);
        const potentialLink = !linkMatch ? "https://studio.penguinmod.com/credits.html#" :
            (`${linkMatch[0]}`.slice(1));
        return {
            text: username,
            image,
            href: potentialLink.startsWith("https://") ? potentialLink : "https://studio.penguinmod.com/credits.html#",
        };
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
        image: `https://penguinmod.com/unknown_user.png`,
        href: `https://github.com/ilikecoding-197/`,
    },
    {
        text: 'NotEmbin',
        image: `https://github.com/NotEmbin.png`,
        href: `https://github.com/NotEmbin/`,
    },
    {
        text: 'ddededodediamante',
        image: `https://github.com/ddededodediamante.png`,
        href: `https://github.com/ddededodediamante/`,
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
        text: 'thekeura',
        image: `https://github.com/thekeura.png`,
        href: `https://github.com/thekeura/`,
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
        image: `https://penguinmod.com/unknown_user.png`,
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
    {
        text: 'dotun',
        image: `https://projects.penguinmod.com/api/v1/users/getpfp?username=dotun`,
        href: "https://penguinmod.com/profile?user=dotun",
    },
    {
        text: 'phi_wpentomino',
        image: `https://projects.penguinmod.com/api/v1/users/getpfp?username=phi_wpentomino`,
        href: "https://penguinmod.com/profile?user=phi_wpentomino",
    },
];

const pmCostumeSubmittors = [
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
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
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
    {
        text: 'applecode_official',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'harrymations3000',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'yodaugly67_13290',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'splitthread',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'miningminer27',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'gatoc_dev',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'solar_asteri',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'greencube7',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'igorcord',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'abo_notebook',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'broguyf',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'brocant__73748',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'itz_premium',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'kirda132',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'maybe.asdf',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'atomicoperations',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'notapolishcow_52995',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'funster10123',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'jlgri',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'neo_nottro',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'wyfixp',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'blablabluhbluh',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'moony_mon.e',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'thatibrahimguy',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'somerandomguuuy',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'noteezteez',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: "FloppyDisk_OSC",
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: "dogstudiostuff",
        image: `https://github.com/dogstudiostuff.png`,
        href: `https://github.com/dogstudiostuff/`,
    },
    {
        text: "oldalx2020",
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: "DogeIsCut",
        image: `https://github.com/DogeIsCut.png`,
        href: `https://github.com/DogeIsCut/`,
    },
    {
        text: "SharkZubat",
        image: `https://github.com/SharkZubat.png`,
        href: `https://github.com/SharkZubat/`,
    },
    {
        text: "KylomaskGamer",
        image: `https://github.com/KylomaskGamer.png`,
        href: `https://github.com/KylomaskGamer/`,
    },
    {
        text: "Anonymous-cat1",
        image: `https://github.com/Anonymous-cat1.png`,
        href: `https://github.com/Anonymous-cat1/`,
    },
    {
        text: "GreedyAllay",
        image: `https://github.com/GreedyAllay.png`,
        href: `https://github.com/GreedyAllay/`,
    },
];
const pmSoundSubmittors = [
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
    {
        text: 'ztedsgaming',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: '_zackplayz',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: '_mya.factorial',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'funster10123',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'solar_asteri',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'Anonymous-cat1',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'hablethedev',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'ad1340',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'GlitchedSpirit',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: '.pinksus',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'wyfixp',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'atomicoperations',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'orangeluigi414',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'vojtabubela11',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'light227',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'bubgamer072',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'rugman_3',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'halliementos',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'kurrmailence',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'applecode_official',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'furbyguy',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: 'cynicmusic',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://opengameart.org/users/cynicmusic",
    },
    {
        text: 'lushogames',
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://opengameart.org/users/lushogames",
    },
    {
        text: "ScratchFakemon",
        image: `https://github.com/ScratchFakemon.png`,
        href: `https://github.com/ScratchFakemon/`,
    },
    {
        text: "budc123",
        image: `https://github.com/budc123.png`,
        href: `https://github.com/budc123/`,
    },
    {
        text: "mildannerofc",
        image: `https://penguinmod.com/unknown_user.png`,
        href: "https://studio.penguinmod.com/credits.html#",
    },
    {
        text: "nataliexists",
        image: `https://github.com/nataliexists.png`,
        href: `https://github.com/nataliexists/`,
    },
    {
        text: "DogeIsCut",
        image: `https://github.com/DogeIsCut.png`,
        href: `https://github.com/DogeIsCut/`,
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
    'AshimeeAlt',
    'ddededodediamante'
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
    pmSupporters: shuffle(pmSupporters),
};
