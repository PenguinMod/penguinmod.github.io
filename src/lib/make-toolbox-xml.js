import LazyScratchBlocks from './tw-lazy-scratch-blocks';

const categorySeparator = '<sep gap="36"/>';

const blockSeparator = '<sep gap="36"/>'; // At default scale, about 28px

const translate = (id, english) => {
    if (LazyScratchBlocks.isLoaded()) {
        const ScratchBlocks = LazyScratchBlocks.get();
        return ScratchBlocks.ScratchMsgs.translate(id, english);
    }
    return english;
};

/* eslint-disable no-unused-vars */
const motion = function (isInitialSetup, isStage, targetId) {
    const stageSelected = translate(
        'MOTION_STAGE_SELECTED',
        'Stage selected: no motion blocks'
    );
    return `
    <category name="%{BKY_CATEGORY_MOTION}" id="motion" colour="#4C97FF" secondaryColour="#3373CC">
        ${isStage ? `
        <label text="${stageSelected}"></label>
        ` : `
        <block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="motion_turnright">
            <value name="DEGREES">
                <shadow type="math_number">
                    <field name="NUM">15</field>
                </shadow>
            </value>
        </block>
        <block type="motion_turnleft">
            <value name="DEGREES">
                <shadow type="math_number">
                    <field name="NUM">15</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="motion_goto">
            <value name="TO">
                <shadow type="motion_goto_menu">
                </shadow>
            </value>
        </block>
        <block type="motion_gotoxy">
            <value name="X">
                <shadow id="movex" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow id="movey" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="motion_changebyxy">
            <value name="DX">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
            <value name="DY">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="motion_glideto" id="motion_glideto">
            <value name="SECS">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="TO">
                <shadow type="motion_glideto_menu">
                </shadow>
            </value>
        </block>
        <block type="motion_glidesecstoxy">
            <value name="SECS">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="X">
                <shadow id="glidex" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow id="glidey" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="motion_pointindirection">
            <value name="DIRECTION">
                <shadow type="math_angle">
                    <field name="NUM">90</field>
                </shadow>
            </value>
        </block>
        <block type="motion_pointtowards">
            <value name="TOWARDS">
                <shadow type="motion_pointtowards_menu">
                </shadow>
            </value>
        </block>
        <block type="motion_pointtowardsxy">
            <value name="X">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="motion_changexby">
            <value name="DX">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="motion_setx">
            <value name="X">
                <shadow id="setx" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="motion_changeyby">
            <value name="DY">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="motion_sety">
            <value name="Y">
                <shadow id="sety" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="motion_ifonedgebounce"/>
        <block type="motion_ifonspritebounce">
            <value name="SPRITE">
                <shadow type="motion_pointtowards_menu"></shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="motion_setrotationstyle"/>
        <block type="motion_move_sprite_to_scene_side"/>
        ${blockSeparator}
        <block id="${targetId}_xposition" type="motion_xposition"/>
        <block id="${targetId}_yposition" type="motion_yposition"/>
        <block id="${targetId}_direction" type="motion_direction"/>`}
        ${categorySeparator}
    </category>
    `;
};

const xmlEscape = function (unsafe) {
    return unsafe.replace(/[<>&'"]/g, c => {
        switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        }
    });
};

const looks = function (isInitialSetup, isStage, targetId, costumeName, backdropName) {
    const hello = translate('LOOKS_HELLO', 'Hello!');
    const hmm = translate('LOOKS_HMM', 'Hmm...');
    return `
    <category name="%{BKY_CATEGORY_LOOKS}" id="looks" colour="#9966FF" secondaryColour="#774DCB">
        ${isStage ? '' : `
        <block type="looks_sayforsecs">
            <value name="MESSAGE">
                <shadow type="text">
                    <field name="TEXT">${hello}</field>
                </shadow>
            </value>
            <value name="SECS">
                <shadow type="math_number">
                    <field name="NUM">2</field>
                </shadow>
            </value>
        </block>
        <block type="looks_say">
            <value name="MESSAGE">
                <shadow type="text">
                    <field name="TEXT">${hello}</field>
                </shadow>
            </value>
        </block>
        <block type="looks_thinkforsecs">
            <value name="MESSAGE">
                <shadow type="text">
                    <field name="TEXT">${hmm}</field>
                </shadow>
            </value>
            <value name="SECS">
                <shadow type="math_number">
                    <field name="NUM">2</field>
                </shadow>
            </value>
        </block>
        <block type="looks_think">
            <value name="MESSAGE">
                <shadow type="text">
                    <field name="TEXT">${hmm}</field>
                </shadow>
            </value>
        </block>
        <block type="looks_stoptalking"/>
        ${blockSeparator}
        <block type="looks_setFont">
            <value name="font">
                <shadow type="text">
                    <field name="TEXT">Helvetica</field>
                </shadow>
            </value>
            <value name="size">
                <shadow type="math_number">
                    <field name="NUM">14</field>
                </shadow>
            </value>
        </block>
        <block type="looks_setColor">
            <field name="prop">BUBBLE_STROKE</field>
            <value name="color">
                <shadow type="colour_picker"></shadow>
            </value>
        </block>
        <block type="looks_setShape">
            <field name="prop">STROKE_WIDTH</field>
            <value name="color">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block id="${targetId}_sayWidth" type="looks_sayWidth"></block>
        <block id="${targetId}_sayHeight" type="looks_sayHeight"></block>
        ${blockSeparator}
        `}
        ${isStage ? `
            <block type="looks_switchbackdropto">
                <value name="BACKDROP">
                    <shadow type="looks_backdrops">
                        <field name="BACKDROP">${backdropName}</field>
                    </shadow>
                </value>
            </block>
            <block type="looks_switchbackdroptoandwait">
                <value name="BACKDROP">
                    <shadow type="looks_backdrops">
                        <field name="BACKDROP">${backdropName}</field>
                    </shadow>
                </value>
            </block>
            <block type="looks_nextbackdrop"/>
            <block type="looks_getinputofcostume">
                <value name="INPUT">
                    <shadow type="looks_getinput_menu"/>
                </value>
                <value name="COSTUME">
                    <shadow type="looks_backdrops">
                        <field name="BACKDROP">${backdropName}</field>
                    </shadow>
                </value>
            </block>
        ` : `
            <block id="${targetId}_switchcostumeto" type="looks_switchcostumeto">
                <value name="COSTUME">
                    <shadow type="looks_costume">
                        <field name="COSTUME">${costumeName}</field>
                    </shadow>
                </value>
            </block>
            <block type="looks_nextcostume"/>
            <block type="looks_getinputofcostume">
                <value name="INPUT">
                    <shadow type="looks_getinput_menu"/>
                </value>
                <value name="COSTUME">
                    <shadow type="looks_costume">
                        <field name="COSTUME">${costumeName}</field>
                    </shadow>
                </value>
            </block>
            ${blockSeparator}
            <block type="looks_switchbackdropto">
                <value name="BACKDROP">
                    <shadow type="looks_backdrops">
                        <field name="BACKDROP">${backdropName}</field>
                    </shadow>
                </value>
            </block>
            <block type="looks_nextbackdrop"/>
            ${blockSeparator}
            <block type="looks_changesizeby">
                <value name="CHANGE">
                    <shadow type="math_number">
                        <field name="NUM">10</field>
                    </shadow>
                </value>
            </block>
            <block type="looks_setsizeto">
                <value name="SIZE">
                    <shadow type="math_number">
                        <field name="NUM">100</field>
                    </shadow>
                </value>
            </block>
            ${blockSeparator}
            <block type="looks_setStretch">
                <value name="X">
                    <shadow type="math_number">
                        <field name="NUM">100</field>
                    </shadow>
                </value>
                <value name="Y">
                    <shadow type="math_number">
                        <field name="NUM">100</field>
                    </shadow>
                </value>
            </block>
            <block type="looks_changeStretch">
                <value name="X">
                    <shadow type="math_number">
                        <field name="NUM">15</field>
                    </shadow>
                </value>
                <value name="Y">
                    <shadow type="math_number">
                        <field name="NUM">0</field>
                    </shadow>
                </value>
            </block>
            <block id="${targetId}_stretchGetX" type="looks_stretchGetX"></block>
            <block id="${targetId}_stretchGetY" type="looks_stretchGetY"></block>
        `}
        ${blockSeparator}
        <block type="looks_changeeffectby">
            <value name="CHANGE">
                <shadow type="math_number">
                    <field name="NUM">25</field>
                </shadow>
            </value>
        </block>
        <block type="looks_seteffectto">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="looks_setTintColor">
            <value name="color">
                <shadow type="colour_picker"></shadow>
            </value>
        </block>
        <block type="looks_cleargraphiceffects"/>
        <block id="${targetId}_getEffectValue" type="looks_getEffectValue"/>
        <block id="${targetId}_tintColor" type="looks_tintColor"/>
        ${blockSeparator}
        ${isStage ? '' : `
            <block type="looks_show"/>
            <block type="looks_hide"/>
            <block id="${targetId}_getSpriteVisible" type="looks_getSpriteVisible"/>
            ${blockSeparator}
            <block type="looks_changeVisibilityOfSpriteShow">
                <value name="VISIBLE_OPTION">
                    <shadow type="looks_changeVisibilityOfSprite_menu"/>
                </value>
            </block>
            <block type="looks_changeVisibilityOfSpriteHide">
                <value name="VISIBLE_OPTION">
                    <shadow type="looks_changeVisibilityOfSprite_menu"/>
                </value>
            </block>
            <block type="looks_getOtherSpriteVisible">
                <value name="VISIBLE_OPTION">
                    <shadow type="looks_getOtherSpriteVisible_menu"/>
                </value>
            </block>
            ${blockSeparator}
            <block type="looks_gotofrontback"/>
            <block type="looks_goforwardbackwardlayers">
                <value name="NUM">
                    <shadow type="math_integer">
                        <field name="NUM">1</field>
                    </shadow>
                </value>
            </block>
            <block type="looks_layersSetLayer">
                <value name="NUM">
                    <shadow type="math_integer">
                        <field name="NUM">1</field>
                    </shadow>
                </value>
            </block>
            <block type="looks_goTargetLayer">
                <value name="VISIBLE_OPTION">
                    <shadow type="looks_getOtherSpriteVisible_menu"/>
                </value>
            </block>
            <block id="${targetId}_layersGetLayer" type="looks_layersGetLayer"></block>
            ${blockSeparator}
        `}
        ${isStage ? `
            <block id="backdropnumbername" type="looks_backdropnumbername"/>
        ` : `
            <block id="${targetId}_costumenumbername" type="looks_costumenumbername"/>
            <block id="backdropnumbername" type="looks_backdropnumbername"/>
            <block id="${targetId}_size" type="looks_size"/>
        `}
        ${categorySeparator}
    </category>
    `;
};

const sound = function (isInitialSetup, isStage, targetId, soundName) {
    return `
    <category name="%{BKY_CATEGORY_SOUND}" id="sound" colour="#D65CD6" secondaryColour="#BD42BD">
        <block id="${targetId}_sound_playuntildone" type="sound_playuntildone">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu">
                    <field name="SOUND_MENU">${soundName}</field>
                </shadow>
            </value>
        </block>
        <block id="${targetId}_sound_play_at_seconds_until_done" type="sound_play_at_seconds_until_done">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">5</field>
                </shadow>
            </value>
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu">
                    <field name="SOUND_MENU">${soundName}</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block id="${targetId}_sound_play" type="sound_play">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu">
                    <field name="SOUND_MENU">${soundName}</field>
                </shadow>
            </value>
        </block>
        <block id="${targetId}_sound_play_at_seconds" type="sound_play_at_seconds">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">5</field>
                </shadow>
            </value>
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu">
                    <field name="SOUND_MENU">${soundName}</field>
                </shadow>
            </value>
        </block>
        <block id="${targetId}_sound_stop" type="sound_stop">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu">
                    <field name="SOUND_MENU">${soundName}</field>
                </shadow>
            </value>
        </block>
        <block type="sound_playallsounds"/>
        <block type="sound_stopallsounds"/>
        ${blockSeparator}
        <block id="${targetId}_sound_set_stop_fadeout_to" type="sound_set_stop_fadeout_to">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu">
                    <field name="SOUND_MENU">${soundName}</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block id="${targetId}_sound_isSoundPlaying" type="sound_isSoundPlaying">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu">
                    <field name="SOUND_MENU">${soundName}</field>
                </shadow>
            </value>
        </block>
        <block id="${targetId}_sound_getLength" type="sound_getLength">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu">
                    <field name="SOUND_MENU">${soundName}</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="sound_changeeffectby">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="sound_seteffectto">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block type="sound_cleareffects"/>
        <block id="${targetId}_soundgetEffectValue" type="sound_getEffectValue"/>
        ${blockSeparator}
        <block type="sound_changevolumeby">
            <value name="VOLUME">
                <shadow type="math_number">
                    <field name="NUM">-10</field>
                </shadow>
            </value>
        </block>
        <block type="sound_setvolumeto">
            <value name="VOLUME">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block id="${targetId}_volume" type="sound_volume"/>
        ${categorySeparator}
    </category>
    `;
};

const events = function (isInitialSetup, isStage) {
    return `
    <category name="%{BKY_CATEGORY_EVENTS}" id="events" colour="#FFD500" secondaryColour="#CC9900">
        <block type="event_whenflagclicked"/>
        <block type="event_whenstopclicked"/>
        ${blockSeparator}
        <block type="event_always"></block>
        <block type="event_whenanything">
            <value name="ANYTHING">
                <shadow type="checkbox" />
            </value>
        </block>
        ${blockSeparator}
        <block type="event_whenkeypressed"></block>
        <block type="event_whenkeyhit"></block>
        <block type="event_whenmousescrolled"></block>
        ${isStage ? `
            <block type="event_whenstageclicked"/>
        ` : `
            <block type="event_whenthisspriteclicked"/>
        `}
        <block type="event_whenbackdropswitchesto">
        </block>
        ${blockSeparator}
        <block type="event_whengreaterthan">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="event_whenbroadcastreceived">
        </block>
        <block type="event_broadcast">
            <value name="BROADCAST_INPUT">
                <shadow type="event_broadcast_menu"></shadow>
            </value>
        </block>
        <block type="event_broadcastandwait">
            <value name="BROADCAST_INPUT">
              <shadow type="event_broadcast_menu"></shadow>
            </value>
        </block>
        ${categorySeparator}
    </category>
    `;
};

const control = function (isInitialSetup, isStage) {
    return `
    <category name="%{BKY_CATEGORY_CONTROL}" id="control" colour="#FFAB19" secondaryColour="#CF8B17">
        <block type="control_wait">
            <value name="DURATION">
                <shadow type="math_positive_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="control_waitsecondsoruntil">
            <value name="DURATION">
                <shadow type="math_positive_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="CONDITION">
                <shadow type="checkbox" />
            </value>
        </block>
        ${blockSeparator}
        <block type="control_repeat">
            <value name="TIMES">
                <shadow type="math_whole_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block id="forever" type="control_forever"/>
        <block id="for_each" type="control_for_each">
            <value name="VALUE">
                <shadow type="math_whole_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="control_exitLoop"/>
        <block type="control_continueLoop"/>
        ${blockSeparator}
        <block type="control_switch"/>
        <block type="control_switch_default"/>
        <block type="control_exitCase"/>
        <block type="control_case_next">
            <value name="CONDITION">
                <shadow type="text">
                    <field name="TEXT">ello</field>
                </shadow>
            </value>
        </block>
        <block type="control_case">
            <value name="CONDITION">
                <shadow type="text">
                    <field name="TEXT">ello</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="control_expandableIf">
            <mutation branches="1" ends-in-else="false"></mutation>
            <value name="BOOL1">
                <shadow type="checkbox"></shadow>
            </value>
        </block>
        <block type="control_expandableIf">
            <mutation branches="2" ends-in-else="true"></mutation>
            <value name="BOOL1">
                <shadow type="checkbox"></shadow>
            </value>
        </block>
        <block type="control_if_return_else_return">
            <value name="boolean">
                <shadow type="checkbox" />
            </value>
            <value name="TEXT1">
                <shadow type="text">
                    <field name="TEXT">foo</field>
                </shadow>
            </value>
            <value name="TEXT2">
                <shadow type="text">
                    <field name="TEXT">bar</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block id="wait_until" type="control_wait_until">
            <value name="CONDITION">
                <shadow type="checkbox" />
            </value>
        </block>
        <block id="repeat_until" type="control_repeat_until">
            <value name="CONDITION">
                <shadow type="checkbox" />
            </value>
        </block>
        <block id="while" type="control_while">
            <value name="CONDITION">
                <shadow type="checkbox" />
            </value>
        </block>
        ${blockSeparator}
        <block type="control_all_at_once"/>
        <block type="control_run_as_sprite">
            <value name="RUN_AS_OPTION">
                <shadow type="control_run_as_sprite_menu"/>
            </value>
        </block>
        ${blockSeparator}
        <block type="control_try_catch"/>
        <block type="control_throw_error">
            <value name="ERROR">
                <shadow type="text">
                    <field name="TEXT">Hello!</field>
                </shadow>
            </value>
        </block>
        <block type="control_error"/>
        ${blockSeparator}
        <block type="control_backToGreenFlag"></block>
        <block type="control_stop_sprite">
            <value name="STOP_OPTION">
                <shadow type="control_stop_sprite_menu"/>
            </value>
        </block>
        <block type="control_stop"/>
        ${blockSeparator}
        ${isStage ? `
            <block type="control_create_clone_of">
                <value name="CLONE_OPTION">
                    <shadow type="control_create_clone_of_menu"/>
                </value>
            </block>
            <block type="control_delete_clones_of">
                <value name="CLONE_OPTION">
                    <shadow type="control_create_clone_of_menu"/>
                </value>
            </block>
        ` : `
            <block type="control_start_as_clone"/>
            <block type="control_create_clone_of">
                <value name="CLONE_OPTION">
                    <shadow type="control_create_clone_of_menu"/>
                </value>
            </block>
            <block type="control_delete_clones_of">
                <value name="CLONE_OPTION">
                    <shadow type="control_create_clone_of_menu"/>
                </value>
            </block>
            <block type="control_delete_this_clone"/>
            <block type="control_is_clone"/>
        `}
        ${LazyScratchBlocks.isNameUrMom() ? '<block type="your_mom"/>' : ''}
        ${categorySeparator}
    </category>
    `;
};

const sensing = function (isInitialSetup, isStage, targetId) {
    const name = translate('SENSING_ASK_TEXT', 'What\'s your name?');
    // const openDocumentation = translate('OPEN_DOCUMENTATION', 'Open Documentation');
    const helpManual = translate('HELP_MANUAL', 'Help Manual');
    return `
    <category name="%{BKY_CATEGORY_SENSING}" id="sensing" colour="#4CBFE6" secondaryColour="#2E8EB8">
        ${isStage ? '' : `
            <block type="sensing_touchingobject">
                <value name="TOUCHINGOBJECTMENU">
                    <shadow type="sensing_touchingobjectmenu"/>
                </value>
            </block>
            <block type="sensing_objecttouchingobject">
                <value name="FULLTOUCHINGOBJECTMENU">
                    <shadow type="sensing_fulltouchingobjectmenu"/>
                </value>
                <value name="SPRITETOUCHINGOBJECTMENU">
                    <shadow type="sensing_touchingobjectmenusprites"/>
                </value>
            </block>
            <block type="sensing_objecttouchingclonesprite">
                <value name="FULLTOUCHINGOBJECTMENU">
                    <shadow type="sensing_fulltouchingobjectmenu"/>
                </value>
                <value name="SPRITETOUCHINGOBJECTMENU">
                    <shadow type="sensing_touchingobjectmenusprites"/>
                </value>
            </block>
            <block type="sensing_touchingcolor">
                <value name="COLOR">
                    <shadow type="colour_picker"/>
                </value>
            </block>
            <block type="sensing_coloristouchingcolor">
                <value name="COLOR">
                    <shadow type="colour_picker"/>
                </value>
                <value name="COLOR2">
                    <shadow type="colour_picker"/>
                </value>
            </block>
            ${blockSeparator}
            <block type="sensing_getxyoftouchingsprite">
                <value name="SPRITE">
                    <shadow type="sensing_distancetomenu"/>
                </value>
            </block>
            <block type="sensing_distanceto">
                <value name="DISTANCETOMENU">
                    <shadow type="sensing_distancetomenu"/>
                </value>
            </block>
            <block type="sensing_distanceTo">
                <value name="x1">
                    <shadow type="text">
                        <field name="TEXT">10</field>
                    </shadow>
                </value>
                <value name="y1">
                    <shadow type="text">
                        <field name="TEXT">-10</field>
                    </shadow>
                </value>
                <value name="x2">
                    <shadow type="text">
                        <field name="TEXT">-10</field>
                    </shadow>
                </value>
                <value name="y2">
                    <shadow type="text">
                        <field name="TEXT">10</field>
                    </shadow>
                </value>
            </block>
            <block type="sensing_directionTo">
                <value name="x1">
                    <shadow type="text">
                        <field name="TEXT">10</field>
                    </shadow>
                </value>
                <value name="y1">
                    <shadow type="text">
                        <field name="TEXT">-10</field>
                    </shadow>
                </value>
                <value name="x2">
                    <shadow type="text">
                        <field name="TEXT">-10</field>
                    </shadow>
                </value>
                <value name="y2">
                    <shadow type="text">
                        <field name="TEXT">10</field>
                    </shadow>
                </value>
            </block>
            ${blockSeparator}
        `}
        ${isInitialSetup ? '' : `
            <block id="askandwait" type="sensing_askandwait">
                <value name="QUESTION">
                    <shadow type="text">
                        <field name="TEXT">${name}</field>
                    </shadow>
                </value>
            </block>
        `}
        <block id="answer" type="sensing_answer"/>
        <block type="sensing_thing_is_text">
            <value name="TEXT1">
                <shadow type="text">
                    <field name="TEXT">world</field>
                </shadow>
            </value>
        </block>
        <block type="sensing_thing_is_number">
            <value name="TEXT1">
                <shadow type="text">
                    <field name="TEXT">10</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="sensing_keypressed">
            <value name="KEY_OPTION">
                <shadow type="sensing_keyoptions"/>
            </value>
        </block>
        <block type="sensing_keyhit">
            <value name="KEY_OPTION">
                <shadow type="sensing_keyoptions"/>
            </value>
        </block>
        <block type="sensing_mousescrolling">
            <value name="SCROLL_OPTION">
                <shadow type="sensing_scrolldirections"/>
            </value>
        </block>
        ${blockSeparator}
        <block type="sensing_mousedown"/>
        <block type="sensing_mouseclicked"/>
        <block type="sensing_mousex"/>
        <block type="sensing_mousey"/>
        ${blockSeparator}
        <block type="sensing_setclipboard">
            <value name="ITEM">
                <shadow type="text">
                    <field name="TEXT">Hello!</field>
                </shadow>
            </value>
        </block>
        <block type="sensing_getclipboard"/>
        ${isStage ? '' : `
            ${blockSeparator}
            <block type="sensing_setdragmode" id="sensing_setdragmode"></block>
            <block id="${targetId}_getdragmode" type="sensing_getdragmode"></block>
            ${blockSeparator}
        `}
        ${blockSeparator}
        <block id="loudness" type="sensing_loudness"/>
        <block id="loud" type="sensing_loud"/>
        ${blockSeparator}
        <block type="sensing_resettimer"/>
        <block id="timer" type="sensing_timer"/>
        ${blockSeparator}
        <block type="sensing_set_of">
            <value name="OBJECT">
                <shadow id="sensing_of_object_menu" type="sensing_of_object_menu"/>
            </value>
            <value name="VALUE">
                <shadow type="text">
                    <field name="TEXT">0</field>
                </shadow>
            </value>
        </block>
        <block id="of" type="sensing_of">
            <value name="OBJECT">
                <shadow id="sensing_of_object_menu" type="sensing_of_object_menu"/>
            </value>
        </block>
        ${blockSeparator}
        <block id="current" type="sensing_current"/>
        <block type="sensing_dayssince2000"/>
        ${blockSeparator}
        <block type="sensing_mobile"></block>
        <block type="sensing_fingerdown">
            <value name="FINGER_OPTION">
                <shadow id="sensing_fingeroptions" type="sensing_fingeroptions"/>
            </value>
        </block>
        <block type="sensing_fingertapped">
            <value name="FINGER_OPTION">
                <shadow id="sensing_fingeroptions" type="sensing_fingeroptions"/>
            </value>
        </block>
        <block type="sensing_fingerx">
            <value name="FINGER_OPTION">
                <shadow id="sensing_fingeroptions" type="sensing_fingeroptions"/>
            </value>
        </block>
        <block type="sensing_fingery">
            <value name="FINGER_OPTION">
                <shadow id="sensing_fingeroptions" type="sensing_fingeroptions"/>
            </value>
        </block>
        ${blockSeparator}
        <button text="${helpManual}" callbackKey="OPEN_USERNAME_DOCS" isLaterDefined="true" />
        <block type="sensing_username"/>
        <block type="sensing_loggedin"/>
        ${categorySeparator}
    </category>
    `;
};

const operators = function (isInitialSetup) {
    const apple = translate('OPERATORS_JOIN_APPLE', 'apple');
    const banana = translate('OPERATORS_JOIN_BANANA', 'banana');
    const letter = translate('OPERATORS_LETTEROF_APPLE', 'a');
    return `
    <category name="%{BKY_CATEGORY_OPERATORS}" id="operators" colour="#40BF4A" secondaryColour="#389438">
        <block type="operator_add">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        <block type="operator_subtract">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        <block type="operator_multiply">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        <block type="operator_divide">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        <block type="operator_power">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        <block type="operator_expandableMath"></block>
        <block type="operator_advMathExpanded">
            <value name="ONE">
                <shadow type="math_number">
                    <field name="NUM">3</field>
                </shadow>
            </value>
            <value name="TWO">
                <shadow type="math_number">
                    <field name="NUM">2</field>
                </shadow>
            </value>
            <field name="OPTION">root</field>
            <value name="THREE">
                <shadow type="math_number">
                    <field name="NUM">16</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_random">
            <value name="FROM">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="TO">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="operator_constrainnumber">
            <value name="inp">
                <shadow type="math_number">
                    <field name="NUM">50</field>
                </shadow>
            </value>
            <value name="min">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="max">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block type="operator_lerpFunc">
            <value name="ONE">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="TWO">
                <shadow type="math_number">
                    <field name="NUM">3</field>
                </shadow>
            </value>
            <value name="AMOUNT">
                <shadow type="math_number">
                    <field name="NUM">0.5</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_gt">
            <value name="OPERAND1">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="text">
                    <field name="TEXT">50</field>
                </shadow>
            </value>
        </block>
        <block type="operator_gtorequal">
            <value name="OPERAND1">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="text">
                    <field name="TEXT">50</field>
                </shadow>
            </value>
        </block>
        <block type="operator_lt">
            <value name="OPERAND1">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="text">
                    <field name="TEXT">50</field>
                </shadow>
            </value>
        </block>
        <block type="operator_ltorequal">
            <value name="OPERAND1">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="text">
                    <field name="TEXT">50</field>
                </shadow>
            </value>
        </block>
        <block type="operator_equals">
            <value name="OPERAND1">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="text">
                    <field name="TEXT">50</field>
                </shadow>
            </value>
        </block>
        <block type="operator_notequal">
            <value name="OPERAND1">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="text">
                    <field name="TEXT">50</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_trueBoolean"></block>
        <block type="operator_falseBoolean"></block>
        ${blockSeparator}
        <block type="operator_and">
            <value name="OPERAND1">
                <shadow type="checkbox" />
            </value>
            <value name="OPERAND2">
                <shadow type="checkbox" />
            </value>
        </block>
        <block type="operator_or">
            <value name="OPERAND1">
                <shadow type="checkbox" />
            </value>
            <value name="OPERAND2">
                <shadow type="checkbox" />
            </value>
        </block>
        <block type="operator_not">
            <value name="OPERAND">
                <shadow type="checkbox" />
            </value>
        </block>
        ${blockSeparator}
        ${isInitialSetup ? '' : `
            <block type="operator_newLine"></block>
            <block type="operator_tabCharacter"></block>
            ${blockSeparator}
            <block type="operator_join">
                <value name="STRING1">
                    <shadow type="text">
                        <field name="TEXT">${apple} </field>
                    </shadow>
                </value>
                <value name="STRING2">
                    <shadow type="text">
                        <field name="TEXT">${banana}</field>
                    </shadow>
                </value>
            </block>
            <block type="operator_expandablejoininputs">
                <mutation inputcount="2"></mutation>
                <value name="INPUT1">
                    <shadow type="text">
                        <field name="TEXT">apple</field>
                    </shadow>
                </value>
                <value name="INPUT2">
                    <shadow type="text">
                        <field name="TEXT">banana</field>
                    </shadow>
                </value>
            </block>
            ${blockSeparator}
            <block type="operator_indexOfTextInText">
                <value name="TEXT1">
                    <shadow type="text">
                        <field name="TEXT">world</field>
                    </shadow>
                </value>
                <value name="TEXT2">
                    <shadow type="text">
                        <field name="TEXT">Hello world!</field>
                    </shadow>
                </value>
            </block>
            <block type="operator_lastIndexOfTextInText">
                <value name="TEXT1">
                    <shadow type="text">
                        <field name="TEXT">world</field>
                    </shadow>
                </value>
                <value name="TEXT2">
                    <shadow type="text">
                        <field name="TEXT">Hello world!</field>
                    </shadow>
                </value>
            </block>
            ${blockSeparator}
            <block type="operator_letter_of">
                <value name="LETTER">
                    <shadow type="math_whole_number">
                        <field name="NUM">1</field>
                    </shadow>
                </value>
                <value name="STRING">
                    <shadow type="text">
                        <field name="TEXT">${apple}</field>
                    </shadow>
                </value>
            </block>
            <block type="operator_getLettersFromIndexToIndexInTextFixed">
                <value name="INDEX1">
                    <shadow type="math_number">
                        <field name="NUM">2</field>
                    </shadow>
                </value>
                <value name="INDEX2">
                    <shadow type="math_number">
                        <field name="NUM">3</field>
                    </shadow>
                </value>
                <value name="TEXT">
                    <shadow type="text">
                        <field name="TEXT">Hello!</field>
                    </shadow>
                </value>
            </block>
            <block type="operator_length">
                <value name="STRING">
                    <shadow type="text">
                        <field name="TEXT">${apple}</field>
                    </shadow>
                </value>
            </block>
            ${blockSeparator}
            <block type="operator_contains" id="operator_contains">
              <value name="STRING1">
                <shadow type="text">
                  <field name="TEXT">${apple}</field>
                </shadow>
              </value>
              <value name="STRING2">
                <shadow type="text">
                  <field name="TEXT">${letter}</field>
                </shadow>
              </value>
            </block>
            <block type="operator_textStartsOrEndsWith" id="operator_textStartsOrEndsWith">
              <value name="TEXT1">
                <shadow type="text">
                  <field name="TEXT">abcdef</field>
                </shadow>
              </value>
              <value name="TEXT2">
                <shadow type="text">
                  <field name="TEXT">abc</field>
                </shadow>
              </value>
            </block>
            ${blockSeparator}
            <block type="operator_replaceAll">
                <value name="text">
                    <shadow type="text">
                        <field name="TEXT">foo bar</field>
                    </shadow>
                </value>
                <value name="term">
                    <shadow type="text">
                        <field name="TEXT">foo</field>
                    </shadow>
                </value>
                <value name="res">
                    <shadow type="text">
                        <field name="TEXT">bar</field>
                    </shadow>
                </value>
            </block>
            <block type="operator_replaceFirst">
                <value name="text">
                    <shadow type="text">
                        <field name="TEXT">bar bar doo</field>
                    </shadow>
                </value>
                <value name="term">
                    <shadow type="text">
                        <field name="TEXT">bar</field>
                    </shadow>
                </value>
                <value name="res">
                    <shadow type="text">
                        <field name="TEXT">foo</field>
                    </shadow>
                </value>
            </block>
            <block type="operator_regexmatch">
                <value name="text">
                    <shadow type="text">
                        <field name="TEXT">foo bar</field>
                    </shadow>
                </value>
                <value name="reg">
                    <shadow type="text">
                        <field name="TEXT">foo</field>
                    </shadow>
                </value>
                <value name="regrule">
                    <shadow type="text">
                        <field name="TEXT">g</field>
                    </shadow>
                </value>
            </block>
            ${blockSeparator}
            <block type="operator_toUpperLowerCase">
                <value name="TEXT">
                    <shadow type="text">
                        <field name="TEXT">ello</field>
                    </shadow>
                </value>
            </block>
        `}
        ${blockSeparator}
        <block type="operator_mod">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        <block type="operator_round">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_mathop">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_stringify">
            <value name="ONE">
                <shadow type="text">
                    <field name="TEXT">foo</field>
                </shadow>
            </value>
        </block>
        <block type="operator_boolify">
            <value name="ONE">
                <shadow type="text">
                    <field name="TEXT">true</field>
                </shadow>
            </value>
        </block>
        ${categorySeparator}
    </category>
    `;
};

const variables = function () {
    return `
    <category
        name="%{BKY_CATEGORY_VARIABLES}"
        id="variables"
        colour="#FF8C1A"
        secondaryColour="#DB6E00"
        custom="VARIABLE">
    </category>
    `;
};

const lists = function () {
    return `
    <category
        name="Lists"
        id="lists"
        colour="#FF661A"
        secondaryColour="#FF5500"
        custom="LIST">
    </category>
    `;
};

const myBlocks = function () {
    return `
    <category
        name="%{BKY_CATEGORY_MYBLOCKS}"
        id="myBlocks"
        colour="#FF6680"
        secondaryColour="#FF4D6A"
        custom="PROCEDURE">
    </category>
    `;
};

const liveTests = function () {
    return `
    <category name="Live Tests" id="liveTests" colour="#FF0000" secondaryColour="#FF0000">
        <block type="procedures_call">
            <mutation proccode="tw:debugger;" argumentids="[]" warp="false" returns="null" edited="true" optype="null"></mutation>
        </block>
        ${blockSeparator}
        <block type="control_fieldbutton"></block>
        <block type="motion_mutatorCheckboxTest"></block>
        ${blockSeparator}
        <block type="control_dualblock"></block>
    </category>
    `;
};

/* eslint-enable no-unused-vars */

const xmlOpen = '<xml style="display: none">';
const xmlClose = '</xml>';

/**
 * @param {!boolean} isInitialSetup - Whether the toolbox is for initial setup. If the mode is "initial setup",
 * blocks with localized default parameters (e.g. ask and wait) should not be loaded. (LLK/scratch-gui#5445)
 * @param {?boolean} isStage - Whether the toolbox is for a stage-type target. This is always set to true
 * when isInitialSetup is true.
 * @param {?string} targetId - The current editing target
 * @param {?Array.<object>} categoriesXML - optional array of `{id,xml}` for categories. This can include both core
 * and other extensions: core extensions will be placed in the normal Scratch order; others will go at the bottom.
 * @property {string} id - the extension / category ID.
 * @property {string} xml - the `<category>...</category>` XML for this extension / category.
 * @param {?string} costumeName - The name of the default selected costume dropdown.
 * @param {?string} backdropName - The name of the default selected backdrop dropdown.
 * @param {?string} soundName -  The name of the default selected sound dropdown.
 * @param {?boolean} isLiveTest - whether or not we should display the live tests categpory
 * @returns {string} - a ScratchBlocks-style XML document for the contents of the toolbox.
 */
const makeToolboxXML = function (isInitialSetup, isStage = true, targetId, categoriesXML = [],
    costumeName = '', backdropName = '', soundName = '', isLiveTest = false) {
    isStage = isInitialSetup || isStage;
    const gap = [categorySeparator];

    costumeName = xmlEscape(costumeName);
    backdropName = xmlEscape(backdropName);
    soundName = xmlEscape(soundName);

    categoriesXML = categoriesXML.slice();
    const moveCategory = categoryId => {
        const index = categoriesXML.findIndex(categoryInfo => categoryInfo.id === categoryId);
        if (index >= 0) {
            // remove the category from categoriesXML and return its XML
            const [categoryInfo] = categoriesXML.splice(index, 1);
            return categoryInfo.xml;
        }
        // return `undefined`
    };
    const motionXML = moveCategory('motion') || motion(isInitialSetup, isStage, targetId);
    const looksXML = moveCategory('looks') || looks(isInitialSetup, isStage, targetId, costumeName, backdropName);
    const soundXML = moveCategory('sound') || sound(isInitialSetup, isStage, targetId, soundName);
    const eventsXML = moveCategory('event') || events(isInitialSetup, isStage, targetId);
    const controlXML = moveCategory('control') || control(isInitialSetup, isStage, targetId);
    const sensingXML = moveCategory('sensing') || sensing(isInitialSetup, isStage, targetId);
    const operatorsXML = moveCategory('operators') || operators(isInitialSetup, isStage, targetId);
    const variablesXML = moveCategory('variables') || variables(isInitialSetup, isStage, targetId);
    const listsXML = moveCategory('lists') || lists(isInitialSetup, isStage, targetId);
    const myBlocksXML = moveCategory('procedures') || myBlocks(isInitialSetup, isStage, targetId);
    const liveTestsXML = moveCategory('liveTests') || liveTests(isLiveTest);

    const everything = [
        xmlOpen,
        motionXML,
        looksXML,
        soundXML,
        eventsXML,
        controlXML,
        sensingXML,
        operatorsXML,
        variablesXML,
        listsXML,
        myBlocksXML
    ];
    if (isLiveTest) everything.push(liveTestsXML);

    for (const extensionCategory of categoriesXML) {
        everything.push(extensionCategory.xml);
    }

    everything.push(xmlClose);
    return everything.join(`\n${gap}\n`);
};

export default makeToolboxXML;
