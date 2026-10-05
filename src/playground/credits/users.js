const shuffle = list => {
    for (let i = list.length - 1; i > 0; i--) {
        const random = Math.floor(Math.random() * (i + 1));
        const tmp = list[i];
        list[i] = list[random];
        list[random] = tmp;
    }
    return list;
};

const brokenImage = "https://penguinmod.com/unknown_user.png";
const brokenHref = "https://studio.penguinmod.com/credits.html#";
export default {
    addonDevelopers: shuffle([
        {
            text: "Jeffalo",
            image: "https://trampoline.turbowarp.org/avatars/34018398",
            href: "https://scratch.mit.edu/users/Jeffalo/"
        },
        {
            text: "ErrorGamer2000",
            image: "https://trampoline.turbowarp.org/avatars/64184234",
            href: "https://scratch.mit.edu/users/ErrorGamer2000/"
        },
        {
            text: "pufferfish101007",
            image: "https://trampoline.turbowarp.org/avatars/41616512",
            href: "https://scratch.mit.edu/users/pufferfish101007/"
        },
        {
            text: "TheColaber",
            image: "https://trampoline.turbowarp.org/avatars/61409215",
            href: "https://scratch.mit.edu/users/TheColaber/"
        },
        {
            text: "griffpatch",
            image: "https://trampoline.turbowarp.org/avatars/1882674",
            href: "https://scratch.mit.edu/users/griffpatch/"
        },
        {
            text: "apple502j",
            image: "https://trampoline.turbowarp.org/avatars/10817178",
            href: "https://scratch.mit.edu/users/apple502j/"
        },
        {
            text: "--Explosion--",
            image: "https://trampoline.turbowarp.org/avatars/16947341",
            href: "https://scratch.mit.edu/users/--Explosion--/"
        },
        {
            text: "Sheep_maker",
            image: "https://trampoline.turbowarp.org/avatars/14880401",
            href: "https://scratch.mit.edu/users/Sheep_maker/"
        },
        {
            text: "NitroCipher",
            image: "https://trampoline.turbowarp.org/avatars/9981676",
            href: "https://scratch.mit.edu/users/NitroCipher/"
        },
        {
            text: "lisa_wolfgang",
            image: "https://trampoline.turbowarp.org/avatars/2561680",
            href: "https://scratch.mit.edu/users/lisa_wolfgang/"
        },
        {
            text: "GDUcrash",
            image: "https://trampoline.turbowarp.org/avatars/60000111",
            href: "https://scratch.mit.edu/users/GDUcrash/"
        },
        {
            text: "World_Languages",
            image: "https://trampoline.turbowarp.org/avatars/4648559",
            href: "https://scratch.mit.edu/users/World_Languages/"
        },
        {
            text: "GarboMuffin",
            image: "https://trampoline.turbowarp.org/avatars/17340565",
            href: "https://scratch.mit.edu/users/GarboMuffin/"
        },
        {
            text: "Chrome_Cat",
            image: "https://trampoline.turbowarp.org/avatars/5354974",
            href: "https://scratch.mit.edu/users/Chrome_Cat/"
        },
        {
            text: "summerscar",
            // actual ID is 34455896 but their avatar is the wrong resolution and looks really weird
            image: "https://trampoline.turbowarp.org/avatars/0",
            href: "https://scratch.mit.edu/users/summerscar/"
        },
        {
            text: "RedGuy7",
            image: "https://trampoline.turbowarp.org/avatars/55742784",
            href: "https://scratch.mit.edu/users/RedGuy7/"
        },
        {
            text: "Tacodiva7729",
            image: "https://trampoline.turbowarp.org/avatars/9636514",
            href: "https://scratch.mit.edu/users/Tacodiva7729/"
        },
        {
            text: "_nix",
            image: "https://trampoline.turbowarp.org/avatars/14792872",
            href: "https://scratch.mit.edu/users/_nix/"
        },
        {
            text: "BarelySmooth",
            image: "https://trampoline.turbowarp.org/avatars/30323614",
            href: "https://scratch.mit.edu/users/BarelySmooth/"
        },
        {
            text: "CST1229",
            image: "https://trampoline.turbowarp.org/avatars/64691048",
            href: "https://scratch.mit.edu/users/CST1229/"
        },
        {
            text: "LilyMakesThings",
            image: "https://trampoline.turbowarp.org/avatars/12498592",
            href: "https://scratch.mit.edu/users/LilyMakesThings/"
        }
    ]),
    pmDevelopers: shuffle([
        {
            text: "enderhacker",
            image: "https://github.com/enderhacker.png",
            href: "https://github.com/enderhacker/"
        },
        {
            text: "freshpenguin112",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "Ianyourgod",
            image: "https://github.com/Ianyourgod.png",
            href: "https://github.com/Ianyourgod/"
        },
        {
            text: "JoshAtticus",
            image: "https://github.com/JoshAtticus.png",
            href: "https://github.com/JoshAtticus/"
        },
        {
            text: "JeremyGamer13",
            image: "https://github.com/JeremyGamer13.png",
            href: "https://github.com/JeremyGamer13/"
        },
        {
            text: "jwklong",
            image: "https://github.com/jwklong.png",
            href: "https://github.com/jwklong/"
        },
        {
            text: "tnix100",
            image: "https://github.com/tnix100.png",
            href: "https://github.com/tnix100/"
        },
        {
            text: "RedMan13",
            image: "https://github.com/RedMan13.png",
            href: "https://github.com/RedMan13/"
        },
        {
            text: "SharkPool-SP",
            image: "https://github.com/SharkPool-SP.png",
            href: "https://github.com/SharkPool-SP/"
        },
        {
            text: "showierdata9978",
            image: "https://github.com/showierdata9978.png",
            href: "https://github.com/showierdata9978/"
        },
        {
            text: "DogeisCut",
            image: "https://github.com/DogeisCut.png",
            href: "https://github.com/DogeisCut/"
        }
    ]),
    extensionDevelopers: shuffle([
        {
            text: "GarboMuffin",
            image: "https://github.com/GarboMuffin.png",
            href: "https://github.com/GarboMuffin/"
        },
        {
            text: "griffpatch",
            image: "https://github.com/griffpatch.png",
            href: "https://github.com/griffpatch/"
        },
        {
            text: "DT-is-not-available",
            image: "https://github.com/DT-is-not-available.png",
            href: "https://github.com/DT-is-not-available/"
        },
        {
            text: "Xeltalliv",
            image: "https://github.com/Xeltalliv.png",
            href: "https://github.com/Xeltalliv/"
        },
        {
            text: "MikeDev101",
            image: "https://github.com/MikeDev101.png",
            href: "https://github.com/MikeDev101/"
        },
        {
            text: "LilyMakesThings",
            image: "https://github.com/LilyMakesThings.png",
            href: "https://github.com/LilyMakesThings/"
        }
    ]),
    pmExtensionDevelopers: shuffle([
        {
            text: "qbjl",
            image: "https://github.com/qbjl.png",
            href: "https://github.com/qbjl/"
        },
        {
            text: "NexusKitten",
            image: "https://github.com/NexusKitten.png",
            href: "https://github.com/NexusKitten/"
        },
        {
            text: "Gen1x-ALT",
            image: "https://github.com/Gen1x-ALT.png",
            href: "https://github.com/Gen1x-ALT/"
        },
        {
            text: "SharkPool-SP",
            image: "https://github.com/SharkPool-SP.png",
            href: "https://github.com/SharkPool-SP/"
        },
        {
            // listed as a collaborator on a SharkPool extension
            text: "DogeisCut",
            image: "https://github.com/DogeisCut.png",
            href: "https://github.com/DogeisCut/"
        },
        {
            text: "David-Orangemoon",
            image: "https://github.com/David-Orangemoon.png",
            href: "https://github.com/David-Orangemoon/"
        },
        {
            text: "pooiod",
            image: "https://github.com/pooiod.png",
            href: "https://github.com/pooiod/"
        },
        {
            text: "WAYLIVES",
            image: "https://github.com/WAYLIVES.png",
            href: "https://github.com/WAYLIVES/"
        },
        {
            text: "MrRedstonia",
            image: "https://github.com/MrRedstonia.png",
            href: "https://github.com/MrRedstonia/"
        },
        {
            text: "MikeDev101",
            image: "https://github.com/MikeDev101.png",
            href: "https://github.com/MikeDev101/"
        },
        {
            text: "liablelua",
            image: "https://github.com/liablelua.png",
            href: "https://github.com/liablelua/"
        },
        {
            text: "AlexSchoolOH",
            image: "https://github.com/AlexSchoolOH.png",
            href: "https://github.com/AlexSchoolOH/"
        },
        {
            text: "Monochromasity",
            image: "https://github.com/Monochromasity.png",
            href: "https://github.com/Monochromasity/"
        },
        {
            text: "LilyMakesThings",
            image: "https://github.com/LilyMakesThings.png",
            href: "https://github.com/LilyMakesThings/"
        },
        {
            text: "TheShovel",
            image: "https://github.com/TheShovel.png",
            href: "https://github.com/TheShovel/"
        },
        {
            text: "skyhigh173",
            image: "https://github.com/skyhigh173.png",
            href: "https://github.com/skyhigh173/"
        },
        {
            text: "Ruby-Devs",
            image: "https://github.com/Ruby-Devs.png",
            href: "https://github.com/Ruby-Devs/"
        },
        {
            text: "oc9x97",
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: "lego7set",
            image: "https://github.com/lego7set.png",
            href: "https://github.com/lego7set/"
        },
        {
            text: "mariocraft987",
            image: "https://github.com/mariocraft987.png",
            href: "https://github.com/mariocraft987/"
        },
        {
            text: "AshimeeAlt",
            image: "https://github.com/AshimeeAlt.png",
            href: "https://github.com/AshimeeAlt/"
        },
        {
            text: "ddededodediamante",
            image: "https://github.com/ddededodediamante.png",
            href: "https://github.com/ddededodediamante/"
        }
    ]),
    pmApiDevelopers: shuffle([
        {
            text: "JeremyGamer13",
            image: "https://github.com/JeremyGamer13.png",
            href: "https://github.com/JeremyGamer13/"
        },
        {
            text: "RedMan13",
            image: "https://github.com/RedMan13.png",
            href: "https://github.com/RedMan13/"
        },
        {
            text: "tnix100",
            image: "https://github.com/tnix100.png",
            href: "https://github.com/tnix100/"
        },
        {
            text: "Ianyourgod",
            image: "https://github.com/Ianyourgod.png",
            href: "https://github.com/Ianyourgod/"
        },
        {
            text: "Jwklong",
            image: "https://github.com/Jwklong.png",
            href: "https://github.com/Jwklong/"
        }
    ]),
    pmTranslators: shuffle([
        {
            text: 'Mildanner',
            image: brokenImage,
            href: "https://github.com/mildannerofc",
        },
        {
            text: 'kolikiscool',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'n0name',
            image: brokenImage,
            href: brokenHref,
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
            image: brokenImage,
            href: brokenHref,
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
            image: brokenImage,
            href: brokenHref,
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
            image: brokenImage,
            href: brokenHref,
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
            image: brokenImage,
            href: brokenHref,
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
    ]),
    pmCostumeSubmittors: shuffle([
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
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'eviepepsi',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: '1340073',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'cubeycreator',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'novaspiderultra',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'poundpound0209',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'gdplayer1035',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'cognitixsammy',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'thebusyman',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'skyglide5',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'cxnnie09',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'hoveras',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'blockgamer904',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: "Anonygoose's Dog (Max)",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=anonygoosedog",
            href: "https://penguinmod.com/profile?user=anonygoosedog",
        },
        {
            text: 'mildannerofc',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'bonemaster96',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'phicicle',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'ron027257',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'fur1na__',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: '00ee8a',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'alf2003_14729',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'pedrotheawsomeguy',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'david342013',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'applecode_official',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'harrymations3000',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'yodaugly67_13290',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'splitthread',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'miningminer27',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'gatoc_dev',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'solar_asteri',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'greencube7',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'igorcord',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'abo_notebook',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'broguyf',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'brocant__73748',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'itz_premium',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'kirda132',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'maybe.asdf',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'atomicoperations',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'notapolishcow_52995',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'funster10123',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'jlgri',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'neo_nottro',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'wyfixp',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'blablabluhbluh',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'moony_mon.e',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'thatibrahimguy',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'somerandomguuuy',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'noteezteez',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: "FloppyDisk_OSC",
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: "dogstudiostuff",
            image: `https://github.com/dogstudiostuff.png`,
            href: `https://github.com/dogstudiostuff/`,
        },
        {
            text: "oldalx2020",
            image: brokenImage,
            href: brokenHref,
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
    ]),
    pmSoundSubmittors: shuffle([
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
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'jn567',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'lukepuke311',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'ma_01',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'poundpound0209',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'cognitixsammy',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'mememaster9000',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'rydia_theawesome',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'jackunavailable',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'hammouda101010',
            image: `https://github.com/hammouda101010.png`,
            href: `https://github.com/hammouda101010/`,
        },
        {
            text: 'gdplayer1035',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'ztedsgaming',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: '_zackplayz',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: '_mya.factorial',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'funster10123',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'solar_asteri',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'Anonymous-cat1',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'hablethedev',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'ad1340',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'GlitchedSpirit',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: '.pinksus',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'wyfixp',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'atomicoperations',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'orangeluigi414',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'vojtabubela11',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'light227',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'bubgamer072',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'rugman_3',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'halliementos',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'kurrmailence',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'applecode_official',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'furbyguy',
            image: brokenImage,
            href: brokenHref,
        },
        {
            text: 'cynicmusic',
            image: brokenImage,
            href: "https://opengameart.org/users/cynicmusic",
        },
        {
            text: 'lushogames',
            image: brokenImage,
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
            image: brokenImage,
            href: brokenHref,
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
    ]),
    pmPullRequestDevelopers: shuffle([ // these people made a PR that got merged, or got a dev to add something they made
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
            image: brokenImage,
            href: brokenHref,
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
            image: brokenImage,
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
            image: brokenImage,
            href: `https://github.com/NotCryptid/`,
        },
        {
            text: 'thekeura',
            image: `https://github.com/thekeura.png`,
            href: `https://github.com/thekeura/`,
        }
        // list could be missing some people, but theres not really a way to tell
    ]),
    pmCodeUsedFrom: shuffle([
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
    ]),
    pmSupporters: shuffle([
        {
            text: "jwklong",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=jwklong",
            href: "https://penguinmod.com/profile?user=jwklong"
        },
        {
            text: "lord cat",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=lordcat",
            href: "https://penguinmod.com/profile?user=lordcat"
        },
        {
            text: "qloak",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "bubasxd",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=bubasxd",
            href: "https://penguinmod.com/profile?user=bubasxd"
        },
        {
            text: "anonymous_cat1",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=anonymous_cat1",
            href: "https://penguinmod.com/profile?user=anonymous_cat1"
        },
        {
            text: "silverstero",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "evilvowel_murdersscarykiller",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "jpsAR",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=jpsar",
            href: "https://penguinmod.com/profile?user=jpsar"
        },
        {
            text: "CarrotD1scord",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=carrotp3nguin",
            href: "https://penguinmod.com/profile?user=carrotp3nguin"
        },
        {
            text: "anonygoose",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=anonygoose",
            href: "https://penguinmod.com/profile?user=anonygoose"
        },
        {
            text: "legume1",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "ianyourgod",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=ianyourgod",
            href: "https://penguinmod.com/profile?user=ianyourgod"
        },
        {
            text: "MubiLop",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=mubilop",
            href: "https://penguinmod.com/profile?user=mubilop"
        },
        {
            text: "thekeura",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=thekeura",
            href: "https://penguinmod.com/profile?user=thekeura"
        },
        {
            text: "10000000_fireflies",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "adurrina",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "jeremygamer13",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=jeremygamer13",
            href: "https://penguinmod.com/profile?user=jeremygamer13"
        },
        {
            text: "glacialtemptation",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "camthekirby",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "redman13",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=redman13",
            href: "https://penguinmod.com/profile?user=redman13"
        },
        {
            text: "JoshAtticus",
            image: "https://github.com/JoshAtticus.png",
            href: "https://github.com/JoshAtticus/"
        },
        {
            text: "krkika",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "mralien7893",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=mralien7893",
            href: "https://en.pronouns.page/@Mr.Alien7893"
        },
        {
            text: "gunner_the_bear",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "autoimi",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: ".funkoid",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "tech_wizard72",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "koffeejava",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=koffeejava",
            href: "https://penguinmod.com/profile?user=koffeejava"
        },
        {
            text: "MrRedstonia",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=mrredstonia",
            href: "https://mrredstonia.com/"
        },
        {
            text: "vchi5332664",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=vchi5332664",
            href: "https://penguinmod.com/profile?user=vchi5332664"
        },
        {
            text: "windowsbuild3r",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "atomicoperations",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "joe",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=joe",
            href: "https://penguinmod.com/profile?user=joe"
        },
        {
            text: "algebruh_35",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "giganttech",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=giganttech",
            href: "https://penguinmod.com/profile?user=giganttech"
        },
        {
            text: "wwtv1",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=wwtv1",
            href: "https://penguinmod.com/profile?user=wwtv1"
        },
        {
            text: "freshpenguin112",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "stealpop_games",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "TPR",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=tpr",
            href: "https://penguinmod.com/profile?user=tpr"
        },
        {
            text: "kypo",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "alpacalii",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=alpacalii",
            href: "https://penguinmod.com/profile?user=alpacalii"
        },
        {
            text: "vedal",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=vedal",
            href: "https://penguinmod.com/profile?user=vedal"
        },
        {
            text: "TheShovel",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=theshovel",
            href: "https://penguinmod.com/profile?user=theshovel"
        },
        {
            text: "electricfuzzball_pm",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=electricfuzzball_pm",
            href: "https://www.youtube.com/@ElectricFuzzball_YT"
        },
        {
            text: "gug.",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=kiwi",
            href: "https://penguinmod.com/profile?user=kiwi"
        },
        {
            text: "aubreymcleen",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=aubreymcleen",
            href: "https://penguinmod.com/profile?user=aubreymcleen"
        },
        {
            text: "kylomaskgamer",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=kylomaskgamer",
            href: "https://kylomaskgamer.ca/"
        },
        {
            text: "dotun",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=dotun",
            href: "https://penguinmod.com/profile?user=dotun"
        },
        {
            text: "dillonr",
            image: brokenImage,
            href: brokenHref
        },
        {
            text: "UnbraveChimp",
            image: brokenImage,
            href: "https://minerlegacy.net"
        },
        {
            text: "rooonym",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=rooonym",
            href: "https://penguinmod.com/profile?user=rooonym"
        },
        {
            text: "DogeisCut",
            image: "https://github.com/DogeisCut.png",
            href: "https://github.com/DogeisCut"
        },
        {
            text: "Janix",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=janix",
            href: "https://www.youtube.com/@GDJarnixys"
        },
        {
            text: "mad_d0x_",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=mad_d0x_",
            href: "https://penguinmod.com/profile?user=mad_d0x_"
        },
        {
            text: "NishiFishy",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=nishifishy",
            href: "https://penguinmod.com/profile?user=nishifishy"
        },
        {
            text: "wavis_shr",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=wavis_shr",
            href: "https://penguinmod.com/profile?user=wavis_shr"
        },
        {
            text: "soup",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=soup",
            href: "https://penguinmod.com/profile?user=soup"
        },
        {
            text: "malachite",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=malachite",
            href: "https://penguinmod.com/profile?user=malachite"
        },
        {
            text: "bread_os",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=bread_os",
            href: "https://penguinmod.com/profile?user=bread_os"
        },
        {
            text: "cubey",
            image: "https://projects.penguinmod.com/api/v1/users/getpfp?username=cubey",
            href: "https://penguinmod.com/profile?user=cubey"
        }
    ]),
};
