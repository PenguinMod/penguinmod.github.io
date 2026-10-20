/* eslint-disable max-len */
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {APP_NAME} from '../../brand';

import musicIconURL from './music/music.png';
import musicInsetIconURL from './music/music-small.svg';

import penIconURL from './pen/pen.png';
import penInsetIconURL from './pen/pen-small.svg';

import videoSensingIconURL from './videoSensing/video-sensing.png';
import videoSensingInsetIconURL from './videoSensing/video-sensing-small.svg';

import text2speechIconURL from './text2speech/text2speech.png';
import text2speechInsetIconURL from './text2speech/text2speech-small.svg';

import translateIconURL from './translate/translate.png';
import translateInsetIconURL from './translate/translate-small.png';

import makeymakeyIconURL from './makeymakey/makeymakey.png';
import makeymakeyInsetIconURL from './makeymakey/makeymakey-small.svg';

import animatedTextIconURL from './penguinmod/extensions/text extension.png';
import animatedTextInsetIconURL from './penguinmod/extensions/text extension small.svg';

import microbitIconURL from './microbit/microbit.png';
import microbitInsetIconURL from './microbit/microbit-small.svg';
import microbitConnectionIconURL from './microbit/microbit-illustration.svg';
import microbitConnectionSmallIconURL from './microbit/microbit-small.svg';

import ev3IconURL from './ev3/ev3.png';
import ev3InsetIconURL from './ev3/ev3-small.svg';
import ev3ConnectionIconURL from './ev3/ev3-hub-illustration.svg';
import ev3ConnectionSmallIconURL from './ev3/ev3-small.svg';

import faceSensingIconURL from './faceSensing/thumb.png';

import wedo2IconURL from './wedo2/wedo.png'; // TODO: Rename file names to match variable/prop names?
import wedo2InsetIconURL from './wedo2/wedo-small.svg';
import wedo2ConnectionIconURL from './wedo2/wedo-illustration.svg';
import wedo2ConnectionSmallIconURL from './wedo2/wedo-small.svg';
import wedo2ConnectionTipIconURL from './wedo2/wedo-button-illustration.svg';

import boostIconURL from './boost/boost.png';
import boostInsetIconURL from './boost/boost-small.svg';
import boostConnectionIconURL from './boost/boost-illustration.svg';
import boostConnectionSmallIconURL from './boost/boost-small.svg';
import boostConnectionTipIconURL from './boost/boost-button-illustration.svg';

import gdxforIconURL from './gdxfor/gdxfor.png';
import gdxforInsetIconURL from './gdxfor/gdxfor-small.svg';
import gdxforConnectionIconURL from './gdxfor/gdxfor-illustration.svg';
import gdxforConnectionSmallIconURL from './gdxfor/gdxfor-small.svg';

// turbowarp & gallery icons
import twIcon from './tw/tw.svg';
import galleryIcon from './gallery/gallery.svg';
import customExtensionIcon from './custom/custom.svg';
import turbowarpIcon from './penguinmod/extensions/turbowarp_icon.svg';
import penguinmodLibraryExtensionIcon from './penguinmod/library.svg';
import sharkpoolGalleryIcon from './penguinmod/sharkpool-library.svg';

import ExtForgeIcon from './penguinmod/extforge.svg';

import filesExtensionIcon from './penguinmod/extensions/files.svg';
import jgTailgatingExtensionIcon from './penguinmod/extensions/tailgating.png';
import jgRuntimeExtensionIcon from './penguinmod/extensions/runtime.svg';
import jgPrismExtensionIcon from './penguinmod/extensions/prism.png';
import jgDebuggingIcon from './penguinmod/extensions/debugging.svg';

import jwProtoExtensionIcon from './penguinmod/extensions/proto.svg';
import jwUniteExtensionIcon from './penguinmod/extensions/Unite.png';

import jwStructsExtensionIcon from './penguinmod/extensions/ooplogo.png';

import jwArrayExtensionThumb from './penguinmod/extensions/jwArray.svg';
import jwTargetsExtensionThumb from './penguinmod/extensions/jwTargets.svg';
import jwNumExtensionThumb from './penguinmod/extensions/jwNum.svg';
import jwColorExtensionThumb from './penguinmod/extensions/jwColor.svg';
import jwVectorExtensionThumb from './penguinmod/extensions/jwVector.svg';
import jwLambdaExtensionThumb from './penguinmod/extensions/jwLambda.svg';
import jwScopeExtensionThumb from './penguinmod/extensions/jwScope.svg';
import jwXMLExtensionIcon from './penguinmod/extensions/jwXML.svg';
import jwPointerExtensionThumb from './penguinmod/extensions/jwPointer.svg';
import jwIntExtensionThumb from './penguinmod/extensions/jwInt.svg';

import iygPerlinNoiseExtensionIcon from './penguinmod/extensions/perlinnoisebanner.png';

// thank yo godslayerakp for makin pmCamera :good:
import pmCameraExtensionIcon from './penguinmod/extensions/pmcamera_thumbnail.png';

// cl waw
// import cloudlinkThumb from './penguinmod/extensions/cloudlinkThumb.png';
import cloudlinkIcon from './penguinmod/extensions/cloudlinkIcon.svg';

// thx jeremey
import canvasExtensionBanner from './penguinmod/extensions/CanvasExtensionMenu.png';
import canvasExtensionIcon from './penguinmod/extensions/CanvasSmall.png';

// griffpatch stuff that hopefully we can keep pls plsplspl !!S!
import griffpatchPhysicsThumb from './penguinmod/extensions/griffpatch_physics.png';
import griffpatchPhysicsIcon from './penguinmod/extensions/griffpatch_physicsIcon.svg';

import gp from './penguinmod/extensions/gamepad.svg';
import clippingblending from './penguinmod/extensions/clippingblending.svg';

import pointerlockThumb from './penguinmod/extensions/pointerlock.png';
import cursorThumb from './penguinmod/extensions/cursor.svg';

// LilyMakesThings 🙏
import lilyTempVariablesExtensionIcon from './penguinmod/orgtw/TempVariables2.svg';

// more icons so they arent just red when the extension color is not red
import gsaTempVariablesExtensionIcon from './penguinmod/extensions/tempvariables.svg';
import jgIframeExtensionIcon from './penguinmod/extensions/iframe.png';
import jgExtendedAudioExtensionIcon from './penguinmod/extensions/extendedaudio.png';
import jgScratchAuthExtensionIcon from './penguinmod/extensions/scratchauth2.svg';
import jgPermissionExtensionIcon from './penguinmod/extensions/permissions.png';
import jgCloneManagerExtensionIcon from './penguinmod/extensions/clonemanager.png';
import pmInlineBlocksExtensionIcon from './penguinmod/extensions/inlineblocks.png';
import jgPackagerApplicationsExtensionIcon from './penguinmod/extensions/packagedApplications.png';
import jgPackagerApplicationsInsetExtensionIcon from './penguinmod/extensions/packagedApplications_inset.png';
import spJSONExtensionIcon from './penguinmod/extensions/sp_json.svg';

// import jgTweeningExtensionIcon from './penguinmod/extensions/tween.png';
import jgsilvxrcatInterfacesExtensionIcon from './penguinmod/extensions/interfaces2.png';

// 3D MAN WTF
import jg3dExtensionIcon from './penguinmod/extensions/3d.png';
import jg3dInsetExtensionIcon from './penguinmod/extensions/3dicon.png';
import jg3dVrExtensionIcon from './penguinmod/extensions/3dVr.png';
import jg3dVrInsetExtensionIcon from './penguinmod/extensions/3dVr_Inset.png';
import fr3dPhysicsExtensionIcon from './penguinmod/extensions/3d_physics.png';
import fr3dPhysicsInsetExtensionIcon from './penguinmod/extensions/3d_physics_icon_sized.png';

// virtal realty
import jgVrExtensionIcon from './penguinmod/extensions/vr_extension.png';

import theshovelCustomStylesIcon from './penguinmod/orgtw/CustomStyles.svg';
import theshovelCanvasEffectsIcon from './penguinmod/extensions/canvas_effects.svg';
import theshovelLzCompressIcon from './penguinmod/orgtw/lz-compress2.svg';
import theshovelColorPickerIcon from './penguinmod/orgtw/ColorPicker.svg';

// sharkpool
import sharkpoolPrintingIcon from './penguinmod/extensions/printing.svg';
import sharkpoolTuneIcon from './penguinmod/extensions/tuneShark.svg';
import sharkpoolMBPIcon from './penguinmod/extensions/myBlocksPlus.svg';
import sharkpoolBCIcon from './penguinmod/extensions/BetterComments.svg';
import sharkpoolPEIcon from './penguinmod/extensions/particleEngine.svg';
import jgScriptsExtensionIcon from './penguinmod/extensions/scripts.svg';
import sharkpoolLooksExpandedIcon from './penguinmod/extensions/looksExpanded.svg';
import spTurboSkinsIcon from './penguinmod/extensions/turboSkins.svg';
import spFontManagerIcon from './penguinmod/extensions/fontManager.svg';
import spSoundWaveIcon from './penguinmod/extensions/soundWaves.svg';
import spTempVarsIcon from './penguinmod/extensions/sp_tempVars.svg';

// events
import jgStorageExtensionIcon from './penguinmod/extensions/storage.png';
import jgTimersExtensionIcon from './penguinmod/extensions/multipletimers.png';
import jgAdvancedTextExtensionIcon from './penguinmod/extensions/advancedtext.png';

import jgJavascriptExtensionIcon from './penguinmod/extensions/javascript.png';
import jgPathfindingExtensionIcon from './penguinmod/extensions/pathfinding.png';
import jgAnimationExtensionIcon from './penguinmod/extensions/animation.png';

// category expansions
import pmMotionExpansionExtensionIcon from './penguinmod/extensions/motion_expanded.png';
import pmEventsExpansionExtensionIcon from './penguinmod/extensions/events_expanded.png';
import pmControlsExpansionExtensionIcon from './penguinmod/extensions/controls_expanded.png';
import pmSensingExpansionExtensionIcon from './penguinmod/extensions/sensing_expanded.png';
import pmOperatorsExpansionExtensionIcon from './penguinmod/extensions/operators_expanded.png';

/*
    Deprecated Thumbnails, uncomment if useful again
import turboBuilderIcon from './penguinmod/turbobuilder.png';
import turboBuilderDevIcon from './penguinmod/turbobuilder-dev.png';

import silvxrcatOddMessagesExtensionIcon from './penguinmod/extensions/oddmessages.svg';
import gsaColorUtilExtensionIcon from './penguinmod/extensions/colorutil.png';
import jgJSONExtensionIcon from './penguinmod/extensions/json.png';
*/

// default icon if one is not made yet...
import defaultExtensionIcon from './penguinmod/extensions/placeholder.png';

const urlParams = new URLSearchParams(location.search);
const IsLocal = String(window.location.href).startsWith(`http://localhost:`);
const IsLiveTests = urlParams.has('livetests');

const menuItems = [
    {
        name: (
            <FormattedMessage
                defaultMessage="Music"
                description="Name for the 'Music' extension"
                id="gui.extension.music.name"
            />
        ),
        extensionId: 'music',
        iconURL: musicIconURL,
        insetIconURL: musicInsetIconURL,
        customInsetColor: '#CF63CF',
        tags: ['scratch', 'noisemaker'],
        description: (
            <FormattedMessage
                defaultMessage="Play instruments and drums."
                description="Description for the 'Music' extension"
                id="gui.extension.music.description"
            />
        ),
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Pen"
                description="Name for the 'Pen' extension"
                id="gui.extension.pen.name"
            />
        ),
        extensionId: 'pen',
        iconURL: penIconURL,
        insetIconURL: penInsetIconURL,
        tags: ['scratch', 'graphics'],
        description: (
            <FormattedMessage
                defaultMessage="Draw with your sprites."
                description="Description for the 'Pen' extension"
                id="gui.extension.pen.description"
            />
        ),
        featured: true
    },
    {
        name: 'Animated Text',
        extensionId: 'text',
        iconURL: animatedTextIconURL,
        insetIconURL: animatedTextInsetIconURL,
        customInsetColor: '#9A66FF',
        tags: ['scratch'],
        description: 'Bring words to life.',
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Video Sensing"
                description="Name for the 'Video Sensing' extension"
                id="gui.extension.videosensing.name"
            />
        ),
        extensionId: 'videoSensing',
        iconURL: videoSensingIconURL,
        insetIconURL: videoSensingInsetIconURL,
        customInsetColor: '#74BDDC',
        tags: ['scratch', 'hardware'],
        description: (
            <FormattedMessage
                defaultMessage="Sense motion with the camera."
                description="Description for the 'Video Sensing' extension"
                id="gui.extension.videosensing.description"
            />
        ),
        featured: true
    },
    {
        name: 'Face Sensing',
        extensionId: 'https://extensions.turbowarp.org/lab/face-sensing.js',
        iconURL: faceSensingIconURL,
        tags: ['scratch'],
        description: 'Sense faces with the camera.',
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Text to Speech"
                description="Name for the Text to Speech extension"
                id="gui.extension.text2speech.name"
            />
        ),
        extensionId: 'text2speech',
        collaborator: 'Amazon Web Services',
        credits: 'Google TTS',
        iconURL: text2speechIconURL,
        insetIconURL: text2speechInsetIconURL,
        customInsetColor: '#9966FF',
        tags: ['scratch', 'noisemaker'],
        description: (
            <FormattedMessage
                defaultMessage="Make your projects talk."
                description="Description for the Text to speech extension"
                id="gui.extension.text2speech.description"
            />
        ),
        featured: true,
        internetConnectionRequired: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Translate"
                description="Name for the Translate extension"
                id="gui.extension.translate.name"
            />
        ),
        extensionId: 'translate',
        collaborator: 'Google',
        iconURL: translateIconURL,
        insetIconURL: translateInsetIconURL,
        customInsetColor: '#5CB1D6',
        tags: ['scratch'],
        description: (
            <FormattedMessage
                defaultMessage="Translate text into many languages."
                description="Description for the Translate extension"
                id="gui.extension.translate.description"
            />
        ),
        featured: true,
        internetConnectionRequired: true
    },
    {
        name: 'Makey Makey',
        extensionId: 'makeymakey',
        collaborator: 'JoyLabz',
        iconURL: makeymakeyIconURL,
        insetIconURL: makeymakeyInsetIconURL,
        customInsetColor: '#E64D00',
        tags: ['scratch', 'hardware'],
        description: (
            <FormattedMessage
                defaultMessage="Make anything into a key."
                description="Description for the 'Makey Makey' extension"
                id="gui.extension.makeymakey.description"
            />
        ),
        featured: true
    },
    {
        name: 'Stage Camera',
        extensionId: 'pmCamera',
        iconURL: pmCameraExtensionIcon,
        tags: ['penguinmod'],
        description: (
            <FormattedMessage
                defaultMessage="Allows the camera to move around anywhere on the stage."
                description="The description for the PenguinMod Camera extension."
                id="pm.extension.camera.description"
            />
        ),
        credits: 'Inspired by⠀⠀⠀⠀⠀⠀ DT-is-not-available',
        featured: true
    },
    {
        name: 'Files',
        extensionId: 'https://sharkpools-extensions.vercel.app/extension-code/Files-Expanded.js',
        extDeveloper: 'SharkPool',
        iconURL: filesExtensionIcon,
        tags: ['turbowarp', 'datamgmt'],
        description: 'Blocks for reading, editing, & creating files & folders.',
        featured: true
    },
    {
        name: 'Zip',
        extensionId: 'https://extensions.turbowarp.org/CST1229/zip.js',
        iconURL: 'https://extensions.turbowarp.org/images/CST1229/zip.svg',
        insetIconURL: turbowarpIcon,
        tags: ['turbowarp', 'datamgmt'],
        description: 'Create and edit .zip format files, including .sb3 files.',
        twDeveloper: 'CST1229',
        featured: true
    },
    {
        name: 'Pen+',
        extensionId: 'https://extensions.penguinmod.com/extensions/ObviousAlexC/PenPlus.js',
        tags: ['categoryexpansion', 'graphics'],
        iconURL: 'https://extensions.penguinmod.com/images/ObviousAlexC/PenPlus.svg',
        description: 'An extension to the Pen category! Adds blocks for drawing triangles using textures and tints, drawing images and editing their pixels, etc.',
        featured: true,
        extDeveloper: 'pinksheep2917'
    },
    {
        name: 'Sound Systems',
        extensionId: 'jgExtendedAudio',
        iconURL: jgExtendedAudioExtensionIcon,
        tags: ['penguinmod', 'categoryexpansion', 'noisemaker'],
        description: 'An audio grouping system for more intensive audio work.',
        featured: true
    },
    {
        name: 'Tune Shark V3',
        extensionId: 'https://sharkpools-extensions.vercel.app/extension-code/Tune-Shark-V3.js',
        iconURL: sharkpoolTuneIcon,
        tags: ['penguinmod', 'categoryexpansion', 'noisemaker'],
        description: 'Advanced audio engine with complex sound control, multiple audio effects and more!',
        extDeveloper: 'SharkPool',
        featured: true
    },
    {
        name: 'Sound Waves',
        extensionId: 'https://extensions.penguinmod.com/extensions/SharkPool/Sound-Waves.js',
        iconURL: spSoundWaveIcon,
        tags: ['penguinmod', 'noisemaker'],
        description: 'Make sounds with oscillators!',
        extDeveloper: 'SharkPool',
        featured: true
    },
    {
        name: 'Motion Expansion',
        extensionId: 'pmMotionExpansion',
        iconURL: pmMotionExpansionExtensionIcon,
        tags: ['penguinmod', 'categoryexpansion'],
        description: 'More small motion blocks for movement or collision.',
        featured: true,
        credits: 'Some blocks from NexusKitten'
    },
    {
        name: 'Looks Expanded',
        extensionId: 'https://sharkpools-extensions.vercel.app/extension-code/Looks-Expanded.js',
        iconURL: sharkpoolLooksExpandedIcon,
        tags: ['penguinmod', 'categoryexpansion', 'graphics'],
        description: 'Expansion of the Looks Category.',
        extDeveloper: 'SharkPool, CST1229',
        featured: true
    },
    {
        name: 'Events Expansion',
        extensionId: 'pmEventsExpansion',
        iconURL: pmEventsExpansionExtensionIcon,
        tags: ['penguinmod', 'categoryexpansion'],
        description: 'More events for sending & receiving information, notifing specific sprites or better control when things should happen.',
        featured: true,
        credits: 'Some blocks from LilyMakesThings'
    },
    {
        name: 'Controls Expansion',
        extensionId: 'pmControlsExpansion',
        iconURL: pmControlsExpansionExtensionIcon,
        tags: ['penguinmod', 'categoryexpansion'],
        description: 'More control blocks for animations, complex systems or cleaner one-time use blocks.',
        featured: true,
        credits: '"new thread" by CubesterYT, CST1229, SharkPool'
    },
    {
        name: 'Sensing Expansion',
        extensionId: 'pmSensingExpansion',
        iconURL: pmSensingExpansionExtensionIcon,
        tags: ['penguinmod', 'categoryexpansion'],
        description: "More sensing blocks for specific use cases or interacting with the user's device.",
        credits: 'Some blocks from SharkPool-SP',
        featured: true
    },
    {
        name: 'Operators Expansion',
        extensionId: 'pmOperatorsExpansion',
        iconURL: pmOperatorsExpansionExtensionIcon,
        tags: ['penguinmod', 'categoryexpansion', 'math'],
        description: 'More operators like nand, nor, character code to character, reading multiple lined text line by line, etc.',
        featured: true
    },
    {
        name: 'My Blocks+',
        extensionId: 'https://sharkpools-extensions.vercel.app/extension-code/My-Blocks-Plus.js',
        iconURL: sharkpoolMBPIcon,
        tags: ['penguinmod', 'categoryexpansion'],
        description: 'Create private or global custom blocks with custom inputs, colors, and more!',
        extDeveloper: 'SharkPool, CST1229, 0znzw',
        featured: true
    },
    {
        name: 'Better Comments',
        extensionId: 'https://sharkpools-extensions.vercel.app/extension-code/Better-Comments.js',
        iconURL: sharkpoolBCIcon,
        tags: ['penguinmod', 'categoryexpansion'],
        description: 'Better Comments with Customization and Markdown support',
        extDeveloper: 'SharkPool',
        featured: true
    },
    {
        name: 'Particle Engine',
        extensionId: 'https://sharkpools-extensions.vercel.app/extension-code/Particle-Engine.js',
        iconURL: sharkpoolPEIcon,
        tags: ['penguinmod', 'graphics'],
        description: 'Create powerful Particle Engines without Clones',
        extDeveloper: 'SharkPool',
        featured: true
    },
    {
        name: 'Custom Styles',
        extensionId: 'shovelcss',
        iconURL: theshovelCustomStylesIcon,
        tags: ['penguinmod', 'graphics'],
        description: 'Customize the appearance of variable monitors and prompts in your project.',
        extDeveloper: 'TheShovel',
        featured: true
    },
    {
        name: 'Physics',
        extensionId: 'https://extensions.turbowarp.org/box2d.js',
        tags: ['turbowarp'],
        extDeveloper: 'griffpatch',
        iconURL: griffpatchPhysicsThumb,
        insetIconURL: griffpatchPhysicsIcon,
        description: 'Box2D Physics extension created by Griffpatch.',
        customInsetColor: '#D9F0FF',
        featured: true
    },
    {
        name: 'Tweening',
        extensionId: 'jgTween',
        credits: 'easings.net, Arrow & GarboMuffin',
        description: 'Smoothly animating values using different easing functions and directions.',
        iconURL: 'https://extensions.turbowarp.org/images/JeremyGamer13/tween.svg',
        tags: ['penguinmod'],
        featured: true
    },
    {
        name: 'Tailgating',
        extensionId: 'jgTailgating',
        description: 'Have sprites & clones follow behind other sprites & clones by an offset, like RPG party members.',
        iconURL: jgTailgatingExtensionIcon,
        tags: ['penguinmod'],
        featured: true
    },
    {
        name: 'Tile Grids',
        extensionId: 'https://extensions.penguinmod.com/extensions/SharkPool/Tile-Grids.js',
        iconURL: 'https://extensions.penguinmod.com/images/SharkPool/Tile-Grids.svg',
        tags: ['penguinmod'],
        description: 'Place sprites on grids.',
        extDeveloper: 'SharkPool-SP',
        featured: true
    },
    {
        name: 'Canvas Effects',
        extensionId: 'theshovelcanvaseffects',
        iconURL: theshovelCanvasEffectsIcon,
        tags: ['penguinmod', 'graphics'],
        description: 'Apply visual effects to the entire stage.',
        extDeveloper: 'TheShovel',
        credits: 'SharkPool',
        featured: true
    },
    {
        name: 'Clones+',
        extensionId: 'https://extensions.turbowarp.org/Lily/ClonesPlus.js',
        tags: ['turbowarp', 'categoryexpansion'],
        iconURL: 'https://extensions.turbowarp.org/images/Lily/ClonesPlus.svg',
        insetIconURL: turbowarpIcon,
        description: "Expansion of Scratch's clone features.",
        featured: true,
        twDeveloper: 'LilyMakesThings'
    },
    {
        name: 'Turbo Skins',
        extensionId: 'https://sharkpools-extensions.vercel.app/extension-code/Turbo-Skins.js',
        tags: ['penguinmod', 'graphics'],
        iconURL: spTurboSkinsIcon,
        description: 'Display sprites with various images or costumes and control their hitboxes',
        extraLabels: [
            {
                name: "Inspired by",
                value: "\"Skins\" by LilyMakesThings"
            }
        ],
        featured: true,
        credits: 'SharkPool'
    },
    {
        name: 'Multiple Timers',
        extensionId: 'jgTimers',
        iconURL: jgTimersExtensionIcon,
        tags: ['penguinmod'],
        description: 'Create different timers you can control seperately.',
        eventSubmittor: 'Arrow',
        featured: true
    },
    {
        name: 'Temporary Variables',
        extensionId: 'tempVars',
        iconURL: gsaTempVariablesExtensionIcon,
        tags: ['penguinmod'],
        description: 'Create temporary variables for use in one block stack.',
        featured: true
    },
    {
        name: 'SharkPool\'s Temporary Variables',
        extensionId: 'https://sharkpools-extensions.vercel.app/extension-code/Temporary-Variables.js',
        iconURL: spTempVarsIcon,
        tags: ['penguinmod', 'datamgmt'],
        description: 'Create temporary runtime, threaded, sprite & scoped variables.',
        featured: true
    },
    {
        name: 'TurboWarp Temporary Variables',
        extensionId: 'lmsTempVars2',
        iconURL: lilyTempVariablesExtensionIcon,
        tags: ['turbowarp'],
        description: 'Create disposable runtime or thread variables.',
        insetIconURL: turbowarpIcon,
        credits: 'LilyMakesThings',
        featured: true
    },
    {
        name: 'Swift JSON',
        extensionId: 'https://sharkpools-extensions.vercel.app/extension-code/JSON-Array.js',
        iconURL: spJSONExtensionIcon,
        tags: ['penguinmod', 'datamgmt'],
        extDeveloper: 'SharkPool',
        description: 'FAST Extension for handling JSON objects and arrays efficiently. Recommended if you are heavily using JSON several times in a project.',
        featured: true
    },
    {
        name: 'Runtime Modifications',
        extensionId: 'jgRuntime',
        tags: ['penguinmod'],
        iconURL: jgRuntimeExtensionIcon,
        description: 'Blocks for updating Scratch objects like the stage and sprites.',
        credits: 'TheShovel, showierdata9978, SharkPool',
        featured: true
    },
    {
        name: 'Font Manager',
        extensionId: 'https://extensions.penguinmod.com/extensions/SharkPool/Font-Manager.js',
        iconURL: spFontManagerIcon,
        tags: ['penguinmod', 'graphics'],
        description: 'Manage, create, and delete fonts.',
        credits: 'SharkPool, Ashimee',
        featured: true
    },
    {
        name: 'Storage',
        extensionId: 'jgStorage',
        iconURL: jgStorageExtensionIcon,
        tags: ['penguinmod', 'datamgmt'],
        description: 'Store data after PenguinMod has already been closed out. Basic Server Storage is also included.',
        eventSubmittor: 'Fir & silvxrcat',
        featured: true
    },
    {
        name: 'HTTP',
        extensionId: 'https://extensions.turbowarp.org/godslayerakp/http.js',
        iconURL: 'https://extensions.turbowarp.org/images/godslayerakp/http.svg',
        insetIconURL: turbowarpIcon,
        tags: ['turbowarp'],
        description: 'Comprehensive extension for interacting with external websites.',
        featured: true,
        internetConnectionRequired: true,
        customInsetColor: '#ff4d4d'
    },
    {
        name: 'CloudLink',
        extensionId: 'https://extensions.penguinmod.com/extensions/MikeDev101/cloudlink.js',
        tags: ['turbowarp', 'penguinmod'],
        insetIconURL: cloudlinkIcon,
        iconURL: 'https://extensions.penguinmod.com/images/MikeDev101/cloudlink.svg',
        description: 'A powerful WebSocket extension for Scratch.',
        featured: true,
        extDeveloper: 'MikeDev',
        internetConnectionRequired: true
    },
    {
        name: 'Scripts',
        extensionId: 'jgScripts',
        iconURL: jgScriptsExtensionIcon,
        tags: ['penguinmod', 'datamgmt'],
        description: 'Create compiled scripts with blocks while the project is running.',
        featured: true
    },
    {
        name: 'Pang API',
        extensionId: 'https://extensions.penguinmod.com/extensions/SammerLOL/pangapi.js',
        iconURL: 'https://extensions.penguinmod.com/images/SammerLOL/pangapi.avif',
        tags: ['penguinmod'],
        description: 'Fetch information from the PenguinMod API.',
        extDeveloper: 'oc9x97, Ianyourgod',
        featured: true
    },
    {
        name: '3D Math',
        extensionId: 'https://extensions.penguinmod.com/extensions/ObviousAlexC/3DMath.js',
        iconURL: 'https://extensions.penguinmod.com/images/ObviousAlexC/3DMath.svg',
        tags: ['penguinmod', '3d', 'graphics', 'math'],
        description: 'A handful of utilities for making your own sprite-based 3D engine.',
        extDeveloper: 'pinksheep2917',
        featured: true
    },
    {
        name: 'Random Utilities',
        extensionId: 'https://extensions.penguinmod.com/extensions/Gen1x/random_utils.js',
        iconURL: 'https://extensions.penguinmod.com/images/Gen1x/randomutils.avif',
        tags: ['penguinmod'],
        description: 'Many blocks related to generating random values, including seed-based number generation, true number generation, UUID\'s, random strings, etc.',
        extDeveloper: 'G1nX',
        featured: true
    },
    {
        name: 'LZ Compress',
        extensionId: 'shovellzcompresss',
        iconURL: theshovelLzCompressIcon,
        tags: ['penguinmod', 'datamgmt'],
        description: 'Compress and decompress text using lz-string.',
        extDeveloper: 'TheShovel',
        featured: true
    },
    {
        name: 'Prism',
        extensionId: 'jgPrism',
        tags: ['penguinmod', 'datamgmt'],
        iconURL: jgPrismExtensionIcon,
        description: 'Blocks for specific use-cases or major convenience.',
        featured: true
    },
    {
        name: 'HTML iframe Elements',
        extensionId: 'jgIframe',
        iconURL: jgIframeExtensionIcon,
        tags: ['penguinmod'],
        description: 'Blocks to place and move around frames that contain HTML content or websites.',
        featured: true,
        internetConnectionRequired: true
    },
    {
        name: 'Color Picker',
        extensionId: 'shovelColorPicker',
        iconURL: theshovelColorPickerIcon,
        tags: ['penguinmod'],
        description: 'Allow the user to choose a color using the built-in color picker, so you don\'t need to make your own.',
        extDeveloper: 'TheShovel',
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Labels"
                description="Name of Proto extension"
                id="jwProto.jwProtoExtension.name"
            />
        ),
        extensionId: 'jwProto',
        iconURL: jwProtoExtensionIcon,
        tags: ['penguinmod'],
        description: (
            <FormattedMessage
                // change this back if you update the extension to have more things
                defaultMessage="Labelling and Placeholders."
                description="Description of Proto extension"
                id="jwProto.jwProtoExtension.description"
            />
        ),
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Perlin Noise"
                description="Name of perlin noise extension"
                id="iygPerlin.iygPerlinExtension.name"
            />
        ),
        extensionId: 'iygPerlin',
        tags: ['penguinmod'],
        iconURL: iygPerlinNoiseExtensionIcon,
        description: (
            <FormattedMessage
                defaultMessage="Blocks for generating and using Perlin noise. Good for generating terrain, clouds, and other things."
                description="Description of perlin noise extension"
                id="iygPerlin.iygPerlinExtension.description"
            />
        ),
        featured: true
    },
    {
        name: 'GamePad',
        extensionId: 'Gamepad',
        tags: ['turbowarp', 'hardware'],
        insetIconURL: turbowarpIcon,
        twDeveloper: 'GarboMuffin',
        iconURL: gp,
        description: (
            <FormattedMessage
                defaultMessage="Directly access gamepads instead of just mapping buttons to keys."
                description="Description for the 'GamePad' extension"
                id="GamepadExtension.GamepadExtension.description"
            />
        ),
        featured: true
    },
    {
        name: 'Printing',
        tags: ['penguinmod', 'hardware'],
        extensionId: 'sharkpoolPrinting',
        iconURL: sharkpoolPrintingIcon,
        description: 'Allows you to show a dialog for printing text, images, and custom HTML to a printer.',
        featured: true
    },
    {
        name: 'Clipping and Blending',
        extensionId: 'https://extensions.turbowarp.org/Xeltalliv/clippingblending.js',
        iconURL: clippingblending,
        tags: ['turbowarp', 'graphics'],
        insetIconURL: turbowarpIcon,
        description: 'Clipping outside of a specified rectangular area and additive color blending.',
        featured: true,
        twDeveloper: 'Vadik1'
    },
    {
        name: 'Pointer Lock',
        extensionId: 'https://extensions.turbowarp.org/pointerlock.js',
        tags: ['turbowarp'],
        insetIconURL: turbowarpIcon,
        iconURL: pointerlockThumb,
        description: (
            <FormattedMessage
                defaultMessage="A extension to lock the mouse cursor in the stage."
                description="Scratch utilities"
                id="gui.extension.pointerlock.description"
            />
        ),
        featured: true,
        internetConnectionRequired: false,
        twDeveloper: 'GarboMuffin'
    },
    {
        name: 'Mouse Cursor',
        extensionId: 'https://extensions.turbowarp.org/cursor.js',
        tags: ['turbowarp'],
        insetIconURL: turbowarpIcon,
        iconURL: 'https://extensions.turbowarp.org/images/cursor.png',
        description: (
            <FormattedMessage
                defaultMessage="A extension to change what the mouse cursor looks like on the stage."
                description="Scratch utilities"
                id="gui.extension.MouseCursor.description"
            />
        ),
        featured: true,
        internetConnectionRequired: false,
        twDeveloper: 'GarboMuffin'
    },
    {
        name: 'Scratch Authentication',
        extensionId: 'jgScratchAuthenticate',
        iconURL: jgScratchAuthExtensionIcon,
        tags: ['penguinmod'],
        description: "Interact with Scratch Authentication to prove the player is a real scratch user.",
        featured: true
    },
    {
        name: 'JavaScript',
        extensionId: 'SPjavascriptV2',
        iconURL: jgJavascriptExtensionIcon,
        tags: ['penguinmod', 'programminglanguage'],
        description: 'Run your own custom code written in JavaScript!',
        featured: true
    },
    {
        name: 'Arrays',
        extensionId: 'jwArray',
        iconURL: jwArrayExtensionThumb,
        tags: ['penguinmod', 'datamgmt'],
        description: 'Store data efficiently in multi-purpose arrays.',
        extDeveloper: 'jwklong',
        featured: true
    },
    {
        name: 'Objects',
        extensionId: 'https://extensions.penguinmod.com/extensions/DogeisCut/dogeiscutObject.js',
        iconURL: 'https://extensions.penguinmod.com/images/DogeisCut/dogeiscutObject.svg',
        tags: ['penguinmod', 'datamgmt'],
        description: 'Store data efficiently in multi-purpose objects.',
        extDeveloper: 'DogeisCut',
        featured: true
    },
    {
        name: 'XML',
        extensionId: 'jwXML',
        iconURL: jwXMLExtensionIcon,
        tags: ['penguinmod', 'datamgmt'],
        description: 'Creating, parsing and modifying XML data.',
        extDeveloper: 'jwklong',
        featured: true
    },
    {
        name: 'Targets',
        extensionId: 'jwTargets',
        iconURL: jwTargetsExtensionThumb,
        tags: ['penguinmod'],
        description: 'Direct access to sprites and their clones.',
        extDeveloper: 'jwklong',
        featured: true
    },
    {
        name: 'Infinity',
        extensionId: 'jwNum',
        iconURL: jwNumExtensionThumb,
        tags: ['penguinmod', 'math'],
        description: 'Advanced number type capable of really big numbers.',
        extDeveloper: 'jwklong',
        credits: 'Naruyoko for ExpantaNum.js',
        featured: true
    },
    {
        name: 'Color',
        extensionId: 'jwColor',
        iconURL: jwColorExtensionThumb,
        tags: ['penguinmod', 'graphics'],
        description: 'Utilities for anything involving colors.',
        extDeveloper: 'jwklong',
        featured: true
    },
    {
        name: 'Vector',
        extensionId: 'jwVector',
        iconURL: jwVectorExtensionThumb,
        tags: ['penguinmod', 'math'],
        description: 'Vector type for calculating with X and Y coordinates.',
        extDeveloper: 'jwklong',
        featured: true
    },
    {
        name: 'Lambda',
        extensionId: 'jwLambda',
        iconURL: jwLambdaExtensionThumb,
        tags: ['penguinmod'],
        description: 'Create anonymous functions with arguments and execute them.',
        extDeveloper: 'jwklong',
        featured: true
    },
    {
        name: 'Scope',
        extensionId: 'jwScope',
        iconURL: jwScopeExtensionThumb,
        tags: ['penguinmod'],
        description: 'Temporary variables based on block stack. (extra blocks if used with Array extension)',
        extDeveloper: 'jwklong',
        featured: true
    },
    {
        name: 'Pointers',
        extensionId: 'jwPointer',
        iconURL: jwPointerExtensionThumb,
        tags: ['penguinmod', 'datamgmt'],
        description: 'Define references to values. (extra blocks if used with Array extension)',
        extDeveloper: 'jwklong',
        featured: true
    },
    {
        name: 'Integers',
        extensionId: 'jwInt',
        iconURL: jwIntExtensionThumb,
        tags: ['penguinmod', 'math'],
        description: 'Large integers with zero precision loss.',
        extDeveloper: 'jwklong',
        featured: true
    },
    {
        name: 'micro:bit',
        extensionId: 'microbit',
        collaborator: 'micro:bit',
        iconURL: microbitIconURL,
        insetIconURL: microbitInsetIconURL,
        tags: ['scratch', 'hardware'],
        description: (
            <FormattedMessage
                defaultMessage="Connect your projects with the world."
                description="Description for the 'micro:bit' extension"
                id="gui.extension.microbit.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: microbitConnectionIconURL,
        connectionSmallIconURL: microbitConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their micro:bit."
                id="gui.extension.microbit.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/microbit'
    },
    {
        name: 'LEGO MINDSTORMS EV3',
        extensionId: 'ev3',
        collaborator: 'LEGO',
        iconURL: ev3IconURL,
        insetIconURL: ev3InsetIconURL,
        tags: ['scratch', 'hardware'],
        description: (
            <FormattedMessage
                defaultMessage="Build interactive robots and more."
                description="Description for the 'LEGO MINDSTORMS EV3' extension"
                id="gui.extension.ev3.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: ev3ConnectionIconURL,
        connectionSmallIconURL: ev3ConnectionSmallIconURL,
        customInsetColor: '#FFBF00',
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting. Make sure the pin on your EV3 is set to 1234."
                description="Message to help people connect to their EV3. Must note the PIN should be 1234."
                id="gui.extension.ev3.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/ev3'
    },
    {
        name: 'LEGO BOOST',
        extensionId: 'boost',
        collaborator: 'LEGO',
        iconURL: boostIconURL,
        insetIconURL: boostInsetIconURL,
        tags: ['scratch', 'hardware'],
        description: (
            <FormattedMessage
                defaultMessage="Bring robotic creations to life."
                description="Description for the 'LEGO BOOST' extension"
                id="gui.extension.boost.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: true,
        connectionIconURL: boostConnectionIconURL,
        connectionSmallIconURL: boostConnectionSmallIconURL,
        connectionTipIconURL: boostConnectionTipIconURL,
        customInsetColor: '#FFAB19',
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their BOOST."
                id="gui.extension.boost.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/boost'
    },
    {
        name: 'LEGO Education WeDo 2.0',
        extensionId: 'wedo2',
        collaborator: 'LEGO',
        iconURL: wedo2IconURL,
        insetIconURL: wedo2InsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Build with motors and sensors."
                description="Description for the 'LEGO WeDo 2.0' extension"
                id="gui.extension.wedo2.description"
            />
        ),
        featured: true,
        disabled: false,
        tags: ['scratch', 'hardware'],
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: true,
        connectionIconURL: wedo2ConnectionIconURL,
        connectionSmallIconURL: wedo2ConnectionSmallIconURL,
        connectionTipIconURL: wedo2ConnectionTipIconURL,
        customInsetColor: '#FF6680',
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their WeDo."
                id="gui.extension.wedo2.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/wedo'
    },
    {
        name: 'Go Direct Force & Acceleration',
        extensionId: 'gdxfor',
        collaborator: 'Vernier',
        iconURL: gdxforIconURL,
        insetIconURL: gdxforInsetIconURL,
        customInsetColor: '#4C97FF',
        tags: ['scratch', 'hardware'],
        description: (
            <FormattedMessage
                defaultMessage="Sense push, pull, motion, and spin."
                description="Description for the Vernier Go Direct Force and Acceleration sensor extension"
                id="gui.extension.gdxfor.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: gdxforConnectionIconURL,
        connectionSmallIconURL: gdxforConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their force and acceleration sensor."
                id="gui.extension.gdxfor.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/vernier'
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="PenguinMod Extra Extensions"
                description="Name of library item to open the Extra Extensions gallery"
                id="pm.extraLibraryExtensions.name"
            />
        ),
        href: 'https://extensions.penguinmod.com/?editor=true',
        extensionId: 'special_penguinmodExtensionLibrary',
        iconURL: penguinmodLibraryExtensionIcon,
        description: (
            <FormattedMessage
                defaultMessage="See some user-submitted extensions. Opens in a new tab."
                description="Description of library item to open the Extra Extensions gallery"
                id="pm.extraLibraryExtensions.description"
            />
        ),
        tags: ['penguinmod', 'library'],
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="TurboWarp Extension Gallery"
                description="Name of extensions.turbowarp.org in extension library"
                id="tw.extensionGallery.name"
                values={{
                    APP_NAME: "TurboWarp"
                }}
            />
        ),
        href: 'https://extensions.turbowarp.org/',
        extensionId: 'special_turbowarpExtensionLibrary',
        iconURL: galleryIcon,
        description: (
            <FormattedMessage
                // eslint-disable-next-line max-len
                defaultMessage="We list many TurboWarp extensions here for convenience, but you can find even more on extensions.turbowarp.org."
                description="Description of extensions.turbowarp.org in extension library"
                id="tw.extensionGallery.description"
            />
        ),
        tags: ['tw', 'turbowarp', 'library'],
        featured: true
    },
    {
        name: 'SharkPool\'s Extension Collection',
        href: 'https://sharkpools-extensions.vercel.app/?originPM=true',
        extensionId: 'special_sharkpoolExtensionLibrary',
        iconURL: sharkpoolGalleryIcon,
        description: 'Tons of extensions created by SharkPool.\n\nClick on an extension while this menu is open to add it to your project.',
        credits: 'Listed in the site',
        tags: ['library'],
        featured: true
    },{
        // not really an extension, but it's easiest to present it as one
        name: 'ExtForge',
        href: 'https://jwklong.github.io/extforge',
        extensionId: 'special_extforge',
        iconURL: ExtForgeIcon,
        description: 'Create extensions with a block-based UI.',
        extDeveloper: 'jwklong',
        isNew: true,
        tags: ['extcreate'],
        featured: true
    },
    {
        // not really an extension, but it's easiest to present it as one
        name: (
            <FormattedMessage
                defaultMessage="Custom Extension"
                description="Name of library item to load a custom extension from a remote source"
                id="tw.customExtension.name"
            />
        ),
        extensionId: '',
        iconURL: customExtensionIcon,
        description: (
            <FormattedMessage
                defaultMessage="Load custom extensions from URLs, files, or JavaScript source code."
                description="Description of library item to load a custom extension from a custom source"
                id="tw.customExtension.description"
            />
        ),
        featured: true
    }
    /*DEPRECATED
    {
        name: 'JSON',
        extensionId: 'jgJSON',
        iconURL: jgJSONExtensionIcon,
        tags: ['penguinmod', 'datamgmt'],
        description: 'Blocks for handling JSON objects and Arrays.',
        featured: true
    },
    {
        name: 'Color Utility Blocks',
        extensionId: 'colors',
        iconURL: gsaColorUtilExtensionIcon,
        tags: ['penguinmod'],
        description: 'Converters for Hex, RGB, HSV and Decimal colors and other color related things.',
        featured: true
    },
    {
        name: 'Odd Messages',
        extensionId: 'oddMessage',
        tags: ['penguinmod'],
        iconURL: silvxrcatOddMessagesExtensionIcon,
        description: 'For logging and variable utilization.',
        featured: true,
        extDeveloper: 'silvxrcat'
    },
    {
        name: 'Extra Mathematics',
        extensionId: 'https://extensions.penguinmod.com/extensions/jwklong/mathematics.js',
        iconURL: 'https://extensions.penguinmod.com/images/jwklong/mathematics.avif',
        tags: ['penguinmod', 'categoryexpansion', 'math'],
        description: 'Complicated maths extension for nerds.',
        extDeveloper: 'jwklong',
        featured: false
    },
    {
        name: 'All Menus',
        extensionId: 'https://extensions.penguinmod.com/extensions/Lily/AllMenus.js',
        iconURL: 'https://extensions.penguinmod.com/images/Lily/AllMenus.svg',
        tags: ['penguinmod'],
        description: 'Every dropdown menu for each block, in one extension.',
        extDeveloper: 'LilyMakesThings',
        featured: true
    },
    {
        // not really an extension, but it's easiest to present it as one
        name: 'TurboBuilder',
        href: 'https://turbobuilder.vercel.app/',
        extensionId: 'special_turboBuilder',
        iconURL: turboBuilderIcon,
        description: 'Create your own amazing extensions using a scratch-based UI!',
        credits: 'Started by JeremyGamer13, continued by jwklong',
        tags: ['extcreate'],
        featured: true,
        disabled: !(IsLocal || IsLiveTests)
    },
    {
        // not really an extension, but it's easiest to present it as one
        name: 'TurboBuilder - Dev Branch',
        href: 'https://turbobuilder-dev.vercel.app/',
        extensionId: 'special_turboBuilderDev',
        iconURL: turboBuilderDevIcon,
        description: 'Publicly available developer branch, with the latest features.',
        credits: 'Started by JeremyGamer13, continued by jwklong',
        tags: ['extcreate'],
        featured: true
    },*/
];

/*
----------------------------------------------
### NOTE TO PENGUINMOD FORKS: ###
Please DO NOT make the extensions below accessible in the editor without livetests!
They are NOT fully developed for people to use and create full projects with!

These extensions could have missing features, cause random errors, broken projects, or even crash the editor!
Moving these into the main extension list will cause people who use your fork to assume they are ready for them to use!

Please keep these in livetests to reduce bug reports on your fork! :)
----------------------------------------------
*/
if (IsLocal || IsLiveTests) {
    const extras = [
        {
            name: (
                <FormattedMessage
                    defaultMessage="HTML Canvas"
                    description="Name of Text extension"
                    id="canvas.name"
                />
            ),
            extensionId: 'newCanvas',
            iconURL: canvasExtensionBanner,
            tags: ['penguinmod'],
            insetIconURL: canvasExtensionIcon,
            customInsetColor: '#0094FF',
            description: (
                <FormattedMessage
                    defaultMessage="Extra drawing tools using an HTML Canvas. Works well when used with other extensions."
                    description="Description of Text extension"
                    id="text.description"
                />
            ),
            featured: true
        },
        {
            name: 'OLD Canvas',
            extensionId: 'canvas',
            iconURL: canvasExtensionBanner,
            tags: ['penguinmod'],
            insetIconURL: canvasExtensionIcon,
            customInsetColor: '#0094FF',
            description: 'depracated version of HTML Canvas.',
            featured: true
        },
        {
            name: 'Legacy Files',
            extensionId: 'jgFiles',
            iconURL: defaultExtensionIcon,
            tags: ['penguinmod', 'datamgmt'],
            description: 'Basic blocks for files. This has been replaced by the TurboWarp files extension.',
            featured: true
        },
        {
            name: 'Clone Communication',
            extensionId: 'jgClones',
            iconURL: jgCloneManagerExtensionIcon,
            tags: ['penguinmod'],
            description: 'Mainly sharing data between clones and the main sprite, but also some other small features. This has been replaced by the TurboWarp Clones+ extension.',
            featured: true
        },
        {
            name: 'Easy Save',
            extensionId: 'jgEasySave',
            iconURL: defaultExtensionIcon,
            tags: ['penguinmod', 'datamgmt'],
            description: 'Save variables, lists and extra info to a file, then load those things back in.',
            featured: true
        },
        {
            name: (
                <FormattedMessage
                    defaultMessage="TurboWarp Blocks"
                    description="Name of TW extension"
                    id="tw.twExtension.name"
                    values={{
                        APP_NAME: "TurboWarp"
                    }}
                />
            ),
            extensionId: 'tw',
            twDeveloper: 'GarboMuffin',
            tags: ['turbowarp'],
            insetIconURL: turbowarpIcon,
            iconURL: twIcon,
            description: 'Weird new blocks. Replaced by Sensing Expansion.',
            featured: true
        },
        {
            name: 'the doo doo extension',
            extensionId: 'jgDooDoo',
            iconURL: defaultExtensionIcon,
            tags: ['penguinmod', 'joke'],
            description: 'dr bob eae',
            featured: true
        },
        {
            name: 'Christmas',
            extensionId: 'jgChristmas',
            iconURL: 'https://extensions.penguinmod.com/images/JeremyGamer13/christmas.avif',
            tags: ['penguinmod', 'joke'],
            description: 'hooraye',
            featured: true
        },
        {
            name: 'an amazing extension',
            extensionId: 'jgBestExtension',
            iconURL: 'https://extensions.penguinmod.com/images/JeremyGamer13/epic.avif',
            internetConnectionRequired: true,
            tags: ['penguinmod', 'joke'],
            description: 'this is SUCH A GOOD EXTENSION USE IT NOW',
            featured: true
        },
        {
            name: 'Epic utilities',
            extensionId: 'https://extensions.penguinmod.com/extensions/SharkPool/AprilFools.js',
            iconURL: 'https://extensions.penguinmod.com/images/JeremyGamer13/epicutils.avif',
            tags: ['penguinmod', 'joke'],
            description: 'the super good utilities brought to you by todays sponsor sharkpool (the epic utilities)',
            featured: true
        },
        {
            name: 'CATS',
            extensionId: 'https://extensions.penguinmod.com/extensions/Gen1x/CATS.js',
            iconURL: 'https://extensions.penguinmod.com/images/Gen1x/cats.avif',
            tags: ['penguinmod', 'joke'],
            description: 'Blocks related to cats.',
            extDeveloper: 'G1nX',
            featured: true
        },
        {
            name: 'McUtils',
            extensionId: 'https://extensions.turbowarp.org/Lily/McUtils.js',
            tags: ['turbowarp', 'joke'],
            iconURL: 'https://extensions.turbowarp.org/images/Lily/McUtils.png',
            insetIconURL: turbowarpIcon,
            description: 'Basic utilities for any fast food employee',
            featured: true,
            twDeveloper: 'LilyMakesThings'
        },
        {
            name: 'image blocks',
            extensionId: 'https://extensions.penguinmod.com/extensions/Ashime/funneimageblocks.js',
            iconURL: 'https://extensions.penguinmod.com/images/JeremyGamer13/screenshot1.avif',
            tags: ['penguinmod', 'joke'],
            internetConnectionRequired: true,
            description: 'who needs cat blocks when you have penguin block',
            extDeveloper: 'Ashimee, 0znzw, CST1229',
            featured: true
        },
        {
            name: 'fire in the hole',
            extensionId: 'https://extensions.penguinmod.com/extensions/JeremyGamer13/FireInTheHole.js',
            iconURL: 'https://library.penguinmod.com/files/emojis/cluelesssmile.png',
            tags: ['penguinmod', 'joke'],
            internetConnectionRequired: true,
            description: 'april fools took too long man this joke is not funny anymore',
            featured: true
        },
        {
            name: 'Unite',
            extensionId: 'jwUnite',
            iconURL: jwUniteExtensionIcon,
            tags: ['penguinmod'],
            description: 'Legacy extension that was eventually merged into the default toolbox.',
            featured: true
        },
        {
            name: 'Debugging',
            extensionId: 'jgDebugging',
            iconURL: jgDebuggingIcon,
            tags: ['penguinmod'],
            description: 'Log information and run commands. Good for debugging packaged projects or just easily changing things.',
            featured: true
        },
        {
            name: 'Test Extension Loader',
            href: 'https://studio.penguinmod.com/loadExt.html',
            extensionId: 'special_testExtensionLibrary',
            iconURL: defaultExtensionIcon,
            description: 'Test loading extensions from a library. For developers.',
            featured: true
        },
        {
            name: 'Editor',
            href: 'https://studio.penguinmod.com/editor.html',
            extensionId: 'special_editorExtensionLibrary',
            iconURL: penguinmodLibraryExtensionIcon,
            description: 'Opens the editor with this tab as the parent, still with the library opened. For developers.',
            featured: true
        },
        {
            name: 'localhost:5173',
            href: 'http://localhost:5173',
            extensionId: 'special_extensionLibraryLocalhost5173',
            iconURL: defaultExtensionIcon,
            description: 'Opens localhost:5173 in a new tab with this tab as the parent. For developers',
            featured: true
        },
        {
            name: 'localhost:5173?editor=true',
            href: 'http://localhost:5173?editor=true',
            extensionId: 'special_extensionLibraryLocalhost5173EditorTrue',
            iconURL: defaultExtensionIcon,
            description: 'Opens localhost:5173 in a new tab with this tab as the parent. Sets ?editor=true. For developers',
            featured: true
        },
        {
            name: (
                <FormattedMessage
                    defaultMessage="OOP"
                    description="Name of OOP extension"
                    id="jwStructs.jwStructsExtension.name"
                />
            ),
            extensionId: 'jwStructs',
            tags: ['penguinmod'],
            iconURL: jwStructsExtensionIcon,
            description: (
                <FormattedMessage
                    defaultMessage="Removed from list. OOP blocks. OOp is a programming paradigm that uses objects and their interactions to design applications and computer programs."
                    description="Description of OOP extension"
                    id="jwStructs.jwStructsExtension.description"
                />
            ),
            featured: true
        },
        {
            name: 'PenguinMod Permissions',
            extensionId: 'JgPermissionBlocks',
            iconURL: jgPermissionExtensionIcon,
            tags: ['penguinmod'],
            description: 'Legacy extension, old blocks no longer serve a real purpose. Direct blocks to manage permissions that PenguinMod requires you have to do certain tasks.',
            featured: true
        },
        {
            name: 'Jeremys Dev Tools',
            extensionId: 'jgDev',
            iconURL: defaultExtensionIcon,
            tags: ['penguinmod'],
            description: 'Test extension to see if things are possible.\nDO NOT USE THIS IN PRODUCTION as blocks are subject to change and may corrupt your projects.',
            credits: 'Some features added from LilyMakesThings, CubesterYT, TheShovel',
            featured: true
        },
        {
            name: '3D',
            extensionId: 'jg3d',
            iconURL: defaultExtensionIcon,
            tags: ['penguinmod', '3d'],
            customInsetColor: '#B200FF',
            insetIconURL: jg3dInsetExtensionIcon,
            description: 'Do not use for real projects. Not recommended, unstable, and will be rewritten/remade entirely at a later date. In development.',
            featured: true,
            extensionWarningOnImport: true
        },
        {
            name: '3D Physics',
            extensionId: 'fr3d',
            iconURL: fr3dPhysicsExtensionIcon,
            tags: ['penguinmod', '3d'],
            customInsetColor: '#D066FE',
            insetIconURL: fr3dPhysicsInsetExtensionIcon,
            description: 'Physics for the 3D extension.',
            featured: true
        },
        {
            name: '3D Virtual Reality',
            extensionId: 'jg3dVr',
            iconURL: jg3dVrExtensionIcon,
            tags: ['penguinmod', 'hardware', '3d'],
            customInsetColor: '#B200FF',
            insetIconURL: jg3dVrInsetExtensionIcon,
            description: 'Do not use for real projects. Not recommended, unstable, and will be rewritten/remade entirely at a later date. In development. May break compatibility. Allow players to really jump into your world!',
            featured: true,
            extensionWarningOnImport: true
        },
        {
            name: 'Interfaces',
            extensionId: 'jgInterfaces',
            iconURL: jgsilvxrcatInterfacesExtensionIcon,
            credits: 'silvxrcat',
            tags: ['penguinmod'],
            description: 'In development.',
            featured: true
        },
        {
            name: 'Packager Applications',
            extensionId: 'jgPackagerApplications',
            iconURL: jgPackagerApplicationsExtensionIcon,
            insetIconURL: jgPackagerApplicationsInsetExtensionIcon,
            twDeveloper: 'CubesterYT',
            customInsetColor: '#66B8FF',
            tags: ['penguinmod', 'packager'],
            description: 'In development. Do extra things in packaged applications that you can\'t do in the website!',
            featured: true
        },

        {
            name: 'Inline Blocks',
            extensionId: 'pmInlineBlocks',
            iconURL: pmInlineBlocksExtensionIcon,
            tags: ['penguinmod'],
            description: 'Create quick blocks for simple tasks. Insert them into any circle spot and have them return any value you want.',
            featured: true
        },
        {
            name: (
                <FormattedMessage
                    defaultMessage="Pathfinding"
                    description="Name of Pathfinding extension"
                    id="jgPathfinding.Pathfinding.name"
                />
            ),
            extensionId: 'jgPathfinding',
            tags: ['penguinmod'],
            iconURL: jgPathfindingExtensionIcon,
            description: (
                <FormattedMessage
                    defaultMessage="(Unstable and or laggy; Needs further work) Have sprites navigate around obstacles in your game instead of clipping into them."
                    description="Description of Pathfinding extension"
                    id="jgPathfinding.Pathfinding.description"
                />
            ),
            featured: true
        },
        {
            name: 'Animation',
            extensionId: 'jgAnimation',
            iconURL: jgAnimationExtensionIcon,
            tags: ['penguinmod'],
            description: 'In development. Currently buggy and missing features.',
            featured: true
        },
        {
            name: 'Virtual Reality',
            extensionId: 'jgVr',
            iconURL: jgVrExtensionIcon,
            tags: ['penguinmod', 'hardware'],
            description: 'In development.',
            extDeveloper: "JeremyGamer13",
            extraLabels: [
                {
                    name: "Uses code from",
                    value: "\"Augmented Reality\" by Vadik1"
                }
            ],
            featured: true,
            extensionWarningOnImport: true
        }
    ];
    extras.forEach(ext => {
        menuItems.push(ext);
    });
}

export default menuItems;
